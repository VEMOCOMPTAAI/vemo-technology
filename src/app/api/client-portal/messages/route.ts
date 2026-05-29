import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "client-messages.json");

function cleanEmail(value: any) {
  return String(value || "").trim().toLowerCase();
}

async function readMessages() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const email = cleanEmail(request.nextUrl.searchParams.get("email"));

  if (!email) {
    return NextResponse.json({ ok: true, messages: [] });
  }

  const messages = await readMessages();

  return NextResponse.json({
    ok: true,
    messages: messages
      .filter((msg: any) => cleanEmail(msg.email || msg.client_email) === email)
      .sort((a: any, b: any) => String(b.created_at).localeCompare(String(a.created_at))),
  });
}
