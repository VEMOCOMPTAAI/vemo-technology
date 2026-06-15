"use client";

import { useMemo, useState } from "react";

type Lang = "fr" | "en";

const initialPacks = [
  {
    key: "starter",
    name: "Starter",
    price: "129",
    descriptionFr: "Création LLC + documents de base.",
    descriptionEn: "LLC formation + basic documents.",
  },
  {
    key: "standard",
    name: "Standard",
    price: "149",
    descriptionFr: "Création LLC + EIN + accompagnement bancaire.",
    descriptionEn: "LLC formation + EIN + banking guidance.",
  },
  {
    key: "premium",
    name: "Premium",
    price: "199",
    descriptionFr: "Création LLC + EIN + suivi complet + support prioritaire.",
    descriptionEn: "LLC formation + EIN + full tracking + priority support.",
  },
];

export default function AdminPacksPage({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";
  const [packs, setPacks] = useState(initialPacks);

  const t = useMemo(
    () =>
      isFr
        ? {
            title: "Paramètres packs",
            subtitle: "Gérez les formules affichées dans le tunnel de création LLC.",
            back: "Retour admin",
            portal: "Espace client",
            pack: "Pack",
            price: "Prix USD",
            description: "Description",
            save: "Enregistrer",
            saved: "Modifications locales enregistrées.",
          }
        : {
            title: "Pack settings",
            subtitle: "Manage the plans displayed in the LLC formation funnel.",
            back: "Back to admin",
            portal: "Client portal",
            pack: "Pack",
            price: "USD price",
            description: "Description",
            save: "Save",
            saved: "Local changes saved.",
          },
    [isFr]
  );

  const [message, setMessage] = useState("");

  function updatePack(index: number, field: string, value: string) {
    setPacks((current) =>
      current.map((pack, i) => (i === index ? { ...pack, [field]: value } : pack))
    );
    setMessage("");
  }

  function save() {
    try {
      localStorage.setItem("vemo_admin_packs", JSON.stringify(packs));
      setMessage(t.saved);
    } catch {
      setMessage(t.saved);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F5F7FA", color: "#111827", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #E5EAF2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 86, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#123A63" }}>
              VEMO<span style={{ color: "#F15A24" }}>TECH</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 10, letterSpacing: 5, fontWeight: 900, color: "#8A98AD" }}>ADMIN</div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <a
              href={isFr ? "/fr/admin" : "/en/admin"}
              style={{
                height: 44,
                padding: "0 18px",
                border: "1px solid #DDE5F0",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#123A63",
                background: "#ffffff",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              {t.back}
            </a>

            <a
              href={isFr ? "/fr/admin/client-portal" : "/en/admin/client-portal"}
              style={{
                height: 44,
                padding: "0 18px",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#ffffff",
                background: "#F15A24",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              {t.portal}
            </a>
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "42px 24px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #E5EAF2", borderRadius: 28, padding: 32 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, color: "#111827" }}>{t.title}</h1>
          <p style={{ marginTop: 10, marginBottom: 28, color: "#667085", fontWeight: 700 }}>{t.subtitle}</p>

          <div style={{ display: "grid", gap: 18 }}>
            {packs.map((pack, index) => (
              <div
                key={pack.key}
                style={{
                  border: "1px solid #E5EAF2",
                  borderRadius: 22,
                  padding: 22,
                  background: "#ffffff",
                  display: "grid",
                  gridTemplateColumns: "1fr 160px",
                  gap: 18,
                }}
              >
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "#8A98AD", letterSpacing: 3, marginBottom: 8 }}>
                    {t.pack}
                  </label>
                  <input
                    value={pack.name}
                    onChange={(e) => updatePack(index, "name", e.target.value)}
                    style={{
                      width: "100%",
                      height: 48,
                      border: "1px solid #DDE5F0",
                      borderRadius: 14,
                      padding: "0 14px",
                      fontWeight: 900,
                      color: "#123A63",
                      boxSizing: "border-box",
                    }}
                  />

                  <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "#8A98AD", letterSpacing: 3, marginTop: 16, marginBottom: 8 }}>
                    {t.description}
                  </label>
                  <input
                    value={isFr ? pack.descriptionFr : pack.descriptionEn}
                    onChange={(e) => updatePack(index, isFr ? "descriptionFr" : "descriptionEn", e.target.value)}
                    style={{
                      width: "100%",
                      height: 48,
                      border: "1px solid #DDE5F0",
                      borderRadius: 14,
                      padding: "0 14px",
                      fontWeight: 700,
                      color: "#344054",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "#8A98AD", letterSpacing: 3, marginBottom: 8 }}>
                    {t.price}
                  </label>
                  <input
                    value={pack.price}
                    onChange={(e) => updatePack(index, "price", e.target.value)}
                    style={{
                      width: "100%",
                      height: 48,
                      border: "1px solid #DDE5F0",
                      borderRadius: 14,
                      padding: "0 14px",
                      fontWeight: 900,
                      color: "#123A63",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
            <button
              onClick={save}
              style={{
                height: 52,
                padding: "0 28px",
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

            {message ? <span style={{ color: "#123A63", fontWeight: 800 }}>{message}</span> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
