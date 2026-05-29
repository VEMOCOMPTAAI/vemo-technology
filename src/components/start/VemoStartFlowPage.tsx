"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { VEMO_COUNTRIES, flagFromIso, type VemoCountry } from "@/lib/vemoCountries";

type Lang = "fr" | "en";
type PlanId = "" | "starter" | "standard" | "premium";
type PaymentMethod = "card" | "bank_transfer";

type Plan = {
  id: Exclude<PlanId, "">;
  label: string;
  subtitle: string;
  features: string[];
  recommended?: boolean;
};

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const plans: Plan[] = [
  {
    id: "starter",
    label: "Starter",
    subtitle: "Pour démarrer simplement votre dossier LLC.",
    features: [
      "Préparation du dossier LLC",
      "Documents de création LLC",
      "Registered Agent offert la première année",
      "Suivi administratif de base",
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
      "Suivi administratif renforcé",
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
      "Support prioritaire",
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
  "Autre activité",
];

const designators = ["LLC", "L.L.C.", "Limited Liability Company"];

const countryNamesFr: Record<string, string> = {
  MA: "Maroc",
  DZ: "Algérie",
  FR: "France",
  AE: "Émirats arabes unis",
  SA: "Arabie saoudite",
  US: "États-Unis",
  GB: "Royaume-Uni",
  ES: "Espagne",
  IT: "Italie",
  DE: "Allemagne",
  BE: "Belgique",
  NL: "Pays-Bas",
  PT: "Portugal",
  TR: "Turquie",
  TN: "Tunisie",
  EG: "Égypte",
  CA: "Canada",
  CN: "Chine",
  JP: "Japon",
  KR: "Corée du Sud",
  QA: "Qatar",
  KW: "Koweït",
  OM: "Oman",
  BH: "Bahreïn",
  JO: "Jordanie",
  LB: "Liban",
  SN: "Sénégal",
  CI: "Côte d’Ivoire",
  CM: "Cameroun",
  NG: "Nigeria",
};

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
    steps: ["État", "Formule", "Nom LLC", "Activité", "Compte", "Membres", "Adresse", "Services", "Résumé", "Paiement"],
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
    steps: ["State", "Package", "LLC name", "Activity", "Account", "Members", "Address", "Services", "Summary", "Payment"],
  },
};

function countryDisplayName(country: VemoCountry, lang: Lang = "fr") {
  if (lang === "fr") return countryNamesFr[country.iso] || country.name;
  return country.name;
}

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
  return prices[planId]?.[state] || 0;
}

function availableServices(planId: string, state: string) {
  if (planId === "starter") {
    return [
      "Préparation du dossier LLC",
      "Documents de création LLC",
      "Registered Agent offert la première année",
      "Suivi administratif de base",
    ];
  }

  if (planId === "standard") {
    return [
      state === "Wyoming"
        ? "Demande EIN — délai estimatif Wyoming : 3 à 7 jours ouvrables"
        : "Demande EIN — délai estimatif New Mexico : 10 à 30 jours ouvrables",
      "Operating Agreement",
      "Registered Agent offert la première année",
      "Suivi administratif renforcé",
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
    "Support prioritaire",
  ];
}

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
}

function phoneIsValid(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15;
}

