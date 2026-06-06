"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type Pack = {
  id: "starter" | "standard" | "premium";
  label: string;
  description: string;
  recommended?: boolean;
  prices: {
    Wyoming: number;
    "New Mexico": number;
  };
  features: string[];
};

type Payload = {
  states: ["Wyoming", "New Mexico"];
  registeredAgentRenewal: {
    Wyoming: number;
    "New Mexico": number;
  };
  packs: Pack[];
};

const emptyPayload: Payload = {
  states: ["Wyoming", "New Mexico"],
  registeredAgentRenewal: {
    Wyoming: 25,
    "New Mexico": 35,
  },
  packs: [],
};

function featuresToText(features: string[]) {
  return features.join("\n");
}

function textToFeatures(text: string) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminPacksSettingsPage() {
  const [payload, setPayload] = useState<Payload>(emptyPayload);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/packs", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (data?.ok) {
        setPayload({
          states: ["Wyoming", "New Mexico"],
          registeredAgentRenewal: data.registeredAgentRenewal || emptyPayload.registeredAgentRenewal,
          packs: Array.isArray(data.packs) ? data.packs : [],
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/packs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setMessage(data?.error || "Erreur sauvegarde.");
        return;
      }

      setPayload({
        states: ["Wyoming", "New Mexico"],
        registeredAgentRenewal: data.registeredAgentRenewal,
        packs: data.packs,
      });

      setMessage("Paramètres sauvegardés. Le formulaire utilise maintenant ces valeurs.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updatePack(index: number, patch: Partial<Pack>) {
    setPayload((prev) => ({
      ...prev,
      packs: prev.packs.map((pack, i) =>
        i === index
          ? {
              ...pack,
              ...patch,
            }
          : pack
      ),
    }));
  }

  return (
    <main className="min-h-screen bg-[#F5F8FB] px-6 py-8 text-[#111827]">
      <section className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6">
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
                Packs LLC modifiables
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
                Les prix et contenus sauvegardés ici alimentent le formulaire client et les pages publiques via une source centrale.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/fr/admin"
                className="inline-flex h-[48px] items-center rounded-[15px] border border-[#E6EDF5] bg-white px-5 text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
              >
                Retour admin
              </a>

              <button
                type="button"
                onClick={load}
                className="inline-flex h-[48px] items-center rounded-[15px] border border-[#E6EDF5] bg-white px-5 text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
              >
                Actualiser
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex h-[48px] items-center rounded-[15px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
              >
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>

          {message ? (
            <div className="mt-5 rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-3 text-sm font-black text-[#123A63]">
              {message}
            </div>
          ) : null}
        </header>

        <section className="mt-7 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
              Registered Agent
            </p>

            <h2 className="mt-3 text-[28px] font-black tracking-[-0.05em] text-[#111827]">
              Renouvellement annuel
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Wyoming
                </span>
                <input
                  type="number"
                  value={payload.registeredAgentRenewal.Wyoming}
                  onChange={(e) =>
                    setPayload((prev) => ({
                      ...prev,
                      registeredAgentRenewal: {
                        ...prev.registeredAgentRenewal,
                        Wyoming: Number(e.target.value),
                      },
                    }))
                  }
                  className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  New Mexico
                </span>
                <input
                  type="number"
                  value={payload.registeredAgentRenewal["New Mexico"]}
                  onChange={(e) =>
                    setPayload((prev) => ({
                      ...prev,
                      registeredAgentRenewal: {
                        ...prev.registeredAgentRenewal,
                        "New Mexico": Number(e.target.value),
                      },
                    }))
                  }
                  className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
              Source centrale
            </p>

            <h2 className="mt-3 text-[28px] font-black tracking-[-0.05em] text-[#111827]">
              Impact automatique
            </h2>

            <p className="mt-5 text-sm font-semibold leading-7 text-slate-500">
              Après sauvegarde, le formulaire `/fr/commencer` lit les packs via l’API publique. Il suffit de rafraîchir la page client.
            </p>
          </div>
        </section>

        <section className="mt-7 space-y-6">
          {loading ? (
            <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6 text-sm font-bold text-slate-500">
              Chargement...
            </div>
          ) : (
            payload.packs.map((pack, index) => (
              <article
                key={pack.id}
                className={`rounded-[2rem] border bg-white p-6 ${
                  pack.recommended ? "border-[#F15A24]" : "border-[#E6EDF5]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
                      {pack.id}
                    </p>
                    <h3 className="mt-2 text-[30px] font-black tracking-[-0.06em] text-[#123A63]">
                      {pack.label}
                    </h3>
                  </div>

                  <label className="flex items-center gap-2 text-sm font-black text-[#123A63]">
                    <input
                      type="checkbox"
                      checked={Boolean(pack.recommended)}
                      onChange={(e) => updatePack(index, { recommended: e.target.checked })}
                    />
                    Recommandé
                  </label>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Nom du pack
                    </span>
                    <input
                      value={pack.label}
                      onChange={(e) => updatePack(index, { label: e.target.value })}
                      className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Description
                    </span>
                    <input
                      value={pack.description}
                      onChange={(e) => updatePack(index, { description: e.target.value })}
                      className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Prix Wyoming
                    </span>
                    <input
                      type="number"
                      value={pack.prices.Wyoming}
                      onChange={(e) =>
                        updatePack(index, {
                          prices: {
                            ...pack.prices,
                            Wyoming: Number(e.target.value),
                          },
                        })
                      }
                      className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Prix New Mexico
                    </span>
                    <input
                      type="number"
                      value={pack.prices["New Mexico"]}
                      onChange={(e) =>
                        updatePack(index, {
                          prices: {
                            ...pack.prices,
                            "New Mexico": Number(e.target.value),
                          },
                        })
                      }
                      className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                    />
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Services inclus — une ligne par service
                  </span>
                  <textarea
                    value={featuresToText(pack.features)}
                    onChange={(e) => updatePack(index, { features: textToFeatures(e.target.value) })}
                    rows={8}
                    className="w-full rounded-[18px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold leading-7 text-[#123A63] outline-none focus:border-[#F15A24]"
                  />
                </label>
              </article>
            ))
          )}
        </section>

        <div className="sticky bottom-5 mt-8 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="h-[56px] rounded-[18px] bg-[#F15A24] px-8 text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </button>
        </div>
      </section>
    </main>
  );
}
