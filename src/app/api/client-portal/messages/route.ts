import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "client-messages.json");

function cleanEmail(value: any) {
  return String(value || "").trim().toLowerCase();
}

async function ensureFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readMessages() {
  await ensureFile();

  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeMessages(messages: any[]) {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), "utf8");
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const email = cleanEmail(body.email || body.client_email);
    const subject = String(body.subject || "Réponse client").trim();
    const message = String(body.message || body.content || "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ ok: false, error: "Message obligatoire." }, { status: 400 });
    }

    const messages = await readMessages();

    const item = {
      id: `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      email,
      client_email: email,
      subject,
      message,
      content: message,
      sender: "client",
      direction: "client_to_admin",
      is_read: false,
      created_at: new Date().toISOString(),
    };

    messages.unshift(item);
    await writeMessages(messages);

    return NextResponse.json({ ok: true, message: item });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur envoi message client." },
      { status: 500 }
    );
  }
}
