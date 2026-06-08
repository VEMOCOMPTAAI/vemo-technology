import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";

export const dynamic = "force-dynamic";

const DATA_PATH = join(process.cwd(), "data", "client-portal-overview.json");

type PortalData = Record<string, any>;

async function readData(): Promise<PortalData> {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeData(data: PortalData) {
  await mkdir(dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

function defaultPortal() {
  return {
    status: {
      payment: "under_review",
      file: "pending",
      currentStep: "file_received",
    },
    documents: [],
    services: [],
    messages: [],
  };
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email") || "";
  const data = await readData();

  return NextResponse.json({
    email,
    portal: data[email] || defaultPortal(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || "");
  const subject = String(body.subject || "");
  const message = String(body.message || "");

  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
  }

  const data = await readData();
  const portal = data[email] || defaultPortal();

  portal.messages = Array.isArray(portal.messages) ? portal.messages : [];
  portal.messages.unshift({
    id: `msg_${Date.now()}`,
    from: "client",
    subject,
    message,
    createdAt: new Date().toISOString(),
  });

  data[email] = portal;
  await writeData(data);

  return NextResponse.json({ ok: true, portal });
}
