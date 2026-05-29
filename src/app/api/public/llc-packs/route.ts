import { NextResponse } from "next/server";
import { readVemoLlcPacksPayload } from "@/lib/vemoLlcPacksStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const payload = readVemoLlcPacksPayload();

  return NextResponse.json({
    ok: true,
    ...payload,
  });
}
