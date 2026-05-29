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

function stateLabel(state?: string) {
  return state || "LLC";
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
      packName: packName(pack, lang),
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
              VEMO<span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
              US LLC SERVICES
            </div>
          </a>

          <div className="flex items-center gap-3">
            <div className="flex items-center border-r border-[#E8E2DC] pr-4">
              <a
                href="/fr/tarifs"
                className={`px-2 text-sm font-black transition ${
                  lang === "fr" ? "text-[#F15A24]" : "text-[#111827] hover:text-[#F15A24]"
                }`}
              >
                FR
              </a>
              <span className="mx-1 text-slate-300">/</span>
              <a
                href="/en/pricing"
                className={`px-2 text-sm font-black transition ${
                  lang === "en" ? "text-[#F15A24]" : "text-[#111827] hover:text-[#F15A24]"
                }`}
              >
                EN
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-14">
        <div className="absolute inset-0 opacity-[0.32] [background-image:linear-gradient(to_right,#e6eaf0_1px,transparent_1px),linear-gradient(to_bottom,#e6eaf0_1px,transparent_1px)] [background-size:54px_54px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-full border border-[#FFD2C2] bg-[#FFF7F1] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
              {t.eyebrow}
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.07em] text-[#111827] md:text-6xl">
              {t.title}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base font-bold leading-8 text-slate-600 md:text-lg">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
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
                      ? "bg-[#F15A24] text-white shadow-[0_12px_26px_rgba(241,90,36,.18)]"
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
              <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                {packs.map((pack) => {
                  const features = packFeatures(pack, lang);

                  return (
                    <article
                      key={pack.id}
                      className={`relative flex min-h-[620px] flex-col overflow-hidden rounded-[2rem] border bg-white p-6 shadow-[0_20px_48px_rgba(18,58,99,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(18,58,99,0.10)] ${
                        pack.recommended ? "border-[#F15A24]" : "border-[#E8E2DC]"
                      }`}
                    >
                      <div className="min-h-[150px]">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
                              {stateLabel(pack.state)}
                            </div>

                            <h2 className="mt-3 text-2xl font-black tracking-[-0.055em] text-[#111827]">
                              {packName(pack, lang)}
                            </h2>
                          </div>

                          {pack.recommended && (
                            <div className="shrink-0 rounded-full bg-[#FFF7F1] px-3 py-2 text-[10px] font-black uppercase tracking-[0.10em] text-[#F15A24] ring-1 ring-[#FFD2C2]">
                              {t.recommended}
                            </div>
                          )}
                        </div>

                        <p className="mt-4 line-clamp-3 text-sm font-bold leading-7 text-slate-600">
                          {packDescription(pack, lang)}
                        </p>
                      </div>

                      <div className="mt-5 rounded-[1.35rem] border border-[#E8E2DC] bg-[#FBFCFD] p-5">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Prix
                            </p>
                            <div className="mt-1 flex items-end gap-1">
                              <span className="text-4xl font-black tracking-[-0.08em] text-[#123A63]">
                                ${pack.price}
                              </span>
                              <span className="mb-1 text-xs font-black text-slate-400">
                                {pricing.currency || "USD"}
                              </span>
                            </div>
                          </div>

                          <div className="rounded-full border border-[#FFD2C2] bg-[#FFF7F1] px-3 py-2 text-[11px] font-black text-[#F15A24]">
                            {t.fees}
                          </div>
                        </div>
                      </div>

                      <ul className="mt-6 min-h-[230px] flex-1 space-y-3">
                        {features.map((feature, index) => (
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
                        className="mt-auto flex min-h-[52px] items-center justify-center rounded-[16px] bg-[#F15A24] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(241,90,36,.18)] transition hover:bg-[#D94A1B]"
                      >
                        {t.start} →
                      </a>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
