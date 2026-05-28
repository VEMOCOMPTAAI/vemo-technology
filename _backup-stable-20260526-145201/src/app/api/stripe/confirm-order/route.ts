// @ts-nocheck
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function normalizeEmail(email?: string | null) {
  return String(email || "").trim().toLowerCase();
}

async function ensureDefaultDocuments(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  orderId: string,
  email: string
) {
  const docs = [
    { title: "Questionnaire LLC", status: "completed", required: false },
    { title: "Operating Agreement", status: "in_progress", required: false },
    { title: "EIN / IRS", status: "pending", required: false },
    { title: "Pièce d'identité du membre", status: "pending", required: true },
    { title: "Justificatif d'adresse", status: "pending", required: true },
    { title: "Documents société", status: "pending", required: false },
  ];

  for (const doc of docs) {
    const { data: existing } = await supabase
      .from("client_documents")
      .select("id")
      .eq("order_id", orderId)
      .eq("title", doc.title)
      .maybeSingle();

    if (!existing?.id) {
      await supabase.from("client_documents").insert({
        order_id: orderId,
        client_email: email,
        title: doc.title,
        status: doc.status,
        required: doc.required,
        admin_comment: doc.required
          ? "Document requis pour poursuivre le traitement du dossier."
          : null,
        updated_at: new Date().toISOString(),
      });
    }
  }
}

async function ensureWelcomeMessages(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  orderId: string,
  email: string
) {
  const { data: existing } = await supabase
    .from("client_messages")
    .select("id")
    .eq("order_id", orderId)
    .limit(1)
    .maybeSingle();

  if (!existing?.id) {
    await supabase.from("client_messages").insert([
      {
        order_id: orderId,
        client_email: email,
        sender: "Vemo Technology",
        message:
          "Votre paiement est confirmé. Votre dossier LLC est lancé. Merci d'activer votre compte client et de vérifier les documents requis.",
        message_type: "success",
      },
      {
        order_id: orderId,
        client_email: email,
        sender: "Admin Vemo",
        message:
          "Nous allons vérifier les informations transmises. Si une information ou un document manque, vous le verrez directement dans cet espace.",
        message_type: "info",
      },
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY manquante." },
        { status: 500 }
      );
    }

    const { sessionId } = (await request.json()) as { sessionId?: string };

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId manquant." },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const supabase = createSupabaseAdminClient();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: "Paiement non confirmé.",
          paymentStatus: session.payment_status,
        },
        { status: 400 }
      );
    }

    const customerEmail = normalizeEmail(
      session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.customerEmail ||
        ""
    );

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Email client introuvable dans Stripe." },
        { status: 400 }
      );
    }

    const customerName =
      session.customer_details?.name ||
      session.metadata?.customerName ||
      "Client";

    const companyName = session.metadata?.companyName || "Dossier LLC";
    const planName = session.metadata?.planName || "Standard";
    const state = session.metadata?.state || "New Mexico";
    const amount =
      typeof session.amount_total === "number" ? session.amount_total / 100 : 179;

    let orderId = session.metadata?.orderId || "";
    let order: any = null;

    if (orderId) {
      const { data: orderData } = await supabase
        .from("llc_orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      const { data: updatedOrder } = await supabase
        .from("llc_orders")
        .update({
          status: "paid",
          payment_status: "paid",
          stripe_session_id: session.id,
          customer_email: customerEmail,
          customer_name: customerName,
          company_name: orderData?.company_name || companyName,
          plan_name: orderData?.plan_name || planName,
          state: orderData?.state || state,
          amount: orderData?.amount || amount,
          currency: "usd",
          missing_items: orderData?.missing_items || [
            "Pièce d'identité du membre",
            "Justificatif d'adresse"
          ],
          paid_at: orderData?.paid_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select("*")
        .single();

      order = updatedOrder || orderData;
    }

    if (!orderId) {
      const { data: existingOrder } = await supabase
        .from("llc_orders")
        .select("*")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existingOrder?.id) {
        orderId = existingOrder.id;
        order = existingOrder;
      }
    }

    if (!orderId) {
      const { data: insertedOrder, error: orderInsertError } = await supabase
        .from("llc_orders")
        .insert({
          stripe_session_id: session.id,
          status: "paid",
          payment_status: "paid",
          customer_email: customerEmail,
          customer_name: customerName,
          company_name: companyName,
          plan_name: planName,
          state,
          amount,
          currency: "usd",
          services: [
            "Operating Agreement",
            "EIN",
            "Registered Agent",
            "Suivi administratif",
          ],
          dossier: {},
          missing_items: [
            "Pièce d'identité du membre",
            "Justificatif d'adresse"
          ],
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (orderInsertError) {
        console.error("Order insert error:", orderInsertError);
      }

      orderId = insertedOrder?.id || "";
      order = insertedOrder;
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "Impossible de créer ou retrouver la commande." },
        { status: 500 }
      );
    }

    const { data: existingAccount } = await supabase
      .from("client_accounts")
      .select("id, access_token")
      .eq("email", customerEmail)
      .maybeSingle();

    let accessToken = existingAccount?.access_token || crypto.randomUUID();

    if (existingAccount?.id) {
      const { data: updatedAccount, error: updateError } = await supabase
        .from("client_accounts")
        .update({
          order_id: orderId,
          full_name: customerName,
          company_name: order?.company_name || companyName,
          plan_name: order?.plan_name || planName,
          status: "pending_activation",
          portal_enabled: true,
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAccount.id)
        .select("access_token")
        .single();

      if (updateError) {
        console.error("Account update error:", updateError);
      }

      accessToken = updatedAccount?.access_token || accessToken;
    } else {
      const { data: insertedAccount, error: insertError } = await supabase
        .from("client_accounts")
        .insert({
          order_id: orderId,
          email: customerEmail,
          full_name: customerName,
          company_name: order?.company_name || companyName,
          plan_name: order?.plan_name || planName,
          status: "pending_activation",
          portal_enabled: true,
          email_confirmed: false,
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        })
        .select("access_token")
        .single();

      if (insertError) {
        console.error("Account insert error:", insertError);
      }

      accessToken = insertedAccount?.access_token || accessToken;
    }

    await ensureDefaultDocuments(supabase, orderId, customerEmail);
    await ensureWelcomeMessages(supabase, orderId, customerEmail);

    const activationUrl = `/fr/compte/activer?token=${accessToken}`;
    const portalUrl = `/fr/espace-client`;

    return NextResponse.json({
      ok: true,
      orderId,
      customerEmail,
      activationUrl,
      portalUrl,
      accessToken,
    });
  } catch (error: unknown) {
    console.error("Confirm order error:", error);

    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Impossible de confirmer le paiement.",
        details: message,
      },
      { status: 500 }
    );
  }
}

