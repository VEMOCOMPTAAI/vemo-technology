import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = String(searchParams.get("token") || "").trim();

    if (!token || token.length < 20) {
      return NextResponse.json(
        { error: "Invalid client access token" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data: order, error: orderError } = await supabase
      .from("llc_orders")
      .select("id")
      .eq("client_access_token", token)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Dossier introuvable" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("llc_order_documents")
      .select(`
        id,
        created_at,
        uploaded_by,
        document_type,
        document_label,
        file_name,
        file_path,
        mime_type,
        file_size,
        status,
        admin_comment,
        reviewed_at
      `)
      .eq("order_id", order.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const visibleDocuments = (data || []).filter(
      (document) => document.status !== "rejected"
    );

    const documents = await Promise.all(
      visibleDocuments.map(async (document) => {
        const { data: signedData } = await supabase.storage
          .from("llc-documents")
          .createSignedUrl(document.file_path, 60 * 30);

        return {
          ...document,
          signed_url: signedData?.signedUrl || null,
        };
      })
    );

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Client documents error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


