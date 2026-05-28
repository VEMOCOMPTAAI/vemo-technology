// @ts-nocheck

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function encodeForm(data: Record<string, any>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === "") continue;
    params.append(key, String(value));
  }

  return params;
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY || "";

    if (!secretKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "STRIPE_SECRET_KEY manquant dans .env.local.",
        },
        { status: 500 }
      );
    }

    if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
      return NextResponse.json(
        {
          ok: false,
          error: "STRIPE_SECRET_KEY invalide. Elle doit commencer par sk_test_ ou sk_live_.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const amount = Number(body.amount || 179);
    const customerEmail = String(body.customerEmail || "").trim().toLowerCase();
    const customerName = String(body.customerName || "").trim();
    const planName = String(body.planName || "New Mexico Standard");
    const companyName = String(body.companyName || "LLC");
    const state = String(body.state || "New Mexico");
    const lang = String(body.lang || "fr");

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Montant Stripe invalide.",
        },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const form = encodeForm({
      amount: Math.round(amount * 100),
      currency: "usd",
      receipt_email: customerEmail || undefined,
      "payment_method_types[]": "card",
      "metadata[customer_email]": customerEmail,
      "metadata[customer_name]": customerName,
      "metadata[plan_name]": planName,
      "metadata[company_name]": companyName,
      "metadata[state]": state,
      "metadata[lang]": lang,
      "metadata[source]": "vemo_visible_card_fields",
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const stripeData = await stripeRes.json().catch(() => ({}));

    if (!stripeRes.ok) {
      console.error("VEMO Stripe API error:", stripeData);

      return NextResponse.json(
        {
          ok: false,
          error:
            stripeData?.error?.message ||
            `Erreur Stripe HTTP ${stripeRes.status}. Vérifie tes clés Stripe.`,
          stripe_error_type: stripeData?.error?.type || null,
          stripe_error_code: stripeData?.error?.code || null,
        },
        { status: 500 }
      );
    }

    if (!stripeData?.client_secret) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stripe n’a pas retourné client_secret.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      clientSecret: stripeData.client_secret,
      paymentIntentId: stripeData.id,
      durationMs: Date.now() - startedAt,
    });
  } catch (error: any) {
    console.error("VEMO create-payment-intent fatal:", error?.message || error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error?.name === "AbortError"
            ? "Timeout Stripe côté serveur. Vérifie la connexion internet ou les clés Stripe."
            : error?.message || "Erreur inconnue Stripe PaymentIntent.",
      },
      { status: 500 }
    );
  }
}
