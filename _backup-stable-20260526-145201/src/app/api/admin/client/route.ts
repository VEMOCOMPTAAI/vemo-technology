// @ts-nocheck
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function checkAdmin(request: Request) {
  return verifyAdminRequest(request);
}

function normalizeEmail(email?: string) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const auth = checkAdmin(request);

    if (!auth.ok) {
      return auth.response;
    }

    const body = await request.json();

    const mode = String(body.mode || "upsert").trim();
    const email = normalizeEmail(body.email);
    const previousEmail = normalizeEmail(body.previousEmail || body.email);

    const fullName = String(body.fullName || "").trim();
    const companyName = String(body.companyName || "Dossier LLC").trim();
    const planName = String(body.planName || "Standard").trim();
    const state = String(body.state || "New Mexico").trim();
    const amount = Number(body.amount || 179);
    const portalEnabled = Boolean(body.portalEnabled);
    const createOrder = body.createOrder !== false;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Email client invalide." },
        { status: 400 }
      );
    }

    if (!companyName) {
      return NextResponse.json(
        { error: "Nom de société requis." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    if (mode === "disable") {
      const { data, error } = await supabase
        .from("client_accounts")
        .update({
          portal_enabled: false,
          status: "disabled",
          updated_at: new Date().toISOString(),
        })
        .eq("email", previousEmail)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json(
          {
            error: "Impossible de désactiver le client.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true, account: data });
    }

    if (mode === "enable") {
      const { data, error } = await supabase
        .from("client_accounts")
        .update({
          portal_enabled: true,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("email", previousEmail)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json(
          {
            error: "Impossible d’activer le client.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true, account: data });
    }

    let orderId = String(body.orderId || "").trim();

    if (createOrder && !orderId) {
      const { data: latestOrder } = await supabase
        .from("llc_orders")
        .select("*")
        .eq("customer_email", previousEmail || email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestOrder?.id) {
        orderId = latestOrder.id;
      }
    }

    if (createOrder && orderId) {
      await supabase
        .from("llc_orders")
        .update({
          customer_email: email,
          customer_name: fullName || null,
          company_name: companyName,
          plan_name: planName,
          state,
          amount,
          currency: "usd",
          status: "paid",
          payment_status: "paid",
          services: [
            "Operating Agreement",
            "EIN",
            "Registered Agent",
            "Suivi administratif"
          ],
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    }

    if (createOrder && !orderId) {
      const { data: insertedOrder, error: orderError } = await supabase
        .from("llc_orders")
        .insert({
          customer_email: email,
          customer_name: fullName || null,
          company_name: companyName,
          plan_name: planName,
          state,
          amount,
          currency: "usd",
          status: "paid",
          payment_status: "paid",
          dossier_status: "payment_confirmed",
          dossier_progress: 20,
          dossier_status_label: "Paiement confirmé",
          services: [
            "Operating Agreement",
            "EIN",
            "Registered Agent",
            "Suivi administratif"
          ],
          missing_items: [],
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (orderError) {
        return NextResponse.json(
          {
            error: "Impossible de créer la commande client.",
            details: orderError.message,
          },
          { status: 500 }
        );
      }

      orderId = insertedOrder.id;
    }

    const { data: existingAccount } = await supabase
      .from("client_accounts")
      .select("*")
      .eq("email", previousEmail || email)
      .maybeSingle();

    let accessToken = existingAccount?.access_token || crypto.randomUUID();

    let accountResult = null;

    if (existingAccount?.id) {
      const { data: updatedAccount, error: updateError } = await supabase
        .from("client_accounts")
        .update({
          order_id: orderId || existingAccount.order_id || null,
          email,
          full_name: fullName || null,
          company_name: companyName,
          plan_name: planName,
          status: portalEnabled ? "active" : "disabled",
          portal_enabled: portalEnabled,
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAccount.id)
        .select("*")
        .single();

      if (updateError) {
        return NextResponse.json(
          {
            error: "Impossible de modifier le client.",
            details: updateError.message,
          },
          { status: 500 }
        );
      }

      accountResult = updatedAccount;
    } else {
      const { data: insertedAccount, error: insertError } = await supabase
        .from("client_accounts")
        .insert({
          order_id: orderId || null,
          email,
          full_name: fullName || null,
          company_name: companyName,
          plan_name: planName,
          status: portalEnabled ? "active" : "disabled",
          portal_enabled: portalEnabled,
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (insertError) {
        return NextResponse.json(
          {
            error: "Impossible de créer le client.",
            details: insertError.message,
          },
          { status: 500 }
        );
      }

      accountResult = insertedAccount;
    }

    if (orderId) {
      const defaultDocs = [
        {
          title: "Company Document",
          document_key: "company_document",
          status: "pending",
          required: false,
          admin_comment: "Document officiel de formation."
        },
        {
          title: "Operating Agreement",
          document_key: "operating_agreement",
          status: "pending",
          required: false,
          admin_comment: "Document d’exploitation de la LLC."
        },
        {
          title: "EIN Letter",
          document_key: "ein_letter",
          status: "pending",
          required: false,
          admin_comment: "Disponible après traitement IRS."
        }
      ];

      for (const doc of defaultDocs) {
        const { data: existingDoc } = await supabase
          .from("client_documents")
          .select("id")
          .eq("client_email", email)
          .eq("document_key", doc.document_key)
          .maybeSingle();

        if (!existingDoc?.id) {
          await supabase.from("client_documents").insert({
            order_id: orderId,
            client_email: email,
            title: doc.title,
            document_key: doc.document_key,
            status: doc.status,
            required: doc.required,
            admin_comment: doc.admin_comment,
            updated_at: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({
      ok: true,
      account: accountResult,
      activationUrl: `/fr/compte/activer?token=${accountResult.access_token}`,
      portalUrl: `/fr/espace-client`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Impossible de gérer le client.",
        details: message,
      },
      { status: 500 }
    );
  }
}



