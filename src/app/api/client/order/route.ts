import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    const { data, error } = await supabase
      .from("llc_orders")
      .select(`
        id,
        created_at,
        language,
        status,
        payment_status,
        admin_status,
        package_name,
        jurisdiction,
        full_company_name,
        company_name,
        first_name,
        last_name,
        email,
        phone_e164,
        residence_country,
        total_amount,
        currency,
        processed_at,
        admin_updated_at
      `)
      .eq("client_access_token", token)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Dossier introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
