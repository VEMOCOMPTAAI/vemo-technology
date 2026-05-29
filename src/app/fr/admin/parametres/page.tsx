"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type Pack = {
  id: string;
  label: string;
  description: string;
  recommended?: boolean;
  prices: Record<string, number>;
  features: string[];
};

export default function AdminPacksSettingsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [renewal, setRenewal] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings/packs", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      setPacks(Array.isArray(data?.packs) ? data.packs : []);
      setRenewal(data?.registeredAgentRenewal || {});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F8FB] px-6 py-8 text-[#111827]">
      <section className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <a href="/fr" className="inline-flex flex-col">
                <div className="text-[30px] font-black uppercase leading-none tracking-[-0.06em]">
                  <span className="text-[#123A63]">VEMO</span>
                  <span className="text-[#F15A24]">TECH</span>
                </div>
                <div className="mt-2 text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">
                  PARAMÈTRES
                </div>
              </a>

              <h1 className="mt-8 text-[42px] font-black tracking-[-0.07em] text-[#111827]">
                Packs LLC
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
                Source unique utilisée par le formulaire, les tarifs et l’admin.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href="/fr/admin"
                className="inline-flex h-[48px] items-center rounded-[15px] border border-[#E6EDF5] bg-white px-5 text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
              >
                Retour admin
              </a>

              <button
                type="button"
                onClick={load}
                className="inline-flex h-[48px] items-center rounded-[15px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Actualiser
              </button>
            </div>
          </div>
        </header>

        <section className="mt-7 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
              Registered Agent
            </p>

            <h2 className="mt-3 text-[28px] font-black tracking-[-0.05em] text-[#111827]">
              Renouvellement annuel
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {Object.entries(renewal).map(([state, price]) => (
                <div key={state} className="rounded-[1.4rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
                  <p className="text-sm font-black text-[#123A63]">{state}</p>
                  <p className="mt-2 text-3xl font-black text-[#F15A24]">{price} USD</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">/ an</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
              États disponibles
            </p>

            <h2 className="mt-3 text-[28px] font-black tracking-[-0.05em] text-[#111827]">
              Wyoming / New Mexico
            </h2>

            <p className="mt-5 text-sm font-semibold leading-7 text-slate-500">
              Les prix des packs varient selon l’État choisi par le client dans le formulaire.
            </p>
          </div>
        </section>

        <section className="mt-7 grid gap-6 lg:grid-cols-3">
          {loading ? (
            <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6 text-sm font-bold text-slate-500">
              Chargement...
            </div>
          ) : (
            packs.map((pack) => (
              <article
                key={pack.id}
                className={`rounded-[2rem] border bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)] ${
                  pack.recommended ? "border-[#F15A24]" : "border-[#E6EDF5]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
                    {pack.label}
                  </h3>

                  {pack.recommended ? (
                    <span className="rounded-full border border-[#F15A24] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#F15A24]">
                      Recommandé
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 min-h-[48px] text-sm font-semibold leading-6 text-slate-500">
                  {pack.description}
                </p>

                <div className="mt-6 grid gap-3">
                  {Object.entries(pack.prices).map(([state, price]) => (
                    <div
                      key={state}
                      className="flex items-center justify-between rounded-[1.2rem] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-4"
                    >
                      <span className="text-sm font-black text-[#123A63]">{state}</span>
                      <span className="text-xl font-black text-[#F15A24]">{price} USD</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  {pack.features.map((feature) => (
                    <div key={feature} className="flex gap-2">
                      <span className="mt-[2px] text-sm font-black text-[#F15A24]">✓</span>
                      <span className="text-sm font-bold leading-6 text-[#123A63]">{feature}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
