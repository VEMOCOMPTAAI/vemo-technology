// @ts-nocheck
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Session manquante." },
        { status: 401 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user?.email) {
      return NextResponse.json(
        { error: "Utilisateur non connecté." },
        { status: 401 }
      );
    }

    const email = userData.user.email.toLowerCase();

    await supabase
      .from("client_accounts")
      .update({
        auth_user_id: userData.user.id,
        email_confirmed: Boolean(userData.user.email_confirmed_at),
        status: "active",
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("email", email);

    return NextResponse.json({
      ok: true,
      email,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Impossible de marquer la session.",
        details: message,
      },
      { status: 500 }
    );
  }
}

