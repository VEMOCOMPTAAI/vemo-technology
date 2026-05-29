import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "client-documents.json");

function cleanEmail(value: any) {
  return String(value || "").trim().toLowerCase();
}

async function readDocuments() {
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
    return NextResponse.json({ ok: true, documents: [] });
  }

  const documents = await readDocuments();

  return NextResponse.json({
    ok: true,
    documents: documents
      .filter((doc: any) => cleanEmail(doc.email || doc.client_email) === email)
      .filter((doc: any) => doc.visible_to_client !== false)
      .sort((a: any, b: any) => String(b.created_at).localeCompare(String(a.created_at))),
  });
}
