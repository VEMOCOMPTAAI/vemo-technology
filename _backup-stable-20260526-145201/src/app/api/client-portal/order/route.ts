// @ts-nocheck

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function cleanEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function cleanText(value: unknown) {
  return String(value || "").trim();
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase is not configured." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const email = cleanEmail(searchParams.get("email"));

  if (!email || !email.includes("@")) {
    return NextResponse.json({
      ok: true,
      order: null,
      documents: [],
      payments: [],
      messages: [],
    });
  }

  const { data: orders } = await supabase
    .from("client_orders")
    .select("*")
    .eq("client_email", email)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: documents } = await supabase
    .from("client_documents")
    .select("*")
    .eq("client_email", email)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: payments } = await supabase
    .from("client_payments")
    .select("*")
    .eq("client_email", email)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: messages } = await supabase
    .from("client_messages")
    .select("*")
    .eq("client_email", email)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({
    ok: true,
    order: Array.isArray(orders) && orders.length ? orders[0] : null,
    orders: orders || [],
    documents: documents || [],
    payments: payments || [],
    messages: messages || [],
  });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase is not configured." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));

  const email = cleanEmail(body.email || body.client_email);
  const clientName = cleanText(body.client_name || body.full_name || body.name);
  const packageName = cleanText(body.package_name || "New Mexico Standard");
  const state = cleanText(body.state || "New Mexico");
  const entityType = cleanText(body.entity_type || "LLC");
  const companyName = cleanText(body.company_name || "");
  const businessActivity = cleanText(body.business_activity || "");
  const notes = cleanText(body.notes || "");
  const amount = Number(body.amount || 0);
  const currency = cleanText(body.currency || "USD");

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, message: "Valid email is required." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  const { data: order, error } = await supabase
    .from("client_orders")
    .insert({
      client_email: email,
      client_name: clientName,
      package_name: packageName,
      state,
      entity_type: entityType,
      company_name: companyName,
      business_activity: businessActivity,
      status: "pending",
      progress: 10,
      amount,
      currency,
      source: "client_portal",
      notes,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 400 }
    );
  }

  await supabase.from("client_payments").insert({
    order_id: order?.id || null,
    client_email: email,
    client_name: clientName,
    payment_method: "pending",
    payment_status: "pending",
    status: "pending",
    amount,
    currency,
    notes: "Created from client portal order",
    created_at: now,
    updated_at: now,
  });

  const defaultDocuments = [
    {
      title: "Articles of Organization",
      document_type: "company_document",
      status: "pending",
    },
    {
      title: "Operating Agreement",
      document_type: "company_document",
      status: "pending",
    },
    {
      title: "EIN Letter",
      document_type: "tax_document",
      status: "pending",
    },
  ];

  for (const doc of defaultDocuments) {
    await supabase.from("client_documents").insert({
      order_id: order?.id || null,
      client_email: email,
      title: doc.title,
      document_type: doc.document_type,
      status: doc.status,
      uploaded_by: "system",
      created_at: now,
    });
  }

  return NextResponse.json({
    ok: true,
    order,
  });
}
