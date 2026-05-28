"use client";

import { useEffect, useState } from "react";

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

function fmtDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("fr-FR");
  } catch {
    return "—";
  }
}

export default function VemoAdminSettingsPage() {
  const [pricing, setPricing] = useState<Pricing>(emptyPricing);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/settings/pricing", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setError(data?.error || "Impossible de charger les paramètres.");
        return;
      }

      setPricing(data.pricing || emptyPricing);
    } catch {
      setError("Erreur réseau pendant le chargement des paramètres.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updatePack(index: number, key: keyof Pack, value: string | number | boolean) {
    setPricing((prev) => {
      const packs = [...prev.packs];
      packs[index] = {
        ...packs[index],
        [key]: value,
      };

      return {
        ...prev,
        packs,
      };
    });
  }

  function addPack() {
    setPricing((prev) => ({
      ...prev,
      packs: [
        ...prev.packs,
        {
          id: `pack_${Date.now()}`,
          state: "New Mexico",
          name_fr: "Nouveau pack",
          name_en: "New pack",
          price: 0,
          description_fr: "",
          description_en: "",
          features_fr: [],
          features_en: [],
          active: true,
          recommended: false,
        },
      ],
    }));
  }

  function removePack(index: number) {
    const ok = window.confirm("Supprimer ce pack ?");
    if (!ok) return;

    setPricing((prev) => ({
      ...prev,
      packs: prev.packs.filter((_, i) => i !== index),
    }));
  }

  async function save() {
    setSaving(true);
    setNotice("");
    setError("");

    try {
      const res = await fetch("/api/admin/settings/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pricing),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setError(data?.error || "Impossible de sauvegarder les paramètres.");
        return;
      }

      setPricing(data.pricing);
      setNotice("Paramètres sauvegardés avec succès.");
      setTimeout(() => setNotice(""), 4500);
    } catch {
      setError("Erreur réseau pendant la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#111827]">
      <header className="border-b border-[#E8E2DC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
              VEMO <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
              PARAMÈTRES ADMIN
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/fr/admin"
              className="rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]"
            >
              ← Retour admin
            </a>

            <button
              onClick={save}
              disabled={saving}
              className="rounded-[18px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,.18)] transition hover:bg-[#D94A1B] disabled:opacity-60"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2.5rem] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(18,58,99,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
            Configuration commerciale
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.06em] text-[#111827]">
                Prix des packs LLC
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                Modifie les prix, libellés FR/EN, descriptions et disponibilité des offres.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#E8E2DC] bg-[#FBFCFD] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Dernière modification
              </p>
              <p className="mt-1 text-sm font-black text-[#123A63]">
                {fmtDate(pricing.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {notice && (
          <div className="mt-5 rounded-[18px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800">
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-[2rem] border border-[#E8E2DC] bg-white p-6 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
          <div className="grid gap-4 md:grid-cols-[220px_1fr_180px] md:items-end">
            <label>
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#F15A24]">
                Devise
              </span>
              <select
                value={pricing.currency}
                onChange={(e) => setPricing((prev) => ({ ...prev, currency: e.target.value }))}
                className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
              >
                <option value="USD">USD</option>
                <option value="MAD">MAD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>

            <div className="rounded-[1.4rem] border border-[#E8E2DC] bg-[#FBFCFD] px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Packs actifs
              </p>
              <p className="mt-1 text-2xl font-black text-[#123A63]">
                {pricing.packs.filter((p) => p.active).length} / {pricing.packs.length}
              </p>
            </div>

            <button
              onClick={addPack}
              className="h-[54px] rounded-[16px] border border-[#E8E2DC] bg-white px-5 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]"
            >
              + Ajouter pack
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          {loading ? (
            <div className="rounded-[2rem] border border-[#E8E2DC] bg-white p-8 text-center text-sm font-black text-slate-500">
              Chargement...
            </div>
          ) : pricing.packs.length === 0 ? (
            <div className="rounded-[2rem] border border-[#E8E2DC] bg-white p-8 text-center text-sm font-black text-slate-500">
              Aucun pack configuré.
            </div>
          ) : (
            pricing.packs.map((pack, index) => (
              <div
                key={pack.id || index}
                className="rounded-[2rem] border border-[#E8E2DC] bg-white p-6 shadow-[0_16px_38px_rgba(18,58,99,0.055)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
                      {pack.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#111827]">
                      {pack.name_fr}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 py-3 text-sm font-black text-[#123A63]">
                      <input
                        type="checkbox"
                        checked={pack.active}
                        onChange={(e) => updatePack(index, "active", e.target.checked)}
                        className="h-4 w-4 accent-[#F15A24]"
                      />
                      Actif
                    </label>

                    <button
                      onClick={() => removePack(index)}
                      className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-5">
                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      ID pack
                    </span>
                    <input
                      value={pack.id}
                      onChange={(e) => updatePack(index, "id", e.target.value)}
                      className="h-[52px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      État
                    </span>
                    <select
                      value={pack.state || "New Mexico"}
                      onChange={(e) => updatePack(index, "state" as keyof Pack, e.target.value)}
                      className="h-[52px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    >
                      <option value="New Mexico">New Mexico</option>
                      <option value="Wyoming">Wyoming</option>
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Prix
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={pack.price}
                      onChange={(e) => updatePack(index, "price", Number(e.target.value))}
                      className="h-[52px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    />
                  </label>

                  <label className="flex items-end">
                    <span className="flex h-[52px] w-full items-center gap-2 rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63]">
                      <input
                        type="checkbox"
                        checked={Boolean(pack.recommended)}
                        onChange={(e) => updatePack(index, "recommended" as keyof Pack, e.target.checked)}
                        className="h-4 w-4 accent-[#F15A24]"
                      />
                      Recommandé
                    </span>
                  </label>

                  <div className="rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Aperçu prix
                    </p>
                    <p className="mt-1 text-2xl font-black text-[#123A63]">
                      {pack.price} {pricing.currency}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Nom FR
                    </span>
                    <input
                      value={pack.name_fr}
                      onChange={(e) => updatePack(index, "name_fr", e.target.value)}
                      className="h-[52px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Nom EN
                    </span>
                    <input
                      value={pack.name_en}
                      onChange={(e) => updatePack(index, "name_en", e.target.value)}
                      className="h-[52px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Description FR
                    </span>
                    <textarea
                      value={pack.description_fr}
                      onChange={(e) => updatePack(index, "description_fr", e.target.value)}
                      className="min-h-[96px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 py-3 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Description EN
                    </span>
                    <textarea
                      value={pack.description_en}
                      onChange={(e) => updatePack(index, "description_en", e.target.value)}
                      className="min-h-[96px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 py-3 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Avantages FR — une ligne par avantage
                    </span>
                    <textarea
                      value={(pack.features_fr || []).join("\n")}
                      onChange={(e) => updatePack(index, "features_fr" as keyof Pack, e.target.value.split("\n").filter(Boolean) as any)}
                      className="min-h-[140px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 py-3 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Features EN — one line per feature
                    </span>
                    <textarea
                      value={(pack.features_en || []).join("\n")}
                      onChange={(e) => updatePack(index, "features_en" as keyof Pack, e.target.value.split("\n").filter(Boolean) as any)}
                      className="min-h-[140px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 py-3 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                    />
                  </label>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sticky bottom-5 mt-8 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-[20px] bg-[#F15A24] px-8 py-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(241,90,36,.24)] transition hover:bg-[#D94A1B] disabled:opacity-60"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </button>
        </div>
      </section>
    </main>
  );
}
