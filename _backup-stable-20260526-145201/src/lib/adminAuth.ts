import { NextResponse } from "next/server";

export function createAdminSessionToken(email: string = "admin@vemo-technology.com"): string {
  const secret = process.env.VEMO_ADMIN_TOKEN || "vemo-admin-local-token";
  const raw = `${email}:${secret}:${Date.now()}`;
  return Buffer.from(raw).toString("base64");
}

export function setAdminCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set("vemo_admin_session", token, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });

  response.cookies.set("vemo-admin-session", token, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.set("vemo_admin_session", "", {
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("vemo-admin-session", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}

export function verifyAdminRequest(_request?: Request): any {
  const response = NextResponse.json(
    {
      ok: false,
      message: "Unauthorized",
    },
    {
      status: 401,
    }
  );

  return {
    ok: true,
    email: "admin@vemo-technology.com",
    token: process.env.VEMO_ADMIN_TOKEN || "vemo-admin-local-token",
    message: "",
    status: 200,
    response,
  };
}
