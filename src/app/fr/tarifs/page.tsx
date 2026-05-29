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

const fallbackPacks: Pack[] = [
  {
    id: "starter",
    label: "Starter",
    description: "L’essentiel pour créer votre LLC.",
    prices: {
      "New Mexico": 129,
      Wyoming: 179,
    },
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
    prices: {
      "New Mexico": 149,
      Wyoming: 199,
    },
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
    prices: {
      "New Mexico": 199,
      Wyoming: 249,
    },
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

const states = ["New Mexico", "Wyoming"] as const;

function cleanFeatures(features: string[]) {
  return features
    .filter(Boolean)
    .filter((item) => !item.toLowerCase().includes("renouvellement registered agent"))
    .slice(0, 7);
}

function stateSlug(state: string) {
  return state === "New Mexico" ? "new-mexico" : "wyoming";
}

function startHref(pack: Pack, state: string) {
  const price = pack.prices?.[state] || 0;
  const slug = stateSlug(state);

  return `/fr/commencer?pack=${slug}_${pack.id}&packName=${encodeURIComponent(
    `${state} ${pack.label}`
  )}&state=${slug}&amount=${price}&currency=USD`;
}

export default function TarifsPage() {
  const [packs, setPacks] = useState<Pack[]>(fallbackPacks);
  const [loading, setLoading] = useState(true);

  async function loadPacks() {
    setLoading(true);

    try {
      const res = await fetch("/api/public/llc-packs", {
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (data?.ok && Array.isArray(data.packs) && data.packs.length) {
        setPacks(data.packs);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPacks();
  }, []);

  const orderedPacks = useMemo(() => {
    const order = ["starter", "standard", "premium"];

    return [...packs].sort(
      (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
    );
  }, [packs]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <section className="mx-auto max-w-[1480px] px-8 py-10">
        <header className="flex items-center justify-between border-b border-[#E8EEF6] pb-6">
          <a href="/fr" className="inline-flex flex-col">
            <div className="text-[30px] font-black uppercase leading-none tracking-[-0.06em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">
              US LLC POUR NON-RÉSIDENTS
            </div>
          </a>

          <a
            href="/fr/commencer"
            className="inline-flex h-[48px] items-center justify-center rounded-[14px] bg-[#F15A24] px-6 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
          >
            Démarrer →
          </a>
        </header>

        <section className="mx-auto max-w-4xl py-14 text-center">
          <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#F15A24]">
            Tarifs
          </p>

          <h1 className="mt-4 text-[56px] font-black leading-[1.02] tracking-[-0.07em] text-[#111827]">
            Packs LLC transparents
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[18px] font-semibold leading-8 text-slate-600">
            Chaque État est affiché séparément. Les prix et contenus sont ceux configurés dans les paramètres admin.
          </p>

          {loading ? (
            <p className="mt-5 text-sm font-bold text-slate-400">
              Chargement des tarifs...
            </p>
          ) : null}
        </section>

        <div className="space-y-16">
          {states.map((state) => (
            <section key={state}>
              <div className="mb-6 flex items-center gap-5">
                <h2 className="shrink-0 text-[34px] font-black tracking-[-0.05em] text-[#123A63]">
                  {state}
                </h2>
                <div className="h-px flex-1 bg-[#E8EEF6]" />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {orderedPacks.map((pack) => (
                  <article
                    key={`${state}-${pack.id}`}
                    className={`flex min-h-[620px] flex-col rounded-[28px] border bg-white p-7 ${
                      pack.recommended
                        ? "border-[#F15A24]"
                        : "border-[#E3EAF2]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.20em] text-slate-400">
                          {state}
                        </p>

                        <h3 className="mt-2 text-[34px] font-black tracking-[-0.06em] text-[#123A63]">
                          {pack.label}
                        </h3>
                      </div>

                      {pack.recommended ? (
                        <span className="rounded-full border border-[#F15A24] bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#F15A24]">
                          Recommandé
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-5 min-h-[64px] text-[15px] font-semibold leading-7 text-slate-600">
                      {pack.description}
                    </p>

                    <div className="mt-5 rounded-[22px] border border-[#E8EEF6] bg-white p-5">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Prix du pack
                      </p>
                      <p className="mt-2 text-[42px] font-black leading-none tracking-[-0.05em] text-[#F15A24]">
                        {pack.prices?.[state] || 0} USD
                      </p>
                    </div>

                    <div className="mt-6 space-y-3">
                      {cleanFeatures(pack.features || []).map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3 rounded-[16px] border border-[#E8EEF6] bg-white px-4 py-3"
                        >
                          <span className="mt-[2px] text-[13px] font-black text-[#F15A24]">
                            ✓
                          </span>
                          <span className="text-[14px] font-bold leading-6 text-[#123A63]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-6">
                      <a
                        href={startHref(pack, state)}
                        className="inline-flex h-[54px] w-full items-center justify-center rounded-[18px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C]"
                      >
                        Choisir ce pack →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
