import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token")?.trim();

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: accounts, error: accountsError } = await supabase
      .from("client_accounts")
      .select("*")
      .eq("portal_enabled", true);

    if (accountsError) {
      return NextResponse.json(
        {
          error: "Erreur pendant la recherche du compte client.",
          details: accountsError.message,
        },
        { status: 500 }
      );
    }

    const account = (accounts || []).find((item: any) => {
      return String(item.access_token || "").trim().toLowerCase() === token.toLowerCase();
    });

    if (!account) {
      return NextResponse.json(
        { error: "Compte client introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      account,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Impossible de charger l'activation.",
        details: message,
      },
      { status: 500 }
    );
  }
}