function slugPlanToPlan(pack?: string | null): PlanId {
  const raw = String(pack || "").toLowerCase();
  if (raw.includes("premium")) return "premium";
  if (raw.includes("starter")) return "starter";
  if (raw.includes("standard")) return "standard";
  return "";
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
  lang = "fr",
}: {
  label: string;
  valueIso: string;
  onChange: (country: VemoCountry) => void;
  compact?: boolean;
  lang?: Lang;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = VEMO_COUNTRIES.find((c) => c.iso === valueIso) || VEMO_COUNTRIES.find((c) => c.iso === "MA")!;

  const filtered = VEMO_COUNTRIES.filter((country) => {
    const q = search.toLowerCase().trim();
    const fr = countryDisplayName(country, "fr").toLowerCase();
    const en = country.name.toLowerCase();

    if (!q) return true;

    return (
      fr.includes(q) ||
      en.includes(q) ||
      country.dial.includes(q) ||
      country.iso.toLowerCase().includes(q)
    );
  }).slice(0, 80);

  return (
    <div className="relative">
      {label ? <span className="mb-2 block text-sm font-black text-[#123A63]">{label}</span> : null}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-[54px] w-full rounded-[16px] border border-[#E1E7EF] bg-white px-4 text-left text-sm font-black text-[#123A63] outline-none transition hover:border-[#F15A24]/50"
      >
        {compact ? (
          <span className="flex items-center justify-center gap-2">
            <span>{flagFromIso(selected.iso)}</span>
            <span>{selected.dial}</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>{flagFromIso(selected.iso)}</span>
            <span className="truncate">{countryDisplayName(selected, lang)}</span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[320px] rounded-[18px] border border-[#E1E7EF] bg-white p-3 shadow-[0_22px_60px_rgba(18,58,99,.16)]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un pays ou indicatif..."
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
                  {flagFromIso(country.iso)} {countryDisplayName(country, lang)}
                </span>
                {compact ? <span className="ml-3 text-slate-400">{country.dial}</span> : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentCardElement({
  billingName,
  billingEmail,
  amount,
  dossierNumber,
}: {
  billingName: string;
  billingEmail: string;
  amount: number;
  dossierNumber: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(billingName || "");
  const [emailValue, setEmailValue] = useState(billingEmail || "");

  useEffect(() => {
    setName(billingName || "");
  }, [billingName]);

  useEffect(() => {
    setEmailValue(billingEmail || "");
  }, [billingEmail]);

  async function pay() {
    if (!stripe || !elements) {
      setError("Stripe n’est pas encore prêt.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Montant invalide. Merci de choisir une formule avant le paiement.");
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      setError("Le champ carte est introuvable.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const intentRes = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount,
          currency: "USD",
          email: emailValue,
          dossier_number: dossierNumber,
          billing_name: name
        })
      });

      const intent = await intentRes.json().catch(() => null);

      if (!intentRes.ok || intent?.ok === false || !intent?.clientSecret) {
        setError(intent?.error || "Impossible de préparer le paiement Stripe.");
        return;
      }

      const result = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name,
            email: emailValue
          }
        }
      });

      if (result.error) {
        setError(result.error.message || "Paiement refusé.");
        return;
      }

      window.location.href = `/fr/payment-success?email=${encodeURIComponent(emailValue)}`;
    } catch (e: any) {
      setError(e?.message || "Erreur paiement Stripe.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-[#E6EDF5] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
            Paiement par carte
          </p>
          <h3 className="mt-2 text-[30px] font-black tracking-[-0.05em] text-[#0F172A]">
            Paiement sécurisé
          </h3>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-7 text-slate-500">
            Saisissez vos informations de facturation et votre carte directement dans cette page.
          </p>
        </div>

        <div className="rounded-[18px] border border-[#E6EDF5] bg-white px-4 py-3 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Montant
          </p>
          <p className="mt-1 text-[32px] font-black tracking-[-0.06em] text-[#F15A24]">
            ${amount}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
            Nom de facturation
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom ou société"
            className="h-[56px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
            Email de facturation
          </span>
          <input
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder="facturation@domaine.com"
            className="h-[56px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24]"
          />
        </label>
      </div>

      <div className="mt-5 rounded-[22px] border border-[#E6EDF5] bg-white p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#E6EDF5] bg-white text-xl">
            💳
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
              Informations carte
            </p>
            <p className="text-sm font-bold text-[#123A63]">
              Visa, Mastercard, American Express...
            </p>
          </div>
        </div>

        <div className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-5">
          <CardElement
            options={{
              hidePostalCode: true,
              disableLink: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#123A63",
                  fontWeight: "600",
                  fontFamily: "Inter, system-ui, sans-serif",
                  "::placeholder": {
                    color: "#94A3B8"
                  }
                },
                invalid: {
                  color: "#DC2626"
                }
              }
            }}
          />
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={pay}
        disabled={busy || !stripe || !elements || !amount}
        className="mt-6 h-[58px] w-full rounded-[18px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Traitement du paiement..." : `Payer $${amount}`}
      </button>
    </div>
  );
}

