import { NextResponse } from "next/server";

export async function GET() {
  const adminPassword = String(process.env.ADMIN_PASSWORD || "").trim();

  return NextResponse.json({
    ok: true,
    route: "admin-login",
    hasAdminPassword: adminPassword.length > 0,
    adminPasswordLength: adminPassword.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const password = String(body.password || "").trim();
    const adminPassword = String(process.env.ADMIN_PASSWORD || "").trim();

    if (!adminPassword) {
      return NextResponse.json(
        {
          ok: false,
          error: "ADMIN_PASSWORD manquant dans .env.local",
        },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        {
          ok: false,
          error: "Mot de passe incorrect",
          typedLength: password.length,
          expectedLength: adminPassword.length,
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set("vemo_admin_session", "ok", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Erreur serveur login admin",
      },
      { status: 500 }
    );
  }
}




