import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = await request.json();

    const amount = Math.round(Number(body.amount || 0) * 100);
    const orderId = String(body.orderId || "");
    const email = String(body.email || "");
    const fullCompanyName = String(body.fullCompanyName || "");

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: email || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_id: orderId,
        company_name: fullCompanyName,
        project: "Vemo Technology",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to create payment intent" },
      { status: 500 }
    );
  }
}
