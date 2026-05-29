import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function clean(value: any) {
  return String(value || "").trim();
}

function dossierNumber() {
  const d = new Date();
  const year = d.getFullYear();
  const stamp = `${d.getTime()}`.slice(-6);
  return `VEMO-${year}-${stamp}`;
}

async function safeInsert(supabase: any, table: string, payload: any) {
  try {
    const { data, error } = await supabase.from(table).insert(payload).select("*").single();
    if (!error) return { table, data, error: null };

    const minimalPayload: any = {};
    for (const key of [
      "client_email",
      "email",
      "client_name",
      "full_name",
      "llc_name",
      "phone",
      "phone_country",
      "llc_alternative_name",
      "llc_designator",
      "activity_sector",
      "activity_description",
      "package_name",
      "amount",
      "currency",
      "payment_method",
      "payment_status",
      "dossier_status",
      "status",
      "created_at",
      "updated_at",
    ]) {
      if (payload[key] !== undefined && payload[key] !== null && String(payload[key]).trim() !== "") {
        minimalPayload[key] = payload[key];
      }
    }

    const retry = await supabase.from(table).insert(minimalPayload).select("*").single();
    if (!retry.error) return { table, data: retry.data, error: null };

    return { table, data: null, error: retry.error.message || error.message };
  } catch (e: any) {
    return { table, data: null, error: e?.message || "Erreur inconnue" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const email = clean(body.email || body.client_email).toLowerCase();
    const fullName = clean(body.full_name || body.client_name);
    const llcName = clean(body.llc_name);
    const llcAlternativeName = clean(body.llc_alternative_name);
    const llcDesignator = clean(body.llc_designator);
    const activitySector = clean(body.activity_sector);
    const activityDescription = clean(body.activity_description);
    const phoneCountry = clean(body.phone_country);
    const phone = clean(body.phone);
    const country = clean(body.country);
    const state = clean(body.state);
    const packageName = clean(body.package_name);
    const packId = clean(body.pack_id);
    const amount = Number(body.amount || 0);
    const currency = clean(body.currency || "USD").toUpperCase();
    const paymentMethod = clean(body.payment_method || "card");
    const lang = clean(body.lang || "fr");

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Email client invalide." }, { status: 400 });
    }

    if (!fullName) {
      return NextResponse.json({ ok: false, error: "Nom complet obligatoire." }, { status: 400 });
    }

    if (!llcName) {
      return NextResponse.json({ ok: false, error: "Nom LLC obligatoire." }, { status: 400 });
    }

    const dossier = dossierNumber();

    const payload = {
      client_email: email,
      email,
      client_name: fullName,
      full_name: fullName,
      llc_name: llcName,
      phone,
      country,
      state,
      llc_state: state,
      package_name: packageName,
      pack_id: packId,
      amount,
      currency,
      payment_method: paymentMethod,
      payment_status: paymentMethod === "bank_transfer" ? "pending_verification" : "pending_payment",
      dossier_status: "new",
      status: paymentMethod === "bank_transfer" ? "pending_verification" : "pending_payment",
      dossier_number: dossier,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = supabaseAdmin();
    const debug: any[] = [];

    if (supabase) {
      for (const table of ["orders", "clients", "client_payments"]) {
        const result = await safeInsert(supabase, table, payload);
        debug.push(result);
      }

      try {
        await supabase.from("client_messages").insert({
          client_email: email,
          sender: "vemo",
          message:
            paymentMethod === "bank_transfer"
              ? "Dossier créé. Paiement par virement en attente de justificatif."
              : "Dossier créé. Paiement par carte en attente.",
        });
      } catch {}
    }

    const params = new URLSearchParams({
      pack: packageName,
      packId,
      amount: String(amount),
      currency,
      email,
      name: fullName,
      llc: llcName,
      dossier,
      state,
    });

    const redirectTo =
      paymentMethod === "bank_transfer"
        ? lang === "en"
          ? `/en/bank-transfer?${params.toString()}`
          : `/fr/virement?${params.toString()}`
        : lang === "en"
          ? `/en/stripe?${params.toString()}`
          : `/fr/stripe?${params.toString()}`;

    return NextResponse.json({
      ok: true,
      dossier_number: dossier,
      redirectTo,
      debug,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur création dossier." },
      { status: 500 }
    );
  }
}
