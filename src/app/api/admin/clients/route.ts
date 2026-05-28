import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key);
}

function getEmail(row: any) {
  return (
    row?.client_email ||
    row?.email ||
    row?.customer_email ||
    row?.billing_email ||
    row?.user_email ||
    ""
  );
}

function getName(row: any) {
  return (
    row?.llc_name ||
    row?.company_name ||
    row?.business_name ||
    row?.name ||
    row?.client_name ||
    row?.full_name ||
    "Dossier LLC"
  );
}

function normalize(row: any, source: string) {
  const email = getEmail(row);

  return {
    id: row?.id || `${source}-${email}`,
    source,
    email,
    client_email: email,
    name: getName(row),
    llc_name: row?.llc_name || row?.company_name || row?.business_name || "",
    company_name: row?.company_name || row?.llc_name || row?.business_name || "",
    payment_status:
      row?.payment_status ||
      row?.status_payment ||
      row?.paymentStatus ||
      row?.status ||
      "non défini",
    account_status:
      row?.account_status ||
      row?.portal_status ||
      row?.accountStatus ||
      "",
    status:
      row?.status ||
      row?.dossier_status ||
      row?.order_status ||
      "",
    created_at:
      row?.created_at ||
      row?.createdAt ||
      row?.date ||
      row?.updated_at ||
      null,
    raw: row,
  };
}

async function safeSelect(supabase: any, table: string) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { table, rows: [], error: error.message };
    }

    return { table, rows: data || [], error: null };
  } catch (e: any) {
    return { table, rows: [], error: e?.message || "Erreur inconnue" };
  }
}

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const sources = await Promise.all([
      safeSelect(supabase, "orders"),
      safeSelect(supabase, "clients"),
      safeSelect(supabase, "client_payments"),
    ]);

    const merged = new Map<string, any>();

    for (const source of sources) {
      for (const row of source.rows) {
        const item = normalize(row, source.table);
        const key = item.email || item.id;

        if (!key) continue;

        const existing = merged.get(key);

        if (!existing) {
          merged.set(key, item);
          continue;
        }

        merged.set(key, {
          ...existing,
          ...item,
          payment_status:
            item.payment_status !== "non défini"
              ? item.payment_status
              : existing.payment_status,
          account_status: item.account_status || existing.account_status,
          status: item.status || existing.status,
          created_at: existing.created_at || item.created_at,
          raw: {
            ...existing.raw,
            ...item.raw,
          },
        });
      }
    }

    const clients = Array.from(merged.values()).sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });

    return NextResponse.json({
      ok: true,
      clients,
      count: clients.length,
      debug: sources.map((s) => ({
        table: s.table,
        count: s.rows.length,
        error: s.error,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        clients: [],
        error: error?.message || "Impossible de charger les clients.",
      },
      { status: 200 }
    );
  }
}
