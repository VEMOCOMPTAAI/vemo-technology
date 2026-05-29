import { NextRequest, NextResponse } from "next/server";
import {
  readVemoLlcPacksPayload,
  writeVemoLlcPacksPayload,
} from "@/lib/vemoLlcPacksStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const payload = readVemoLlcPacksPayload();

  return NextResponse.json({
    ok: true,
    ...payload,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const payload = writeVemoLlcPacksPayload(body);

    return NextResponse.json({
      ok: true,
      saved: true,
      ...payload,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erreur sauvegarde paramètres packs.",
      },
      { status: 500 }
    );
  }
}
