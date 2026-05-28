// @ts-nocheck
import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
  });

  return clearAdminCookie(response);
}

