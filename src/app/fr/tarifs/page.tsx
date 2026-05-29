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
  renewalPrices?: Record<string, number>;
};

const stateOptions: StateName[] = ["New Mexico", "Wyoming"];

const fallbackRenewals: Record<StateName, number> = {
  "New Mexico": 35,
  Wyoming: 25,
};

const fallbackPacks: Pack[] = [
  {
    id: "starter",
    label: "Starter",
    description: "L’essentiel pour créer votre LLC.",
    prices: { "New Mexico": 129, Wyoming: 179 },
    renewalPrices: { "New Mexico": 35, Wyoming: 25 },
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
    renewalPrices: { "New Mexico": 35, Wyoming: 25 },
    features: [
      "Tout Starter",
      "Demande EIN",
      "Assistance Stripe + Mercury",
    ],
  },
  {
    id: "premium",
    label: "Premium",
    description: "L’offre complète pour structurer votre activité.",
    prices: { "New Mexico": 199, Wyoming: 249 },
    renewalPrices: { "New Mexico": 35, Wyoming: 25 },
    features: [
      "Tout Standard",
      "Assistance Stripe / PayPal",
      "Assistance Wise / Mercury / Payoneer",
      "Shopify offert 3 mois + nom de domaine 1 an",
    ],
  },
];

function slugState(state: string) {
  return state === "New Mexico" ? "new-mexico" : "wyoming";
}

function buildHref(pack: Pack, state: StateName) {
  const amount = Number(pack.prices?.[state] || 0);
  const stateSlug = slugState(state);

  return `/fr/commencer?pack=${stateSlug}_${pack.id}&packName=${encodeURIComponent(
    `${state} ${pack.label}`
  )}&state=${stateSlug}&amount=${amount}&currency=USD`;
}

function getPackPrice(pack: Pack, state: StateName) {
  return Number(pack?.prices?.[state] || 0);
}

function getRenewalPrice(pack: Pack, state: StateName) {
  const fromPack =
    pack?.renewalPrices?.[state] ??
    (pack as any)?.registeredAgentRenewal?.[state] ??
    (pack as any)?.registered_agent_renewal?.[state] ??
    (pack as any)?.renewals?.[state];

  return Number(fromPack || fallbackRenewals[state]);
}

function cleanedFeatures(pack: Pack) {
  return (pack.features || [])
    .filter(Boolean)
    .filter(
      (item) =>
        !item.toLowerCase().includes("documents de création llc") &&
        !item.toLowerCase().includes("frais de dépôt") &&
        !item.toLowerCase().includes("registered agent offert la première année") &&
        !item.toLowerCase().includes("renouvellement registered agent")
    )
    .slice(0, 4);
}

