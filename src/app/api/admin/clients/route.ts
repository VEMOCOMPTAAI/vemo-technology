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

function pick(row: any, keys: string[]) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }
  return "";
}

function getEmail(row: any) {
  return String(
    pick(row, [
      "client_email",
      "email",
      "customer_email",
      "billing_email",
      "user_email",
      "owner_email",
    ])
  );
}

function getLLCName(row: any) {
  return String(
    pick(row, [
      "llc_name",
      "company_name",
      "business_name",
      "company",
      "legal_name",
      "entity_name",
      "name",
      "client_name",
      "full_name",
    ])
  );
}

function getPhone(row: any) {
  return String(
    pick(row, [
      "phone",
      "phone_number",
      "client_phone",
      "customer_phone",
      "telephone",
      "tel",
      "mobile",
      "whatsapp",
    ])
  );
}

function getDossierNumber(row: any) {
  return String(
    pick(row, [
      "dossier_number",
      "dossier_no",
      "dossier_ref",
      "reference",
      "order_number",
      "order_ref",
      "file_number",
      "case_number",
      "number",
    ])
  );
}

function getCreatedAt(row: any) {
  return (
    pick(row, [
      "created_at",
      "createdAt",
      "order_date",
      "payment_date",
      "date",
      "updated_at",
    ]) || null
  );
}

function cleanStatus(value: any) {
  const raw = String(value || "non défini").trim();
  if (!raw) return "non défini";
  return raw.replace(/[_-]+/g, " ");
}

function normalize(row: any, source: string, index: number) {
  const email = getEmail(row);
  const llcName = getLLCName(row);
  const dossierNumber = getDossierNumber(row);

  return {
    id: row?.id || `${source}-${email || llcName || index}`,
    source,
    email,
    client_email: email,
    dossier_number: dossierNumber,
    llc_name: llcName || "Sans nom LLC",
    phone: getPhone(row),
    payment_status: cleanStatus(
      pick(row, [
        "payment_status",
        "status_payment",
        "paymentStatus",
        "payment_state",
        "payment_status_label",
      ])
    ),
    dossier_status: cleanStatus(
      pick(row, [
        "dossier_status",
        "account_status",
        "portal_status",
        "order_status",
        "status",
      ])
    ),
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

function makeDossierNumber(createdAt: string | null, index: number) {
  let year = new Date().getFullYear();
  if (createdAt) {
    const d = new Date(createdAt);
    if (!Number.isNaN(d.getTime())) year = d.getFullYear();
  }

  return `VEMO-${year}-${String(index + 1).padStart(5, "0")}`;
}

export async function GET() {
  try {
    const supabase = supabaseAdmin();

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
      source.rows.forEach((row: any, index: number) => {
        const item = normalize(row, source.table, index);

        if (!item.email && (!item.llc_name || item.llc_name === "Sans nom LLC")) {
          return;
        }

        const key = item.email || item.llc_name;
        const existing = merged.get(key);

        if (!existing) {
          merged.set(key, item);
          return;
        }

        merged.set(key, {
          ...existing,
          llc_name:
            existing.llc_name && existing.llc_name !== "Sans nom LLC"
              ? existing.llc_name
              : item.llc_name,
          phone: existing.phone || item.phone,
          dossier_number: existing.dossier_number || item.dossier_number,
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
      });
    }

    const clients = Array.from(merged.values())
      .sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      })
      .map((client, index) => ({
        ...client,
        dossier_number: client.dossier_number || makeDossierNumber(client.created_at, index),
      }));

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
