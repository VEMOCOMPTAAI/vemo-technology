"use client";

type Lang = "fr" | "en";

type Plan = {
  key: string;
  name: string;
  price: string;
  badge?: string;
  description: string;
  items: string[];
  note: string;
  cta: string;
  featured?: boolean;
};

const plansFr: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    price: "129 $",
    description: "Pour lancer simplement votre LLC au Nouveau-Mexique.",
    items: [
      "LLC formation documents",
      "Documents essentiels de la LLC",
      "Agent enregistré offert la 1re année",
      "US phone number included for 3 months",
    ],
    note: "Renouvellement agent enregistré : 129 $/an après la 1re année.",
    cta: "Choisir Starter",
  },
  {
    key: "standard",
    name: "Standard",
    price: "149 $",
    badge: "Recommandé",
    description: "La formule la plus choisie pour un dossier complet.",
    items: [
      "Tout le pack Starter",
      "Obtention de l’EIN",
      "EIN application",
      "Agent enregistré offert la 1re année",
      "Suivi renforcé du dossier",
    ],
    note: "Renouvellement agent enregistré : 129 $/an après la 1re année.",
    cta: "Choisir Standard",
    featured: true,
  },
  {
    key: "premium",
    name: "Premium",
    price: "199 $",
    description: "Pour un accompagnement premium et prioritaire.",
    items: [
      "Tout le pack Standard",
      "Stripe / PayPal assistance / Wise / Mercury / Payoneer",
      "Assistance Form 5472 + Form 1120 — 1re année",
      "Shopify included for 3 months + 1-year domain name",
      "Accompagnement premium de bout en bout",
    ],
    note: "Renouvellement agent enregistré : 129 $/an après la 1re année.",
    cta: "Choisir Premium",
  },
];

const plansEn: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    price: "$129",
    description: "A simple way to launch your New Mexico LLC.",
    items: [
      "LLC filing preparation",
      "Essential LLC documents",
      "Registered Agent included for the 1st year",
      "Basic administrative follow-up",
    ],
    note: "Registered Agent renewal: $129/year after the 1st year.",
    cta: "Choose Starter",
  },
  {
    key: "standard",
    name: "Standard",
    price: "$149",
    badge: "Recommended",
    description: "The most popular plan for a complete LLC setup.",
    items: [
      "Everything in Starter",
      "EIN application",
      "EIN application",
      "Registered Agent included for the 1st year",
      "Enhanced case follow-up",
    ],
    note: "Registered Agent renewal: $129/year after the 1st year.",
    cta: "Choose Standard",
    featured: true,
  },
  {
    key: "premium",
    name: "Premium",
    price: "$199",
    description: "For a priority, premium end-to-end experience.",
    items: [
      "Everything in Standard",
      "Stripe / PayPal / Wise / Mercury / Payoneer preparation",
      "Form 5472 + Form 1120 assistance — 1st year",
      "Priority support",
      "Premium end-to-end assistance",
    ],
    note: "Registered Agent renewal: $129/year after the 1st year.",
    cta: "Choose Premium",
  },
];

export default function PricingPlans({ lang = "fr" }: { lang?: Lang }) {
  const isFr = lang === "fr";
  const plans = isFr ? plansFr : plansEn;

  return (
    <section
      id={isFr ? "tarifs" : "pricing"}
      className="relative overflow-hidden bg-[#f4f7fa] px-6 py-20 text-slate-950"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#F15A24]">
            {isFr ? "Formules LLC" : "LLC Packages"}
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] md:text-6xl">
            {isFr
              ? "Choisissez l’accompagnement adapté à votre projet."
              : "Choose the right package for your LLC."}
          </h2>

          <p className="mt-5 text-base font-semibold leading-8 text-slate-500">
            {isFr
              ? "Tarifs applicables pour une LLC au Nouveau-Mexique. Les services peuvent être ajustés selon votre situation."
              : "Pricing for a New Mexico LLC. Services may be adjusted based on your situation."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={[
                "relative flex min-h-full flex-col rounded-[2rem] border bg-white p-7 shadow-xl shadow-slate-200/70 transition",
                plan.featured
                  ? "border-[#F15A24] ring-4 ring-cyan-100"
                  : "border-slate-200",
              ].join(" ")}
            >
              {plan.badge && (
                <div className="absolute right-6 top-6 rounded-full bg-[#F15A24] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                  {plan.badge}
                </div>
              )}

              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F15A24]">
                  {plan.name}
                </p>

                <div className="mt-5 flex items-end gap-2">
                  <p className="text-6xl font-black tracking-[-0.08em]">
                    {plan.price}
                  </p>
                  <p className="pb-2 text-sm font-black text-slate-400">
                    {isFr ? "(NM)" : "(New Mexico)"}
                  </p>
                </div>

                <p className="mt-5 min-h-[56px] text-sm font-bold leading-7 text-slate-500">
                  {plan.description}
                </p>
              </div>

              <div className="mt-7 flex-1 space-y-3">
                {plan.items.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#F15A24]">
                      ✓
                    </span>
                    <p className="text-sm font-black leading-6 text-slate-800">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-black leading-6 text-amber-800">
                {plan.note}
              </div>

              <a
                href={`/${lang}/commencer?plan=${encodeURIComponent(plan.name)}`}
                className={[
                  "mt-6 inline-flex w-full justify-center rounded-2xl px-5 py-4 text-sm font-black transition",
                  plan.featured
                    ? "bg-[#F15A24] text-white shadow-lg shadow-orange-900/20"
                    : "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50",
                ].join(" ")}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-[1.5rem] border border-slate-200 bg-white/80 px-6 py-5 text-center text-sm font-bold leading-7 text-slate-500 shadow-sm">
          {isFr
            ? "Note : les frais officiels de dépôt de l’État, les frais bancaires, fiscaux ou tiers éventuels ne sont pas inclus sauf mention contraire."
            : "Note: official state filing fees, banking, tax or third-party fees are not included unless stated otherwise."}
        </div>
      </div>
    </section>
  );
}