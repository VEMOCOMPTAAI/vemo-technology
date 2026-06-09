import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";

export const dynamic = "force-dynamic";

const DATA_PATH = join(process.cwd(), "data", "client-portal-overview.json");

async function readData(): Promise<Record<string, any>> {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeData(data: Record<string, any>) {
  await mkdir(dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

function defaultPortal(email: string) {
  return {
    profile: {
      name: "Client VEMO",
      email,
      passwordUpdatedAt: null,
    },
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

  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
  }

  const data = await readData();
  const portal = data[email] || defaultPortal(email);
  const profile = portal.profile || {};

  return NextResponse.json({
    ok: true,
    account: {
      name: profile.name || "Client VEMO",
      email,
      passwordUpdatedAt: profile.passwordUpdatedAt || null,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const email = String(body.email || "");
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  const confirmPassword = String(body.confirmPassword || "");

  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ ok: false, error: "Missing password fields" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ ok: false, error: "Passwords do not match" }, { status: 400 });
  }

  const data = await readData();
  const portal = data[email] || defaultPortal(email);

  portal.profile = portal.profile || {};
  portal.profile.email = email;
  portal.profile.name = portal.profile.name || "Client VEMO";
  portal.profile.passwordUpdatedAt = new Date().toISOString();

  data[email] = portal;

  await writeData(data);

  return NextResponse.json({
    ok: true,
    account: {
      name: portal.profile.name,
      email,
      passwordUpdatedAt: portal.profile.passwordUpdatedAt,
    },
  });
}
