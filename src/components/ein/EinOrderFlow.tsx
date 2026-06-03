"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

type Locale = "fr" | "en";

type Country = {
  code: string;
  nameFr: string;
  nameEn: string;
  dial: string;
};

const COUNTRIES: Country[] = [
  { code: "AF", nameFr: "Afghanistan", nameEn: "Afghanistan", dial: "+93" },
  { code: "AL", nameFr: "Albanie", nameEn: "Albania", dial: "+355" },
  { code: "DZ", nameFr: "Algérie", nameEn: "Algeria", dial: "+213" },
  { code: "AD", nameFr: "Andorre", nameEn: "Andorra", dial: "+376" },
  { code: "AO", nameFr: "Angola", nameEn: "Angola", dial: "+244" },
  { code: "AR", nameFr: "Argentine", nameEn: "Argentina", dial: "+54" },
  { code: "AM", nameFr: "Arménie", nameEn: "Armenia", dial: "+374" },
  { code: "AU", nameFr: "Australie", nameEn: "Australia", dial: "+61" },
  { code: "AT", nameFr: "Autriche", nameEn: "Austria", dial: "+43" },
  { code: "AZ", nameFr: "Azerbaïdjan", nameEn: "Azerbaijan", dial: "+994" },
  { code: "BH", nameFr: "Bahreïn", nameEn: "Bahrain", dial: "+973" },
  { code: "BD", nameFr: "Bangladesh", nameEn: "Bangladesh", dial: "+880" },
  { code: "BE", nameFr: "Belgique", nameEn: "Belgium", dial: "+32" },
  { code: "BJ", nameFr: "Bénin", nameEn: "Benin", dial: "+229" },
  { code: "BR", nameFr: "Brésil", nameEn: "Brazil", dial: "+55" },
  { code: "BG", nameFr: "Bulgarie", nameEn: "Bulgaria", dial: "+359" },
  { code: "BF", nameFr: "Burkina Faso", nameEn: "Burkina Faso", dial: "+226" },
  { code: "CM", nameFr: "Cameroun", nameEn: "Cameroon", dial: "+237" },
  { code: "CA", nameFr: "Canada", nameEn: "Canada", dial: "+1" },
  { code: "CL", nameFr: "Chili", nameEn: "Chile", dial: "+56" },
  { code: "CN", nameFr: "Chine", nameEn: "China", dial: "+86" },
  { code: "CO", nameFr: "Colombie", nameEn: "Colombia", dial: "+57" },
  { code: "CI", nameFr: "Côte d’Ivoire", nameEn: "Côte d’Ivoire", dial: "+225" },
  { code: "HR", nameFr: "Croatie", nameEn: "Croatia", dial: "+385" },
  { code: "DK", nameFr: "Danemark", nameEn: "Denmark", dial: "+45" },
  { code: "EG", nameFr: "Égypte", nameEn: "Egypt", dial: "+20" },
  { code: "AE", nameFr: "Émirats arabes unis", nameEn: "United Arab Emirates", dial: "+971" },
  { code: "EC", nameFr: "Équateur", nameEn: "Ecuador", dial: "+593" },
  { code: "ES", nameFr: "Espagne", nameEn: "Spain", dial: "+34" },
  { code: "EE", nameFr: "Estonie", nameEn: "Estonia", dial: "+372" },
  { code: "US", nameFr: "États-Unis", nameEn: "United States", dial: "+1" },
  { code: "FR", nameFr: "France", nameEn: "France", dial: "+33" },
  { code: "GA", nameFr: "Gabon", nameEn: "Gabon", dial: "+241" },
  { code: "DE", nameFr: "Allemagne", nameEn: "Germany", dial: "+49" },
  { code: "GH", nameFr: "Ghana", nameEn: "Ghana", dial: "+233" },
  { code: "GR", nameFr: "Grèce", nameEn: "Greece", dial: "+30" },
  { code: "GN", nameFr: "Guinée", nameEn: "Guinea", dial: "+224" },
  { code: "HK", nameFr: "Hong Kong", nameEn: "Hong Kong", dial: "+852" },
  { code: "IN", nameFr: "Inde", nameEn: "India", dial: "+91" },
  { code: "ID", nameFr: "Indonésie", nameEn: "Indonesia", dial: "+62" },
  { code: "IE", nameFr: "Irlande", nameEn: "Ireland", dial: "+353" },
  { code: "IT", nameFr: "Italie", nameEn: "Italy", dial: "+39" },
  { code: "JP", nameFr: "Japon", nameEn: "Japan", dial: "+81" },
  { code: "JO", nameFr: "Jordanie", nameEn: "Jordan", dial: "+962" },
  { code: "KE", nameFr: "Kenya", nameEn: "Kenya", dial: "+254" },
  { code: "KW", nameFr: "Koweït", nameEn: "Kuwait", dial: "+965" },
  { code: "LB", nameFr: "Liban", nameEn: "Lebanon", dial: "+961" },
  { code: "LU", nameFr: "Luxembourg", nameEn: "Luxembourg", dial: "+352" },
  { code: "MY", nameFr: "Malaisie", nameEn: "Malaysia", dial: "+60" },
  { code: "ML", nameFr: "Mali", nameEn: "Mali", dial: "+223" },
  { code: "MT", nameFr: "Malte", nameEn: "Malta", dial: "+356" },
  { code: "MA", nameFr: "Maroc", nameEn: "Morocco", dial: "+212" },
  { code: "MR", nameFr: "Mauritanie", nameEn: "Mauritania", dial: "+222" },
  { code: "MU", nameFr: "Maurice", nameEn: "Mauritius", dial: "+230" },
  { code: "MX", nameFr: "Mexique", nameEn: "Mexico", dial: "+52" },
  { code: "NL", nameFr: "Pays-Bas", nameEn: "Netherlands", dial: "+31" },
  { code: "NZ", nameFr: "Nouvelle-Zélande", nameEn: "New Zealand", dial: "+64" },
  { code: "NE", nameFr: "Niger", nameEn: "Niger", dial: "+227" },
  { code: "NG", nameFr: "Nigéria", nameEn: "Nigeria", dial: "+234" },
  { code: "NO", nameFr: "Norvège", nameEn: "Norway", dial: "+47" },
  { code: "OM", nameFr: "Oman", nameEn: "Oman", dial: "+968" },
  { code: "PK", nameFr: "Pakistan", nameEn: "Pakistan", dial: "+92" },
  { code: "PS", nameFr: "Palestine", nameEn: "Palestine", dial: "+970" },
  { code: "PE", nameFr: "Pérou", nameEn: "Peru", dial: "+51" },
  { code: "PH", nameFr: "Philippines", nameEn: "Philippines", dial: "+63" },
  { code: "PL", nameFr: "Pologne", nameEn: "Poland", dial: "+48" },
  { code: "PT", nameFr: "Portugal", nameEn: "Portugal", dial: "+351" },
  { code: "QA", nameFr: "Qatar", nameEn: "Qatar", dial: "+974" },
  { code: "RO", nameFr: "Roumanie", nameEn: "Romania", dial: "+40" },
  { code: "GB", nameFr: "Royaume-Uni", nameEn: "United Kingdom", dial: "+44" },
  { code: "SA", nameFr: "Arabie saoudite", nameEn: "Saudi Arabia", dial: "+966" },
  { code: "SN", nameFr: "Sénégal", nameEn: "Senegal", dial: "+221" },
  { code: "RS", nameFr: "Serbie", nameEn: "Serbia", dial: "+381" },
  { code: "SG", nameFr: "Singapour", nameEn: "Singapore", dial: "+65" },
  { code: "ZA", nameFr: "Afrique du Sud", nameEn: "South Africa", dial: "+27" },
  { code: "KR", nameFr: "Corée du Sud", nameEn: "South Korea", dial: "+82" },
  { code: "SE", nameFr: "Suède", nameEn: "Sweden", dial: "+46" },
  { code: "CH", nameFr: "Suisse", nameEn: "Switzerland", dial: "+41" },
  { code: "TH", nameFr: "Thaïlande", nameEn: "Thailand", dial: "+66" },
  { code: "TN", nameFr: "Tunisie", nameEn: "Tunisia", dial: "+216" },
  { code: "TR", nameFr: "Turquie", nameEn: "Turkey", dial: "+90" },
  { code: "UA", nameFr: "Ukraine", nameEn: "Ukraine", dial: "+380" },
  { code: "UY", nameFr: "Uruguay", nameEn: "Uruguay", dial: "+598" },
  { code: "VN", nameFr: "Vietnam", nameEn: "Vietnam", dial: "+84" },
];

