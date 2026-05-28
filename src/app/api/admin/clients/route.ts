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
    throw new Error("Variables Supabase manquantes");
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
    row?.owner_email ||
    ""
  );
}

function getLLCName(row: any) {
  return (
    row?.llc_name ||
    row?.company_name ||
    row?.business_name ||
    row?.company ||
    row?.name ||
    row?.client_name ||
    row?.full_name ||
    ""
  );
}

function getCreatedAt(row: any) {
  return (
    row?.created_at ||
    row?.createdAt ||
    row?.order_date ||
    row?.payment_date ||
    row?.date ||
    row?.updated_at ||
    null
  );
}

function normalize(row: any, source: string) {
  const email = getEmail(row);
  const llcName = getLLCName(row);

  return {
    id: row?.id || `${source}-${email}`,
    source,
    email,
    client_email: email,
    llc_name: llcName || "Sans nom LLC",
    payment_status:
      row?.payment_status ||
      row?.status_payment ||
      row?.paymentStatus ||
      row?.payment_state ||
      row?.payment_status_label ||
      "non défini",
    dossier_status:
      row?.dossier_status ||
      row?.account_status ||
      row?.portal_status ||
      row?.order_status ||
      row?.status ||
      "non défini",
    created_at: getCreatedAt(row),
    raw: row,
  };
}

async function safeSelect(supabase: any, table: string) {
  try {
    const withOrder = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (!withOrder.error) {
      return { table, rows: withOrder.data || [], error: null };
    }

    const plain = await supabase.from(table).select("*");

    if (!plain.error) {
      return { table, rows: plain.data || [], error: null };
    }

    return { table, rows: [], error: plain.error.message || withOrder.error.message };
  } catch (e: any) {
    return { table, rows: [], error: e?.message || "Erreur inconnue" };
  }
}

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    /*
      IMPORTANT :
      On ne lit PAS client_messages ni client_documents ici.
      Ces tables créent des fausses lignes "Dossier LLC".
      La liste admin doit venir uniquement des vraies tables dossiers/clients/paiements.
    */
    const tables = [
      "orders",
      "clients",
      "client_payments",
      "client_orders",
      "llc_orders",
      "llc_clients",
      "profiles",
    ];

    const sources = await Promise.all(tables.map((t) => safeSelect(supabase, t)));
    const merged = new Map<string, any>();

    for (const source of sources) {
      for (const row of source.rows) {
        const item = normalize(row, source.table);

        // On ignore les lignes sans email ET sans vrai nom LLC.
        if (!item.email && (!item.llc_name || item.llc_name === "Sans nom LLC")) {
          continue;
        }

        // Clé de fusion : email d'abord, sinon nom LLC.
        const key = item.email || item.llc_name;

        const existing = merged.get(key);

        if (!existing) {
          merged.set(key, item);
          continue;
        }

        merged.set(key, {
          ...existing,
          llc_name:
            existing.llc_name && existing.llc_name !== "Sans nom LLC"
              ? existing.llc_name
              : item.llc_name,
          payment_status:
            item.payment_status !== "non défini"
              ? item.payment_status
              : existing.payment_status,
          dossier_status:
            item.dossier_status !== "non défini"
              ? item.dossier_status
              : existing.dossier_status,
          created_at: existing.created_at || item.created_at,
          raw: { ...existing.raw, ...item.raw },
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
