"use client";

import { useEffect, useRef, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/lib/supabase";

type Lang = "fr" | "en";

type EmbeddedStripePaymentProps = {
  lang: Lang;
  amount: number;
  orderPayload: Record<string, unknown>;
  email: string;
  fullCompanyName: string;
  onSuccess: () => void;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function StripeInnerForm({
  lang,
  orderId,
  onSuccess,
}: {
  lang: Lang;
  orderId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const isFr = lang === "fr";

  async function handlePayment() {
    if (!stripe || !elements) {
      setMessage(
        isFr
          ? "Stripe n’est pas encore prêt. Patientez quelques secondes."
          : "Stripe is not ready yet. Please wait a few seconds."
      );
      return;
    }

    setIsPaying(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: window.location.href,
      },
    });

    if (error) {
      setMessage(
        error.message ||
          (isFr
            ? "Le paiement a échoué. Vérifiez votre carte."
            : "Payment failed. Please check your card.")
      );
      setIsPaying(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const updateResponse = await fetch("/api/orders/mark-paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentIntentId: paymentIntent.id,
        }),
      });

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok || !updateResult.ok) {
        console.error("Order paid but Supabase update failed:", updateResult);
        setMessage(
          isFr
            ? "Paiement réussi, mais la mise à jour du dossier a échoué. Vérifiez Supabase."
            : "Payment succeeded, but order update failed. Please check Supabase."
        );
        setIsPaying(false);
        return;
      }

      setIsPaying(false);
      onSuccess();
      return;
    }

    setMessage(
      isFr
        ? "Paiement en cours de traitement. Vérifiez le statut Stripe."
        : "Payment is processing. Please check Stripe status."
    );

    setIsPaying(false);
  }

  return (
    <div className="mt-7">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <PaymentElement />
      </div>

      {message && (
        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || !elements || isPaying}
        className="vemo-button-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPaying
          ? isFr
            ? "Paiement en cours..."
            : "Payment in progress..."
          : isFr
            ? "Payer maintenant"
            : "Pay now"}
      </button>
    </div>
  );
}

export default function EmbeddedStripePayment({
  lang,
  amount,
  orderPayload,
  email,
  fullCompanyName,
  onSuccess,
}: EmbeddedStripePaymentProps) {
  const isFr = lang === "fr";

  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);

  const createdRef = useRef(false);
  const clientTokenRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now()}${Math.random().toString(16).slice(2)}`
  );

  useEffect(() => {
    async function preparePayment() {
      if (createdRef.current) return;

      createdRef.current = true;
      setIsPreparing(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("llc_orders")
        .insert([{ ...orderPayload, client_access_token: clientTokenRef.current }])
        .select("id")
        .single();

      if (error || !data?.id) {
        console.error(error);
        setErrorMessage(
          isFr
            ? "Impossible d’enregistrer le dossier avant paiement."
            : "Unable to save the case before payment."
        );
        setIsPreparing(false);
        return;
      }

      setOrderId(data.id);

      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          orderId: data.id,
          email,
          fullCompanyName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.clientSecret) {
        setErrorMessage(
          result.error ||
            (isFr
              ? "Impossible de préparer le paiement Stripe."
              : "Unable to prepare Stripe payment.")
        );
        setIsPreparing(false);
        return;
      }

      await supabase
        .from("llc_orders")
        .update({
          stripe_payment_intent_id: result.paymentIntentId,
        })
        .eq("id", data.id);

      setClientSecret(result.clientSecret);
      setIsPreparing(false);
    }

    preparePayment();
  }, [amount, email, fullCompanyName, isFr, orderPayload]);

  if (isPreparing) {
    return (
      <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <p className="font-black text-[#111a33]">
          {isFr ? "Préparation du paiement sécurisé..." : "Preparing secure payment..."}
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          {isFr
            ? "Création du dossier et initialisation Stripe."
            : "Creating the case and initializing Stripe."}
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mt-7 rounded-2xl bg-red-50 px-5 py-4 text-sm font-black text-red-700">
        {errorMessage}
      </div>
    );
  }

  if (!clientSecret || !orderId) {
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#c51f32",
            colorText: "#111a33",
            borderRadius: "14px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        },
      }}
    >
      <StripeInnerForm lang={lang} orderId={orderId} onSuccess={onSuccess} />
    </Elements>
  );
}
