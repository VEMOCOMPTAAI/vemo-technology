import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!sessionId) {
    return NextResponse.json({ error: "session_id manquant." }, { status: 400 });
  }

  if (!secret) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY manquant." }, { status: 400 });
  }

  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=payment_intent.latest_charge`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      cache: "no-store",
    }
  );

  const data = await stripeRes.json();

  if (!stripeRes.ok) {
    return NextResponse.json({ error: data?.error?.message || "Erreur Stripe." }, { status: 400 });
  }

  const receiptUrl =
    data?.payment_intent?.latest_charge?.receipt_url ||
    data?.payment_intent?.charges?.data?.[0]?.receipt_url ||
    "";

  if (!receiptUrl) {
    return NextResponse.json({ error: "Reçu non disponible pour le moment." }, { status: 404 });
  }

  return NextResponse.redirect(receiptUrl);
}
