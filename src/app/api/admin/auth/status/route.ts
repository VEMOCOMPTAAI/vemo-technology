import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function adminToken() {
  const password = process.env.VEMO_ADMIN_PASSWORD || "VemoAdmin@2026";
  const secret = process.env.VEMO_ADMIN_SECRET || "vemo-admin-local-secret-2026";
  return crypto.createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("vemo_admin_session")?.value || "";
  return NextResponse.json({ ok: token === adminToken() });
}
