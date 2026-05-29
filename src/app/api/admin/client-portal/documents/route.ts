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

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase() || "";
    const supabase = supabaseAdmin();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ ok: true, documents: [] });
    }

    for (const table of ["client_documents", "documents"]) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .or(`client_email.eq.${email},email.eq.${email}`)
          .order("created_at", { ascending: false });

        if (!error) {
          return NextResponse.json({ ok: true, documents: data || [] });
        }
      } catch {}
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

    const file = form.get("file") as File | null;
    const email = String(form.get("email") || form.get("client_email") || "")
      .trim()
      .toLowerCase();

    const title = String(form.get("title") || file?.name || "Document client").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email client obligatoire." }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ ok: false, error: "Fichier obligatoire." }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        ok: true,
        document: {
          client_email: email,
          name: title,
          filename: file.name,
          created_at: new Date().toISOString(),
        },
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "-");

    const path = `${email}/${Date.now()}-${safeName}`;

    let publicUrl = "";

    try {
      const { error: uploadError } = await supabase.storage
        .from("client-documents")
        .upload(path, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("client-documents")
          .getPublicUrl(path);

        publicUrl = urlData?.publicUrl || "";
      }
    } catch {}

    const payload = {
      client_email: email,
      email,
      title,
      name: title,
      filename: file.name,
      file_path: path,
      path,
      url: publicUrl,
      public_url: publicUrl,
      mime_type: file.type || null,
      size_bytes: file.size || null,
      visible_to_client: true,
      created_at: new Date().toISOString(),
    };

    for (const table of ["client_documents", "documents"]) {
      try {
        const { data, error } = await supabase
          .from(table)
          .insert(payload)
          .select("*")
          .single();

        if (!error) {
          return NextResponse.json({ ok: true, document: data });
        }
      } catch {}
    }

    return NextResponse.json({ ok: true, document: payload });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur upload document." },
      { status: 500 }
    );
  }
}
