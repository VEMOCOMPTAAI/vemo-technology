import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function cleanEmail(value: any) {
  return String(value || "").trim().toLowerCase();
}

function cleanFileName(value: string) {
  return String(value || "document")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function uploadToStorage(supabase: any, email: string, file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = cleanFileName(file.name);
  const path = `${email}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from("client-documents")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message || "Erreur upload Storage.");
  }

  const { data } = supabase.storage.from("client-documents").getPublicUrl(path);

  return {
    path,
    publicUrl: data?.publicUrl || "",
  };
}

export async function GET(request: NextRequest) {
  try {
    const email = cleanEmail(request.nextUrl.searchParams.get("email"));
    const supabase = supabaseAdmin();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ ok: true, documents: [] });
    }

    const tables = ["client_documents", "documents"];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .or(`client_email.eq.${email},email.eq.${email}`)
        .order("created_at", { ascending: false });

      if (!error) {
        return NextResponse.json({ ok: true, documents: data || [] });
      }
    }

    return NextResponse.json({ ok: true, documents: [] });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur lecture documents." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const supabase = supabaseAdmin();

    const email = cleanEmail(form.get("email") || form.get("client_email"));
    const title = String(form.get("title") || "").trim();
    const file = form.get("file") as File | null;
    const replaceId = String(form.get("replace_id") || form.get("id") || "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ ok: false, error: "Fichier obligatoire." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase non configuré." }, { status: 500 });
    }

    const uploaded = await uploadToStorage(supabase, email, file);

    const payload = {
      client_email: email,
      email,
      title: title || file.name,
      name: title || file.name,
      filename: file.name,
      file_path: uploaded.path,
      path: uploaded.path,
      url: uploaded.publicUrl,
      public_url: uploaded.publicUrl,
      mime_type: file.type || null,
      size_bytes: file.size || null,
      visible_to_client: true,
      updated_at: new Date().toISOString(),
    };

    if (replaceId) {
      for (const table of ["client_documents", "documents"]) {
        const { data, error } = await supabase
          .from(table)
          .update(payload)
          .eq("id", replaceId)
          .select("*")
          .single();

        if (!error) {
          return NextResponse.json({ ok: true, document: data });
        }
      }
    }

    const insertPayload = {
      ...payload,
      created_at: new Date().toISOString(),
    };

    for (const table of ["client_documents", "documents"]) {
      const { data, error } = await supabase
        .from(table)
        .insert(insertPayload)
        .select("*")
        .single();

      if (!error) {
        return NextResponse.json({ ok: true, document: data });
      }
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "Aucune table documents compatible trouvée. Vérifie la table client_documents ou documents.",
      },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur upload document." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = supabaseAdmin();
    const body = await request.json().catch(() => ({}));
    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID document obligatoire." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase non configuré." }, { status: 500 });
    }

    for (const table of ["client_documents", "documents"]) {
      const { error } = await supabase.from(table).delete().eq("id", id);

      if (!error) {
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur suppression document." },
      { status: 500 }
    );
  }
}
