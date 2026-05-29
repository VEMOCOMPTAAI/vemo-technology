import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const amount = Number(body.amount || 0);
    const currency = String(body.currency || "USD").toLowerCase();
    const email = String(body.email || "").trim().toLowerCase();
    const dossierNumber = String(body.dossier_number || "").trim();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        ok: false,
        error: "STRIPE_SECRET_KEY manquante dans .env.local.",
      }, { status: 200 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({
        ok: false,
        error: "Montant invalide.",
      }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      receipt_email: email || undefined,
      automatic_payment_methods: { enabled: true },
      metadata: {
        email,
        dossier_number: dossierNumber,
        source: "vemo_llc_wizard",
      },
    });

    return NextResponse.json({
      ok: true,
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message || "Erreur création paiement Stripe.",
    }, { status: 500 });
  }
}
