"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Locale = "fr" | "en";

const DIAL_CODES: Record<string, string> = {
  AF: "+93", AL: "+355", DZ: "+213", AS: "+1-684", AD: "+376", AO: "+244", AI: "+1-264", AG: "+1-268", AR: "+54",
  AM: "+374", AW: "+297", AU: "+61", AT: "+43", AZ: "+994", BS: "+1-242", BH: "+973", BD: "+880", BB: "+1-246",
  BY: "+375", BE: "+32", BZ: "+501", BJ: "+229", BM: "+1-441", BT: "+975", BO: "+591", BA: "+387", BW: "+267",
  BR: "+55", BN: "+673", BG: "+359", BF: "+226", BI: "+257", KH: "+855", CM: "+237", CA: "+1", CV: "+238",
  KY: "+1-345", CF: "+236", TD: "+235", CL: "+56", CN: "+86", CO: "+57", KM: "+269", CG: "+242", CD: "+243",
  CR: "+506", CI: "+225", HR: "+385", CU: "+53", CY: "+357", CZ: "+420", DK: "+45", DJ: "+253", DM: "+1-767",
  DO: "+1-809", EC: "+593", EG: "+20", SV: "+503", GQ: "+240", ER: "+291", EE: "+372", SZ: "+268", ET: "+251",
  FJ: "+679", FI: "+358", FR: "+33", GA: "+241", GM: "+220", GE: "+995", DE: "+49", GH: "+233", GR: "+30",
  GD: "+1-473", GT: "+502", GN: "+224", GW: "+245", GY: "+592", HT: "+509", HN: "+504", HK: "+852", HU: "+36",
  IS: "+354", IN: "+91", ID: "+62", IR: "+98", IQ: "+964", IE: "+353", IL: "+972", IT: "+39", JM: "+1-876",
  JP: "+81", JO: "+962", KZ: "+7", KE: "+254", KI: "+686", KP: "+850", KR: "+82", KW: "+965", KG: "+996",
  LA: "+856", LV: "+371", LB: "+961", LS: "+266", LR: "+231", LY: "+218", LI: "+423", LT: "+370", LU: "+352",
  MO: "+853", MG: "+261", MW: "+265", MY: "+60", MV: "+960", ML: "+223", MT: "+356", MH: "+692", MR: "+222",
  MU: "+230", MX: "+52", FM: "+691", MD: "+373", MC: "+377", MN: "+976", ME: "+382", MA: "+212", MZ: "+258",
  MM: "+95", NA: "+264", NR: "+674", NP: "+977", NL: "+31", NZ: "+64", NI: "+505", NE: "+227", NG: "+234",
  MK: "+389", NO: "+47", OM: "+968", PK: "+92", PW: "+680", PS: "+970", PA: "+507", PG: "+675", PY: "+595",
  PE: "+51", PH: "+63", PL: "+48", PT: "+351", PR: "+1-787", QA: "+974", RO: "+40", RU: "+7", RW: "+250",
  KN: "+1-869", LC: "+1-758", VC: "+1-784", WS: "+685", SM: "+378", ST: "+239", SA: "+966", SN: "+221",
  RS: "+381", SC: "+248", SL: "+232", SG: "+65", SK: "+421", SI: "+386", SB: "+677", SO: "+252", ZA: "+27",
  SS: "+211", ES: "+34", LK: "+94", SD: "+249", SR: "+597", SE: "+46", CH: "+41", SY: "+963", TW: "+886",
  TJ: "+992", TZ: "+255", TH: "+66", TL: "+670", TG: "+228", TO: "+676", TT: "+1-868", TN: "+216", TR: "+90",
  TM: "+993", TV: "+688", UG: "+256", UA: "+380", AE: "+971", GB: "+44", US: "+1", UY: "+598", UZ: "+998",
  VU: "+678", VA: "+379", VE: "+58", VN: "+84", YE: "+967", ZM: "+260", ZW: "+263",
};

