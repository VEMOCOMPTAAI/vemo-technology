// @ts-nocheck

import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(request: Request) {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";

  if (envUrl) return envUrl.replace(/\/$/, "");

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY || "";

    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            "STRIPE_SECRET_KEY manquant dans .env.local. Ajoute ta clé sk_test_... puis relance le serveur.",
        },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const body = await request.json().catch(() => ({}));

    const amount = Number(body.amount || 179);
    const customerEmail = String(body.customerEmail || "").trim().toLowerCase();
    const customerName = String(body.customerName || "").trim();
    const planName = String(body.planName || "New Mexico Standard");
    const companyName = String(body.companyName || "LLC");
    const state = String(body.state || "New Mexico");
    const lang = String(body.lang || "fr");

    const baseUrl = getBaseUrl(request);

    const successUrl =
      `${baseUrl}/fr/verification-compte?payment=stripe_success&status=paid` +
      `&email=${encodeURIComponent(customerEmail)}` +
      `&name=${encodeURIComponent(customerName)}` +
      `&session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = `${baseUrl}/fr/commencer?payment=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      billing_address_collection: "auto",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `Vemo Technology — ${planName}`,
              description: `${companyName} / ${state}`,
            },
          },
        },
      ],
      metadata: {
        customer_email: customerEmail,
        customer_name: customerName,
        plan_name: planName,
        company_name: companyName,
        state,
        lang,
        source: "vemo_llc_wizard",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe Checkout n’a pas retourné d’URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error: any) {
    console.error("VEMO Stripe Checkout error:", error?.message || error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Erreur pendant la création de la session Stripe Checkout.",
      },
      { status: 500 }
    );
  }
}
