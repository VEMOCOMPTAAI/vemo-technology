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

function displayFeatures(features: string[]) {
  return (Array.isArray(features) ? features : [])
    .map((feature) => String(feature || "").trim())
    .filter(Boolean);
}

export default function TarifsPage() {
  const [selectedState, setSelectedState] = useState<StateName>("New Mexico");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/public/llc-packs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!active || !data?.ok) return;

        if (Array.isArray(data.packs)) {
          setPacks(data.packs);
        }
      })
      .catch(() => null)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const orderedPacks = useMemo(() => {
    const order: PackId[] = ["starter", "standard", "premium"];

    return [...packs].sort((a, b) => {
      const ai = order.indexOf(a.id);
      const bi = order.indexOf(b.id);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [packs]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="border-b border-[#E8EEF6] bg-white">
        <div className="mx-auto flex max-w-[1060px] items-center justify-between px-6 py-4">
          <a href="/fr" className="shrink-0">
            <div className="text-[24px] font-black uppercase leading-none tracking-[-0.06em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[8.5px] font-black uppercase tracking-[0.28em] text-slate-500">
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
            className="inline-flex h-[42px] items-center justify-center rounded-[13px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
          >
            Démarrer →
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[980px] px-6 py-7">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F15A24]">
            Tarifs
          </p>

          <h1 className="mt-1 text-[34px] font-black tracking-[-0.07em] text-[#111827]">
            Packs LLC
          </h1>

          <div className="mt-4 inline-flex rounded-[14px] border border-[#E8EEF6] bg-white p-1">
            {states.map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => setSelectedState(state)}
                className={`h-[38px] rounded-[10px] px-6 text-sm font-black transition ${
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

        {loading ? (
          <div className="mx-auto mt-7 max-w-[920px] rounded-[16px] border border-[#E8EEF6] bg-white px-5 py-4 text-center text-sm font-bold text-slate-500">
            Chargement...
          </div>
        ) : null}

        {!loading && orderedPacks.length === 0 ? (
          <div className="mx-auto mt-7 max-w-[920px] rounded-[16px] border border-[#E8EEF6] bg-white px-5 py-4 text-center text-sm font-bold text-slate-500">
            Aucun pack configuré.
          </div>
        ) : null}

        <div className="mx-auto mt-7 grid max-w-[920px] gap-4 lg:grid-cols-3">
          {orderedPacks.map((pack) => {
            const price = Number(pack.prices?.[selectedState] || 0);
            const features = displayFeatures(pack.features || []);

            return (
              <article
                key={`${selectedState}-${pack.id}`}
                className={`flex flex-col rounded-[20px] border bg-white p-4 ${
                  pack.recommended ? "border-[#F15A24]" : "border-[#E4ECF5]"
                }`}
              >
                <div className="flex h-[26px] items-center justify-between gap-2">
                  <p className="text-[8.5px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {selectedState}
                  </p>

                  {pack.recommended ? (
                    <span className="rounded-full border border-[#F15A24] bg-white px-2.5 py-1 text-[7.5px] font-black uppercase tracking-[0.11em] text-[#F15A24]">
                      Recommandé
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-1.5 text-[23px] font-black tracking-[-0.06em] text-[#123A63]">
                  {pack.label}
                </h2>

                <p className="mt-2 min-h-[34px] text-[11.5px] font-semibold leading-5 text-slate-600">
                  {pack.description}
                </p>

                <div className="mt-3 rounded-[15px] border border-[#E8EEF6] bg-white px-3.5 py-3">
                  <p className="text-[8.5px] font-black uppercase tracking-[0.17em] text-slate-400">
                    Prix
                  </p>
                  <p className="mt-1 text-[29px] font-black leading-none tracking-[-0.05em] text-[#F15A24]">
                    {price} USD
                  </p>
                </div>

                <div className="mt-3 space-y-1.5">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 rounded-[11px] border border-[#E8EEF6] bg-white px-3 py-2"
                    >
                      <span className="mt-[1px] text-[10.5px] font-black text-[#F15A24]">
                        ✓
                      </span>
                      <span className="text-[11px] font-bold leading-4 text-[#123A63]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <a
                    href={startHref(pack, selectedState)}
                    className="inline-flex h-[42px] w-full items-center justify-center rounded-[12px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C]"
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
