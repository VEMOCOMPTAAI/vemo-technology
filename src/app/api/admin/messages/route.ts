import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function checkAdmin(request: Request) {
  return verifyAdminRequest(request);
}

export async function POST(request: Request) {
  try {
    const auth = checkAdmin(request);

    if (!auth.ok) {
      return auth.response;
    }

    const body = await request.json();

    const clientEmail = String(body.clientEmail || "").trim().toLowerCase();
    const orderId = String(body.orderId || "").trim();
    const message = String(body.message || "").trim();

    if (!clientEmail) {
      return NextResponse.json(
        { error: "Email client manquant." },
        { status: 400 }
      );
    }

    if (!message || message.length < 3) {
      return NextResponse.json(
        { error: "Message trop court." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("client_messages")
      .insert({
        order_id: orderId || null,
        client_email: clientEmail,
        sender: "Admin Vemo",
        message,
        message_type: "admin",
        is_read: false,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Impossible d'envoyer le message.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: data,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Impossible d'envoyer le message.",
        details: message,
      },
      { status: 500 }
    );
  }
}



