"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
  amount: number;
  customerEmail?: string;
  customerName?: string;
  companyName?: string;
  planName?: string;
  state?: string;
  services?: string[];
  dossier?: any;
  lang?: "fr" | "en";
};

type CardFormProps = Props & {
  clientSecret: string;
};

const stripeInputStyle = {
  base: {
    color: "#111827",
    fontSize: "16px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontWeight: "600",
    lineHeight: "24px",
    "::placeholder": {
      color: "#94A3B8",
    },
  },
  invalid: {
    color: "#dc2626",
  },
};

function StripeField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#123A63]">
        {label}
      </span>
      <div className="min-h-[56px] rounded-[16px] border border-[#E8E2DC] bg-white px-4 py-4 shadow-sm transition focus-within:border-[#F15A24] focus-within:ring-4 focus-within:ring-[#F15A24]/10">
        {children}
      </div>
    </label>
  );
}

function VemoCardForm({
  amount,
  customerEmail = "",
  customerName = "",
  clientSecret,
  lang = "fr",
}: CardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const isFr = lang === "fr";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardholderName, setCardholderName] = useState(customerName || "");

  async function submitPayment() {
    if (!stripe || !elements) {
      setError("Stripe n’est pas encore prêt. Patientez quelques secondes.");
      return;
    }

    setLoading(true);
    setError("");

    const cardNumber = elements.getElement(CardNumberElement);

    if (!cardNumber) {
      setError("Le champ numéro de carte n’est pas chargé.");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: {
          email: customerEmail || undefined,
          name: cardholderName || customerName || undefined,
        },
      },
    });

    if (result.error) {
      setError(result.error.message || "Paiement refusé.");
      setLoading(false);
      return;
    }

    window.location.href =
      `/fr/verification-compte?payment=stripe_success&status=paid` +
      `&email=${encodeURIComponent(customerEmail || "")}` +
      `&name=${encodeURIComponent(customerName || "")}` +
      `&payment_intent=${encodeURIComponent(result.paymentIntent?.id || "")}`;
  }

  return (
    <div className="mt-5">
      <div className="rounded-[20px] border border-[#E8E2DC] bg-white p-5">
        <p className="mb-4 text-sm font-black text-[#123A63]">
          {isFr ? "Informations de carte" : "Card information"}
        </p>

        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-[#123A63]">
              {isFr ? "Nom du titulaire de la carte" : "Cardholder name"}
            </span>
            <input
              value={cardholderName}
              onChange={(event) => setCardholderName(event.target.value)}
              required
              placeholder={isFr ? "Nom affiché sur la carte" : "Name on card"}
              className="min-h-[56px] w-full rounded-[16px] border border-[#E8E2DC] bg-white px-4 py-4 text-sm font-bold text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
            />
          </label>

          <StripeField label={isFr ? "Numéro de carte" : "Card number"}>
            <CardNumberElement
              options={{
                showIcon: true,
                disableLink: true,
                placeholder: "4242 4242 4242 4242",
                style: stripeInputStyle,
              }}
            />
          </StripeField>

          <div className="grid gap-4 md:grid-cols-2">
            <StripeField label="MM / AA">
              <CardExpiryElement
                options={{
                  placeholder: "12 / 30",
                  style: stripeInputStyle,
                }}
              />
            </StripeField>

            <StripeField label="CVC">
              <CardCvcElement
                options={{
                  placeholder: "123",
                  style: stripeInputStyle,
                }}
              />
            </StripeField>
          </div>
        </div>

        <p className="mt-4 text-xs font-bold leading-6 text-slate-500">
          {isFr
            ? "Vos informations bancaires sont chiffrées et traitées de manière sécurisée par Stripe."
            : "Your card details are encrypted and securely processed by Stripe."}
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={submitPayment}
        disabled={!stripe || !elements || loading}
        className="mt-5 w-full rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] transition hover:bg-[#D94A1B] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? isFr
            ? "Validation du paiement..."
            : "Confirming payment..."
          : isFr
          ? `Payer $${amount}.00`
          : `Pay $${amount}.00`}
      </button>
    </div>
  );
}

export default function StripeCardPayment({
  amount,
  customerEmail = "",
  customerName = "",
  companyName = "",
  planName = "New Mexico Standard",
  state = "New Mexico",
  services = [],
  dossier = {},
  lang = "fr",
}: Props) {
  const isFr = lang === "fr";

  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [loadingIntent, setLoadingIntent] = useState(true);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  const stripePromise = useMemo(() => {
    if (!publishableKey) return null;
    return loadStripe(publishableKey);
  }, [publishableKey]);

  useEffect(() => {
    let cancelled = false;

    async function createIntent() {
      setLoadingIntent(true);
      setError("");

      if (!publishableKey) {
        setError("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY manquant dans .env.local.");
        setLoadingIntent(false);
        return;
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 45000);

      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            amount,
            customerEmail,
            customerName,
            companyName,
            planName,
            state,
            services,
            dossier,
            lang,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data?.clientSecret) {
          throw new Error(data?.error || "Impossible de préparer le paiement.");
        }

        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.name === "AbortError"
              ? "Stripe ne répond pas. Vérifiez le message du terminal et vos clés Stripe dans .env.local."
              : err?.message || "Le paiement carte est temporairement indisponible."
          );
        }
      } finally {
        window.clearTimeout(timeout);
        if (!cancelled) setLoadingIntent(false);
      }
    }

    createIntent();

    return () => {
      cancelled = true;
    };
  }, [
    amount,
    customerEmail,
    customerName,
    companyName,
    planName,
    state,
    lang,
    publishableKey,
  ]);

  return (
    <div className="rounded-[2rem] border border-[#E8E2DC] bg-white p-6 shadow-[0_22px_60px_rgba(18,58,99,0.08)]">
      <div className="flex items-start justify-between gap-4 border-b border-[#E8E2DC] pb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
            {isFr ? "Paiement carte sécurisé" : "Secure card payment"}
          </p>

          <p className="mt-2 text-sm font-black text-slate-500">
            {planName || "New Mexico Standard"} — ${amount}.00
          </p>
        </div>

        <span className="rounded-full border border-[#E8E2DC] bg-white px-4 py-2 text-xs font-black text-[#F15A24]">
          Stripe
        </span>
      </div>

      <div className="mt-5 rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF7F2] text-[#F15A24]">
            💳
          </span>

          <div>
            <p className="text-sm font-black text-[#111827]">
              {isFr ? "Carte bancaire" : "Credit card"}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              {isFr
                ? "Paiement 100 % sécurisé par Stripe."
                : "100% secure payment powered by Stripe."}
            </p>
          </div>
        </div>
      </div>

      {loadingIntent && (
        <div className="mt-5 rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-5 text-sm font-bold text-slate-500">
          {isFr ? "Préparation du formulaire carte..." : "Preparing card form..."}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
          {error}
        </div>
      )}

      {stripePromise && clientSecret && !loadingIntent && (
        <Elements stripe={stripePromise}>
          <VemoCardForm
            amount={amount}
            customerEmail={customerEmail}
            customerName={customerName}
            companyName={companyName}
            planName={planName}
            state={state}
            services={services}
            dossier={dossier}
            lang={lang}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    </div>
  );
}
