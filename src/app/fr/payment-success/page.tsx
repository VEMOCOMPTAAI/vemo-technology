"use client";

import { useEffect } from "react";

export default function PaymentSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") || params.get("customer_email") || "";
    const receipt = params.get("receipt_url") || "";

    const url =
      "/fr/verification-compte?payment=stripe_success&status=paid" +
      (email ? `&email=${encodeURIComponent(email)}` : "") +
      (receipt ? `&receipt_url=${encodeURIComponent(receipt)}` : "");

    window.location.replace(url);
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-[#E8E2DC] bg-white p-8 text-center shadow-[0_22px_60px_rgba(18,58,99,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
          Paiement confirmé
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#111827]">
          Préparation de votre espace client...
        </h1>
        <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
          Vous allez être redirigé vers la création de votre compte client.
        </p>
      </div>
    </main>
  );
}
