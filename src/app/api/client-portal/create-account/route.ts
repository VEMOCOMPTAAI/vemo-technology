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
      autoRefreshToken: false
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Email invalide." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        ok: true,
        warning: "Supabase non configuré. Simulation création espace client.",
        email
      });
    }

    try {
      const { error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          source: "payment_pending_verification"
        }
      });

      if (authError && !String(authError.message || "").toLowerCase().includes("already")) {
        return NextResponse.json({ ok: false, error: authError.message }, { status: 200 });
      }
    } catch {}

    for (const table of ["clients", "client_payments", "orders"]) {
      try {
        await supabase
          .from(table)
          .update({
            email,
            client_email: email,
            portal_enabled: true,
            account_status: "payment_pending_verification",
            updated_at: new Date().toISOString()
          })
          .or(`email.eq.${email},client_email.eq.${email}`);
      } catch {}
    }

    try {
      await supabase.from("client_messages").insert({
        client_email: email,
        sender: "vemo",
        message: "Espace client créé. Paiement en attente de vérification."
      });
    } catch {}

    return NextResponse.json({
      ok: true,
      email
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message || "Erreur création espace client."
    }, { status: 500 });
  }
}
