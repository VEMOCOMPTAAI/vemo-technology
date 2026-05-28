// @ts-nocheck

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSupabase } from "@/lib/vemoAdminServer";

function getUserSupabase(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authHeader = request.headers.get("authorization") || "";

  if (!url || !anon) return null;

  return createClient(url, anon, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: Request) {
  const userSupabase = getUserSupabase(request);
  const adminSupabase = getAdminSupabase();

  if (!userSupabase || !adminSupabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase is not configured." },
      { status: 500 }
    );
  }

  const { data: userData, error: userError } = await userSupabase.auth.getUser();

  if (userError || !userData?.user?.email) {
    return NextResponse.json(
      { ok: false, message: "Not authenticated." },
      { status: 401 }
    );
  }

  const email = userData.user.email.toLowerCase();
  const body = await request.json().catch(() => ({}));

  const subject = String(body?.subject || "").trim();
  const message = String(body?.message || "").trim();

  if (!message) {
    return NextResponse.json(
      { ok: false, message: "Message is required." },
      { status: 400 }
    );
  }

  const { data, error } = await adminSupabase
    .from("client_messages")
    .insert({
      client_email: email,
      order_id: null,
      sender: "client",
      subject: subject || "Message client",
      message,
      status: "open",
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    row: data,
  });
}
