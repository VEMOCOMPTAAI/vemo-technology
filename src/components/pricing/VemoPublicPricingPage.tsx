"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";

type Pack = {
  id: string;
  state?: string;
  name_fr: string;
  name_en: string;
  price: number;
  description_fr: string;
  description_en: string;
  features_fr?: string[];
  features_en?: string[];
  active: boolean;
  recommended?: boolean;
};

type Pricing = {
  currency: string;
  packs: Pack[];
  updated_at?: string | null;
};

const emptyPricing: Pricing = {
  currency: "USD",
  packs: [],
  updated_at: null,
};

const content = {
  fr: {
    eyebrow: "Tarifs VEMO",
    title: "Choisissez votre pack LLC",
    subtitle:
      "Des packs clairs pour créer votre LLC aux États-Unis avec frais de dépôt inclus, suivi administratif et accompagnement VEMO.",
    all: "Tous",
    nm: "New Mexico",
    wy: "Wyoming",
    included: "Inclus",
    recommended: "Recommandé",
    start: "Commencer",
    fees: "Frais de dépôt inclus",
    empty: "Aucun pack disponible pour le moment.",
    loading: "Chargement des packs...",
  },
  en: {
    eyebrow: "VEMO Pricing",
    title: "Choose your LLC package",
    subtitle:
      "Clear packages to form your US LLC with state filing fees included, administrative tracking and VEMO support.",
    all: "All",
    nm: "New Mexico",
    wy: "Wyoming",
    included: "Included",
    recommended: "Recommended",
    start: "Start",
    fees: "State filing fees included",
    empty: "No package available yet.",
    loading: "Loading packages...",
  },
};

function packName(pack: Pack, lang: Lang) {
  return lang === "fr" ? pack.name_fr : pack.name_en;
}

function packDescription(pack: Pack, lang: Lang) {
  return lang === "fr" ? pack.description_fr : pack.description_en;
}

function packFeatures(pack: Pack, lang: Lang) {
  return lang === "fr" ? pack.features_fr || [] : pack.features_en || [];
}

function stateSlug(state?: string) {
  const s = String(state || "").toLowerCase();
  if (s.includes("wyoming")) return "wyoming";
  return "new-mexico";
}

export default function VemoPublicPricingPage({ lang = "fr" }: { lang?: Lang }) {
  const [pricing, setPricing] = useState<Pricing>(emptyPricing);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<"all" | "New Mexico" | "Wyoming">("all");

  const t = content[lang];

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/pricing", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        setPricing(data?.pricing || emptyPricing);
      } catch {
        setPricing(emptyPricing);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const packs = useMemo(() => {
    return (pricing.packs || [])
      .filter((pack) => pack.active)
      .filter((pack) => stateFilter === "all" || pack.state === stateFilter);
  }, [pricing.packs, stateFilter]);

  function startUrl(pack: Pack) {
    const base = lang === "fr" ? "/fr/commencer" : "/en/commencer";
    const params = new URLSearchParams({
      pack: pack.id,
      state: stateSlug(pack.state),
      amount: String(pack.price),
      currency: pricing.currency || "USD",
    });

    return `${base}?${params.toString()}`;
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#111827]">
      <header className="border-b border-[#E8E2DC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href={lang === "fr" ? "/fr" : "/en"} className="leading-none">
            <div className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
              VEMO <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
              US LLC SERVICES
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href={lang === "fr" ? "/fr/tarifs" : "/fr/tarifs"}
              className={`rounded-[14px] px-4 py-2 text-xs font-black ${lang === "fr" ? "bg-[#F15A24] text-white" : "border border-[#E8E2DC] bg-white text-[#123A63]"}`}
            >
              FR
            </a>
            <a
              href={lang === "fr" ? "/en/pricing" : "/en/pricing"}
              className={`rounded-[14px] px-4 py-2 text-xs font-black ${lang === "en" ? "bg-[#F15A24] text-white" : "border border-[#E8E2DC] bg-white text-[#123A63]"}`}
            >
              EN
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#e6eaf0_1px,transparent_1px),linear-gradient(to_bottom,#e6eaf0_1px,transparent_1px)] [background-size:54px_54px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-full border border-[#FFD2C2] bg-[#FFF7F1] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
              {t.eyebrow}
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-[-0.07em] text-[#111827] md:text-6xl">
              {t.title}
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-9 flex justify-center">
            <div className="inline-flex rounded-[18px] border border-[#E8E2DC] bg-white p-1 shadow-[0_12px_28px_rgba(18,58,99,0.06)]">
              {[
                ["all", t.all],
                ["New Mexico", t.nm],
                ["Wyoming", t.wy],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setStateFilter(value as any)}
                  className={`rounded-[14px] px-5 py-3 text-sm font-black transition ${
                    stateFilter === value
                      ? "bg-[#F15A24] text-white shadow-[0_12px_26px_rgba(241,90,36,.22)]"
                      : "text-[#123A63] hover:bg-[#FFF7F1] hover:text-[#F15A24]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="rounded-[2rem] border border-[#E8E2DC] bg-white p-10 text-center text-sm font-black text-slate-500">
                {t.loading}
              </div>
            ) : packs.length === 0 ? (
              <div className="rounded-[2rem] border border-[#E8E2DC] bg-white p-10 text-center text-sm font-black text-slate-500">
                {t.empty}
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {packs.map((pack) => (
                  <article
                    key={pack.id}
                    className={`relative overflow-hidden rounded-[2.2rem] border bg-white p-7 shadow-[0_22px_60px_rgba(18,58,99,0.08)] ${
                      pack.recommended ? "border-[#F15A24]" : "border-[#E8E2DC]"
                    }`}
                  >
                    {pack.recommended && (
                      <div className="absolute right-5 top-5 rounded-full bg-[#F15A24] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                        {t.recommended}
                      </div>
                    )}

                    <div className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
                      {pack.state || "LLC"}
                    </div>

                    <h2 className="mt-4 pr-24 text-3xl font-black tracking-[-0.06em] text-[#111827]">
                      {packName(pack, lang)}
                    </h2>

                    <p className="mt-4 min-h-[72px] text-sm font-bold leading-7 text-slate-600">
                      {packDescription(pack, lang)}
                    </p>

                    <div className="mt-6 flex items-end gap-2">
                      <span className="text-5xl font-black tracking-[-0.08em] text-[#123A63]">
                        ${pack.price}
                      </span>
                      <span className="mb-2 text-sm font-black text-slate-400">
                        {pricing.currency || "USD"}
                      </span>
                    </div>

                    <div className="mt-4 rounded-[1.3rem] border border-[#FFD2C2] bg-[#FFF7F1] px-4 py-3 text-sm font-black text-[#F15A24]">
                      {t.fees}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {packFeatures(pack, lang).map((feature, index) => (
                        <li key={index} className="flex gap-3 text-sm font-bold leading-6 text-slate-700">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF7F1] text-xs font-black text-[#F15A24]">
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={startUrl(pack)}
                      className="mt-8 flex min-h-[54px] items-center justify-center rounded-[18px] bg-[#F15A24] px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] transition hover:bg-[#D94A1B]"
                    >
                      {t.start} →
                    </a>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
