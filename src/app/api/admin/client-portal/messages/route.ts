import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(request: Request) {
  try {
    const adminCheck = await verifyAdminRequest(request);
    if (!adminCheck.ok) return adminCheck.response;

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase admin manquant." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = String(searchParams.get("email") || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email client manquant." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("client_messages")
      .select("*")
      .eq("client_email", email)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, messages: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible de charger les messages.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminCheck = await verifyAdminRequest(request);
    if (!adminCheck.ok) return adminCheck.response;

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase admin manquant." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const subject = String(body.subject || "Message Vemo").trim();
    const message = String(body.message || "").trim();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email client et message obligatoires." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("client_messages")
      .insert({
        client_email: email,
        subject,
        message,
        sender: "admin",
        status: "sent",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d’envoyer le message.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const adminCheck = await verifyAdminRequest(request);
    if (!adminCheck.ok) return adminCheck.response;

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase admin manquant." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "ID message manquant." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("client_messages")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible de supprimer le message.",
      },
      { status: 500 }
    );
  }
}