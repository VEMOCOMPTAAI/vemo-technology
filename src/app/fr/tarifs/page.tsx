"use client";

import { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";

type PackId = "starter" | "standard" | "premium";
type StateName = "New Mexico" | "Wyoming";

type Pack = {
  id: PackId;
  label: string;
  description: string;
  recommended?: boolean;
  prices: Record<string, number>;
  features: string[];
};

const states: StateName[] = ["New Mexico", "Wyoming"];

const renewalFallback: Record<StateName, number> = {
  "New Mexico": 35,
  Wyoming: 25,
};

const fallbackPacks: Pack[] = [
  {
    id: "starter",
    label: "Starter",
    description: "L’essentiel pour créer votre LLC.",
    prices: { "New Mexico": 129, Wyoming: 179 },
    features: [
      "Documents de création LLC",
      "Frais de dépôt de l’État inclus",
      "Registered Agent offert la première année",
      "US Phone Number offert 3 mois",
    ],
  },
  {
    id: "standard",
    label: "Standard",
    description: "La formule recommandée pour démarrer sérieusement.",
    recommended: true,
    prices: { "New Mexico": 149, Wyoming: 199 },
    features: [
      "Documents de création LLC",
      "Frais de dépôt de l’État inclus",
      "Registered Agent offert la première année",
      "US Phone Number offert 3 mois",
      "Demande EIN",
      "Assistance Stripe + Mercury",
    ],
  },
  {
    id: "premium",
    label: "Premium",
    description: "L’offre complète pour structurer votre activité.",
    prices: { "New Mexico": 199, Wyoming: 249 },
    features: [
      "Documents de création LLC",
      "Frais de dépôt de l’État inclus",
      "Registered Agent offert la première année",
      "US Phone Number offert 3 mois",
      "Demande EIN",
      "Assistance Stripe / PayPal",
      "Assistance Wise / Mercury / Payoneer",
      "Shopify offert 3 mois + nom de domaine 1 an",
    ],
  },
];

function stateSlug(state: StateName) {
  return state === "New Mexico" ? "new-mexico" : "wyoming";
}

function startHref(pack: Pack, state: StateName) {
  const price = Number(pack.prices?.[state] || 0);
  const slug = stateSlug(state);

  return `/fr/commencer?pack=${slug}_${pack.id}&packName=${encodeURIComponent(
    `${state} ${pack.label}`
  )}&state=${slug}&amount=${price}&currency=USD`;
}

function cleanFeatureList(features: string[]) {
  return features
    .filter(Boolean)
    .filter((feature) => !feature.toLowerCase().includes("renouvellement registered agent"))
    .filter((feature) => !feature.toLowerCase().includes("registered agent offert la première année"))
    .slice(0, 6);
}

export default function TarifsPage() {
  const [selectedState, setSelectedState] = useState<StateName>("New Mexico");
  const [packs, setPacks] = useState<Pack[]>(fallbackPacks);
  const [renewal, setRenewal] = useState<Record<StateName, number>>(renewalFallback);

  useEffect(() => {
    let active = true;

    fetch("/api/public/llc-packs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!active || !data?.ok) return;

        if (Array.isArray(data.packs) && data.packs.length) {
          setPacks(data.packs);
        }

        if (data.registeredAgentRenewal) {
          setRenewal({
            "New Mexico": Number(data.registeredAgentRenewal["New Mexico"] || 35),
            Wyoming: Number(data.registeredAgentRenewal.Wyoming || 25),
          });
        }
      })
      .catch(() => null);

    return () => {
      active = false;
    };
  }, []);

  const orderedPacks = useMemo(() => {
    const order: PackId[] = ["starter", "standard", "premium"];
    return [...packs].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [packs]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="border-b border-[#E8EEF6] bg-white">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-5">
          <a href="/fr" className="shrink-0">
            <div className="text-[25px] font-black uppercase leading-none tracking-[-0.06em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1.5 text-[9px] font-black uppercase tracking-[0.30em] text-slate-500">
              US LLC POUR NON-RÉSIDENTS
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            <a href="/fr" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">
              Accueil
            </a>
            <a href="/fr/tarifs" className="text-sm font-bold text-[#F15A24]">
              Tarifs
            </a>
            <a href="/fr/faq" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">
              FAQ
            </a>
            <a href="/fr/contact" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">
              Contact
            </a>
          </nav>

          <a
            href="/fr/commencer"
            className="inline-flex h-[44px] items-center justify-center rounded-[14px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
          >
            Démarrer →
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[1040px] px-6 py-9">
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#F15A24]">
            Tarifs
          </p>

          <h1 className="mt-2 text-[40px] font-black tracking-[-0.07em] text-[#111827]">
            Packs LLC
          </h1>

          <div className="mt-5 inline-flex rounded-[15px] border border-[#E8EEF6] bg-white p-1">
            {states.map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => setSelectedState(state)}
                className={`h-[40px] rounded-[11px] px-6 text-sm font-black transition ${
                  selectedState === state
                    ? "bg-[#F15A24] text-white"
                    : "bg-white text-[#123A63] hover:bg-[#F8FAFC]"
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-[980px] gap-4 lg:grid-cols-3">
          {orderedPacks.map((pack) => {
            const price = Number(pack.prices?.[selectedState] || 0);
            const renewalPrice = renewal[selectedState] || renewalFallback[selectedState];
            const features = cleanFeatureList(pack.features || []);

            return (
              <article
                key={`${selectedState}-${pack.id}`}
                className={`flex min-h-[430px] flex-col rounded-[22px] border bg-white p-4 ${
                  pack.recommended ? "border-[#F15A24]" : "border-[#E4ECF5]"
                }`}
              >
                <div className="flex h-[28px] items-center justify-between gap-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.20em] text-slate-400">
                    {selectedState}
                  </p>

                  {pack.recommended ? (
                    <span className="rounded-full border border-[#F15A24] bg-white px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#F15A24]">
                      Recommandé
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-2 text-[25px] font-black tracking-[-0.06em] text-[#123A63]">
                  {pack.label}
                </h2>

                <p className="mt-2 min-h-[42px] text-[12px] font-semibold leading-5 text-slate-600">
                  {pack.description}
                </p>

                <div className="mt-3 rounded-[16px] border border-[#E8EEF6] bg-white px-3.5 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Prix
                  </p>
                  <p className="mt-1 text-[30px] font-black leading-none tracking-[-0.05em] text-[#F15A24]">
                    {price} USD
                  </p>
                </div>

                <div className="mt-3 space-y-1.5">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 rounded-[12px] border border-[#E8EEF6] bg-white px-3 py-2"
                    >
                      <span className="mt-[1px] text-[11px] font-black text-[#F15A24]">
                        ✓
                      </span>
                      <span className="text-[11.5px] font-bold leading-4 text-[#123A63]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <a
                    href={startHref(pack, selectedState)}
                    className="inline-flex h-[43px] w-full items-center justify-center rounded-[13px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C]"
                  >
                    Choisir →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
