import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const runtime = "nodejs";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Variables Supabase manquantes");
  }

  return createClient(url, key);
}

function cleanFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ documents: [] });
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ documents: [], error: error.message }, { status: 200 });
    }

    return NextResponse.json({ documents: data || [] });
  } catch (error: any) {
    return NextResponse.json({ documents: [], error: error?.message || "Erreur documents" }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const email = String(form.get("email") || "");
    const document_type = String(form.get("document_type") || "Autre document");
    const replace_id = String(form.get("replace_id") || "");
    const file = form.get("file");

    if (!email) {
      return NextResponse.json({ error: "Email client manquant" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = cleanFileName(file.name || "document.pdf");
    const finalName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${safeName}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "admin-documents");
    await fs.mkdir(uploadDir, { recursive: true });

    const diskPath = path.join(uploadDir, finalName);
    await fs.writeFile(diskPath, buffer);

    const file_url = `/uploads/admin-documents/${finalName}`;
    const supabase = supabaseAdmin();

    if (replace_id) {
      const { data, error } = await supabase
        .from("client_documents")
        .update({
          document_type,
          title: document_type,
          file_name: file.name,
          file_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", replace_id)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      await supabase.from("client_messages").insert({
        client_email: email,
        sender: "admin",
        message: `Document remplacé : ${document_type}`,
      });

      return NextResponse.json({ document: data, replaced: true });
    }

    const { data, error } = await supabase
      .from("client_documents")
      .insert({
        client_email: email,
        document_type,
        title: document_type,
        file_name: file.name,
        file_url,
        status: "uploaded",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.from("client_messages").insert({
      client_email: email,
      sender: "admin",
      message: `Nouveau document ajouté : ${document_type}`,
    });

    return NextResponse.json({ document: data, uploaded: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur upload document" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id;
    const email = body.email;

    if (!id) {
      return NextResponse.json({ error: "ID document manquant" }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("client_documents")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (email) {
      await supabase.from("client_messages").insert({
        client_email: email,
        sender: "admin",
        message: "Document supprimé du dossier.",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur suppression document" }, { status: 500 });
  }
}
