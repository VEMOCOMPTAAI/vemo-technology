"use client";

import { useState } from "react";
import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

type StateKey = "new-mexico" | "wyoming";

type Plan = {
  name: string;
  tag: string;
  description: string;
  price: number;
  recommended?: boolean;
  features: string[];
};

const plansByState: Record<StateKey, Plan[]> = {
  "new-mexico": [
    {
      name: "Starter",
      tag: "New Mexico",
      description: "Essential package to create your LLC.",
      price: 129,
      features: [
        "LLC formation documents",
        "State filing fees included",
        "Registered Agent included for the first year (renewal 35 USD/year)",
        "US Phone Number included for 3 months",
      ],
    },
    {
      name: "Standard",
      tag: "New Mexico",
      description: "Recommended package to start seriously.",
      price: 149,
      recommended: true,
      features: [
        "LLC formation documents",
        "State filing fees included",
        "Registered Agent included for the first year (renewal 35 USD/year)",
        "US Phone Number included for 3 months",
        "EIN request",
        "Stripe + Mercury assistance",
      ],
    },
    {
      name: "Premium",
      tag: "New Mexico",
      description: "Complete package to structure your business.",
      price: 199,
      features: [
        "LLC formation documents",
        "State filing fees included",
        "Registered Agent included for the first year (renewal 35 USD/year)",
        "US Phone Number included for 3 months",
        "EIN request",
        "Stripe / PayPal assistance",
        "Wise / Mercury / Payoneer assistance",
        "Shopify included for 3 months + 1-year domain name",
      ],
    },
  ],
  wyoming: [
    {
      name: "Starter",
      tag: "Wyoming",
      description: "Essential package to create your LLC.",
      price: 179,
      features: [
        "LLC formation documents",
        "State filing fees included",
        "Registered Agent included for the first year (renewal 25 USD/year)",
        "US Phone Number included for 3 months",
      ],
    },
    {
      name: "Standard",
      tag: "Wyoming",
      description: "Recommended package to start seriously.",
      price: 199,
      recommended: true,
      features: [
        "LLC formation documents",
        "State filing fees included",
        "Registered Agent included for the first year (renewal 25 USD/year)",
        "US Phone Number included for 3 months",
        "EIN request",
        "Stripe + Mercury assistance",
      ],
    },
    {
      name: "Premium",
      tag: "Wyoming",
      description: "Complete package to structure your business.",
      price: 249,
      features: [
        "LLC formation documents",
        "State filing fees included",
        "Registered Agent included for the first year (renewal 25 USD/year)",
        "US Phone Number included for 3 months",
        "EIN request",
        "Stripe / PayPal assistance",
        "Wise / Mercury / Payoneer assistance",
        "Shopify included for 3 months + 1-year domain name",
      ],
    },
  ],
};

export default function PricingPage() {
  const [state, setState] = useState<StateKey>("new-mexico");
  const plans = plansByState[state];

  return (
    <>
      <VemoPublicHeader locale="en" />

      <main className="vemo-public-zero-reflets min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-[980px] px-6 py-7">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              Pricing
            </p>

            <h1 className="mt-2 text-[34px] font-black tracking-[-0.05em] text-[#111827]">
              LLC Packages
            </h1>

            <div className="mx-auto mt-5 grid w-fit grid-cols-2 rounded-[14px] border border-[#E6EDF5] bg-white p-1">
              <button
                type="button"
                onClick={() => setState("new-mexico")}
                className={
                  state === "new-mexico"
                    ? "rounded-[11px] bg-[#F15A24] px-7 py-3 text-sm font-black text-white"
                    : "rounded-[11px] px-7 py-3 text-sm font-black text-[#123A63]"
                }
              >
                New Mexico
              </button>

              <button
                type="button"
                onClick={() => setState("wyoming")}
                className={
                  state === "wyoming"
                    ? "rounded-[11px] bg-[#F15A24] px-7 py-3 text-sm font-black text-white"
                    : "rounded-[11px] px-7 py-3 text-sm font-black text-[#123A63]"
                }
              >
                Wyoming
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={
                  plan.recommended
                    ? "relative flex min-h-[560px] flex-col rounded-[22px] border-2 border-[#F15A24] bg-white p-5"
                    : "relative flex min-h-[560px] flex-col rounded-[22px] border border-[#DDE7F2] bg-white p-5"
                }
              >
                {plan.recommended && (
                  <div className="absolute right-5 top-5 rounded-full border border-[#F15A24] px-4 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
                    Recommended
                  </div>
                )}

                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-slate-400">
                  {plan.tag}
                </p>

                <h2 className="mt-3 text-[24px] font-black tracking-[-0.04em] text-[#123A63]">
                  {plan.name}
                </h2>

                <p className="mt-3 min-h-[46px] text-sm font-bold leading-6 text-[#334155]">
                  {plan.description}
                </p>

                <div className="mt-4 rounded-[14px] border border-[#DDE7F2] bg-white px-5 py-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.24em] text-slate-400">
                    Price
                  </p>
                  <p className="mt-2 text-[26px] font-black tracking-[-0.04em] text-[#F15A24]">
                    {plan.price} USD
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex min-h-[38px] items-center gap-2 rounded-[12px] border border-[#DDE7F2] bg-white px-3 py-2 text-xs font-black leading-5 text-[#123A63]"
                    >
                      <span className="text-[#F15A24]">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                  <Link
                    href="/en/start"
                    className="flex h-11 items-center justify-center rounded-[12px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C]"
                  >
                    Choose →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      
        <VemoPublicFooter locale="en" />
      </main>
    </>
  );
}
