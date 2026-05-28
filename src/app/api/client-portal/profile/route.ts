import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) throw new Error("Variables Supabase manquantes");

  return createClient(url, key);
}

function pick(row: any, keys: string[]) {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return "";
}

function normalize(row: any, source: string) {
  const email = String(
    pick(row, ["client_email", "email", "customer_email", "billing_email", "user_email"])
  ).trim();

  return {
    source,
    id: row?.id || "",
    email,
    client_email: email,
    full_name: pick(row, ["full_name", "client_name", "name", "customer_name"]),
    llc_name: pick(row, ["llc_name", "company_name", "business_name", "company", "entity_name"]),
    phone: pick(row, ["phone", "phone_number", "client_phone", "telephone", "mobile", "whatsapp"]),
    state: pick(row, ["state", "llc_state", "jurisdiction"]),
    dossier_number: pick(row, ["dossier_number", "dossier_no", "order_number", "reference", "file_number"]),
    package_name: pick(row, ["package_name", "pack_name", "selected_pack", "plan"]),
    amount: pick(row, ["amount", "price", "total"]),
    currency: pick(row, ["currency"]) || "USD",
    payment_status: pick(row, ["payment_status", "status_payment", "payment_state", "status"]),
    dossier_status: pick(row, ["dossier_status", "account_status", "portal_status", "order_status", "status"]),
    created_at: pick(row, ["created_at", "order_date", "payment_date", "date", "updated_at"]),
  };
}

async function safeSelectByEmail(supabase: any, table: string, email: string) {
  const emailColumns = ["client_email", "email", "customer_email", "billing_email", "user_email"];

  for (const col of emailColumns) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(col, email)
        .limit(5);

      if (!error && Array.isArray(data) && data.length > 0) {
        return { table, rows: data, error: null };
      }
    } catch {}
  }

  return { table, rows: [], error: null };
}

function makeDossierNumber(createdAt?: string) {
  let year = new Date().getFullYear();
  if (createdAt) {
    const d = new Date(createdAt);
    if (!Number.isNaN(d.getTime())) year = d.getFullYear();
  }
  return `VEMO-${year}-00001`;
}

export async function GET(request: NextRequest) {
  try {
    const email = String(request.nextUrl.searchParams.get("email") || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client manquant.", profile: null });
    }

    const supabase = supabaseAdmin();

    const tables = [
      "orders",
      "clients",
      "client_payments",
      "client_orders",
      "llc_orders",
      "llc_clients",
      "client_accounts",
      "profiles"
    ];

    const sources = await Promise.all(tables.map((table) => safeSelectByEmail(supabase, table, email)));

    let profile: any = {
      email,
      client_email: email,
      dossier_number: "",
      full_name: "",
      llc_name: "",
      phone: "",
      state: "",
      package_name: "",
      amount: "",
      currency: "USD",
      payment_status: "pending_verification",
      dossier_status: "in_progress",
      created_at: "",
    };

    for (const source of sources) {
      for (const row of source.rows) {
        const item = normalize(row, source.table);
        profile = {
          ...profile,
          ...Object.fromEntries(
            Object.entries(item).filter(([_, value]) => value !== undefined && value !== null && String(value).trim() !== "")
          ),
          email,
          client_email: email,
        };
      }
    }

    if (!profile.dossier_number) {
      profile.dossier_number = makeDossierNumber(profile.created_at);
    }

    return NextResponse.json({
      ok: true,
      profile,
      debug: sources.map((s) => ({ table: s.table, count: s.rows.length })),
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message || "Erreur chargement profil client.",
      profile: null,
    });
  }
}
