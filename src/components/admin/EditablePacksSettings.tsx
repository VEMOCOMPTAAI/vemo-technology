"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";

type Pack = {
  id: string;
  state: "New Mexico" | "Wyoming";
  name: string;
  price: string;
  lines: string;
};

const DEFAULT_PACKS: Pack[] = [
  {
    id: "nm-starter",
    state: "New Mexico",
    name: "New Mexico Starter",
    price: "129",
    lines: "LLC New Mexico\nDocuments de création\nRegistered Agent première année",
  },
  {
    id: "nm-standard",
    state: "New Mexico",
    name: "New Mexico Standard",
    price: "149",
    lines: "LLC New Mexico\nEIN\nDocuments de création\nAccompagnement bancaire",
  },
  {
    id: "nm-premium",
    state: "New Mexico",
    name: "New Mexico Premium",
    price: "199",
    lines: "LLC New Mexico\nEIN\nOperating Agreement\nSuivi complet\nSupport prioritaire",
  },
  {
    id: "wy-starter",
    state: "Wyoming",
    name: "Wyoming Starter",
    price: "149",
    lines: "LLC Wyoming\nDocuments de création\nRegistered Agent première année",
  },
  {
    id: "wy-standard",
    state: "Wyoming",
    name: "Wyoming Standard",
    price: "179",
    lines: "LLC Wyoming\nEIN\nDocuments de création\nAccompagnement bancaire",
  },
  {
    id: "wy-premium",
    state: "Wyoming",
    name: "Wyoming Premium",
    price: "229",
    lines: "LLC Wyoming\nEIN\nOperating Agreement\nSuivi complet\nSupport prioritaire",
  },
];

const STORAGE_KEY = "vemo_admin_llc_packs_settings_v1";

export default function EditablePacksSettings({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";
  const [packs, setPacks] = useState<Pack[]>(DEFAULT_PACKS);
  const [saved, setSaved] = useState(false);

  const t = useMemo(
    () =>
      isFr
        ? {
            title: "Paramètres packs",
            subtitle: "Modifiez les noms, les prix et les lignes de chaque pack.",
            back: "Retour admin",
            packName: "Nom du pack",
            price: "Prix USD",
            lines: "Lignes du pack",
            linesHint: "Une ligne par avantage/service.",
            save: "Enregistrer les modifications",
            reset: "Réinitialiser",
            saved: "Modifications enregistrées.",
            usd: "USD",
          }
        : {
            title: "Pack settings",
            subtitle: "Edit each pack name, price and lines.",
            back: "Back to admin",
            packName: "Pack name",
            price: "USD price",
            lines: "Pack lines",
            linesHint: "One line per benefit/service.",
            save: "Save changes",
            reset: "Reset",
            saved: "Changes saved.",
            usd: "USD",
          },
    [isFr]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setPacks(parsed);
        }
      }
    } catch {}
  }, []);

  function updatePack(id: string, field: "name" | "price" | "lines", value: string) {
    setSaved(false);
    setPacks((current) =>
      current.map((pack) =>
        pack.id === id
          ? {
              ...pack,
              [field]: value,
            }
          : pack
      )
    );
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
    } catch {}
    setSaved(true);
  }

  function reset() {
    setPacks(DEFAULT_PACKS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSaved(false);
  }

  const grouped = {
    "New Mexico": packs.filter((pack) => pack.state === "New Mexico"),
    Wyoming: packs.filter((pack) => pack.state === "Wyoming"),
  };

  return (
    <section style={{ maxWidth: 1232, margin: "0 auto", padding: "34px 24px" }}>
      <div style={{ background: "#ffffff", border: "1px solid #E5EAF2", borderRadius: 32, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.1, fontWeight: 900, color: "#111827" }}>
              {t.title}
            </h1>
            <p style={{ marginTop: 10, marginBottom: 0, color: "#667085", fontWeight: 700 }}>
              {t.subtitle}
            </p>
          </div>

          <a
            href={isFr ? "/fr/admin" : "/en/admin"}
            style={{
              height: 46,
              padding: "0 20px",
              borderRadius: 15,
              background: "#F15A24",
              color: "#ffffff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              fontWeight: 900,
              whiteSpace: "nowrap",
            }}
          >
            {t.back}
          </a>
        </div>

        {(["New Mexico", "Wyoming"] as const).map((stateName) => (
          <div key={stateName} style={{ marginTop: 32 }}>
            <h2 style={{ margin: "0 0 14px", color: "#123A63", fontSize: 24, fontWeight: 900 }}>
              {stateName}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
              {grouped[stateName].map((pack) => (
                <div
                  key={pack.id}
                  style={{
                    border: "1px solid #DDE5F0",
                    borderRadius: 22,
                    padding: 22,
                    background: "#ffffff",
                  }}
                >
                  <label style={{ display: "block", color: "#8AA0BE", letterSpacing: 3, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>
                    {t.packName}
                  </label>

                  <input
                    value={pack.name}
                    onChange={(e) => updatePack(pack.id, "name", e.target.value)}
                    style={{
                      width: "100%",
                      height: 46,
                      border: "1px solid #DDE5F0",
                      borderRadius: 14,
                      padding: "0 12px",
                      color: "#123A63",
                      fontWeight: 900,
                      boxSizing: "border-box",
                      background: "#ffffff",
                    }}
                  />

                  <label style={{ display: "block", color: "#8AA0BE", letterSpacing: 3, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginTop: 16, marginBottom: 8 }}>
                    {t.price}
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 70px", gap: 10 }}>
                    <input
                      value={pack.price}
                      onChange={(e) => updatePack(pack.id, "price", e.target.value)}
                      style={{
                        width: "100%",
                        height: 46,
                        border: "1px solid #DDE5F0",
                        borderRadius: 14,
                        padding: "0 12px",
                        color: "#F15A24",
                        fontWeight: 900,
                        fontSize: 20,
                        boxSizing: "border-box",
                        background: "#ffffff",
                      }}
                    />

                    <div
                      style={{
                        height: 46,
                        border: "1px solid #DDE5F0",
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#123A63",
                        fontWeight: 900,
                        background: "#ffffff",
                      }}
                    >
                      {t.usd}
                    </div>
                  </div>

                  <label style={{ display: "block", color: "#8AA0BE", letterSpacing: 3, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginTop: 16, marginBottom: 8 }}>
                    {t.lines}
                  </label>

                  <textarea
                    value={pack.lines}
                    onChange={(e) => updatePack(pack.id, "lines", e.target.value)}
                    rows={7}
                    style={{
                      width: "100%",
                      border: "1px solid #DDE5F0",
                      borderRadius: 14,
                      padding: 12,
                      color: "#344054",
                      fontWeight: 700,
                      lineHeight: 1.5,
                      resize: "vertical",
                      boxSizing: "border-box",
                      background: "#ffffff",
                    }}
                  />

                  <p style={{ margin: "8px 0 0", color: "#8A98AD", fontSize: 12, fontWeight: 700 }}>
                    {t.linesHint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 28 }}>
          <button
            onClick={save}
            style={{
              height: 52,
              padding: "0 26px",
              border: "none",
              borderRadius: 16,
              background: "#F15A24",
              color: "#ffffff",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {t.save}
          </button>

          <button
            onClick={reset}
            style={{
              height: 52,
              padding: "0 22px",
              border: "1px solid #DDE5F0",
              borderRadius: 16,
              background: "#ffffff",
              color: "#123A63",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {t.reset}
          </button>

          {saved ? <span style={{ color: "#123A63", fontWeight: 900 }}>{t.saved}</span> : null}
        </div>
      </div>
    </section>
  );
}
