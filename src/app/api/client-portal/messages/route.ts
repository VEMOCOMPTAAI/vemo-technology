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

export async function GET(request: NextRequest) {
  try {
    const email = String(request.nextUrl.searchParams.get("email") || "").trim().toLowerCase();

    if (!email) return NextResponse.json({ ok: true, messages: [] });

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("client_messages")
      .select("*")
      .eq("client_email", email)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({
        ok: false,
        messages: [],
        error: error.message,
      });
    }

    return NextResponse.json({
      ok: true,
      messages: data || [],
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      messages: [],
      error: error?.message || "Erreur chargement messages.",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const email = String(body.email || body.client_email || "").trim().toLowerCase();
    const message = String(body.message || "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client manquant." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ ok: false, error: "Message vide." }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("client_messages")
      .insert({
        client_email: email,
        sender: "client",
        message,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
    }

    return NextResponse.json({ ok: true, message: data });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message || "Erreur envoi message.",
    });
  }
}
