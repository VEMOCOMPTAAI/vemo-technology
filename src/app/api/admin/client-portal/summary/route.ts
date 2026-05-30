import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "client-summary.json");

function cleanEmail(value: any) {
  return String(value || "").trim().toLowerCase();
}

async function ensureFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "{}", "utf8");
  }
}

async function readSummaries() {
  await ensureFile();

  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeSummaries(summaries: Record<string, any>) {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(summaries, null, 2), "utf8");
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
    return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
  }

  const summaries = await readSummaries();

  return NextResponse.json({
    ok: true,
    summary: summaries[email] || defaultSummary(email),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = cleanEmail(body.email || body.client_email);

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    const summaries = await readSummaries();

    const nextSummary = {
      ...(summaries[email] || defaultSummary(email)),
      email,
      llc_name: body.llc_name || body.llcName || body.company_name || summaries[email]?.llc_name || "Dossier LLC",
      formula: body.formula || body.pack || body.plan || summaries[email]?.formula || "—",
      state: body.state || summaries[email]?.state || "—",
      amount: body.amount ?? summaries[email]?.amount ?? "",
      currency: body.currency || summaries[email]?.currency || "USD",
      updated_at: new Date().toISOString(),
    };

    summaries[email] = nextSummary;
    await writeSummaries(summaries);

    return NextResponse.json({ ok: true, summary: nextSummary });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur résumé dossier." },
      { status: 500 }
    );
  }
}
