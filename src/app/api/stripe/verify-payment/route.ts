import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY manquante dans .env.local." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const body = await request.json();

    const sessionId = String(body.sessionId || "").trim();
    const paymentIntentId = String(body.paymentIntentId || "").trim();

    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return NextResponse.json({
        ok: true,
        type: "payment_intent",
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paid: paymentIntent.status === "succeeded",
        customerEmail:
          typeof paymentIntent.receipt_email === "string"
            ? paymentIntent.receipt_email
            : "",
        metadata: paymentIntent.metadata || {},
      });
    }

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return NextResponse.json({
        ok: true,
        type: "checkout_session",
        id: session.id,
        status: session.payment_status,
        amount: Number(session.amount_total || 0) / 100,
        currency: session.currency,
        paid: session.payment_status === "paid",
        customerEmail:
          typeof session.customer_email === "string"
            ? session.customer_email
            : "",
        metadata: session.metadata || {},
      });
    }

    return NextResponse.json(
      { error: "Référence Stripe manquante." },
      { status: 400 }
    );
  } catch (error) {
    console.error("verify payment error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible de vérifier le paiement.",
      },
      { status: 500 }
    );
  }
}