function flagEmoji(region: string) {
  return region
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function getCountries(locale: Locale) {
  const regions = Object.keys(DIAL_CODES).filter((code) => code !== "EH");

  const display = new Intl.DisplayNames([locale === "fr" ? "fr" : "en"], {
    type: "region",
  });

  return regions
    .map((code) => ({
      code,
      name: display.of(code) || code,
      dial: DIAL_CODES[code] || "",
      flag: flagEmoji(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const labels = {
  fr: {
    back: "Retour EIN",
    step: "Étape",
    title: "Commande EIN dédiée",
    subtitle: "Ce formulaire ne lance pas le tunnel complet de création LLC. Il est réservé au service EIN seul.",
    next: "Continuer",
    prev: "Retour",
    submit: "Continuer vers paiement",
    price: "29 USD",
    service: "Service EIN seul",
    steps: ["Contact", "Société LLC", "Propriétaire", "Validation"],
    fullName: "Nom complet",
    email: "Email",
    phoneCountry: "Indicatif",
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
    businessActivity: "Activité de la société",
    notes: "Message ou précision",
    summary: "Résumé de la commande",
    paymentNotice: "Après validation, vous passerez au choix du paiement : Stripe ou virement.",
  },
  en: {
    back: "Back to EIN",
    step: "Step",
    title: "Dedicated EIN order",
    subtitle: "This form does not start the full LLC formation flow. It is only for the standalone EIN service.",
    next: "Continue",
    prev: "Back",
    submit: "Continue to payment",
    price: "29 USD",
    service: "Standalone EIN service",
    steps: ["Contact", "LLC company", "Owner", "Review"],
    fullName: "Full name",
    email: "Email",
    phoneCountry: "Dial code",
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
    businessActivity: "Business activity",
    notes: "Message or details",
    summary: "Order summary",
    paymentNotice: "After review, you will choose your payment method: Stripe or bank transfer.",
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
  llcCountry: string;
  ownerAddress: string;
  ownerAddress2: string;
  ownerCity: string;
  ownerZip: string;
  ownerCountry: string;
  businessActivity: string;
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
  llcCountry: "US",
  ownerAddress: "",
  ownerAddress2: "",
  ownerCity: "",
  ownerZip: "",
  ownerCountry: "MA",
  businessActivity: "",
  notes: "",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function EinOrderFlow({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = labels[locale];
  const countries = useMemo(() => getCountries(locale), [locale]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function countryOptions(showDial = false) {
    return countries.map((country) => (
      <option key={country.code} value={country.code}>
        {country.flag} {country.name}
        {showDial && country.dial ? ` (${country.dial})` : ""}
      </option>
    ));
  }

  function input(key: keyof FormState, placeholder = "", required = true) {
    return (
      <input
        required={required}
        value={form[key]}
        onChange={(event) => update(key, event.target.value)}
        className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]"
        placeholder={placeholder}
      />
    );
  }

  function goToPayment() {
    const query = new URLSearchParams({
      service: "ein",
      amount: "29",
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
          <span className="text-[#F15A24]">{t.price}</span>
          <span>{t.service}</span>
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
                onClick={() => setStep(index)}
                className={[
                  "flex items-center gap-3 rounded-[18px] border p-4 text-left transition",
                  step === index
                    ? "border-[#F15A24] text-[#123A63]"
                    : "border-[#E6EDF5] text-slate-500",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-[13px] text-xs font-black",
                    step === index ? "bg-[#F15A24] text-white" : "border border-[#E6EDF5] bg-white",
                  ].join(" ")}
                >
                  {index + 1}
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
            {t.step} {step + 1}/4
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#111827]">
            {t.steps[step]}
          </h2>
        </div>

        <div className="mt-6 grid gap-4">
          {step === 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t.fullName}>{input("fullName", locale === "fr" ? "Votre nom" : "Your name")}</Field>
                <Field label={t.email}>{input("email", "email@example.com")}</Field>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <Field label={t.phoneCountry}>
                  <select
                    value={form.phoneCountry}
                    onChange={(event) => update("phoneCountry", event.target.value)}
                    className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]"
                  >
                    {countryOptions(true)}
                  </select>
                </Field>
                <Field label={t.phone}>{input("phone", "+212...")}</Field>
              </div>

              <Field label={t.residenceCountry}>
                <select
                  value={form.residenceCountry}
                  onChange={(event) => update("residenceCountry", event.target.value)}
                  className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]"
                >
                  {countryOptions(false)}
                </select>
              </Field>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t.companyName}>{input("companyName", "Example LLC")}</Field>
                <Field label={t.formationState}>
                  <select
                    required
                    value={form.formationState}
                    onChange={(event) => update("formationState", event.target.value)}
                    className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]"
                  >
                    <option value="">{locale === "fr" ? "Choisir" : "Choose"}</option>
                    <option value="New Mexico">New Mexico</option>
                    <option value="Wyoming">Wyoming</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
              </div>

              <Field label={t.llcAddress}>{input("llcAddress", locale === "fr" ? "Adresse complète de la LLC" : "Full LLC address")}</Field>
              <Field label={t.llcAddress2}>{input("llcAddress2", locale === "fr" ? "Appartement, suite..." : "Apt, suite...", false)}</Field>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label={t.llcCity}>{input("llcCity", locale === "fr" ? "Ville" : "City")}</Field>
                <Field label={t.llcZip}>{input("llcZip", locale === "fr" ? "Code postal" : "ZIP code")}</Field>
                <Field label={t.llcCountry}>
                  <select
                    value={form.llcCountry}
                    onChange={(event) => update("llcCountry", event.target.value)}
                    className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]"
                  >
                    {countryOptions(false)}
                  </select>
                </Field>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Field label={t.ownerAddress}>{input("ownerAddress", locale === "fr" ? "Adresse complète du propriétaire" : "Full owner address")}</Field>
              <Field label={t.ownerAddress2}>{input("ownerAddress2", locale === "fr" ? "Appartement, suite..." : "Apt, suite...", false)}</Field>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label={t.ownerCity}>{input("ownerCity", locale === "fr" ? "Ville" : "City")}</Field>
                <Field label={t.ownerZip}>{input("ownerZip", locale === "fr" ? "Code postal" : "ZIP code")}</Field>
                <Field label={t.ownerCountry}>
                  <select
                    value={form.ownerCountry}
                    onChange={(event) => update("ownerCountry", event.target.value)}
                    className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]"
                  >
                    {countryOptions(false)}
                  </select>
                </Field>
              </div>

              <Field label={t.businessActivity}>
                <textarea
                  required
                  value={form.businessActivity}
                  onChange={(event) => update("businessActivity", event.target.value)}
                  rows={4}
                  className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]"
                  placeholder={locale === "fr" ? "Décrivez l’activité de la société..." : "Describe the company activity..."}
                />
              </Field>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F15A24]">
                  {t.summary}
                </p>
                <div className="mt-5 grid gap-3 text-sm font-bold text-[#123A63]">
                  <p>{t.fullName}: {form.fullName || "-"}</p>
                  <p>{t.email}: {form.email || "-"}</p>
                  <p>{t.companyName}: {form.companyName || "-"}</p>
                  <p>{t.formationState}: {form.formationState || "-"}</p>
                  <p>{t.price}: {t.service}</p>
                </div>
              </div>

              <Field label={t.notes}>
                <textarea
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  rows={4}
                  className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]"
                  placeholder={locale === "fr" ? "Ajoutez une précision sur votre situation..." : "Add any useful detail..."}
                />
              </Field>

              <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-[#123A63]">{t.service}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{t.paymentNotice}</p>
                  </div>
                  <p className="text-3xl font-black tracking-[-0.06em] text-[#F15A24]">{t.price}</p>
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
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(3, current + 1))}
              className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]"
            >
              {t.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={goToPayment}
              className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]"
            >
              {t.submit}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
