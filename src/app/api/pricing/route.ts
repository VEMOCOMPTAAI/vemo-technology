import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const filePath = path.join(process.cwd(), "data", "vemo-pricing.json");

export async function GET() {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const pricing = JSON.parse(raw);
    return NextResponse.json({ ok: true, pricing });
  } catch {
    return NextResponse.json({
      ok: true,
      pricing: {
        currency: "USD",
        packs: [],
        updated_at: null,
      },
    });
  }
}
