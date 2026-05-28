"use client";

import { useState } from "react";
import { PaymentHero, VemoCard, VemoInput, VemoPaymentShell } from "@/components/VemoPaymentShell";

export default function StripePaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startStripe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        package_name: form.get("package_name"),
        amount: form.get("amount"),
        email: form.get("email"),
        client_name: form.get("client_name"),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      setLoading(false);
      setError(data.message || "Erreur Stripe. Vérifie STRIPE_SECRET_KEY dans .env.local.");
      return;
    }

    window.location.href = data.url;
  }

  return (
    <VemoPaymentShell lang="fr">
      <PaymentHero
        eyebrow="Stripe Checkout"
        title="Paiement sécurisé par Stripe"
        text="Confirmez votre pack, votre email de commande et continuez vers le paiement en ligne."
      />

      <main className="px-6 pb-20">
        <VemoCard className="mx-auto grid max-w-5xl gap-8 p-8 lg:grid-cols-[1fr_.85fr]">
          <div>
            <h2 className="text-3xl font-black text-[#123A63]">Activation rapide</h2>
            <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
              Après paiement Stripe, vous serez redirigé vers la page de création / vérification du compte client.
            </p>

            <div className="mt-8 rounded-[18px] border border-[#FFD2C2] bg-white p-6">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-[#F15A24]">Pack recommandé</div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-black text-[#202838]">New Mexico Standard</div>
                  <div className="mt-1 text-sm font-semibold text-slate-500">LLC + EIN guidance + support</div>
                </div>
                <div className="text-4xl font-black text-[#F15A24]">$179</div>
              </div>
            </div>
          </div>

          <form onSubmit={startStripe} className="rounded-[18px] bg-white p-6">
            <div className="grid gap-4">
              <VemoInput name="client_name" required placeholder="Nom complet" />
              <VemoInput name="email" required type="email" placeholder="Email de commande" />
              <VemoInput name="package_name" defaultValue="New Mexico Standard" placeholder="Pack" />
              <VemoInput name="amount" defaultValue="179" placeholder="Montant USD" />

              {error ? (
                <div className="rounded-[14px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                disabled={loading}
                className="mt-2 h-13 min-h-[52px] rounded-[14px] bg-[#F15A24] text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] disabled:opacity-60"
              >
                {loading ? "Redirection Stripe..." : "Payer avec Stripe →"}
              </button>
            </div>
          </form>
        </VemoCard>
      </main>
    </VemoPaymentShell>
  );
}
