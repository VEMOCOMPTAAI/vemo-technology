// @ts-nocheck
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function cleanFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function documentCategory(key: string) {
  if (key === "company_document") return "Company Document";
  if (key === "operating_agreement") return "Operating Agreement";
  if (key === "ein_letter") return "EIN Letter";
  return "Other";
}

export async function GET(request: Request) {
  try {
    const adminCheck = await verifyAdminRequest(request);
    if (!adminCheck.ok) return adminCheck.response;

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase admin manquant." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = String(searchParams.get("email") || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email client manquant." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_email", email)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      documents: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible de charger les documents.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminCheck = await verifyAdminRequest(request);
    if (!adminCheck.ok) return adminCheck.response;

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase admin manquant." },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const rawTitle = String(formData.get("title") || "").trim();
    const rawKey = String(formData.get("documentKey") || "other").trim();

    const documentKey =
      rawKey
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "other";

    const title = rawTitle || documentCategory(documentKey);
    const comment = String(formData.get("comment") || "").trim();
    const file = formData.get("file");

    if (!email || !title) {
      return NextResponse.json(
        { error: "Email client et titre du document sont obligatoires." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Fichier manquant." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = cleanFileName(file.name || `${documentKey}.pdf`);
    const storagePath = `${email}/${documentKey}-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("client-documents")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("client-documents")
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData.publicUrl;

    const { data: existing } = await supabase
      .from("client_documents")
      .select("id, storage_path")
      .eq("client_email", email)
      .eq("document_key", documentKey)
      .maybeSingle();

    if (existing?.storage_path) {
      await supabase.storage
        .from("client-documents")
        .remove([existing.storage_path]);
    }

    if (existing?.id) {
      const { data, error } = await supabase
        .from("client_documents")
        .update({
          title,
          file_name: file.name,
          file_url: fileUrl,
          storage_path: storagePath,
          status: "available",
          admin_comment: comment || "Document ajouté par Vemo.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true, document: data });
    }

    const { data, error } = await supabase
      .from("client_documents")
      .insert({
        client_email: email,
        document_key: documentKey,
        title,
        file_name: file.name,
        file_url: fileUrl,
        storage_path: storagePath,
        status: "available",
        required: false,
        admin_comment: comment || "Document ajouté par Vemo.",
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, document: data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d’ajouter le document.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const adminCheck = await verifyAdminRequest(request);
    if (!adminCheck.ok) return adminCheck.response;

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase admin manquant." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "ID document manquant." },
        { status: 400 }
      );
    }

    const { data: existing, error: readError } = await supabase
      .from("client_documents")
      .select("id, storage_path")
      .eq("id", id)
      .maybeSingle();

    if (readError) {
      return NextResponse.json({ error: readError.message }, { status: 500 });
    }

    if (existing?.storage_path) {
      await supabase.storage
        .from("client-documents")
        .remove([existing.storage_path]);
    }

    const { error } = await supabase
      .from("client_documents")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible de supprimer le document.",
      },
      { status: 500 }
    );
  }
}