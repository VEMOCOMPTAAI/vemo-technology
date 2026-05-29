"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";
type PaymentMethod = "card" | "bank_transfer";

type Plan = {
  id: string;
  label: string;
  price: number;
  subtitle: string;
  features: string[];
  recommended?: boolean;
};

const plans: Plan[] = [
  {
    id: "starter",
    label: "Starter",
    price: 129,
    subtitle: "Pour démarrer simplement votre dossier LLC.",
    features: ["Questionnaire LLC", "Préparation dossier", "Suivi administratif"],
  },
  {
    id: "standard",
    label: "Standard",
    price: 149,
    subtitle: "La formule recommandée pour la plupart des non-résidents.",
    features: ["Tout Starter", "EIN", "Operating Agreement", "Suivi renforcé"],
    recommended: true,
  },
  {
    id: "premium",
    label: "Premium",
    price: 199,
    subtitle: "Un accompagnement plus complet et structuré.",
    features: ["Tout Standard", "Préparation Stripe / PayPal", "Checklist bancaire", "Support prioritaire"],
  },
];

const wyomingExtra = 50;

const content = {
  fr: {
    home: "Accueil",
    pricing: "Tarifs",
    faq: "FAQ",
    contact: "Contact",
    start: "Démarrer",
    next: "Continuer",
    back: "← Retour",
    summary: "Résumé",
    progress: "Progression",
    company: "Votre société LLC",
    estimated: "Total estimé",
    finalNote: "Le montant final pourra être ajusté selon les services réellement nécessaires.",
    included: "Inclus",
    toComplete: "À compléter",
    selected: "Sélectionné",
    recommended: "Recommandé",
    steps: [
      "Formule",
      "État",
      "Nom LLC",
      "Activité",
      "Compte",
      "Membres",
      "Adresse",
      "Services",
      "Résumé",
      "Paiement",
    ],
  },
  en: {
    home: "Home",
    pricing: "Pricing",
    faq: "FAQ",
    contact: "Contact",
    start: "Start",
    next: "Continue",
    back: "← Back",
    summary: "Summary",
    progress: "Progress",
    company: "Your LLC company",
    estimated: "Estimated total",
    finalNote: "The final amount may be adjusted depending on the services actually required.",
    included: "Included",
    toComplete: "To complete",
    selected: "Selected",
    recommended: "Recommended",
    steps: [
      "Package",
      "State",
      "LLC name",
      "Activity",
      "Account",
      "Members",
      "Address",
      "Services",
      "Summary",
      "Payment",
    ],
  },
};

function inputClass() {
  return "h-[54px] w-full rounded-[16px] border border-[#E1E7EF] bg-white px-4 text-sm font-black text-[#123A63] outline-none transition focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10";
}

function textareaClass() {
  return "min-h-[120px] w-full rounded-[16px] border border-[#E1E7EF] bg-white px-4 py-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10";
}

function slugPlanToPlan(pack?: string | null, amount?: string | null) {
  const raw = String(pack || "").toLowerCase();

  if (raw.includes("premium")) return { plan: "premium", price: Number(amount || 199) || 199 };
  if (raw.includes("starter")) return { plan: "starter", price: Number(amount || 129) || 129 };
  return { plan: "standard", price: Number(amount || 149) || 149 };
}

