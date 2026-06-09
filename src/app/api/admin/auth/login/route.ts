import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function adminToken() {
  const password = process.env.VEMO_ADMIN_PASSWORD || "VemoAdmin@2026";
  const secret = process.env.VEMO_ADMIN_SECRET || "vemo-admin-local-secret-2026";
  return crypto.createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || "");
  const expected = process.env.VEMO_ADMIN_PASSWORD || "VemoAdmin@2026";

  if (!password || password !== expected) {
    return NextResponse.json({ ok: false, error: "INVALID_PASSWORD" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("vemo_admin_session", adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
