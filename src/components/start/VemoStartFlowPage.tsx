"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";
type PaymentMethod = "card" | "bank_transfer";

const content = {
  fr: {
    home: "Accueil",
    business: "Business Setup",
    contact: "Contact",
    cost: "Cost Calculator",
    eyebrow: "Démarrer votre LLC",
    title: "Finalisez votre dossier LLC",
    subtitle: "Confirmez votre pack, renseignez vos informations principales et choisissez votre mode de paiement.",
    selectedPack: "Pack sélectionné",
    included: "Frais de dépôt inclus",
    clientInfo: "Informations client",
    fullName: "Nom complet",
    email: "Email",
    phone: "Téléphone / WhatsApp",
    country: "Pays de résidence",
    llcName: "Nom souhaité de la LLC",
    llcState: "État LLC",
    payment: "Mode de paiement",
    card: "Carte bancaire",
    cardDesc: "Paiement en ligne sécurisé.",
    transfer: "Virement bancaire",
    transferDesc: "Upload justificatif puis vérification admin.",
    continue: "Continuer",
    processing: "Création du dossier...",
    errorRequired: "Merci de compléter les champs obligatoires.",
    switchLang: "EN",
  },
  en: {
    home: "Home",
    business: "Business Setup",
    contact: "Contact",
    cost: "Cost Calculator",
    eyebrow: "Start your LLC",
    title: "Finalize your LLC file",
    subtitle: "Confirm your package, enter your main details and choose your payment method.",
    selectedPack: "Selected package",
    included: "State filing fees included",
    clientInfo: "Client information",
    fullName: "Full name",
    email: "Email",
    phone: "Phone / WhatsApp",
    country: "Country of residence",
    llcName: "Desired LLC name",
    llcState: "LLC state",
    payment: "Payment method",
    card: "Credit card",
    cardDesc: "Secure online payment.",
    transfer: "Bank transfer",
    transferDesc: "Upload proof then admin verification.",
    continue: "Continue",
    processing: "Creating file...",
    errorRequired: "Please complete the required fields.",
    switchLang: "FR",
  },
};

function defaultPackName(state: string, lang: Lang) {
  if (state === "wyoming") return "Wyoming Standard";
  return "New Mexico Standard";
}

function stateLabel(state: string) {
  if (state === "wyoming") return "Wyoming";
  return "New Mexico";
}

