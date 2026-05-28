// @ts-nocheck
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-11-17.clover",
  });
}

function toAmountInCents(value: unknown) {
  const raw = String(value || "0").replace("$", "").replace(",", ".").trim();
  const number = Number(raw);

  if (!Number.isFinite(number) || number <= 0) {
    return 0;
  }

  return Math.round(number * 100);
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json(
        {
          ok: false,
          error: "STRIPE_SECRET_KEY manquant dans .env.local.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const amount =
      toAmountInCents(body.amount) ||
      toAmountInCents(body.total) ||
      toAmountInCents(body.price) ||
      11900;

    const email = String(body.email || body.billingEmail || "").trim().toLowerCase();
    const companyName = String(body.companyName || body.company_name || "").trim();
    const packageName = String(body.packageName || body.package_name || body.plan || "").trim();
    const stateName = String(body.stateName || body.state || body.jurisdiction || "").trim();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: email || undefined,
      metadata: {
        email,
        company_name: companyName,
        package_name: packageName,
        state_name: stateName,
        source: "vemo_checkout",
      },
    });

    return NextResponse.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      client_secret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      payment_intent: paymentIntent.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Impossible de créer le paiement Stripe.",
      },
      { status: 500 }
    );
  }
}