export default function VemoStartFlowPage({ lang = "fr" }: { lang?: Lang }) {
  const t = content[lang];

  const [step, setStep] = useState(0);
  const [planId, setPlanId] = useState<PlanId>("");
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
  const [memberRole, setMemberRole] = useState("Membre et Manager");
  const [managerName, setManagerName] = useState("");

  const [address, setAddress] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [addressCountryIso, setAddressCountryIso] = useState("MA");

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [confirmSummary, setConfirmSummary] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [dossierNumber, setDossierNumber] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [autoStripeAttempted, setAutoStripeAttempted] = useState(false);
  const [bankProofFile, setBankProofFile] = useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = useMemo(() => plans.find((p) => p.id === planId) || null, [planId]);
  const selectedCountry = useMemo(() => VEMO_COUNTRIES.find((c) => c.iso === countryIso) || VEMO_COUNTRIES.find((c) => c.iso === "MA")!, [countryIso]);
  const phoneCountry = useMemo(() => VEMO_COUNTRIES.find((c) => c.iso === phoneCountryIso) || VEMO_COUNTRIES.find((c) => c.iso === "MA")!, [phoneCountryIso]);
  const memberCountry = useMemo(() => VEMO_COUNTRIES.find((c) => c.iso === memberCountryIso) || selectedCountry, [memberCountryIso, selectedCountry]);
  const addressCountry = useMemo(() => VEMO_COUNTRIES.find((c) => c.iso === addressCountryIso) || selectedCountry, [addressCountryIso, selectedCountry]);

  const services = selectedPlan ? availableServices(selectedPlan.id, state) : [];
  const finalPrice = selectedPlan ? getPlanPrice(selectedPlan.id, state) : null;
  const packName = selectedPlan ? `${state} ${selectedPlan.label}` : "";
  const progress = Math.round(((step + 1) / t.steps.length) * 100);
  const switchHref = lang === "fr" ? "/en/commencer" : "/fr/commencer";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qPack = params.get("pack");
    const qState = params.get("state");
    const qEmail = params.get("email");
    const qName = params.get("name");
    const qLlc = params.get("llc");

    if (qPack) {
      setPlanId(slugPlanToPlan(qPack));
      setPackId(qPack);
    }

    if (qState?.toLowerCase().includes("wyoming")) setState("Wyoming");
    if (qState?.toLowerCase().includes("new")) setState("New Mexico");

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
    setMemberCountryIso(countryIso);
    setAddressCountryIso(countryIso);
  }, [countryIso]);

  useEffect(() => {
    setSelectedServices([]);
  }, [planId, state]);

  useEffect(() => {
    if (memberRole === "Membre et Manager") {
      setManagerName(memberName);
    }
  }, [memberRole, memberName]);
  useEffect(() => {
    // AUTO_REDIRECT_PAYMENT_WITHOUT_PLAN
    if (step === 9 && (!selectedPlan || !finalPrice)) {
      setStep(1);
    }
  }, [step, selectedPlan, finalPrice]);

  function handlePhoneChange(value: string) {
    const country = findCountryByDial(value);

    if (country) {
      setPhoneCountryIso(country.iso);
      setPhone(value.replace(country.dial, "").replace(/^\s+/, ""));
      return;
    }

    setPhone(value);
  }

  function toggleService(service: string) {
    setSelectedServices((prev) => {
      if (prev.includes(service)) return prev.filter((item) => item !== service);
      return [...prev, service];
    });
  }

  function canContinue() {
    if (step === 1 && !selectedPlan) return false;
    if (step === 2 && !llcName.trim()) return false;
    if (step === 3 && (!activitySector.trim() || !activityDescription.trim())) return false;
    if (step === 4 && (!fullName.trim() || !emailIsValid(email) || !phoneIsValid(phone))) return false;
    if (step === 5 && (!memberName.trim() || !memberRole.trim())) return false;
    if (step === 5 && memberRole === "Membre" && !managerName.trim()) return false;
    if (step === 6 && (!address.trim() || !addressCity.trim() || !addressCountryIso.trim())) return false;
    if (step === 7 && selectedServices.length === 0) return false;
    if (step === 8 && !confirmSummary) return false;
    return true;
  }

  async function createOrder(method: PaymentMethod) {
    if (!selectedPlan || !finalPrice) {
      throw new Error("Merci de choisir une formule.");
    }

    const manager = memberRole === "Membre" ? managerName : memberName;

    const res = await fetch("/api/orders/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lang,
        full_name: fullName,
        email,
        phone: `${phoneCountry.dial} ${phone}`.trim(),
        phone_country: countryDisplayName(phoneCountry, lang),
        country: countryDisplayName(selectedCountry, lang),
        llc_name: `${llcName} ${designator}`.trim(),
        llc_name_raw: llcName,
        llc_designator: designator,
        llc_alternative_name: alternativeName,
        state,
        package_name: packName,
        pack_id: packId || `${state.toLowerCase().replace(/\s+/g, "_")}_${selectedPlan.id}`,
        amount: finalPrice,
        currency: "USD",
        payment_method: method,
        activity_sector: activitySector,
        activity_description: activityDescription,
        member_name: memberName,
        member_country: countryDisplayName(memberCountry, lang),
        member_role: memberRole,
        manager_name: manager,
        address,
        address_city: addressCity,
        address_postal_code: addressPostalCode,
        address_country: countryDisplayName(addressCountry, lang),
        services: selectedServices,
        summary_confirmed: confirmSummary,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.ok === false) {
      throw new Error(data?.error || "Erreur création dossier.");
    }

    setDossierNumber(data?.dossier_number || "");
    return data;
  }

  async function prepareStripePayment() {
    setError("");
    setBusy(true);

    try {
      const order = dossierNumber ? { dossier_number: dossierNumber } : await createOrder("card");

      const intentRes = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalPrice,
          currency: "USD",
          email,
          dossier_number: order.dossier_number || dossierNumber,
        }),
      });

      const intent = await intentRes.json().catch(() => null);

      if (!intentRes.ok || intent?.ok === false || !intent?.clientSecret) {
        setError(intent?.error || "Impossible de préparer le paiement Stripe.");
        return;
      }

      setClientSecret(intent.clientSecret);
    } catch (e: any) {
      setError(e?.message || "Erreur préparation paiement.");
    } finally {
      setBusy(false);
    }
  }

  async function submitBankTransfer() {
    setError("");

    if (!bankProofFile) {
      setError("Merci d’uploader le justificatif de virement.");
      return;
    }

    setBusy(true);

    try {
      const order = dossierNumber ? { dossier_number: dossierNumber } : await createOrder("bank_transfer");

      const form = new FormData();
      form.append("email", email);
      form.append("dossier_number", order.dossier_number || dossierNumber);
      form.append("file", bankProofFile);

      const res = await fetch("/api/orders/bank-transfer-proof", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setError(data?.error || "Erreur upload justificatif.");
        return;
      }

      window.location.href = `/fr/payment-pending-verification?email=${encodeURIComponent(email)}`;
    } catch (e: any) {
      setError(e?.message || "Erreur virement.");
    } finally {
      setBusy(false);
    }
  }

  function next() {
    setError("");

    if (!canContinue()) {
      if (step === 4) setError("Merci de vérifier le nom complet, l’email et le numéro de téléphone.");
      else if (step === 7) setError("Merci de sélectionner au moins un service inclus.");
      else if (step === 8) setError("Merci de confirmer les informations avant le paiement.");
      else setError("Merci de compléter cette étape avant de continuer.");
      return;
    }

    if (step < 9) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
                LLC US POUR NON-RÉSIDENTS
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
                className={`min-h-[76px] rounded-[14px] border p-3 text-left transition ${
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
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Choisissez l’État de création</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  L’État doit être choisi avant la formule, car les prix et les délais peuvent changer.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {["New Mexico", "Wyoming"].map((s) => {
                    const selected = state === s;

                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setState(s)}
                        className={`relative min-h-[220px] rounded-[1.8rem] border bg-white p-6 text-left transition ${
                          selected
                            ? "border-[#F15A24] shadow-[0_20px_48px_rgba(18,58,99,.10)]"
                            : "border-[#E3EAF2] shadow-[0_12px_28px_rgba(18,58,99,.04)] hover:border-[#F15A24]/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                              État de création
                            </p>
                            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#123A63]">
                              {s}
                            </h3>
                          </div>

                          <div className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                            selected ? "border-[#F15A24] bg-[#F15A24] text-white" : "border-[#D6E0EA] bg-white text-transparent"
                          }`}>
                            ✓
                          </div>
                        </div>

                        <p className="mt-4 text-sm font-bold leading-7 text-slate-500">
                          {s === "New Mexico"
                            ? "Confidentialité, coût optimisé et structure simple pour les entrepreneurs non-résidents."
                            : "État reconnu, image corporate plus forte et traitement généralement plus rapide."}
                        </p>

                        <div className="mt-5 rounded-[1.1rem] border border-[#E3EAF2] bg-[#F8FAFC] px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                              Renouvellement Registered Agent
                            </span>
                            <span className="text-sm font-black text-[#123A63]">{renewal}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
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
                      className={`relative flex min-h-[410px] flex-col rounded-[1.6rem] border p-6 text-left transition ${
                        planId === plan.id
                          ? "border-[#F15A24] bg-white shadow-[0_18px_40px_rgba(18,58,99,.08)]"
                          : "border-[#E3EAF2] bg-white hover:border-[#F15A24]/40"
                      }`}
                    >
                      {plan.recommended && (
                        <div className="mb-5 flex items-center justify-start">
                          <span className="inline-flex h-[34px] items-center justify-center rounded-full border border-[#F15A24] bg-white px-4 text-[11px] font-black uppercase tracking-[0.08em] text-[#F15A24] shadow-none">
                            {t.recommended}
                          </span>
                        </div>
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

                      <p className="mt-5 min-h-[82px] text-sm font-bold leading-7 text-slate-500">{plan.subtitle}</p>

                      <ul className="mt-5 flex-1 space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="text-xs font-black text-[#123A63]">✓ {feature}</li>
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
                      {designators.map((item) => <option key={item} value={item}>{item}</option>)}
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
                      {activitySectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Description de l’activité</span>
                    <textarea value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} className={textareaClass()} placeholder="Ex : consulting en ligne, services digitaux, logiciel, e-commerce..." />
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
                    <input
                      value={fullName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFullName(value);
                        setMemberName(value);
                        if (memberRole !== "Membre") setManagerName(value);
                      }}
                      className={inputClass()}
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass()} ${email && !emailIsValid(email) ? "border-red-300" : ""}`} />
                    {email && !emailIsValid(email) ? <p className="mt-2 text-xs font-black text-red-600">Email invalide.</p> : null}
                  </label>

                  <CountryPicker label="Pays de résidence" valueIso={countryIso} onChange={(country) => setCountryIso(country.iso)} lang={lang} />

                  <div>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Téléphone / WhatsApp</span>
                    <div className="grid grid-cols-[118px_1fr] gap-3">
                      <CountryPicker label="" valueIso={phoneCountryIso} onChange={(country) => setPhoneCountryIso(country.iso)} compact lang={lang} />
                      <input value={phone} onChange={(e) => handlePhoneChange(e.target.value)} className={`${inputClass()} ${phone && !phoneIsValid(phone) ? "border-red-300" : ""}`} placeholder="651980076" />
                    </div>
                    {phone && !phoneIsValid(phone) ? <p className="mt-2 text-xs font-black text-red-600">Numéro invalide.</p> : null}
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
                    <input value={memberName} onChange={(e) => setMemberName(e.target.value)} className={inputClass()} placeholder="Nom complet" />
                  </label>

                  <CountryPicker label="Pays" valueIso={memberCountryIso} onChange={(country) => setMemberCountryIso(country.iso)} lang={lang} />

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Rôle</span>
                    <select value={memberRole} onChange={(e) => setMemberRole(e.target.value)} className={inputClass()}>
                      <option value="Membre">Membre</option>
                      <option value="Manager">Manager</option>
                      <option value="Membre et Manager">Membre et Manager</option>
                    </select>
                  </label>

                  {memberRole === "Membre" ? (
                    <label className="md:col-span-3">
                      <span className="mb-2 block text-sm font-black text-[#123A63]">Manager</span>
                      <input value={managerName} onChange={(e) => setManagerName(e.target.value)} className={inputClass()} placeholder="Nom du manager" />
                    </label>
                  ) : null}
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
                    <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass()} placeholder="Adresse complète" />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Ville</span>
                    <input value={addressCity} onChange={(e) => setAddressCity(e.target.value)} className={inputClass()} />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-[#123A63]">Code postal</span>
                    <input value={addressPostalCode} onChange={(e) => setAddressPostalCode(e.target.value)} className={inputClass()} />
                  </label>

                  <CountryPicker label="Pays" valueIso={addressCountryIso} onChange={(country) => setAddressCountryIso(country.iso)} lang={lang} />
                </div>
              </>
            )}

            {step === 7 && (
              <>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Services inclus</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Sélectionnez les services dont vous avez besoin parmi ceux disponibles dans le pack choisi : {selectedPlan?.label || "—"}.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {services.length === 0 ? (
                    <div className="md:col-span-2 rounded-[1.3rem] border border-[#E3EAF2] bg-[#F8FAFC] p-5 text-sm font-black text-slate-500">
                      Choisissez d’abord une formule pour afficher les services disponibles.
                    </div>
                  ) : services.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`flex min-h-[70px] items-center gap-3 rounded-[1.3rem] border bg-white p-4 text-left text-sm font-black text-[#123A63] transition ${
                        selectedServices.includes(service)
                          ? "border-[#E3EAF2] shadow-[0_12px_28px_rgba(18,58,99,.06)]"
                          : "border-[#E3EAF2] hover:border-[#F15A24]/40"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
                          selectedServices.includes(service)
                            ? "border-[#F15A24] bg-white text-[#F15A24]"
                            : "border-[#D6E0EA] bg-[#F8FAFC] text-slate-400"
                        }`}
                      >
                        {selectedServices.includes(service) ? "✓" : "+"}
                      </span>
                      <span>{service}</span>
                    </button>
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
                    ["Formule", selectedPlan?.label || "—"],
                    ["Nom LLC", `${llcName} ${designator}`.trim()],
                    ["Nom alternatif", alternativeName],
                    ["Secteur", activitySector],
                    ["Activité", activityDescription],
                    ["Client", fullName],
                    ["Email", email],
                    ["Pays du client", countryDisplayName(selectedCountry, lang)],
                    ["Téléphone", `${phoneCountry.dial} ${phone}`],
                    ["Membre principal", memberName],
                    ["Pays du membre", countryDisplayName(memberCountry, lang)],
                    ["Rôle", memberRole],
                    ["Manager", memberRole === "Membre" ? managerName : memberName],
                    ["Adresse", address],
                    ["Ville", addressCity],
                    ["Code postal", addressPostalCode],
                    ["Pays adresse", countryDisplayName(addressCountry, lang)],
                    ["Services sélectionnés", selectedServices.length ? selectedServices.join(", ") : "—"],
                  ].map(([key, value]) => (
                    <div key={key} className="rounded-[1.2rem] border border-[#E3EAF2] bg-[#F8FAFC] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{key}</p>
                      <p className="mt-2 text-sm font-black text-[#123A63]">{value || "—"}</p>
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
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
                      Étape 10
                    </p>
                    <h1 className="mt-2 text-[42px] font-black tracking-[-0.06em] text-[#0F172A]">
                      Paiement sécurisé
                    </h1>
                    <p className="mt-4 max-w-2xl text-[15px] font-semibold leading-8 text-slate-500">
                      Finalisez votre dossier en choisissant votre mode de paiement.
                      La carte bancaire est sélectionnée par défaut.
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#E6EDF5] bg-white px-5 py-4 text-right shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Total
                    </p>
                    <p className="mt-1 text-[38px] font-black tracking-[-0.06em] text-[#F15A24]">
                      ${finalPrice || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-[32px] border border-[#E6EDF5] bg-white p-7 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Nom de facturation
                      </span>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nom ou société"
                        className="h-[56px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Email de facturation
                      </span>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="facturation@domaine.com"
                        className="h-[56px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24]"
                      />
                    </label>
                  </div>

                  <div className="mt-6">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Méthode de paiement
                    </span>

                    <select
                      value={paymentMethod}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value as PaymentMethod);
                        setClientSecret("");
                      }}
                      className="h-[56px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none transition focus:border-[#F15A24]"
                    >
                      <option value="card">Carte bancaire</option>
                      <option value="bank_transfer">Virement bancaire</option>
                    </select>
                  </div>

                  <div className="mt-6">
                    {paymentMethod === "card" ? (
                      !stripePromise ? (
                        <div className="rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-bold text-amber-800">
                          Stripe n’est pas configuré : ajoute NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY et STRIPE_SECRET_KEY dans .env.local.
                        </div>
                      ) : (
                        <Elements stripe={stripePromise}>
                          <PaymentCardElement
                            billingName={fullName}
                            billingEmail={email}
                            amount={finalPrice || 0}
                            dossierNumber={dossierNumber}
                          />
                        </Elements>
                      )
                    ) : (
                      <div className="rounded-[28px] border border-[#E6EDF5] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
                              Paiement par virement
                            </p>
                            <h3 className="mt-2 text-[30px] font-black tracking-[-0.05em] text-[#0F172A]">
                              Envoi du justificatif
                            </h3>
                            <p className="mt-2 max-w-xl text-sm font-semibold leading-7 text-slate-500">
                              Contactez VEMO sur WhatsApp puis ajoutez le justificatif.
                              Votre dossier passera ensuite en attente de vérification.
                            </p>
                          </div>

                          <a
                            href="https://wa.me/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-[52px] min-w-[170px] items-center justify-center rounded-[16px] border border-[#F15A24] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
                          >
                            WhatsApp
                          </a>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-[18px] border border-[#E6EDF5] bg-white p-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                              Étape 01
                            </p>
                            <p className="mt-2 text-sm font-black text-[#123A63]">
                              Contacter VEMO
                            </p>
                          </div>

                          <div className="rounded-[18px] border border-[#E6EDF5] bg-white p-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                              Étape 02
                            </p>
                            <p className="mt-2 text-sm font-black text-[#123A63]">
                              Uploader le justificatif
                            </p>
                          </div>

                          <div className="rounded-[18px] border border-[#E6EDF5] bg-white p-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                              Étape 03
                            </p>
                            <p className="mt-2 text-sm font-black text-[#123A63]">
                              Vérification admin
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <input
                            type="file"
                            onChange={(e) => setBankProofFile(e.target.files?.[0] || null)}
                            className="block w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold text-[#123A63]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={submitBankTransfer}
                          disabled={busy}
                          className="mt-5 h-[58px] w-full rounded-[18px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {busy ? "Envoi du justificatif..." : "Uploader le justificatif et continuer →"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {error ? (
              <div className="mt-6 rounded-[16px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between border-t border-[#E3EAF2] pt-6">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="rounded-[12px] border border-[#E3EAF2] bg-[#F8FAFC] px-6 py-3 text-sm font-black text-[#123A63] disabled:opacity-40"
              >
                {t.back}
              </button>

              {step < 9 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-[12px] bg-[#F15A24] px-8 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(18,58,99,.12)] hover:bg-[#D94A1B]"
                >
                  {t.next} →
                </button>
              ) : null}
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
                ["Accompagnement", selectedPlan?.label || "À choisir", selectedPlan ? `$${finalPrice}` : "—"],
                ["Services", selectedServices.length ? `${selectedServices.length} sélectionné(s)` : selectedPlan ? "À sélectionner" : "À choisir", "$0"],
              ].map(([key, value, price]) => (
                <div key={key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-[#111827]">{key}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{value}</p>
                  </div>
                  <p className="text-sm font-black text-[#111827]">{price}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.4rem] border border-[#F15A24] bg-white p-5">
              <div className="flex items-end justify-between gap-4">
                <p className="text-lg font-black text-[#111827]">{t.estimated}</p>
                {selectedPlan ? (
                  <p className="text-4xl font-black tracking-[-0.08em] text-[#F15A24]">${finalPrice}</p>
                ) : (
                  <p className="text-sm font-black text-slate-400">Après choix de formule</p>
                )}
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
