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

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  const email = cleanEmail(request.nextUrl.searchParams.get("email"));

  if (!email) {
    return NextResponse.json({ ok: true, checklist: null });
  }

  const data = await readData();

  return NextResponse.json({
    ok: true,
    checklist: data[email] || defaultChecklist(email),
  });
}
