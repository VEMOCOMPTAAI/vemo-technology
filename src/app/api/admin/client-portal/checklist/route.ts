import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "client-checklist.json");

function cleanEmail(value: any) {
  return String(value || "").trim().toLowerCase();
}

function defaultChecklist(email: string) {
  return {
    email,
    items: [
      { key: "passport", label: "Passeport / pièce d’identité", status: "Demandé" },
      { key: "address", label: "Adresse personnelle", status: "Demandé" },
      { key: "activity", label: "Activité de la société", status: "Demandé" },
      { key: "llc_name", label: "Nom souhaité de la LLC", status: "Demandé" },
      { key: "payment", label: "Justificatif de paiement", status: "Demandé" }
    ],
    updated_at: new Date().toISOString(),
  };
}

async function ensureFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "{}", "utf8");
  }
}

async function readData() {
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

async function writeData(data: Record<string, any>) {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(request: NextRequest) {
  const email = cleanEmail(request.nextUrl.searchParams.get("email"));

  if (!email) {
    return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
  }

  const data = await readData();

  return NextResponse.json({
    ok: true,
    checklist: data[email] || defaultChecklist(email),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = cleanEmail(body.email || body.client_email);

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    const data = await readData();

    const checklist = {
      ...(data[email] || defaultChecklist(email)),
      email,
      items: Array.isArray(body.items) ? body.items : data[email]?.items || defaultChecklist(email).items,
      updated_at: new Date().toISOString(),
    };

    data[email] = checklist;
    await writeData(data);

    return NextResponse.json({ ok: true, checklist });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur checklist." },
      { status: 500 }
    );
  }
}