export default function TarifsPage() {
  const [packs, setPacks] = useState<Pack[]>(fallbackPacks);
  const [selectedState, setSelectedState] = useState<StateName>("New Mexico");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/public/llc-packs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;

        const apiPacks = Array.isArray(data?.packs) ? data.packs : null;

        if (apiPacks?.length) {
          const normalized: Pack[] = apiPacks.map((pack: any, index: number) => {
            const id = (pack.id || ["starter", "standard", "premium"][index] || "starter") as PackId;

            return {
              id,
              label:
                pack.label ||
                (id === "starter" ? "Starter" : id === "standard" ? "Standard" : "Premium"),
              description:
                pack.description ||
                (id === "starter"
                  ? "L’essentiel pour créer votre LLC."
                  : id === "standard"
                  ? "La formule recommandée pour démarrer sérieusement."
                  : "L’offre complète pour structurer votre activité."),
              recommended: Boolean(pack.recommended || id === "standard"),
              prices: pack.prices || fallbackPacks.find((p) => p.id === id)?.prices || {},
              renewalPrices:
                pack.renewalPrices ||
                pack.registeredAgentRenewal ||
                pack.registered_agent_renewal ||
                fallbackPacks.find((p) => p.id === id)?.renewalPrices ||
                {},
              features:
                pack.features || fallbackPacks.find((p) => p.id === id)?.features || [],
            };
          });

          setPacks(normalized);
        }
      })
      .catch(() => null)
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const orderedPacks = useMemo(() => {
    const order: PackId[] = ["starter", "standard", "premium"];
    return [...packs].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [packs]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="border-b border-[#E8EEF6] bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-5">
          <a href="/fr" className="shrink-0">
            <div className="text-[24px] font-black uppercase leading-none tracking-[-0.06em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[9px] font-black uppercase tracking-[0.30em] text-slate-500">
              US LLC POUR NON-RÉSIDENTS
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            <a href="/fr" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">Accueil</a>
            <a href="/fr/business-setup" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">Business Setup</a>
            <a href="/fr/banking" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">Banking</a>
            <a href="/fr/services" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">Services</a>
            <a href="/fr/resources" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">Resources</a>
            <a href="/fr/contact" className="text-sm font-bold text-[#123A63] hover:text-[#F15A24]">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/en/tarifs"
              className="inline-flex h-[42px] items-center justify-center rounded-[12px] border border-[#E8EEF6] px-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]"
            >
              EN
            </a>
            <a
              href="/fr/commencer"
              className="inline-flex h-[44px] items-center justify-center rounded-[14px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
            >
              Démarrer →
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1080px] px-6 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#F15A24]">
            Tarifs
          </p>
          <h1 className="mt-3 text-[44px] font-black tracking-[-0.07em] text-[#111827]">
            Packs LLC
          </h1>

          <div className="mt-6 inline-flex rounded-[16px] border border-[#E8EEF6] bg-white p-1">
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
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {orderedPacks.map((pack) => {
            const price = getPackPrice(pack, selectedState);
            const renewal = getRenewalPrice(pack, selectedState);
            const features = cleanedFeatures(pack);

            return (
              <article
                key={`${selectedState}-${pack.id}`}
                className={`flex flex-col rounded-[24px] border bg-white p-5 ${
                  pack.recommended ? "border-[#F15A24]" : "border-[#E8EEF6]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                      {selectedState}
                    </p>
                    <h2 className="mt-3 text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
                      {pack.label}
                    </h2>
                  </div>

                  {pack.recommended ? (
                    <span className="rounded-full border border-[#F15A24] bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#F15A24]">
                      Recommandé
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 min-h-[48px] text-[13px] font-semibold leading-6 text-slate-600">
                  {pack.description}
                </p>

                <div className="mt-4 rounded-[18px] border border-[#E8EEF6] bg-white px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Prix du pack
                  </p>
                  <p className="mt-1 text-[34px] font-black leading-none tracking-[-0.05em] text-[#F15A24]">
                    {price} USD
                  </p>
                </div>

                <div className="mt-3 rounded-[16px] border border-[#E8EEF6] bg-[#FFFDFC] px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Renouvellement Registered Agent
                  </p>
                  <p className="mt-1 text-[18px] font-black text-[#123A63]">
                    {renewal} USD / an
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 rounded-[14px] border border-[#E8EEF6] px-3 py-2.5">
                    <span className="mt-[1px] text-[12px] font-black text-[#F15A24]">✓</span>
                    <span className="text-[12.5px] font-bold leading-5 text-[#123A63]">
                      Documents de création LLC
                    </span>
                  </div>

                  <div className="flex items-start gap-2 rounded-[14px] border border-[#E8EEF6] px-3 py-2.5">
                    <span className="mt-[1px] text-[12px] font-black text-[#F15A24]">✓</span>
                    <span className="text-[12.5px] font-bold leading-5 text-[#123A63]">
                      Frais de dépôt de l’État inclus
                    </span>
                  </div>

                  <div className="flex items-start gap-2 rounded-[14px] border border-[#E8EEF6] px-3 py-2.5">
                    <span className="mt-[1px] text-[12px] font-black text-[#F15A24]">✓</span>
                    <span className="text-[12.5px] font-bold leading-5 text-[#123A63]">
                      Registered Agent offert la première année
                    </span>
                  </div>

                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 rounded-[14px] border border-[#E8EEF6] px-3 py-2.5"
                    >
                      <span className="mt-[1px] text-[12px] font-black text-[#F15A24]">✓</span>
                      <span className="text-[12.5px] font-bold leading-5 text-[#123A63]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <a
                    href={buildHref(pack, selectedState)}
                    className="inline-flex h-[46px] w-full items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C]"
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
