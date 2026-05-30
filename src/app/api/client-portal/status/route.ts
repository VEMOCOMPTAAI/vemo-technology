import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "client-status.json");

function cleanEmail(value: any) {
  return String(value || "").trim().toLowerCase();
}

async function readStatuses() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function defaultStatus(email: string) {
  return {
    email,
    payment_status: "En vérification",
    dossier_status: "En attente",
    current_step: "Réception du dossier",
    note: "",
    updated_at: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const email = cleanEmail(request.nextUrl.searchParams.get("email"));

  if (!email) {
    return NextResponse.json({ ok: true, status: null });
  }

  const statuses = await readStatuses();

  return NextResponse.json({
    ok: true,
    status: statuses[email] || defaultStatus(email),
  });
}
