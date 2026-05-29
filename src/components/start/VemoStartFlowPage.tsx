"use client";

import { useEffect, useMemo, useState } from "react";
import { VEMO_COUNTRIES, flagFromIso, type VemoCountry } from "@/lib/vemoCountries";

type Lang = "fr" | "en";
type PaymentMethod = "card" | "bank_transfer";

type Plan = {
  id: "starter" | "standard" | "premium";
  label: string;
  subtitle: string;
  features: string[];
  recommended?: boolean;
};

const plans: Plan[] = [
  {
    id: "starter",
    label: "Starter",
    subtitle: "Pour démarrer simplement votre dossier LLC.",
    features: [
      "Préparation du dossier LLC",
      "Documents de création LLC",
      "Registered Agent offert la première année",
      "Suivi administratif de base"
    ],
  },
  {
    id: "standard",
    label: "Standard",
    subtitle: "La formule recommandée pour la plupart des non-résidents.",
    features: [
      "Tout le Pack Starter",
      "Demande EIN",
      "Operating Agreement",
      "Registered Agent offert la première année",
      "Suivi administratif renforcé"
    ],
    recommended: true,
  },
  {
    id: "premium",
    label: "Premium",
    subtitle: "Accompagnement complet avec préparation bancaire, paiements et fiscalité.",
    features: [
      "Tout le Pack Standard",
      "Préparation Stripe, PayPal, Wise, Mercury ou Payoneer",
      "Form 5472 + Form 1120 offerts la première année",
      "Registered Agent offert la première année",
      "Support prioritaire"
    ],
  },
];

const activitySectors = [
  "E-commerce",
  "Services digitaux",
  "Consulting / Business services",
  "Software / SaaS",
  "Marketing / Advertising",
  "Formation / Coaching",
  "Import / Export",
  "Holding / Investment",
  "Travel / Tourism",
  "Autre activité"
];

