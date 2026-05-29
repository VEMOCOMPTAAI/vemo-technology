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

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase() || "";
    const supabase = supabaseAdmin();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ ok: true, messages: [] });
    }

    for (const table of ["client_messages", "messages"]) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .or(`client_email.eq.${email},email.eq.${email}`)
          .order("created_at", { ascending: false });

        if (!error) {
          return NextResponse.json({ ok: true, messages: data || [] });
        }
      } catch {}
    }

    return NextResponse.json({ ok: true, messages: [] });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur lecture messages." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body.email || body.client_email || "")
      .trim()
      .toLowerCase();

    const subject = String(body.subject || "Message VEMO").trim();
    const message = String(body.message || body.content || "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ ok: false, error: "Message obligatoire." }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    const payload = {
      client_email: email,
      email,
      subject,
      message,
      content: message,
      sender: "admin",
      direction: "admin_to_client",
      is_read: false,
      created_at: new Date().toISOString(),
    };

    if (!supabase) {
      return NextResponse.json({ ok: true, message: payload });
    }

    for (const table of ["client_messages", "messages"]) {
      try {
        const { data, error } = await supabase
          .from(table)
          .insert(payload)
          .select("*")
          .single();

        if (!error) {
          return NextResponse.json({ ok: true, message: data });
        }
      } catch {}
    }

    return NextResponse.json({ ok: true, message: payload });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur envoi message." },
      { status: 500 }
    );
  }
}
