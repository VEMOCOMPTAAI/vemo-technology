import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "client-summary.json");

function cleanEmail(value: any) {
  return String(value || "").trim().toLowerCase();
}

async function readSummaries() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function defaultSummary(email: string) {
  return {
    email,
    llc_name: "Dossier LLC",
    formula: "—",
    state: "—",
    amount: "",
    currency: "USD",
    updated_at: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const email = cleanEmail(request.nextUrl.searchParams.get("email"));

  if (!email) {
    return NextResponse.json({ ok: true, summary: null });
  }

  const summaries = await readSummaries();

  return NextResponse.json({
    ok: true,
    summary: summaries[email] || defaultSummary(email),
  });
}
