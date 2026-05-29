"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function TarifsPage() {
  const [packs, setPacks] = useState<any[]>([]);
  const [renewal, setRenewal] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/public/llc-packs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setPacks(Array.isArray(data?.packs) ? data.packs : []);
        setRenewal(data?.registeredAgentRenewal || {});
      })
      .catch(() => null);
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F8FB] px-6 py-10 text-[#111827]">
      <section className="mx-auto max-w-7xl">
        <a href="/fr" className="inline-flex flex-col">
          <div className="text-[30px] font-black uppercase leading-none tracking-[-0.06em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>
          <div className="mt-2 text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">
            TARIFS LLC
          </div>
        </a>

        <h1 className="mt-10 text-[46px] font-black tracking-[-0.07em]">
          Tarifs LLC
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {packs.map((pack) => (
            <article
              key={pack.id}
              className={`rounded-[2rem] border bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)] ${
                pack.recommended ? "border-[#F15A24]" : "border-[#E6EDF5]"
              }`}
            >
              <h2 className="text-[30px] font-black tracking-[-0.06em] text-[#123A63]">
                {pack.label}
              </h2>

              <p className="mt-3 min-h-[52px] text-sm font-semibold leading-7 text-slate-500">
                {pack.description}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-[1.2rem] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-4">
                  <span className="text-sm font-black text-[#123A63]">Wyoming</span>
                  <span className="text-xl font-black text-[#F15A24]">{pack.prices?.Wyoming} USD</span>
                </div>

                <div className="flex items-center justify-between rounded-[1.2rem] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-4">
                  <span className="text-sm font-black text-[#123A63]">New Mexico</span>
                  <span className="text-xl font-black text-[#F15A24]">{pack.prices?.["New Mexico"]} USD</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {(pack.features || []).map((feature: string) => (
                  <div key={feature} className="flex gap-2">
                    <span className="mt-[2px] text-sm font-black text-[#F15A24]">✓</span>
                    <span className="text-sm font-bold leading-6 text-[#123A63]">{feature}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#E6EDF5] bg-white p-6">
          <h2 className="text-[26px] font-black tracking-[-0.05em] text-[#123A63]">
            Renouvellement Registered Agent
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {Object.entries(renewal).map(([state, price]) => (
              <div key={state} className="rounded-[1.4rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
                <p className="text-sm font-black text-[#123A63]">{state}</p>
                <p className="mt-2 text-3xl font-black text-[#F15A24]">{price} USD</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
