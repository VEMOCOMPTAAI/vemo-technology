// @ts-nocheck
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Configuration Supabase manquante.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const email = String(body.email || "").trim().toLowerCase();
    const companyName = String(body.companyName || "").trim();
    const paymentMethod = String(body.paymentMethod || "card").trim();
    const paymentStatus = String(body.paymentStatus || "confirmed").trim();

    if (!email) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email manquant.",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const payload: Record<string, string> = {
      email,
      status: "active",
      payment_method: paymentMethod,
      payment_status: paymentStatus,
    };

    if (companyName) {
      payload.company_name = companyName;
    }

    const { error } = await supabase
      .from("client_accounts")
      .upsert(payload, { onConflict: "email" });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Erreur serveur.",
      },
      { status: 500 }
    );
  }
}