export default function VemoStartFlowPage({ lang = "fr" }: { lang?: Lang }) {
  const t = content[lang];

  const [packId, setPackId] = useState("");
  const [packName, setPackName] = useState("");
  const [state, setState] = useState("new-mexico");
  const [amount, setAmount] = useState("149");
  const [currency, setCurrency] = useState("USD");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Morocco");
  const [llcName, setLlcName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const switchHref = useMemo(() => {
    const params = new URLSearchParams({
      pack: packId,
      packName,
      state,
      amount,
      currency,
    });

    return lang === "fr" ? `/en/commencer?${params.toString()}` : `/fr/commencer?${params.toString()}`;
  }, [lang, packId, packName, state, amount, currency]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const qPack = params.get("pack") || "";
    const qPackName = params.get("packName") || "";
    const qState = params.get("state") || "new-mexico";
    const qAmount = params.get("amount") || "149";
    const qCurrency = params.get("currency") || "USD";
    const qEmail = params.get("email") || "";
    const qName = params.get("name") || "";
    const qLlc = params.get("llc") || "";

    setPackId(qPack);
    setState(qState);
    setAmount(qAmount);
    setCurrency(qCurrency);
    setEmail(qEmail);
    setFullName(qName);
    setLlcName(qLlc);

    if (qPackName) {
      setPackName(qPackName);
    } else if (qPack) {
      setPackName(
        qPack
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .replace("Nm", "New Mexico")
          .replace("Wy", "Wyoming")
      );
    } else {
      setPackName(defaultPackName(qState, lang));
    }
  }, [lang]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !llcName.trim()) {
      setError(t.errorRequired);
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/orders/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang,
          full_name: fullName,
          email,
          phone,
          country,
          llc_name: llcName,
          state: stateLabel(state),
          package_name: packName,
          pack_id: packId,
          amount: Number(amount || 0),
          currency,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false || !data?.redirectTo) {
        setError(data?.error || "Erreur pendant la création du dossier.");
        return;
      }

      window.location.href = data.redirectTo;
    } catch {
      setError("Erreur réseau pendant la création du dossier.");
    } finally {
      setBusy(false);
    }
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

          <nav className="hidden items-center gap-7 text-sm font-black text-[#111827] lg:flex">
            <a href={lang === "fr" ? "/fr" : "/en"}>{t.home}</a>
            <a href={lang === "fr" ? "/fr/tarifs" : "/en/pricing"}>{t.business}</a>
            <a href={lang === "fr" ? "/fr/contact" : "/en/contact"}>{t.contact}</a>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={switchHref}
              className="border-r border-[#E8E2DC] pr-4 text-sm font-black text-[#111827] transition hover:text-[#F15A24]"
            >
              {t.switchLang}
            </a>

            <a
              href={lang === "fr" ? "/fr/tarifs" : "/en/pricing"}
              className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,.18)] transition hover:bg-[#D94A1B]"
            >
              {t.cost}
            </a>
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

            <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.07em] text-[#111827]">
              {t.title}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_22px_60px_rgba(18,58,99,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
                {t.selectedPack}
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-[#123A63]">
                {packName}
              </h2>

              <div className="mt-6 rounded-[1.5rem] border border-[#E8E2DC] bg-[#FBFCFD] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {stateLabel(state)}
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-black tracking-[-0.08em] text-[#123A63]">
                    ${amount}
                  </span>
                  <span className="mb-2 text-sm font-black text-slate-400">{currency}</span>
                </div>

                <div className="mt-4 rounded-full border border-[#FFD2C2] bg-[#FFF7F1] px-4 py-2 text-sm font-black text-[#F15A24]">
                  {t.included}
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm font-bold text-slate-600">
                <div className="rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] p-4">
                  ✓ LLC formation file
                </div>
                <div className="rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] p-4">
                  ✓ Admin tracking
                </div>
                <div className="rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] p-4">
                  ✓ Client portal access
                </div>
              </div>
            </aside>

            <form
              onSubmit={submit}
              className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_22px_60px_rgba(18,58,99,0.08)]"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
                {t.clientInfo}
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">{t.fullName}</span>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">{t.email}</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">{t.phone}</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">{t.country}</span>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  >
                    <option>Morocco</option>
                    <option>France</option>
                    <option>United Arab Emirates</option>
                    <option>Saudi Arabia</option>
                    <option>United States</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">{t.llcName}</span>
                  <input
                    value={llcName}
                    onChange={(e) => setLlcName(e.target.value)}
                    required
                    className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">{t.llcState}</span>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  >
                    <option value="new-mexico">New Mexico</option>
                    <option value="wyoming">Wyoming</option>
                  </select>
                </label>
              </div>

              <div className="mt-7">
                <p className="mb-3 text-sm font-black text-[#123A63]">{t.payment}</p>

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`rounded-[1.4rem] border p-5 text-left transition ${
                      paymentMethod === "card"
                        ? "border-[#F15A24] bg-[#FFF7F1]"
                        : "border-[#E8E2DC] bg-[#FBFCFD] hover:border-[#F15A24]/40"
                    }`}
                  >
                    <div className="text-lg font-black text-[#123A63]">💳 {t.card}</div>
                    <p className="mt-2 text-sm font-bold text-slate-500">{t.cardDesc}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`rounded-[1.4rem] border p-5 text-left transition ${
                      paymentMethod === "bank_transfer"
                        ? "border-[#F15A24] bg-[#FFF7F1]"
                        : "border-[#E8E2DC] bg-[#FBFCFD] hover:border-[#F15A24]/40"
                    }`}
                  >
                    <div className="text-lg font-black text-[#123A63]">🏦 {t.transfer}</div>
                    <p className="mt-2 text-sm font-bold text-slate-500">{t.transferDesc}</p>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-800">
                  {error}
                </div>
              )}

              <button
                disabled={busy}
                className="mt-7 flex min-h-[56px] w-full items-center justify-center rounded-[18px] bg-[#F15A24] px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.20)] transition hover:bg-[#D94A1B] disabled:opacity-60"
              >
                {busy ? t.processing : `${t.continue} →`}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
