"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";

type Pack = {
  id: string;
  state: "New Mexico" | "Wyoming";
  name: string;
  price: string;
  lines: string[];
};

const DEFAULT_PACKS: Pack[] = [
  { id: "nm-starter", state: "New Mexico", name: "New Mexico Starter", price: "129", lines: ["LLC New Mexico", "Documents de création", "Registered Agent première année"] },
  { id: "nm-standard", state: "New Mexico", name: "New Mexico Standard", price: "149", lines: ["LLC New Mexico", "EIN", "Documents de création", "Accompagnement bancaire"] },
  { id: "nm-premium", state: "New Mexico", name: "New Mexico Premium", price: "199", lines: ["LLC New Mexico", "EIN", "Operating Agreement", "Suivi complet", "Support prioritaire"] },
  { id: "wy-starter", state: "Wyoming", name: "Wyoming Starter", price: "149", lines: ["LLC Wyoming", "Documents de création", "Registered Agent première année"] },
  { id: "wy-standard", state: "Wyoming", name: "Wyoming Standard", price: "179", lines: ["LLC Wyoming", "EIN", "Documents de création", "Accompagnement bancaire"] },
  { id: "wy-premium", state: "Wyoming", name: "Wyoming Premium", price: "229", lines: ["LLC Wyoming", "EIN", "Operating Agreement", "Suivi complet", "Support prioritaire"] }
];

