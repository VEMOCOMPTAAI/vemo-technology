"use client";

import PaymentPendingClient from "./PaymentPendingClient";

export const dynamic = "force-dynamic";

export default async function EnPaymentPendingVerificationPage({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const email = params.email || "";

  return <PaymentPendingClient email={email} />;
}
