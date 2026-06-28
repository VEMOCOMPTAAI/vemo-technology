"use client";

import { useSearchParams } from "next/navigation";

export default function VemoPaymentSuccessClient({ lang }: { lang: "fr" | "en" }) {
  const params = useSearchParams();

  const sessionId = params.get("session_id") || "";
  const email = params.get("email") || "";
  const redirect = params.get("redirect") || (lang === "fr" ? "/fr/client" : "/en/client");

  const verifyHref = `/api/llc/verify?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}&lang=${lang}&payment=success`;

  return (
    <main className="vemo-payment-success">
      <section>
        <span>{lang === "fr" ? "PAIEMENT VALIDÉ" : "PAYMENT CONFIRMED"}</span>
        <h1>{lang === "fr" ? "Votre paiement a été accepté" : "Your payment was accepted"}</h1>
        <p>
          {lang === "fr"
            ? "Téléchargez votre reçu Stripe, puis confirmez votre adresse email pour accéder à votre espace client."
            : "Download your Stripe receipt, then confirm your email address to access your client portal."}
        </p>

        <div className="vemo-payment-success-actions">
          {sessionId && (
            <a href={`/api/llc/receipt?session_id=${encodeURIComponent(sessionId)}`} target="_blank" rel="noreferrer">
              {lang === "fr" ? "Télécharger le reçu Stripe" : "Download Stripe receipt"}
            </a>
          )}

          <a href={verifyHref} className="primary">
            {lang === "fr" ? "Confirmer mon email et accéder à mon espace" : "Confirm email and access my portal"}
          </a>
        </div>
      </section>
    </main>
  );
}
