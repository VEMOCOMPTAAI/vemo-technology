import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

const DATA_PATH = join(process.cwd(), "data", "client-portal-overview.json");

async function readData(): Promise<Record<string, any>> {
  try {
    return JSON.parse(await readFile(DATA_PATH, "utf8"));
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email") || "";

  if (!email.includes("@")) {
    return NextResponse.json({
      ok: true,
      documents: []
    });
  }

  const data = await readData();
  const portal = data[email] || {};
  const documents = Array.isArray(portal.documents) ? portal.documents : [];

  return NextResponse.json({
    ok: true,
    documents: documents.map((doc: any) => ({
      id: doc.id || `doc_${Date.now()}`,
      name: doc.name || doc.title || doc.filename || "Document",
      title: doc.name || doc.title || doc.filename || "Document",
      filename: doc.filename || doc.name || "document.pdf",
      url: doc.url || doc.fileUrl || "",
      fileUrl: doc.url || doc.fileUrl || "",
      uploadedAt: doc.uploadedAt || doc.createdAt || "",
      createdAt: doc.uploadedAt || doc.createdAt || ""
    }))
  });
}