export default function VemoStartFlowPage({ lang = "fr" }: { lang?: Lang }) {
  const t = content[lang];

  const [step, setStep] = useState(0);
  const [planId, setPlanId] = useState("standard");
  const [state, setState] = useState("New Mexico");
  const [packId, setPackId] = useState("");
  const [packName, setPackName] = useState("New Mexico Standard");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+212");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Morocco");
  const [llcName, setLlcName] = useState("");
  const [activity, setActivity] = useState("");
  const [memberName, setMemberName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [address, setAddress] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === planId) || plans[1];
  }, [planId]);

  const finalPrice = useMemo(() => {
    const base = selectedPlan.price;
    return state === "Wyoming" ? base + wyomingExtra : base;
  }, [selectedPlan, state]);

  const progress = Math.round(((step + 1) / t.steps.length) * 100);

  const switchHref = lang === "fr" ? "/en/commencer" : "/fr/commencer";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const qPack = params.get("pack");
    const qPackName = params.get("packName");
    const qState = params.get("state");
    const qAmount = params.get("amount");
    const qEmail = params.get("email");
    const qName = params.get("name");
    const qLlc = params.get("llc");

    const parsed = slugPlanToPlan(qPack || qPackName, qAmount);

    setPlanId(parsed.plan);

    if (qState?.toLowerCase().includes("wyoming")) {
      setState("Wyoming");
    } else {
      setState("New Mexico");
    }

    if (qPack) setPackId(qPack);
    if (qPackName) setPackName(qPackName);
    if (qEmail) setEmail(qEmail);
    if (qName) {
      setFullName(qName);
      setMemberName(qName);
      setManagerName(qName);
    }
    if (qLlc) setLlcName(qLlc);
  }, []);

  useEffect(() => {
    if (!memberName && fullName) setMemberName(fullName);
    if (!managerName && fullName) setManagerName(fullName);
  }, [fullName, memberName, managerName]);

  useEffect(() => {
    setPackName(`${state} ${selectedPlan.label}`);
  }, [state, selectedPlan]);

  function toggleService(service: string) {
    setServices((prev) => {
      if (prev.includes(service)) return prev.filter((s) => s !== service);
      return [...prev, service];
    });
  }

  function canContinue() {
    if (step === 2 && !llcName.trim()) return false;
    if (step === 3 && !activity.trim()) return false;
    if (step === 4 && (!fullName.trim() || !email.trim())) return false;
    if (step === 5 && (!memberName.trim() || !managerName.trim())) return false;
    if (step === 6 && !address.trim()) return false;
    return true;
  }

  async function submitFinal() {
    setError("");

    if (!fullName.trim() || !email.trim() || !llcName.trim()) {
      setError(lang === "fr" ? "Merci de compléter les champs obligatoires." : "Please complete the required fields.");
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
          phone: `${phoneCode} ${phone}`.trim(),
          country,
          llc_name: llcName,
          state,
          package_name: packName,
          pack_id: packId || `${state.toLowerCase().replace(/\s+/g, "_")}_${planId}`,
          amount: finalPrice,
          currency: "USD",
          payment_method: paymentMethod,
          activity,
          member_name: memberName,
          manager_name: managerName,
          address,
          services,
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

  function next() {
    setError("");

    if (!canContinue()) {
      setError(lang === "fr" ? "Merci de compléter cette étape avant de continuer." : "Please complete this step before continuing.");
      return;
    }

    if (step < 9) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      submitFinal();
    }
  }

  function back() {
    setError("");
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F8FB] text-[#111827]">
      <header className="border-b border-[#E3EAF2] bg-white">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
          <a href={lang === "fr" ? "/fr" : "/en"} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#123A63] text-sm font-black text-white">
              V
            </div>
            <div>
              <div className="text-lg font-black tracking-[-0.04em]">
                <span className="text-[#123A63]">Vemo</span>{" "}
                <span className="text-[#111827]">Technology</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                US LLC pour non-résidents
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-black text-[#111827] lg:flex">
            <a href={lang === "fr" ? "/fr" : "/en"}>{t.home}</a>
            <a href={lang === "fr" ? "/fr/tarifs" : "/en/pricing"}>{t.pricing}</a>
            <a href="/fr/faq">{t.faq}</a>
            <a href="/fr/contact">{t.contact}</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={switchHref}
              className="rounded-full border border-[#E3EAF2] bg-white px-4 py-2 text-xs font-black text-[#111827] transition hover:text-[#F15A24]"
            >
              {lang === "fr" ? "EN" : "FR"}
            </a>

            <a
              href={lang === "fr" ? "/fr/tarifs" : "/en/pricing"}
              className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,.18)] hover:bg-[#D94A1B]"
            >
              {t.start} →
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[1.6rem] border border-[#E3EAF2] bg-white p-3 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
          <div className="grid gap-2 md:grid-cols-5 lg:grid-cols-10">
            {t.steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className={`rounded-[14px] border p-3 text-left transition ${
                  step === index
                    ? "border-[#F15A24] bg-[#FFF7F1] text-[#F15A24]"
                    : index < step
                    ? "border-[#DCE7F2] bg-[#F8FAFC] text-[#123A63]"
                    : "border-[#E3EAF2] bg-white text-slate-400"
                }`}
              >
                <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${
                  step === index ? "bg-[#F15A24] text-white" : "bg-[#EDF3F8] text-[#123A63]"
                }`}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="text-[11px] font-black">{label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-7 lg:grid-cols-[1.1fr_0.68fr]">
          <section className="rounded-[2rem] border border-[#E3EAF2] bg-white p-8 shadow-[0_24px_70px_rgba(18,58,99,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
              Étape {String(step + 1).padStart(2, "0")}
            </p>

            {step === 0 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Choisissez votre formule</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Sélectionnez le niveau d’accompagnement adapté à votre projet LLC.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setPlanId(plan.id)}
                      className={`relative min-h-[260px] rounded-[1.6rem] border p-5 text-left transition ${
                        planId === plan.id
                          ? "border-[#F15A24] bg-[#FFF7F1] shadow-[0_18px_40px_rgba(241,90,36,.12)]"
                          : "border-[#E3EAF2] bg-white hover:border-[#F15A24]/40"
                      }`}
                    >
                      {plan.recommended && (
                        <span className="absolute right-4 top-4 rounded-full bg-[#F15A24] px-3 py-1 text-[10px] font-black uppercase text-white">
                          {t.recommended}
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-[#111827]">{plan.label}</h3>
                          <div className="mt-2 text-4xl font-black tracking-[-0.07em] text-[#123A63]">
                            ${state === "Wyoming" ? plan.price + wyomingExtra : plan.price}
                          </div>
                        </div>
                        <div className={`mt-2 h-5 w-5 rounded-full border ${
                          planId === plan.id ? "border-[#F15A24] bg-[#F15A24]" : "border-[#B9C8D8]"
                        }`} />
                      </div>

                      <p className="mt-4 text-sm font-bold leading-6 text-slate-500">{plan.subtitle}</p>

                      <ul className="mt-5 space-y-2">
                        {plan.features.map((f) => (
                          <li key={f} className="text-xs font-black text-[#123A63]">✓ {f}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Choisissez l’État LLC</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  New Mexico et Wyoming sont les deux États actuellement proposés.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {["New Mexico", "Wyoming"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setState(s)}
                      className={`rounded-[1.6rem] border p-6 text-left transition ${
                        state === s ? "border-[#F15A24] bg-[#FFF7F1]" : "border-[#E3EAF2] bg-white hover:border-[#F15A24]/40"
                      }`}
                    >
                      <h3 className="text-2xl font-black text-[#123A63]">{s}</h3>
                      <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                        {s === "New Mexico"
                          ? "Confidentialité, coût optimisé et structure simple pour non-résidents."
                          : "État reconnu, frais plus élevés mais image corporate plus forte."}
                      </p>
                      <div className="mt-5 rounded-full border border-[#FFD2C2] bg-[#FFF7F1] px-4 py-2 text-sm font-black text-[#F15A24]">
                        {s === "Wyoming" ? "+ $50" : "Frais inclus"}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Nom souhaité de la LLC</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Indiquez le nom souhaité. Nous vérifierons la disponibilité avant dépôt.
                </p>

                <div className="mt-6 grid gap-4">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Nom LLC souhaité</span>
                    <input value={llcName} onChange={(e) => setLlcName(e.target.value)} className={inputClass()} placeholder="Ex: Vemo Digital LLC" />
                  </label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Activité business</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Décrivez clairement l’activité prévue de votre société.
                </p>

                <div className="mt-6">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Business activity</span>
                    <textarea value={activity} onChange={(e) => setActivity(e.target.value)} className={textareaClass()} placeholder="Ex: Online consulting, digital services, software, e-commerce..." />
                  </label>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Informations du compte</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Ces informations seront utilisées pour créer votre dossier et préremplir l’espace client.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Nom complet</span>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass()} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass()} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Indicatif</span>
                    <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} className={inputClass()}>
                      <option value="+212">🇲🇦 Morocco +212</option>
                      <option value="+33">🇫🇷 France +33</option>
                      <option value="+971">🇦🇪 UAE +971</option>
                      <option value="+966">🇸🇦 Saudi Arabia +966</option>
                      <option value="+1">🇺🇸 USA +1</option>
                    </select>
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Téléphone / WhatsApp</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass()} placeholder="651983600" />
                  </label>
                  <label className="md:col-span-2">
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Pays de résidence</span>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass()}>
                      <option>Morocco</option>
                      <option>France</option>
                      <option>United Arab Emirates</option>
                      <option>Saudi Arabia</option>
                      <option>United States</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Membres et manager</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Par défaut, le nom du client est proposé comme membre et manager.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Membre principal</span>
                    <input value={memberName} onChange={(e) => setMemberName(e.target.value)} className={inputClass()} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Manager</span>
                    <input value={managerName} onChange={(e) => setManagerName(e.target.value)} className={inputClass()} />
                  </label>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Adresse</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Adresse de résidence ou adresse administrative principale.
                </p>

                <div className="mt-6">
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} className={textareaClass()} placeholder="Adresse complète..." />
                </div>
              </>
            )}

            {step === 7 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Services disponibles</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Les services affichés dépendent de la formule sélectionnée.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    "EIN application",
                    "Operating Agreement",
                    "Stripe / PayPal / Wise preparation",
                    "Form 5472 + Form 1120 first year",
                    "Priority support",
                    "Banking checklist",
                  ]
                    .filter((s) => selectedPlan.id !== "starter" || ["EIN application", "Operating Agreement"].includes(s) === false)
                    .map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`rounded-[1.3rem] border p-4 text-left text-sm font-black transition ${
                          services.includes(service)
                            ? "border-[#F15A24] bg-[#FFF7F1] text-[#F15A24]"
                            : "border-[#E3EAF2] bg-white text-[#123A63] hover:border-[#F15A24]/40"
                        }`}
                      >
                        {services.includes(service) ? "✓ " : "+ "} {service}
                      </button>
                    ))}
                </div>
              </>
            )}

            {step === 8 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Résumé avant paiement</h1>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["Formule", selectedPlan.label],
                    ["État", state],
                    ["Nom LLC", llcName],
                    ["Activité", activity],
                    ["Client", fullName],
                    ["Email", email],
                    ["Téléphone", `${phoneCode} ${phone}`],
                    ["Membre / Manager", `${memberName} / ${managerName}`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-[1.2rem] border border-[#E3EAF2] bg-[#F8FAFC] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{k}</p>
                      <p className="mt-2 text-sm font-black text-[#123A63]">{v || "—"}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 9 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Paiement</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Choisissez votre mode de paiement pour continuer.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`rounded-[1.5rem] border p-6 text-left transition ${
                      paymentMethod === "card" ? "border-[#F15A24] bg-[#FFF7F1]" : "border-[#E3EAF2] bg-white"
                    }`}
                  >
                    <div className="text-2xl font-black text-[#123A63]">💳 Credit card</div>
                    <p className="mt-3 text-sm font-bold text-slate-500">Paiement en ligne sécurisé.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`rounded-[1.5rem] border p-6 text-left transition ${
                      paymentMethod === "bank_transfer" ? "border-[#F15A24] bg-[#FFF7F1]" : "border-[#E3EAF2] bg-white"
                    }`}
                  >
                    <div className="text-2xl font-black text-[#123A63]">🏦 Virement</div>
                    <p className="mt-3 text-sm font-bold text-slate-500">Upload justificatif puis vérification admin.</p>
                  </button>
                </div>
              </>
            )}

            {error && (
              <div className="mt-6 rounded-[16px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-700">
                {error}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-[#E3EAF2] pt-6">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="rounded-[12px] border border-[#E3EAF2] bg-[#F8FAFC] px-6 py-3 text-sm font-black text-[#123A63] disabled:opacity-40"
              >
                {t.back}
              </button>

              <button
                type="button"
                onClick={next}
                disabled={busy}
                className="rounded-[12px] bg-[#F15A24] px-8 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,.18)] hover:bg-[#D94A1B] disabled:opacity-60"
              >
                {busy ? "Traitement..." : `${t.next} →`}
              </button>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-[#E3EAF2] bg-white p-8 shadow-[0_24px_70px_rgba(18,58,99,0.08)]">
            <h2 className="text-3xl font-black tracking-[-0.06em]">{t.summary}</h2>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              {t.company}
            </p>

            <div className="mt-5 h-2 rounded-full bg-[#EDF3F8]">
              <div className="h-2 rounded-full bg-[#F15A24]" style={{ width: `${progress}%` }} />
            </div>

            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#123A63]">
              {t.progress} : {progress}%
            </p>

            <div className="mt-8 space-y-5">
              {[
                ["Accompagnement", selectedPlan.label, `$${state === "Wyoming" ? selectedPlan.price + wyomingExtra : selectedPlan.price}`],
                ["État", state, state === "Wyoming" ? "+$50" : "Inclus"],
                ["Services", `${services.length} sélectionné(s)`, "$0"],
                ["Compte client", email ? email : t.toComplete, t.included],
              ].map(([k, v, price]) => (
                <div key={k} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-[#111827]">{k}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{v}</p>
                  </div>
                  <p className="text-sm font-black text-[#111827]">{price}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.4rem] border border-[#FFD2C2] bg-[#FFF7F1] p-5">
              <div className="flex items-end justify-between">
                <p className="text-lg font-black text-[#111827]">{t.estimated}</p>
                <p className="text-4xl font-black tracking-[-0.08em] text-[#F15A24]">${finalPrice}</p>
              </div>
            </div>

            <p className="mt-5 text-xs font-bold leading-6 text-slate-500">
              {t.finalNote}
            </p>
          </aside>
        </div>
      </section>

      <footer className="mt-10 bg-[#0F2F55] px-6 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div>
            <div className="text-xl font-black">Vemo Technology</div>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
              Plateforme premium pour accompagner les entrepreneurs non-résidents dans la création de leur LLC américaine.
            </p>
          </div>
          <div>
            <p className="font-black">Navigation</p>
            <div className="mt-3 space-y-2 text-sm font-semibold text-white/70">
              <p>Accueil</p>
              <p>Tarifs</p>
              <p>FAQ</p>
              <p>Contact</p>
            </div>
          </div>
          <div>
            <p className="font-black">Légal</p>
            <div className="mt-3 space-y-2 text-sm font-semibold text-white/70">
              <p>Conditions d’utilisation</p>
              <p>Confidentialité</p>
              <p>Remboursement</p>
            </div>
          </div>
          <div>
            <p className="font-black">Note importante</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
              Vemo Technology fournit un accompagnement administratif et documentaire.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