function flagEmoji(region: string) {
  return region
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const copy = {
  fr: {
    title: "Commander votre EIN en 4 étapes",
    subtitle: "Un tunnel dédié EIN, séparé de la création LLC complète, avec validation des champs avant chaque étape.",
    steps: ["Contact", "Société LLC", "Propriétaire", "Validation"],
    next: "Continuer",
    prev: "Retour",
    pay: "Continuer vers paiement",
    required: "Champ obligatoire",
    search: "Rechercher un pays ou indicatif...",
    fullName: "Nom complet",
    email: "Email",
    phoneCode: "Indicatif",
    phone: "Téléphone / WhatsApp",
    residenceCountry: "Pays de résidence",
    companyName: "Nom de la LLC",
    formationState: "État de création",
    llcAddress: "Adresse complète de la LLC",
    llcAddress2: "Complément adresse LLC",
    llcCity: "Ville LLC",
    llcZip: "Code postal LLC",
    llcCountry: "Pays LLC",
    ownerAddress: "Adresse complète du propriétaire",
    ownerAddress2: "Complément adresse propriétaire",
    ownerCity: "Ville propriétaire",
    ownerZip: "Code postal propriétaire",
    ownerCountry: "Pays propriétaire",
    activity: "Activité de la société",
    notes: "Message ou précision",
    summary: "Résumé de la demande EIN",
    paymentNotice: "Après validation, vous serez dirigé vers la page de paiement sécurisée : Stripe ou virement.",
  },
  en: {
    title: "Order your EIN in 4 steps",
    subtitle: "A dedicated EIN flow, separated from full LLC formation, with required-field validation before each step.",
    steps: ["Contact", "LLC company", "Owner", "Review"],
    next: "Continue",
    prev: "Back",
    pay: "Continue to payment",
    required: "Required field",
    search: "Search country or dial code...",
    fullName: "Full name",
    email: "Email",
    phoneCode: "Dial code",
    phone: "Phone / WhatsApp",
    residenceCountry: "Country of residence",
    companyName: "LLC name",
    formationState: "State of formation",
    llcAddress: "Full LLC address",
    llcAddress2: "LLC address line 2",
    llcCity: "LLC city",
    llcZip: "LLC ZIP code",
    llcCountry: "LLC country",
    ownerAddress: "Full owner address",
    ownerAddress2: "Owner address line 2",
    ownerCity: "Owner city",
    ownerZip: "Owner ZIP code",
    ownerCountry: "Owner country",
    activity: "Business activity",
    notes: "Message or details",
    summary: "EIN request summary",
    paymentNotice: "After review, you will be redirected to the secure payment page: Stripe or bank transfer.",
  },
};

type FormState = {
  fullName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  residenceCountry: string;
  companyName: string;
  formationState: string;
  llcAddress: string;
  llcAddress2: string;
  llcCity: string;
  llcZip: string;
  ownerAddress: string;
  ownerAddress2: string;
  ownerCity: string;
  ownerZip: string;
  ownerCountry: string;
  activity: string;
  notes: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phoneCountry: "MA",
  phone: "",
  residenceCountry: "MA",
  companyName: "",
  formationState: "",
  llcAddress: "",
  llcAddress2: "",
  llcCity: "",
  llcZip: "",
  ownerAddress: "",
  ownerAddress2: "",
  ownerCity: "",
  ownerZip: "",
  ownerCountry: "MA",
  activity: "",
  notes: "",
};

const requiredByStep: Record<number, (keyof FormState)[]> = {
  0: ["fullName", "email", "phone", "residenceCountry"],
  1: ["companyName", "formationState", "llcAddress", "llcCity", "llcZip"],
  2: ["ownerAddress", "ownerCity", "ownerZip", "ownerCountry", "activity"],
  3: [],
};

function getCountryName(country: Country, locale: Locale) {
  return locale === "fr" ? country.nameFr : country.nameEn;
}

function CountrySearchSelect({
  locale,
  value,
  onChange,
  showDial = false,
  error = false,
}: {
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
  showDial?: boolean;
  error?: boolean;
}) {
  const t = copy[locale];
  const [query, setQuery] = useState("");
  const selected = COUNTRIES.find((country) => country.code === value) || COUNTRIES.find((country) => country.code === "MA")!;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((country) => {
      const name = getCountryName(country, locale).toLowerCase();
      return name.includes(q) || country.code.toLowerCase().includes(q) || country.dial.includes(q);
    });
  }, [query, locale]);

  return (
    <div className="rounded-[16px] border border-[#E6EDF5] bg-white p-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`${flagEmoji(selected.code)} ${getCountryName(selected, locale)}${showDial ? ` ${selected.dial}` : ""}`}
        className={[
          "w-full rounded-[12px] border bg-white px-3 py-3 text-sm font-bold outline-none",
          error ? "border-red-300" : "border-[#E6EDF5]",
        ].join(" ")}
      />

      <div className="mt-2 max-h-48 overflow-auto rounded-[12px] border border-[#E6EDF5]">
        {filtered.map((country) => (
          <button
            key={country.code}
            type="button"
            onClick={() => {
              onChange(country.code);
              setQuery("");
            }}
            className={[
              "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-bold hover:bg-[#F8FAFC]",
              country.code === value ? "text-[#F15A24]" : "text-[#123A63]",
            ].join(" ")}
          >
            <span>
              {flagEmoji(country.code)} {getCountryName(country, locale)}
            </span>
            {showDial ? <span className="text-slate-400">{country.dial}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      {children}
      {error ? <span className="text-xs font-black text-red-500">{error}</span> : null}
    </label>
  );
}

export default function EinOrderFlow({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = copy[locale];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function detectCountryFromPhone(value: string) {
    const normalized = value.replace(/\s/g, "");
    if (!normalized.startsWith("+")) return;
    const matched = [...COUNTRIES]
      .sort((a, b) => b.dial.length - a.dial.length)
      .find((country) => normalized.startsWith(country.dial.replace(/\s/g, "")));
    if (matched) {
      update("phoneCountry", matched.code);
    }
  }

  function input(key: keyof FormState, placeholder = "", multiline = false) {
    const common = {
      value: form[key],
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        update(key, event.target.value);
        if (key === "phone") detectCountryFromPhone(event.target.value);
      },
      className: [
        "rounded-[16px] border bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]",
        errors[key] ? "border-red-300" : "border-[#E6EDF5]",
      ].join(" "),
      placeholder,
    };

    return multiline ? <textarea rows={4} {...common} /> : <input {...common} />;
  }

  function validate(targetStep = step) {
    const required = requiredByStep[targetStep] || [];
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    required.forEach((key) => {
      if (!String(form[key] || "").trim()) {
        nextErrors[key] = t.required;
      }
    });

    if (targetStep === 0 && form.email && !form.email.includes("@")) {
      nextErrors.email = locale === "fr" ? "Email invalide" : "Invalid email";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setStep((current) => Math.min(3, current + 1));
  }

  function goToPayment() {
    if (!validate(3)) return;

    const query = new URLSearchParams({
      service: "ein",
      amount: "29",
      pack: "ein_only",
      packName: "EIN Only",
      fullName: form.fullName,
      email: form.email,
      companyName: form.companyName,
      state: form.formationState,
    });

    router.push(`/${locale}/ein-payment?${query.toString()}`);
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
      <div>
        <div className="inline-flex items-center gap-2 rounded-[12px] border border-[#E6EDF5] bg-white px-4 py-2 text-sm font-black text-[#123A63]">
          <span className="text-[#F15A24]">29 USD</span>
          <span>{locale === "fr" ? "Service EIN seul" : "Standalone EIN service"}</span>
        </div>

        <h1 className="mt-8 max-w-3xl text-[42px] font-black leading-[1.05] tracking-[-0.055em] text-[#111827] md:text-[60px]">
          {locale === "fr" ? (
            <>
              Commander votre <span className="text-[#F15A24]">EIN</span>
              <br />
              en 4 étapes
            </>
          ) : (
            <>
              Order your <span className="text-[#F15A24]">EIN</span>
              <br />
              in 4 steps
            </>
          )}
        </h1>

        <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-500">
          {t.subtitle}
        </p>

        <div className="mt-8 rounded-[28px] border border-[#E6EDF5] bg-white p-5">
          <div className="grid gap-3">
            {t.steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (index <= step || validate(step)) setStep(index);
                }}
                className={[
                  "flex items-center gap-3 rounded-[18px] border p-4 text-left transition",
                  step === index ? "border-[#F15A24] text-[#123A63]" : "border-[#E6EDF5] text-slate-500",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-[13px] text-xs font-black",
                    step === index ? "bg-[#F15A24] text-white" : "border border-[#E6EDF5] bg-white",
                  ].join(" ")}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-black">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-6">
        <div className="border-b border-[#E6EDF5] pb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F15A24]">
            {locale === "fr" ? "Étape" : "Step"} {step + 1}/4
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#111827]">
            {t.steps[step]}
          </h2>
        </div>

        <div className="mt-6 grid gap-4">
          {step === 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t.fullName} error={errors.fullName}>{input("fullName", locale === "fr" ? "Votre nom" : "Your name")}</Field>
                <Field label={t.email} error={errors.email}>{input("email", "email@example.com")}</Field>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                <Field label={t.phoneCode} error={errors.phoneCountry}>
                  <CountrySearchSelect locale={locale} value={form.phoneCountry} onChange={(value) => update("phoneCountry", value)} showDial />
                </Field>
                <Field label={t.phone} error={errors.phone}>{input("phone", "+212...")}</Field>
              </div>

              <Field label={t.residenceCountry} error={errors.residenceCountry}>
                <CountrySearchSelect locale={locale} value={form.residenceCountry} onChange={(value) => update("residenceCountry", value)} />
              </Field>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t.companyName} error={errors.companyName}>{input("companyName", "Example LLC")}</Field>
                <Field label={t.formationState} error={errors.formationState}>
                  <select
                    value={form.formationState}
                    onChange={(event) => update("formationState", event.target.value)}
                    className={[
                      "rounded-[16px] border bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]",
                      errors.formationState ? "border-red-300" : "border-[#E6EDF5]",
                    ].join(" ")}
                  >
                    <option value="">{locale === "fr" ? "Choisir" : "Choose"}</option>
                    <option value="New Mexico">New Mexico</option>
                    <option value="Wyoming">Wyoming</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
              </div>

              <Field label={t.llcAddress} error={errors.llcAddress}>{input("llcAddress", locale === "fr" ? "Adresse complète de la LLC" : "Full LLC address")}</Field>
              <Field label={t.llcAddress2}>{input("llcAddress2", locale === "fr" ? "Appartement, suite..." : "Apt, suite...")}</Field>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label={t.llcCity} error={errors.llcCity}>{input("llcCity", locale === "fr" ? "Ville" : "City")}</Field>
                <Field label={t.llcZip} error={errors.llcZip}>{input("llcZip", locale === "fr" ? "Code postal" : "ZIP code")}</Field>
                <Field label={t.llcCountry}>
                  <input
                    value={locale === "fr" ? "🇺🇸 États-Unis" : "🇺🇸 United States"}
                    readOnly
                    className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-4 text-sm font-black text-[#123A63] outline-none"
                  />
                </Field>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Field label={t.ownerAddress} error={errors.ownerAddress}>{input("ownerAddress", locale === "fr" ? "Adresse complète du propriétaire" : "Full owner address")}</Field>
              <Field label={t.ownerAddress2}>{input("ownerAddress2", locale === "fr" ? "Appartement, suite..." : "Apt, suite...")}</Field>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label={t.ownerCity} error={errors.ownerCity}>{input("ownerCity", locale === "fr" ? "Ville" : "City")}</Field>
                <Field label={t.ownerZip} error={errors.ownerZip}>{input("ownerZip", locale === "fr" ? "Code postal" : "ZIP code")}</Field>
                <Field label={t.ownerCountry} error={errors.ownerCountry}>
                  <CountrySearchSelect locale={locale} value={form.ownerCountry} onChange={(value) => update("ownerCountry", value)} />
                </Field>
              </div>

              <Field label={t.activity} error={errors.activity}>{input("activity", locale === "fr" ? "Décrivez l’activité de la société..." : "Describe the company activity...", true)}</Field>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F15A24]">{t.summary}</p>
                <div className="mt-5 grid gap-3 text-sm font-bold text-[#123A63]">
                  <p>{t.fullName}: {form.fullName || "-"}</p>
                  <p>{t.email}: {form.email || "-"}</p>
                  <p>{t.companyName}: {form.companyName || "-"}</p>
                  <p>{t.formationState}: {form.formationState || "-"}</p>
                  <p>{t.llcCountry}: {locale === "fr" ? "États-Unis" : "United States"}</p>
                  <p>Prix: 29 USD</p>
                </div>
              </div>

              <Field label={t.notes}>{input("notes", locale === "fr" ? "Ajoutez une précision..." : "Add useful details...", true)}</Field>

              <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-[#123A63]">{locale === "fr" ? "Service EIN seul" : "Standalone EIN service"}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{t.paymentNotice}</p>
                  </div>
                  <p className="text-3xl font-black tracking-[-0.06em] text-[#F15A24]">29 USD</p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.prev}
          </button>

          {step < 3 ? (
            <button type="button" onClick={next} className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">
              {t.next}
            </button>
          ) : (
            <button type="button" onClick={goToPayment} className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">
              {t.pay}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