export default function StartLLCFlow({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";

  const [packs, setPacks] = useState<Pack[]>(DEFAULT_PACKS);
  const [stateName, setStateName] = useState<"New Mexico" | "Wyoming">("New Mexico");
  const [packId, setPackId] = useState("nm-premium");
  const [payment, setPayment] = useState<"card" | "bank">("card");

  const [form, setForm] = useState({
    llcName: "",
    alternativeName: "",
    activity: "",
    ownerName: "",
    email: "",
    phone: "",
    country: "Morocco",
    address: "",
  });

  const t = useMemo(
    () =>
      isFr
        ? {
            title: "Créer votre LLC US",
            subtitle: "Choisissez l’État, le pack, puis complétez les informations du propriétaire.",
            step1: "1. État",
            step2: "2. Pack",
            step3: "3. Informations",
            step4: "4. Résumé",
            nm: "New Mexico",
            wy: "Wyoming",
            llcName: "Nom souhaité de la LLC",
            alternativeName: "Nom alternatif",
            activity: "Activité",
            ownerName: "Nom complet du propriétaire",
            email: "Email",
            phone: "Téléphone",
            country: "Pays",
            address: "Adresse",
            payment: "Paiement",
            card: "Carte bancaire",
            bank: "Virement bancaire",
            submitCard: "Continuer vers le paiement carte",
            submitBank: "Continuer vers le virement",
            included: "Inclus",
            total: "Total",
            backHome: "Retour accueil",
          }
        : {
            title: "Start your US LLC",
            subtitle: "Choose the state, select your pack, then complete the owner information.",
            step1: "1. State",
            step2: "2. Pack",
            step3: "3. Information",
            step4: "4. Summary",
            nm: "New Mexico",
            wy: "Wyoming",
            llcName: "Desired LLC name",
            alternativeName: "Alternative name",
            activity: "Activity",
            ownerName: "Owner full name",
            email: "Email",
            phone: "Phone",
            country: "Country",
            address: "Address",
            payment: "Payment",
            card: "Card payment",
            bank: "Bank transfer",
            submitCard: "Continue to card payment",
            submitBank: "Continue to bank transfer",
            included: "Included",
            total: "Total",
            backHome: "Back home",
          },
    [isFr]
  );

  useEffect(() => {
    fetch("/api/public/llc-packs", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.packs) && data.packs.length) {
          setPacks(data.packs);
          const first = data.packs.find((p: Pack) => p.state === stateName);
          if (first?.id) setPackId(first.id);
        }
      })
      .catch(() => setPacks(DEFAULT_PACKS));
  }, []);

  const statePacks = packs.filter((pack) => pack.state === stateName);
  const selectedPack = packs.find((pack) => pack.id === packId) || statePacks[0] || DEFAULT_PACKS[0];

  function chooseState(next: "New Mexico" | "Wyoming") {
    setStateName(next);
    const first = packs.find((pack) => pack.state === next);
    if (first) setPackId(first.id);
  }

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function finish() {
    const order = {
      ...form,
      state: stateName,
      pack: selectedPack,
      payment,
      createdAt: new Date().toISOString(),
      status: payment === "bank" ? "Paiement à vérifier" : "Paiement carte",
    };

    try {
      localStorage.setItem("vemo_last_llc_order", JSON.stringify(order));
    } catch {}

    if (payment === "bank") {
      window.location.href = isFr ? "/fr/paiement/virement" : "/en/payment/bank-transfer";
      return;
    }

    window.location.href = isFr ? "/fr/stripe" : "/en/stripe";
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F7F9FC", fontFamily: "Arial, sans-serif", color: "#111827" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #E5EAF2" }}>
        <div style={{ maxWidth: 1180, height: 86, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href={isFr ? "/fr" : "/en"} style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#123A63" }}>
              VEMO<span style={{ color: "#F15A24" }}>TECH</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 10, letterSpacing: 5, color: "#8A98AD", fontWeight: 900 }}>
              US LLC
            </div>
          </a>

          <a
            href={isFr ? "/fr" : "/en"}
            style={{
              height: 46,
              padding: "0 20px",
              border: "1px solid #DDE5F0",
              borderRadius: 15,
              background: "#ffffff",
              color: "#123A63",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              fontWeight: 900,
            }}
          >
            {t.backHome}
          </a>
        </div>
      </header>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #E5EAF2", borderRadius: 32, padding: 32 }}>
          <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.05, fontWeight: 900 }}>
            {t.title}
          </h1>
          <p style={{ marginTop: 12, marginBottom: 34, color: "#667085", fontWeight: 700, lineHeight: 1.6 }}>
            {t.subtitle}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: 28 }}>
            <div>
              <h2 style={{ margin: "0 0 14px", color: "#123A63", fontSize: 20, fontWeight: 900 }}>{t.step1}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 30 }}>
                {(["New Mexico", "Wyoming"] as const).map((state) => (
                  <button
                    key={state}
                    onClick={() => chooseState(state)}
                    style={{
                      height: 58,
                      borderRadius: 18,
                      border: stateName === state ? "2px solid #F15A24" : "1px solid #DDE5F0",
                      background: "#ffffff",
                      color: "#123A63",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {state}
                  </button>
                ))}
              </div>

              <h2 style={{ margin: "0 0 14px", color: "#123A63", fontSize: 20, fontWeight: 900 }}>{t.step2}</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {statePacks.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setPackId(pack.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 20,
                      border: packId === pack.id ? "2px solid #F15A24" : "1px solid #DDE5F0",
                      background: "#ffffff",
                      padding: 18,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
                      <strong style={{ color: "#123A63", fontSize: 17 }}>{pack.name}</strong>
                      <strong style={{ color: "#F15A24", fontSize: 20 }}>{pack.price} USD</strong>
                    </div>
                    <div style={{ marginTop: 10, color: "#667085", fontWeight: 700, lineHeight: 1.6 }}>
                      {pack.lines.slice(0, 3).join(" · ")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ margin: "0 0 14px", color: "#123A63", fontSize: 20, fontWeight: 900 }}>{t.step3}</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  ["llcName", t.llcName],
                  ["alternativeName", t.alternativeName],
                  ["activity", t.activity],
                  ["ownerName", t.ownerName],
                  ["email", t.email],
                  ["phone", t.phone],
                  ["country", t.country],
                  ["address", t.address],
                ].map(([field, label]) => (
                  <label key={field} style={{ display: "grid", gap: 8, color: "#123A63", fontWeight: 900, fontSize: 13 }}>
                    {label}
                    <input
                      value={(form as any)[field]}
                      onChange={(e) => update(field as keyof typeof form, e.target.value)}
                      style={{
                        height: 50,
                        border: "1px solid #DDE5F0",
                        borderRadius: 15,
                        padding: "0 14px",
                        outline: "none",
                        color: "#111827",
                        fontWeight: 700,
                        background: "#ffffff",
                      }}
                    />
                  </label>
                ))}
              </div>

              <div style={{ marginTop: 28, border: "1px solid #DDE5F0", borderRadius: 24, padding: 22, background: "#ffffff" }}>
                <h2 style={{ margin: 0, color: "#123A63", fontSize: 20, fontWeight: 900 }}>{t.step4}</h2>

                <div style={{ marginTop: 16, display: "grid", gap: 10, color: "#344054", fontWeight: 800 }}>
                  <div>{stateName}</div>
                  <div>{selectedPack.name}</div>
                  <div style={{ color: "#F15A24", fontSize: 28, fontWeight: 900 }}>{selectedPack.price} USD</div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ color: "#8AA0BE", letterSpacing: 3, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>
                    {t.included}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#667085", fontWeight: 700, lineHeight: 1.7 }}>
                    {selectedPack.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ color: "#8AA0BE", letterSpacing: 3, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>
                    {t.payment}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <button
                      onClick={() => setPayment("card")}
                      style={{
                        height: 50,
                        borderRadius: 15,
                        border: payment === "card" ? "2px solid #F15A24" : "1px solid #DDE5F0",
                        background: "#ffffff",
                        color: "#123A63",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      {t.card}
                    </button>

                    <button
                      onClick={() => setPayment("bank")}
                      style={{
                        height: 50,
                        borderRadius: 15,
                        border: payment === "bank" ? "2px solid #F15A24" : "1px solid #DDE5F0",
                        background: "#ffffff",
                        color: "#123A63",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      {t.bank}
                    </button>
                  </div>
                </div>

                <button
                  onClick={finish}
                  style={{
                    marginTop: 22,
                    width: "100%",
                    height: 56,
                    border: "none",
                    borderRadius: 18,
                    background: "#F15A24",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  {payment === "card" ? t.submitCard : t.submitBank}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
