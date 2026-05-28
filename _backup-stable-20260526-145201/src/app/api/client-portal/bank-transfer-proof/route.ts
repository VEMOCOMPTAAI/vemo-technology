// @ts-nocheck
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function cleanFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase admin manquant." },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const companyName = String(formData.get("companyName") || "").trim();
    const packageName = String(formData.get("packageName") || "").trim();
    const stateName = String(formData.get("stateName") || "").trim();
    const amount = String(formData.get("amount") || "").trim();
    const paymentReference = String(formData.get("paymentReference") || "").trim();
    const file = formData.get("file");

    if (!email) {
      return NextResponse.json(
        { error: "Email client manquant." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Justificatif de paiement manquant." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = cleanFileName(file.name || "justificatif-paiement.pdf");
    const storagePath = `${email}/proof-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData.publicUrl;

    const { data: proof, error: insertError } = await supabase
      .from("bank_transfer_proofs")
      .insert({
        email,
        company_name: companyName || null,
        package_name: packageName || null,
        state_name: stateName || null,
        amount: amount || null,
        payment_reference: paymentReference || null,
        file_name: file.name,
        file_url: fileUrl,
        storage_path: storagePath,
        status: "pending_verification",
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const { data: existingAccount } = await supabase
      .from("client_accounts")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingAccount?.id) {
      await supabase
        .from("client_accounts")
        .update({
          company_name: companyName || undefined,
          plan_name: packageName || undefined,
          status: "payment_verification",
          payment_status: "pending_verification",
          payment_method: "bank_transfer",
          portal_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAccount.id);
    } else {
      await supabase
        .from("client_accounts")
        .insert({
          email,
          company_name: companyName || "Client LLC",
          plan_name: packageName || "LLC Package",
          status: "payment_verification",
          payment_status: "pending_verification",
          payment_method: "bank_transfer",
          portal_enabled: true,
          updated_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      ok: true,
      proof,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d’envoyer le justificatif.",
      },
      { status: 500 }
    );
  }
}