import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) throw new Error("Variables Supabase manquantes");

  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  try {
    const email = String(request.nextUrl.searchParams.get("email") || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ ok: true, documents: [] });
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({
        ok: false,
        documents: [],
        error: error.message,
      });
    }

    const documents = (data || []).map((doc: any) => ({
      id: doc.id,
      title: doc.title || doc.document_type || doc.file_name || "Document",
      document_type: doc.document_type || doc.title || "Document",
      file_name: doc.file_name || doc.title || "document",
      file_url: doc.file_url || doc.url || doc.public_url || "",
      status: doc.status || "available",
      created_at: doc.created_at,
      uploaded_by: doc.uploaded_by || "admin",
    }));

    return NextResponse.json({ ok: true, documents });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      documents: [],
      error: error?.message || "Erreur chargement documents.",
    });
  }
}