const designators = ["LLC", "L.L.C.", "Limited Liability Company"];

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
    recommended: "Recommandé",
    steps: [
      "État",
      "Formule",
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
    recommended: "Recommended",
    steps: [
      "State",
      "Package",
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

function getPlanPrice(planId: string, state: string) {
  const prices: Record<string, Record<string, number>> = {
    starter: { "New Mexico": 129, Wyoming: 179 },
    standard: { "New Mexico": 149, Wyoming: 199 },
    premium: { "New Mexico": 199, Wyoming: 249 },
  };

  return prices[planId]?.[state] || prices.standard["New Mexico"];
}

function availableServices(planId: string, state: string) {
  if (planId === "starter") {
    return [
      "Préparation du dossier LLC",
      "Documents de création LLC",
      "Registered Agent offert la première année",
      "Suivi administratif de base"
    ];
  }

  if (planId === "standard") {
    return [
      state === "Wyoming"
        ? "Demande EIN — délai estimatif Wyoming : 3 à 7 jours ouvrables"
        : "Demande EIN — délai estimatif New Mexico : 10 à 30 jours ouvrables",
      "Operating Agreement",
      "Registered Agent offert la première année",
      "Suivi administratif renforcé"
    ];
  }

  return [
    state === "Wyoming"
      ? "Demande EIN — délai estimatif Wyoming : 3 à 7 jours ouvrables"
      : "Demande EIN — délai estimatif New Mexico : 10 à 30 jours ouvrables",
    "Operating Agreement",
    "Préparation Stripe, PayPal, Wise, Mercury ou Payoneer",
    "Form 5472 + Form 1120 offerts la première année",
    "Registered Agent offert la première année",
    "Support prioritaire"
  ];
}

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
}

function phoneIsValid(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15;
}

function slugPlanToPlan(pack?: string | null, amount?: string | null) {
  const raw = String(pack || "").toLowerCase();
  if (raw.includes("premium")) return "premium";
  if (raw.includes("starter")) return "starter";
  return "standard";
}

function findCountryByDial(value: string) {
  const cleaned = value.trim();
  return [...VEMO_COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((country) => cleaned.startsWith(country.dial));
}

function CountryPicker({
  label,
  valueIso,
  onChange,
  compact = false,
}: {
  label: string;
  valueIso: string;
  onChange: (country: VemoCountry) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = VEMO_COUNTRIES.find((c) => c.iso === valueIso) || VEMO_COUNTRIES.find((c) => c.iso === "MA")!;

  const filtered = VEMO_COUNTRIES.filter((country) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      country.name.toLowerCase().includes(q) ||
      country.dial.includes(q) ||
      country.iso.toLowerCase().includes(q)
    );
  }).slice(0, 80);

  return (
    <div className="relative">
      <span className="mb-2 block text-sm font-black text-[#123A63]">{label}</span>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`h-[54px] w-full rounded-[16px] border border-[#E1E7EF] bg-white px-4 text-left text-sm font-black text-[#123A63] outline-none transition hover:border-[#F15A24]/50 ${
          compact ? "min-w-[124px]" : ""
        }`}
      >
        {compact ? (
          <span className="flex items-center gap-2">
            <span>{flagFromIso(selected.iso)}</span>
            <span>{selected.dial}</span>
          </span>
        ) : (
          <span className="flex items-center justify-between gap-3">
            <span className="truncate">
              {flagFromIso(selected.iso)} {selected.name}
            </span>
            <span className="text-slate-400">{selected.dial}</span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[320px] rounded-[18px] border border-[#E1E7EF] bg-white p-3 shadow-[0_22px_60px_rgba(18,58,99,.16)]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher pays ou indicatif..."
            className="h-11 w-full rounded-[13px] border border-[#E1E7EF] bg-[#F8FAFC] px-3 text-sm font-bold outline-none focus:border-[#F15A24]"
          />

          <div className="mt-3 max-h-[250px] overflow-auto">
            {filtered.map((country) => (
              <button
                key={`${country.iso}-${country.dial}`}
                type="button"
                onClick={() => {
                  onChange(country);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center justify-between rounded-[12px] px-3 py-2 text-left text-sm font-black text-[#123A63] hover:bg-[#F8FAFC]"
              >
                <span className="truncate">
                  {flagFromIso(country.iso)} {country.name}
                </span>
                <span className="ml-3 text-slate-400">{country.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VemoStartFlowPage({ lang = "fr" }: { lang?: Lang }) {
  const t = content[lang];

  const [step, setStep] = useState(0);
  const [planId, setPlanId] = useState<"starter" | "standard" | "premium">("standard");
  const [state, setState] = useState("New Mexico");
  const [packId, setPackId] = useState("");

  const [llcName, setLlcName] = useState("");
  const [designator, setDesignator] = useState("LLC");
  const [alternativeName, setAlternativeName] = useState("");

  const [activitySector, setActivitySector] = useState(activitySectors[0]);
  const [activityDescription, setActivityDescription] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [countryIso, setCountryIso] = useState("MA");
  const [phoneCountryIso, setPhoneCountryIso] = useState("MA");
  const [phone, setPhone] = useState("");

  const [memberName, setMemberName] = useState("");
  const [memberCountryIso, setMemberCountryIso] = useState("MA");
  const [memberRole, setMemberRole] = useState("Membre");
  const [managerName, setManagerName] = useState("");
  const [address, setAddress] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [addressCountryIso, setAddressCountryIso] = useState("MA");
  const [confirmSummary, setConfirmSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === planId) || plans[1];
  }, [planId]);

  const selectedCountry = useMemo(() => {
    return VEMO_COUNTRIES.find((c) => c.iso === countryIso) || VEMO_COUNTRIES.find((c) => c.iso === "MA")!;
  }, [countryIso]);

  const phoneCountry = useMemo(() => {
    return VEMO_COUNTRIES.find((c) => c.iso === phoneCountryIso) || VEMO_COUNTRIES.find((c) => c.iso === "MA")!;
  }, [phoneCountryIso]);

  const memberCountry = useMemo(() => {
    return VEMO_COUNTRIES.find((c) => c.iso === memberCountryIso) || selectedCountry;
  }, [memberCountryIso, selectedCountry]);

  const addressCountry = useMemo(() => {
    return VEMO_COUNTRIES.find((c) => c.iso === addressCountryIso) || selectedCountry;
  }, [addressCountryIso, selectedCountry]);

  const finalPrice = useMemo(() => {
    return getPlanPrice(selectedPlan.id, state);
  }, [selectedPlan, state]);

  const packName = `${state} ${selectedPlan.label}`;
  const services = availableServices(selectedPlan.id, state);
  const progress = Math.round(((step + 1) / t.steps.length) * 100);
  const switchHref = lang === "fr" ? "/en/commencer" : "/fr/commencer";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const qPack = params.get("pack");
    const qState = params.get("state");
    const qEmail = params.get("email");
    const qName = params.get("name");
    const qLlc = params.get("llc");

    setPlanId(slugPlanToPlan(qPack) as any);

    if (qState?.toLowerCase().includes("wyoming")) setState("Wyoming");
    if (qState?.toLowerCase().includes("new")) setState("New Mexico");

    if (qPack) setPackId(qPack);
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
    if (!memberCountryIso || memberCountryIso === "MA") setMemberCountryIso(countryIso);
    if (!addressCountryIso || addressCountryIso === "MA") setAddressCountryIso(countryIso);
  }, [countryIso]);

  function handlePhoneChange(value: string) {
    const country = findCountryByDial(value);

    if (country) {
      setPhoneCountryIso(country.iso);
      setPhone(value.replace(country.dial, "").replace(/^\s+/, ""));
      return;
    }

    setPhone(value);
  }

  function canContinue() {
    if (step === 2 && !llcName.trim()) return false;
    if (step === 3 && (!activitySector.trim() || !activityDescription.trim())) return false;
    if (step === 4 && (!fullName.trim() || !emailIsValid(email) || !phoneIsValid(phone))) return false;
    if (step === 5 && (!memberName.trim() || !managerName.trim() || !memberRole.trim())) return false;
    if (step === 6 && (!address.trim() || !addressCity.trim() || !addressCountryIso.trim())) return false;
    if (step === 8 && !confirmSummary) return false;
    return true;
  }

  async function submitFinal() {
    setError("");

    if (!fullName.trim() || !emailIsValid(email) || !llcName.trim() || !phoneIsValid(phone)) {
      setError(lang === "fr" ? "Merci de vérifier le nom, l’email, le téléphone et le nom LLC." : "Please check the name, email, phone and LLC name.");
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
          phone: `${phoneCountry.dial} ${phone}`.trim(),
          phone_country: phoneCountry.name,
          country: selectedCountry.name,
          llc_name: `${llcName} ${designator}`.trim(),
          llc_name_raw: llcName,
          llc_designator: designator,
          llc_alternative_name: alternativeName,
          state,
          package_name: packName,
          pack_id: packId || `${state.toLowerCase().replace(/\s+/g, "_")}_${selectedPlan.id}`,
          amount: finalPrice,
          currency: "USD",
          payment_method: paymentMethod,
          activity_sector: activitySector,
          activity_description: activityDescription,
          member_name: memberName,
          member_country: memberCountry.name,
          member_role: memberRole,
          manager_name: managerName,
          address,
          address_city: addressCity,
          address_postal_code: addressPostalCode,
          address_country: addressCountry.name,
          services,
          summary_confirmed: confirmSummary,
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
      if (step === 4) {
        setError("Merci de vérifier le nom complet, l’email et le numéro de téléphone.");
      } else {
        setError(lang === "fr" ? "Merci de compléter cette étape avant de continuer." : "Please complete this step before continuing.");
      }
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
              className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(18,58,99,.12)] hover:bg-[#D94A1B]"
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
                    ? "border-[#F15A24] bg-white text-[#F15A24]"
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
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Choisissez l’État LLC</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  L’État doit être choisi avant la formule, car les prix et les délais peuvent changer.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {["New Mexico", "Wyoming"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setState(s)}
                      className={`rounded-[1.6rem] border p-6 text-left transition ${
                        state === s ? "border-[#F15A24] bg-white" : "border-[#E3EAF2] bg-white hover:border-[#F15A24]/40"
                      }`}
                    >
                      <h3 className="text-2xl font-black text-[#123A63]">{s}</h3>
                      <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                        {s === "New Mexico"
                          ? "Confidentialité, coût optimisé et structure simple pour non-résidents."
                          : "État reconnu, image corporate plus forte et traitement généralement plus rapide."}
                      </p>
                      <div className="mt-5 rounded-full border border-[#F15A24] bg-white px-4 py-2 text-sm font-black text-[#F15A24]">
                        Frais de dépôt inclus
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Choisissez votre formule</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Les prix affichés sont adaptés à l’État sélectionné : {state}.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setPlanId(plan.id)}
                      className={`relative min-h-[300px] rounded-[1.6rem] border p-5 text-left transition ${
                        planId === plan.id
                          ? "border-[#F15A24] bg-white shadow-[0_18px_40px_rgba(18,58,99,.08)]"
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
                            ${getPlanPrice(plan.id, state)}
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

            {step === 2 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Nom souhaité de la LLC</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Ajoutez le nom souhaité, le designator et un nom alternatif en cas d’indisponibilité.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px]">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Nom souhaité</span>
                    <input value={llcName} onChange={(e) => setLlcName(e.target.value)} className={inputClass()} placeholder="Ex : Vemo Technology" />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Designator</span>
                    <select value={designator} onChange={(e) => setDesignator(e.target.value)} className={inputClass()}>
                      {designators.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>

                  <label className="md:col-span-2">
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Nom alternatif</span>
                    <input value={alternativeName} onChange={(e) => setAlternativeName(e.target.value)} className={inputClass()} placeholder="Ex : Vemo Global LLC" />
                  </label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Activité business</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Choisissez le secteur puis décrivez clairement l’activité prévue.
                </p>

                <div className="mt-6 grid gap-4">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Secteur d’activité</span>
                    <select value={activitySector} onChange={(e) => setActivitySector(e.target.value)} className={inputClass()}>
                      {activitySectors.map((sector) => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Description de l’activité</span>
                    <textarea
                      value={activityDescription}
                      onChange={(e) => setActivityDescription(e.target.value)}
                      className={textareaClass()}
                      placeholder="Ex : Online consulting, digital services, software, e-commerce, marketing services..."
                    />
                  </label>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Informations du compte</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Email et téléphone doivent être valides. Le Maroc est sélectionné par défaut.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Nom complet</span>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass()} />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass()} ${email && !emailIsValid(email) ? "border-red-300" : ""}`} />
                    {email && !emailIsValid(email) && (
                      <p className="mt-2 text-xs font-black text-red-600">Email invalide.</p>
                    )}
                  </label>

                  <CountryPicker
                    label="Pays de résidence"
                    valueIso={countryIso}
                    onChange={(country) => setCountryIso(country.iso)}
                  />

                  <div>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Téléphone / WhatsApp</span>
                    <div className="grid grid-cols-[132px_1fr] gap-3">
                      <CountryPicker
                        label=""
                        valueIso={phoneCountryIso}
                        onChange={(country) => setPhoneCountryIso(country.iso)}
                        compact
                      />
                      <input
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={`${inputClass()} ${phone && !phoneIsValid(phone) ? "border-red-300" : ""}`}
                        placeholder="651983600 ou +213..."
                      />
                    </div>
                    {phone && !phoneIsValid(phone) && (
                      <p className="mt-2 text-xs font-black text-red-600">Numéro invalide.</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Membre principal</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Renseignez les informations du propriétaire ou membre principal. Le nom du client est suggéré automatiquement.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_220px]">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Nom du membre</span>
                    <input
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className={inputClass()}
                      placeholder="Nom complet"
                    />
                  </label>

                  <CountryPicker
                    label="Pays"
                    valueIso={memberCountryIso}
                    onChange={(country) => setMemberCountryIso(country.iso)}
                  />

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Rôle</span>
                    <select
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      className={inputClass()}
                    >
                      <option value="Membre">Membre</option>
                      <option value="Manager">Manager</option>
                      <option value="Membre et Manager">Membre et Manager</option>
                    </select>
                  </label>

                  <label className="md:col-span-3">
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Manager</span>
                    <input
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className={inputClass()}
                      placeholder="Nom du manager"
                    />
                  </label>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Adresse du client</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Adresse utilisée pour le dossier et la facturation. Le pays est suggéré depuis les informations du propriétaire.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <label className="md:col-span-3">
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Adresse</span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={inputClass()}
                      placeholder="Adresse complète"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Ville</span>
                    <input
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      className={inputClass()}
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Code postal</span>
                    <input
                      value={addressPostalCode}
                      onChange={(e) => setAddressPostalCode(e.target.value)}
                      className={inputClass()}
                    />
                  </label>

                  <CountryPicker
                    label="Pays"
                    valueIso={addressCountryIso}
                    onChange={(country) => setAddressCountryIso(country.iso)}
                  />
                </div>
              </>
            )}

            {step === 7 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Services inclus</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Les services affichés correspondent uniquement au pack choisi : {selectedPlan.label}.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {services.map((service) => (
                    <div
                      key={service}
                      className="rounded-[1.3rem] border border-[#E3EAF2] bg-white p-4 text-left text-sm font-black text-[#123A63]"
                    >
                      ✓ {service}
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 8 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Résumé avant paiement</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Vérifiez les informations avant de continuer vers le paiement sécurisé.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["État", state],
                    ["Formule", selectedPlan.label],
                    ["Nom LLC", `${llcName} ${designator}`.trim()],
                    ["Nom alternatif", alternativeName],
                    ["Secteur", activitySector],
                    ["Activité", activityDescription],
                    ["Client", fullName],
                    ["Email", email],
                    ["Pays du client", selectedCountry.name],
                    ["Téléphone", `${phoneCountry.dial} ${phone}`],
                    ["Membre principal", memberName],
                    ["Pays du membre", memberCountry.name],
                    ["Rôle", memberRole],
                    ["Manager", managerName],
                    ["Adresse", address],
                    ["Ville", addressCity],
                    ["Code postal", addressPostalCode],
                    ["Pays adresse", addressCountry.name],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-[1.2rem] border border-[#E3EAF2] bg-[#F8FAFC] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{k}</p>
                      <p className="mt-2 text-sm font-black text-[#123A63]">{v || "—"}</p>
                    </div>
                  ))}
                </div>

                <label className="mt-6 flex gap-4 rounded-[1.5rem] border border-[#E3EAF2] bg-white p-5 text-sm font-black leading-7 text-[#123A63]">
                  <input
                    type="checkbox"
                    checked={confirmSummary}
                    onChange={(e) => setConfirmSummary(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#F15A24]"
                  />
                  <span>
                    Je confirme que les informations fournies sont correctes et j’accepte de continuer vers le paiement sécurisé.
                  </span>
                </label>
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
                      paymentMethod === "card" ? "border-[#F15A24] bg-white" : "border-[#E3EAF2] bg-white"
                    }`}
                  >
                    <div className="text-2xl font-black text-[#123A63]">💳 Credit card</div>
                    <p className="mt-3 text-sm font-bold text-slate-500">Paiement en ligne sécurisé.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`rounded-[1.5rem] border p-6 text-left transition ${
                      paymentMethod === "bank_transfer" ? "border-[#F15A24] bg-white" : "border-[#E3EAF2] bg-white"
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
                className="rounded-[12px] bg-[#F15A24] px-8 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(18,58,99,.12)] hover:bg-[#D94A1B] disabled:opacity-60"
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
                ["État", state, "Inclus"],
                ["Accompagnement", selectedPlan.label, `$${finalPrice}`],
                ["Services", `${services.length} inclus`, "$0"],
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

            <div className="mt-8 rounded-[1.4rem] border border-[#F15A24] bg-white p-5">
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
    </main>
  );
}
