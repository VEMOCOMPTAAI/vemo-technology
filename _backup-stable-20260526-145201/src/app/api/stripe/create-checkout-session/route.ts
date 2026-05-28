// @ts-nocheck
import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(stripeSecretKey);

type CheckoutPayload = {
  amount: number;
  currency?: string;
  customerEmail?: string;
  customerName?: string;
  companyName?: string;
  planName?: string;
  state?: string;
  services?: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;

    const amount = Number(body.amount || 0);

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Montant invalide." },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.customerEmail || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: body.currency || "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `Création LLC — ${body.planName || "Formule"}`,
              description: `${body.companyName || "Dossier LLC"} · ${
                body.state || "État à confirmer"
              }`,
              metadata: {
                companyName: body.companyName || "",
                planName: body.planName || "",
                state: body.state || "",
              },
            },
          },
        },
      ],
      metadata: {
        companyName: body.companyName || "",
        customerName: body.customerName || "",
        customerEmail: body.customerEmail || "",
        planName: body.planName || "",
        state: body.state || "",
        services: JSON.stringify(body.services || []),
      },
      success_url: `${appUrl}/fr/commencer/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/fr/commencer?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Impossible de créer la session Stripe." },
      { status: 500 }
    );
  }
}

