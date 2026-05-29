"use client";

import { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";

type Pack = {
  id: "starter" | "standard" | "premium";
  label: string;
  description: string;
  recommended?: boolean;
  prices: Record<string, number>;
  features: string[];
};

const defaultPacks: Pack[] = [
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

const stateOptions = ["New Mexico", "Wyoming"] as const;

function stateSlug(state: string) {
  return state === "New Mexico" ? "new-mexico" : "wyoming";
}

function startHref(pack: Pack, state: string) {
  const amount = Number(pack.prices?.[state] || 0);
  const slug = stateSlug(state);

  return `/fr/commencer?pack=${slug}_${pack.id}&packName=${encodeURIComponent(
    `${state} ${pack.label}`
  )}&state=${slug}&amount=${amount}&currency=USD`;
}

function cleanFeatures(features: string[]) {
  return features
    .filter(Boolean)
    .filter((item) => !item.toLowerCase().includes("renouvellement registered agent"))
    .slice(0, 5);
}

export default function TarifsPage() {
  const [packs, setPacks] = useState<Pack[]>(defaultPacks);
  const [selectedState, setSelectedState] = useState<"New Mexico" | "Wyoming">("New Mexico");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetch("/api/public/llc-packs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;

        if (data?.ok && Array.isArray(data.packs) && data.packs.length) {
          setPacks(data.packs);
        }
      })
      .catch(() => null)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const orderedPacks = useMemo(() => {
    const order = ["starter", "standard", "premium"];
    return [...packs].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [packs]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <section className="mx-auto max-w-[1180px] px-6 py-8">
        <header className="flex items-center justify-between border-b border-[#E8EEF6] pb-5">
          <a href="/fr" className="inline-flex flex-col">
            <div className="text-[28px] font-black uppercase leading-none tracking-[-0.06em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-2 text-[9px] font-black uppercase tracking-[0.32em] text-slate-500">
              US LLC POUR NON-RÉSIDENTS
            </div>
          </a>

          <a
            href="/fr/commencer"
            className="inline-flex h-[44px] items-center justify-center rounded-[13px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
          >
            Démarrer →
          </a>
        </header>

        <section className="mx-auto max-w-3xl py-10 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#F15A24]">
            Tarifs
          </p>

          <h1 className="mt-3 text-[44px] font-black leading-[1.03] tracking-[-0.07em] text-[#111827]">
            Packs LLC
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] font-semibold leading-7 text-slate-600">
            Les prix et services affichés sont synchronisés avec les paramètres admin.
          </p>

          <div className="mx-auto mt-7 inline-flex rounded-[16px] border border-[#E8EEF6] bg-white p-1">
            {stateOptions.map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => setSelectedState(state)}
                className={`h-[42px] rounded-[12px] px-6 text-sm font-black transition ${
                  selectedState === state
                    ? "bg-[#F15A24] text-white"
                    : "bg-white text-[#123A63] hover:bg-[#F8FAFC]"
                }`}
              >
                {state}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="mt-4 text-xs font-bold text-slate-400">Chargement...</p>
          ) : null}
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {orderedPacks.map((pack) => {
            const price = Number(pack.prices?.[selectedState] || 0);
            const features = cleanFeatures(pack.features || []);

            return (
              <article
                key={`${selectedState}-${pack.id}`}
                className={`flex min-h-[455px] flex-col rounded-[24px] border bg-white p-5 ${
                  pack.recommended ? "border-[#F15A24]" : "border-[#E3EAF2]"
                }`}
              >
                <div className="flex min-h-[34px] items-start justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.20em] text-slate-400">
                    {selectedState}
                  </p>

                  {pack.recommended ? (
                    <span className="rounded-full border border-[#F15A24] bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#F15A24]">
                      Recommandé
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-2 text-[30px] font-black tracking-[-0.06em] text-[#123A63]">
                  {pack.label}
                </h2>

                <p className="mt-3 min-h-[52px] text-[13px] font-semibold leading-6 text-slate-600">
                  {pack.description}
                </p>

                <div className="mt-4 rounded-[18px] border border-[#E8EEF6] bg-white px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Prix
                  </p>
                  <p className="mt-1 text-[34px] font-black leading-none tracking-[-0.05em] text-[#F15A24]">
                    {price} USD
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 rounded-[14px] border border-[#E8EEF6] bg-white px-3 py-2.5"
                    >
                      <span className="mt-[1px] text-[12px] font-black text-[#F15A24]">
                        ✓
                      </span>
                      <span className="text-[12.5px] font-bold leading-5 text-[#123A63]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                  <a
                    href={startHref(pack, selectedState)}
                    className="inline-flex h-[48px] w-full items-center justify-center rounded-[15px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C]"
                  >
                    Choisir →
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
