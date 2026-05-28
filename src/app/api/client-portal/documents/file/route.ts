import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Variables Supabase manquantes");
  }

  return createClient(url, key);
}

function contentType(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();

  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".txt") return "text/plain; charset=utf-8";
  if (ext === ".doc") return "application/msword";
  if (ext === ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (ext === ".xls") return "application/vnd.ms-excel";
  if (ext === ".xlsx") return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return "application/octet-stream";
}

function safeFileName(name: string) {
  return String(name || "document")
    .replace(/[\r\n"]/g, "")
    .trim() || "document";
}

export async function GET(request: NextRequest) {
  try {
    const id = String(request.nextUrl.searchParams.get("id") || "").trim();
    const mode = String(request.nextUrl.searchParams.get("mode") || "view").trim();

    if (!id) {
      return new NextResponse("Document ID manquant.", { status: 400 });
    }

    const supabase = supabaseAdmin();

    const { data: doc, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !doc) {
      return new NextResponse("Document introuvable.", { status: 404 });
    }

    const fileUrl = String(doc.file_url || doc.url || doc.public_url || "").trim();
    const fileName = safeFileName(doc.file_name || doc.title || doc.document_type || "document");

    if (!fileUrl) {
      return new NextResponse("Ce document ne contient aucun fichier.", { status: 404 });
    }

    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return NextResponse.redirect(fileUrl);
    }

    const cleanUrl = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const absolutePath = path.join(process.cwd(), "public", cleanUrl);

    try {
      const buffer = await fs.readFile(absolutePath);

      const disposition =
        mode === "download"
          ? `attachment; filename="${fileName}"`
          : `inline; filename="${fileName}"`;

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType(fileName || fileUrl),
          "Content-Disposition": disposition,
          "Cache-Control": "private, max-age=0, no-store",
        },
      });
    } catch {
      const redirectUrl = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  } catch (error: any) {
    return new NextResponse(error?.message || "Erreur ouverture document.", {
      status: 500,
    });
  }
}
