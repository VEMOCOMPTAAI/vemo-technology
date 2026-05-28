// @ts-nocheck
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("vemo_admin_session")?.value === "ok";
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("llc_orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const adminStatus = String(body.admin_status || "new");
    const internalNotes = String(body.internal_notes || "");

    const allowedStatuses = [
      "new",
      "paid_to_process",
      "in_progress",
      "waiting_client",
      "documents_prepared",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(adminStatus)) {
      return NextResponse.json(
        { error: "Invalid admin status" },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      admin_status: adminStatus,
      internal_notes: internalNotes,
      admin_updated_at: new Date().toISOString(),
    };

    if (adminStatus === "completed") {
      updatePayload.processed_at = new Date().toISOString();
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("llc_orders")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}