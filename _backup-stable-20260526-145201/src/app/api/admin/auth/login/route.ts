// @ts-nocheck
import { NextResponse } from "next/server";
import { createAdminSessionToken, setAdminCookie } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };

    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD manquant dans .env.local." },
        { status: 500 }
      );
    }

    if (!password || password !== expected) {
      return NextResponse.json(
        { error: "Mot de passe admin incorrect." },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();

    const response = NextResponse.json({
      ok: true,
    });

    return setAdminCookie(response, token);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Connexion admin impossible.",
        details: message,
      },
      { status: 500 }
    );
  }
}

