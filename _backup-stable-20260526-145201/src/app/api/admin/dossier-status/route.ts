// @ts-nocheck
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const STATUS_MAP: Record<string, { label: string; progress: number }> = {
  payment_confirmed: {
    label: "Paiement confirmé",
    progress: 20,
  },
  verification: {
    label: "Vérification des informations",
    progress: 40,
  },
  documents_preparation: {
    label: "Documents en préparation",
    progress: 60,
  },
  ein_processing: {
    label: "EIN en cours",
    progress: 80,
  },
  completed: {
    label: "Dossier terminé",
    progress: 100,
  },
};

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

    const orderId = String(body.orderId || "").trim();
    const clientEmail = String(body.clientEmail || "").trim().toLowerCase();
    const dossierStatus = String(body.dossierStatus || "").trim();

    if (!STATUS_MAP[dossierStatus]) {
      return NextResponse.json(
        { error: "Statut de dossier invalide." },
        { status: 400 }
      );
    }

    if (!orderId && !clientEmail) {
      return NextResponse.json(
        { error: "orderId ou clientEmail requis." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    let targetOrderId = orderId;

    if (!targetOrderId && clientEmail) {
      const { data: latestOrder } = await supabase
        .from("llc_orders")
        .select("id")
        .eq("customer_email", clientEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      targetOrderId = latestOrder?.id || "";
    }

    if (!targetOrderId) {
      return NextResponse.json(
        { error: "Commande client introuvable." },
        { status: 404 }
      );
    }

    const next = STATUS_MAP[dossierStatus];

    const { data: updatedOrder, error: updateError } = await supabase
      .from("llc_orders")
      .update({
        dossier_status: dossierStatus,
        dossier_status_label: next.label,
        dossier_progress: next.progress,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetOrderId)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        {
          error: "Impossible de mettre à jour le statut du dossier.",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    if (clientEmail) {
      await supabase.from("client_messages").insert({
        order_id: targetOrderId,
        client_email: clientEmail,
        sender: "Admin Vemo",
        message: `Mise à jour du dossier : ${next.label}.`,
        message_type: "dossier_status",
        is_read: false,
      });
    }

    return NextResponse.json({
      ok: true,
      order: updatedOrder,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Impossible de mettre à jour le statut du dossier.",
        details: message,
      },
      { status: 500 }
    );
  }
}



