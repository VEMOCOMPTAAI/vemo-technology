import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "data", "llc-packs.json");

const fallback = [
  { id: "nm-starter", state: "New Mexico", name: "New Mexico Starter", price: "129", lines: ["LLC New Mexico", "Documents de création", "Registered Agent première année"] },
  { id: "nm-standard", state: "New Mexico", name: "New Mexico Standard", price: "149", lines: ["LLC New Mexico", "EIN", "Documents de création", "Accompagnement bancaire"] },
  { id: "nm-premium", state: "New Mexico", name: "New Mexico Premium", price: "199", lines: ["LLC New Mexico", "EIN", "Operating Agreement", "Suivi complet", "Support prioritaire"] },
  { id: "wy-starter", state: "Wyoming", name: "Wyoming Starter", price: "149", lines: ["LLC Wyoming", "Documents de création", "Registered Agent première année"] },
  { id: "wy-standard", state: "Wyoming", name: "Wyoming Standard", price: "179", lines: ["LLC Wyoming", "EIN", "Documents de création", "Accompagnement bancaire"] },
  { id: "wy-premium", state: "Wyoming", name: "Wyoming Premium", price: "229", lines: ["LLC Wyoming", "EIN", "Operating Agreement", "Suivi complet", "Support prioritaire"] }
];

export async function GET() {
  try {
    const raw = await readFile(FILE, "utf8");
    return NextResponse.json({ ok: true, packs: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ ok: true, packs: fallback });
  }
}
