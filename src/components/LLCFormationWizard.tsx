"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

type Lang = "fr" | "en";

type CountryItem = {
  code: CountryCode;
  name: string;
  dial: string;
};

type FormState = {
  packageName: string;
  entityType: string;
  jurisdiction: string;
  companyName: string;
  designator: string;

  businessPurposeType: string;
  businessActivity: string;
  physicalAddressChoice: string;
  mailingAddressChoice: string;

  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: CountryCode;
  phoneNumber: string;
  residenceCountry: CountryCode;
  password: string;
  confirmPassword: string;

  managementType: string;
  publicListing: string;
  memberFirstName: string;
  memberLastName: string;
  memberCountry: CountryCode;

  needEin: boolean;
  needOperatingAgreement: boolean;
  needStripePaypalDocs: boolean;
  needComplianceReminders: boolean;

  message: string;
};

const initialForm: FormState = {
  packageName: "Standard",
  entityType: "LLC",
  jurisdiction: "New Mexico",
  companyName: "",
  designator: "LLC",

  businessPurposeType: "generic",
  businessActivity: "",
  physicalAddressChoice: "registered_agent",
  mailingAddressChoice: "registered_agent",

  firstName: "",
  lastName: "",
  email: "",
  phoneCountry: "MA",
  phoneNumber: "",
  residenceCountry: "MA",
  password: "",
  confirmPassword: "",

  managementType: "member_managed",
  publicListing: "omit",
  memberFirstName: "",
  memberLastName: "",
  memberCountry: "MA",

  needEin: true,
  needOperatingAgreement: true,
  needStripePaypalDocs: false,
  needComplianceReminders: true,

  message: "",
};

const packagePrices: Record<string, number> = {
  Starter: 199,
  Standard: 349,
  Premium: 599,
};

const copy = {
  fr: {
    steps: [
      "Formation",
      "Nom société",
      "Activité",
      "Compte",
      "Management",
      "Services",
      "Paiement",
    ],
    title: "Créer votre LLC américaine",
    subtitle:
      "Un parcours clair et structuré pour préparer votre dossier LLC avec Vemo Technology.",
    orderSummary: "Résumé du dossier",
    package: "Formule",
    entity: "Type d'entité",
    jurisdiction: "État",
    stateFee: "Frais officiels État",
    serviceFee: "Service Vemo Technology",
    total: "Total estimé",
    note: "Les frais officiels et services tiers seront confirmés avant paiement.",
    continue: "Continuer",
    back: "Retour",
    submit: "Payer maintenant",
    saved: "Demande prête",
    savedText:
      "L'interface est prête. La prochaine étape sera de connecter cette page à Stripe Payment Element et à Supabase.",
  },
  en: {
    steps: [
      "Formation",
      "Company Name",
      "Business",
      "Account",
      "Management",
      "Services",
      "Payment",
    ],
    title: "Set up your US LLC",
    subtitle:
      "A clear and structured journey to prepare your LLC formation file with Vemo Technology.",
    orderSummary: "Order summary",
    package: "Package",
    entity: "Entity type",
    jurisdiction: "State",
    stateFee: "Official state fees",
    serviceFee: "Vemo Technology service",
    total: "Estimated total",
    note: "Official fees and third-party services will be confirmed before payment.",
    continue: "Continue",
    back: "Back",
    submit: "Pay now",
    saved: "Request ready",
    savedText:
      "The interface is ready. The next step will be connecting this page to Stripe Payment Element and Supabase.",
  },
};

function money(value: number) {
  return `$${value.toFixed(0)}`;
}

function estimateStateFee(state: string) {
  if (state === "New Mexico") return 50;
  if (state === "Wyoming") return 100;
  if (state === "Delaware") return 110;
  if (state === "Florida") return 125;
  return 0;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function flagUrl(countryCode: string) {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

function getCountryOptions(lang: Lang): CountryItem[] {
  const displayNames = new Intl.DisplayNames([lang === "fr" ? "fr" : "en"], {
    type: "region",
  });

  return getCountries()
    .filter((country) => country !== "EH")
    .map((country) => ({
      code: country as CountryCode,
      name: displayNames.of(country) || country,
      dial: getCountryCallingCode(country as CountryCode),
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, lang === "fr" ? "fr" : "en")
    );
}

function detectCountryFromDialPrefix(value: string, countries: CountryItem[]) {
  if (!value.trim().startsWith("+")) return null;

  const digits = onlyDigits(value);
  const sorted = [...countries].sort((a, b) => b.dial.length - a.dial.length);

  return sorted.find((country) => digits.startsWith(country.dial)) || null;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="vemo-label">{children}</label>;
}

function FlagIcon({ code }: { code: CountryCode }) {
  return (
    <img
      src={flagUrl(code)}
      alt={code}
      className="h-4 w-6 rounded-sm object-cover shadow-sm"
    />
  );
}

function CountryDropdown({
  value,
  countries,
  onSelect,
  showDial = false,
  placeholder,
}: {
  value: CountryCode;
  countries: CountryItem[];
  onSelect: (country: CountryCode) => void;
  showDial?: boolean;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = countries.find((country) => country.code === value);

  const filtered = countries.filter((country) => {
    const term = search.toLowerCase().trim();

    if (!term) return true;

    return (
      country.name.toLowerCase().includes(term) ||
      country.code.toLowerCase().includes(term) ||
      country.dial.includes(term.replace("+", ""))
    );
  });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="vemo-input flex items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          {selected && <FlagIcon code={selected.code} />}
          <span className="truncate">
            {selected
              ? showDial
                ? `+${selected.dial} ${selected.name}`
                : selected.name
              : placeholder}
          </span>
        </span>

        <span className="text-slate-400">⌄</span>
      </button>

      {open && (
        <div className="absolute z-[80] mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#c51f32]"
            />
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.map((country) => (
              <button
                type="button"
                key={country.code}
                onClick={() => {
                  onSelect(country.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={[
                  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-red-50",
                  country.code === value ? "bg-red-50 text-[#c51f32]" : "text-[#111a33]",
                ].join(" ")}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <FlagIcon code={country.code} />
                  <span className="truncate">{country.name}</span>
                </span>

                {showDial && (
                  <span className="shrink-0 text-slate-500">+{country.dial}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TextField({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  name: keyof FormState;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      required={required}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="vemo-input mt-2"
    />
  );
}

function SelectField({
  name,
  value,
  onChange,
  children,
}: {
  name: keyof FormState;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  children: ReactNode;
}) {
  return (
    <select name={name} value={value} onChange={onChange} className="vemo-input mt-2">
      {children}
    </select>
  );
}

function PhoneField({
  lang,
  form,
  countries,
  phoneValid,
  phoneTouched,
  setPhoneTouched,
  updateField,
}: {
  lang: Lang;
  form: FormState;
  countries: CountryItem[];
  phoneValid: boolean;
  phoneTouched: boolean;
  setPhoneTouched: (value: boolean) => void;
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  const isFr = lang === "fr";

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setPhoneTouched(true);

    if (value.trim().startsWith("+")) {
      const detected = detectCountryFromDialPrefix(value, countries);

      if (detected) {
        const digits = onlyDigits(value);
        const nationalNumber = digits.startsWith(detected.dial)
          ? digits.slice(detected.dial.length)
          : digits;

        updateField("phoneCountry", detected.code);
        updateField("phoneNumber", nationalNumber);
        return;
      }
    }

    updateField("phoneNumber", value.replace(/[^\d\s().-]/g, ""));
  }

  return (
    <div>
      <FieldLabel>{isFr ? "Téléphone / WhatsApp" : "Phone / WhatsApp"}</FieldLabel>

      <div className="mt-2 grid gap-3 md:grid-cols-[300px_1fr]">
        <CountryDropdown
          value={form.phoneCountry}
          countries={countries}
          showDial
          placeholder={isFr ? "Rechercher un indicatif" : "Search dialing code"}
          onSelect={(country) => {
            updateField("phoneCountry", country);
            setPhoneTouched(true);
          }}
        />

        <input
          required
          value={form.phoneNumber}
          onChange={handlePhoneChange}
          placeholder={isFr ? "Ex : 6 00 00 00 00 ou +212..." : "Ex: 600000000 or +212..."}
          className={[
            "vemo-input",
            phoneTouched && !phoneValid ? "border-red-400" : "",
          ].join(" ")}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
        {phoneTouched && phoneValid && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
            {isFr ? "Numéro valide" : "Valid phone number"}
          </span>
        )}

        {phoneTouched && !phoneValid && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">
            {isFr ? "Numéro invalide ou incomplet" : "Invalid or incomplete phone number"}
          </span>
        )}
      </div>
    </div>
  );
}

function OptionCard({
  active,
  title,
  text,
  onClick,
}: {
  active: boolean;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-5 text-left transition",
        active
          ? "border-[#c51f32] bg-red-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-[#c51f32]/60",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-1 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-black",
            active
              ? "border-[#c51f32] bg-[#c51f32] text-white"
              : "border-slate-300 bg-white text-transparent",
          ].join(" ")}
        >
          ✓
        </span>

        <div>
          <p className="font-black text-[#111a33]">{title}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
            {text}
          </p>
        </div>
      </div>
    </button>
  );
}

function ToggleService({
  checked,
  title,
  text,
  price,
  onClick,
}: {
  checked: boolean;
  title: string;
  text: string;
  price: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-5 border-b border-slate-200 py-5 text-left last:border-b-0"
    >
      <div className="flex items-start gap-4">
        <span
          className={[
            "mt-1 h-7 w-12 rounded-full p-1 transition",
            checked ? "bg-[#c51f32]" : "bg-slate-200",
          ].join(" ")}
        >
          <span
            className={[
              "block h-5 w-5 rounded-full bg-white transition",
              checked ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </span>

        <div>
          <p className="font-black text-[#111a33]">{title}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
            {text}
          </p>
        </div>
      </div>

      <p className="shrink-0 font-black text-[#c51f32]">{price}</p>
    </button>
  );
}

export default function LLCFormationWizard({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";
  const c = copy[lang];

  const countries = useMemo(() => getCountryOptions(lang), [lang]);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const stateFee = estimateStateFee(form.jurisdiction);
  const serviceFee = packagePrices[form.packageName] || 0;
  const optionsFee = form.needStripePaypalDocs ? 49 : 0;
  const total = serviceFee + stateFee + optionsFee;

  const phoneE164 = useMemo(() => {
    const dial = getCountryCallingCode(form.phoneCountry);
    const national = onlyDigits(form.phoneNumber);
    return national ? `+${dial}${national}` : "";
  }, [form.phoneCountry, form.phoneNumber]);

  const parsedPhone = phoneE164 ? parsePhoneNumberFromString(phoneE164) : null;
  const phoneValid = Boolean(parsedPhone?.isValid());

  const passwordsMatch =
    form.password.length === 0 ||
    form.confirmPassword.length === 0 ||
    form.password === form.confirmPassword;

  const fullCompanyName = useMemo(() => {
    const name = form.companyName.trim() || (isFr ? "Votre Société" : "Your Company");
    return `${name} ${form.designator}`.toUpperCase();
  }, [form.companyName, form.designator, isFr]);

  const residenceCountry =
    countries.find((country) => country.code === form.residenceCountry) ||
    countries.find((country) => country.code === "MA")!;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }) as FormState);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function validateStep() {
    if (step === 3) {
      setPhoneTouched(true);
      setPasswordTouched(true);

      if (!phoneValid) return false;
      if (!passwordsMatch) return false;
    }

    return true;
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, c.steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateStep()) return;

    if (step < c.steps.length - 1) {
      nextStep();
      return;
    }

    console.log("Next: create Supabase case + Stripe PaymentIntent:", {
      ...form,
      phoneE164,
      total,
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="vemo-container py-16">
        <div className="vemo-card mx-auto max-w-4xl rounded-[2rem] p-8 md:p-12">
          <div className="vemo-badge">{c.saved}</div>

          <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
            {isFr ? "Votre demande est prête." : "Your request is ready."}
          </h1>

          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
            {c.savedText}
          </p>

          <div className="mt-8 grid gap-4 rounded-[1.5rem] bg-slate-50 p-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                {isFr ? "Société" : "Company"}
              </p>
              <p className="mt-2 font-black">{fullCompanyName}</p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                Téléphone
              </p>
              <p className="mt-2 font-black">{phoneE164}</p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                {c.total}
              </p>
              <p className="mt-2 font-black">{money(total)}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="vemo-container py-10 md:py-14">
      <div className="mb-10">
        <p className="vemo-badge">{isFr ? "Questionnaire LLC" : "LLC Wizard"}</p>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-5xl">
              {c.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
              {c.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              {isFr ? "Société" : "Company"}
            </p>
            <p className="mt-1 text-lg font-black text-[#111a33]">
              {fullCompanyName}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid min-w-[980px] grid-cols-7 gap-0">
          {c.steps.map((label, index) => {
            const done = index < step;
            const active = index === step;

            return (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className="relative flex flex-col items-center gap-3 text-center"
              >
                <div className="flex w-full items-center">
                  <div
                    className={[
                      "h-[2px] flex-1",
                      index === 0
                        ? "bg-transparent"
                        : done || active
                          ? "bg-[#c51f32]"
                          : "bg-slate-300",
                    ].join(" ")}
                  />

                  <div
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black",
                      done
                        ? "border-[#c51f32] bg-[#c51f32] text-white"
                        : active
                          ? "border-[#c51f32] bg-white text-[#c51f32]"
                          : "border-slate-300 bg-white text-slate-400",
                    ].join(" ")}
                  >
                    {done ? "✓" : index + 1}
                  </div>

                  <div
                    className={[
                      "h-[2px] flex-1",
                      index === c.steps.length - 1
                        ? "bg-transparent"
                        : index < step
                          ? "bg-[#c51f32]"
                          : "bg-slate-300",
                    ].join(" ")}
                  />
                </div>

                <p
                  className={[
                    "text-sm font-black",
                    active ? "text-[#111a33]" : "text-slate-500",
                  ].join(" ")}
                >
                  {label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-start"
      >
        <div className="vemo-card rounded-[2rem] p-7 md:p-9">
          {step === 0 && (
            <div>
              <h2 className="text-3xl font-black">
                {isFr ? "Détails de formation" : "Formation details"}
              </h2>

              <div className="mt-5 h-px bg-red-100" />

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel>{c.package}</FieldLabel>
                  <SelectField
                    name="packageName"
                    value={form.packageName}
                    onChange={handleChange}
                  >
                    <option>Starter</option>
                    <option>Standard</option>
                    <option>Premium</option>
                  </SelectField>
                </div>

                <div>
                  <FieldLabel>{c.entity}</FieldLabel>
                  <SelectField
                    name="entityType"
                    value={form.entityType}
                    onChange={handleChange}
                  >
                    <option>LLC</option>
                  </SelectField>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>{c.jurisdiction}</FieldLabel>
                  <SelectField
                    name="jurisdiction"
                    value={form.jurisdiction}
                    onChange={handleChange}
                  >
                    <option>New Mexico</option>
                    <option>Wyoming</option>
                    <option>Delaware</option>
                    <option>Florida</option>
                    <option>
                      {isFr
                        ? "À recommander par Vemo Technology"
                        : "To be recommended by Vemo Technology"}
                    </option>
                  </SelectField>
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-6">
                <h3 className="text-xl font-black">
                  {isFr ? "Conseil Vemo Technology" : "Vemo Technology advice"}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  {isFr
                    ? "New Mexico est souvent choisi pour sa simplicité et ses coûts faibles. Le choix final dépendra de votre activité et de vos objectifs."
                    : "New Mexico is often chosen for simplicity and low cost. The final choice depends on your business activity and goals."}
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-3xl font-black">
                {isFr ? "Nom de la société" : "Company name"}
              </h2>

              <div className="mt-5 h-px bg-red-100" />

              <div className="mt-7 grid gap-5 md:grid-cols-[1.4fr_0.6fr]">
                <div>
                  <FieldLabel>
                    {isFr ? "Nom souhaité" : "Desired company name"}
                  </FieldLabel>
                  <TextField
                    required
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Vemo Technology"
                  />
                </div>

                <div>
                  <FieldLabel>Designator</FieldLabel>
                  <SelectField
                    name="designator"
                    value={form.designator}
                    onChange={handleChange}
                  >
                    <option>LLC</option>
                    <option>L.L.C.</option>
                    <option>Limited Liability Company</option>
                  </SelectField>
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-red-50 p-6">
                <p className="text-xs font-black uppercase tracking-wide text-[#c51f32]">
                  {isFr ? "Nom affiché dans le dossier" : "Name shown in the file"}
                </p>
                <p className="mt-3 text-2xl font-black text-[#111a33]">
                  {fullCompanyName}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-black">
                {isFr ? "Détails de l’activité" : "Business details"}
              </h2>

              <div className="mt-5 h-px bg-red-100" />

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <OptionCard
                  active={form.businessPurposeType === "generic"}
                  title={isFr ? "Objet générique" : "Generic business purpose"}
                  text={
                    isFr
                      ? "Option simple et flexible pour la plupart des activités."
                      : "Simple and flexible option for most activities."
                  }
                  onClick={() => updateField("businessPurposeType", "generic")}
                />

                <OptionCard
                  active={form.businessPurposeType === "specific"}
                  title={isFr ? "Objet spécifique" : "Specific business purpose"}
                  text={
                    isFr
                      ? "Utile si votre activité doit être décrite précisément."
                      : "Useful if your activity should be described precisely."
                  }
                  onClick={() => updateField("businessPurposeType", "specific")}
                />
              </div>

              <div className="mt-6">
                <FieldLabel>
                  {isFr ? "Décrivez votre activité" : "Describe your business activity"}
                </FieldLabel>
                <textarea
                  required
                  name="businessActivity"
                  value={form.businessActivity}
                  onChange={handleChange}
                  rows={6}
                  placeholder={
                    isFr
                      ? "Exemple : e-commerce, consulting, SaaS, agence marketing, prestations digitales..."
                      : "Example: e-commerce, consulting, SaaS, marketing agency, digital services..."
                  }
                  className="vemo-input mt-2 resize-none"
                />
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel>
                    {isFr
                      ? "Adresse physique pour l’État"
                      : "Physical address for state records"}
                  </FieldLabel>
                  <SelectField
                    name="physicalAddressChoice"
                    value={form.physicalAddressChoice}
                    onChange={handleChange}
                  >
                    <option value="registered_agent">
                      {isFr
                        ? "Adresse du Registered Agent"
                        : "Registered Agent address"}
                    </option>
                    <option value="own_address">
                      {isFr
                        ? "Adresse personnelle / professionnelle"
                        : "Own personal / business address"}
                    </option>
                  </SelectField>
                </div>

                <div>
                  <FieldLabel>{isFr ? "Adresse courrier" : "Mailing address"}</FieldLabel>
                  <SelectField
                    name="mailingAddressChoice"
                    value={form.mailingAddressChoice}
                    onChange={handleChange}
                  >
                    <option value="registered_agent">
                      {isFr
                        ? "Adresse du Registered Agent"
                        : "Registered Agent address"}
                    </option>
                    <option value="own_address">
                      {isFr
                        ? "Adresse personnelle / professionnelle"
                        : "Own personal / business address"}
                    </option>
                  </SelectField>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-3xl font-black">
                {isFr ? "Compte client" : "Client account"}
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-600">
                {isFr
                  ? "Ces informations serviront pour votre futur espace client."
                  : "This information will be used for your future client area."}
              </p>

              <div className="mt-5 h-px bg-red-100" />

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel>{isFr ? "Prénom" : "First name"}</FieldLabel>
                  <TextField
                    required
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <FieldLabel>{isFr ? "Nom" : "Last name"}</FieldLabel>
                  <TextField
                    required
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <FieldLabel>Email</FieldLabel>
                  <TextField
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <FieldLabel>
                    {isFr ? "Pays de résidence" : "Country of residence"}
                  </FieldLabel>

                  <div className="mt-2">
                    <CountryDropdown
                      value={form.residenceCountry}
                      countries={countries}
                      placeholder={isFr ? "Rechercher un pays" : "Search country"}
                      onSelect={(country) => updateField("residenceCountry", country)}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <PhoneField
                    lang={lang}
                    form={form}
                    countries={countries}
                    phoneValid={phoneValid}
                    phoneTouched={phoneTouched}
                    setPhoneTouched={setPhoneTouched}
                    updateField={updateField}
                  />
                </div>

                <div>
                  <FieldLabel>
                    {isFr ? "Créer un mot de passe" : "Create password"}
                  </FieldLabel>
                  <TextField
                    required
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <FieldLabel>
                    {isFr ? "Confirmer le mot de passe" : "Confirm password"}
                  </FieldLabel>
                  <TextField
                    required
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {passwordTouched && !passwordsMatch && (
                <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">
                  {isFr
                    ? "Les mots de passe ne correspondent pas."
                    : "Passwords do not match."}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-3xl font-black">
                {isFr ? "Management de la LLC" : "LLC management"}
              </h2>

              <div className="mt-5 h-px bg-red-100" />

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <OptionCard
                  active={form.managementType === "member_managed"}
                  title="Member Managed"
                  text={
                    isFr
                      ? "Le ou les membres gèrent directement la LLC."
                      : "The member or members directly manage the LLC."
                  }
                  onClick={() => updateField("managementType", "member_managed")}
                />

                <OptionCard
                  active={form.managementType === "manager_managed"}
                  title="Manager Managed"
                  text={
                    isFr
                      ? "Un manager désigné gère la LLC."
                      : "A designated manager manages the LLC."
                  }
                  onClick={() => updateField("managementType", "manager_managed")}
                />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <OptionCard
                  active={form.publicListing === "list"}
                  title={isFr ? "Afficher dans l’État" : "List with the state"}
                  text={
                    isFr
                      ? "Le nom peut apparaître dans les registres selon l’État."
                      : "The name may appear in state records depending on the state."
                  }
                  onClick={() => updateField("publicListing", "list")}
                />

                <OptionCard
                  active={form.publicListing === "omit"}
                  title={isFr ? "Limiter l’affichage" : "Omit from public display"}
                  text={
                    isFr
                      ? "Option privilégiée quand elle est possible."
                      : "Preferred option when available."
                  }
                  onClick={() => updateField("publicListing", "omit")}
                />
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-6">
                <h3 className="text-2xl font-black">
                  {isFr ? "Membre #1" : "Member #1"}
                </h3>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel>{isFr ? "Prénom" : "First name"}</FieldLabel>
                    <TextField
                      name="memberFirstName"
                      value={form.memberFirstName}
                      onChange={handleChange}
                      placeholder={form.firstName}
                    />
                  </div>

                  <div>
                    <FieldLabel>{isFr ? "Nom" : "Last name"}</FieldLabel>
                    <TextField
                      name="memberLastName"
                      value={form.memberLastName}
                      onChange={handleChange}
                      placeholder={form.lastName}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel>{isFr ? "Pays du membre" : "Member country"}</FieldLabel>

                    <div className="mt-2">
                      <CountryDropdown
                        value={form.memberCountry}
                        countries={countries}
                        placeholder={isFr ? "Rechercher un pays" : "Search country"}
                        onSelect={(country) => updateField("memberCountry", country)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-3xl font-black">
                {isFr ? "Services recommandés" : "Recommended services"}
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-600">
                {isFr
                  ? "Activez ou désactivez les options selon vos besoins."
                  : "Enable or disable options based on your needs."}
              </p>

              <div className="mt-5 h-px bg-red-100" />

              <div className="mt-4">
                <ToggleService
                  checked={form.needEin}
                  title={isFr ? "Accompagnement EIN" : "EIN guidance"}
                  text={
                    isFr
                      ? "Préparation et orientation pour la demande EIN non-résident."
                      : "Preparation and guidance for a non-resident EIN request."
                  }
                  price={isFr ? "Inclus" : "Included"}
                  onClick={() => updateField("needEin", !form.needEin)}
                />

                <ToggleService
                  checked={form.needOperatingAgreement}
                  title="Operating Agreement"
                  text={
                    isFr
                      ? "Document interne utile pour organiser les règles de la LLC."
                      : "Internal document used to organize LLC rules."
                  }
                  price={isFr ? "Inclus" : "Included"}
                  onClick={() =>
                    updateField("needOperatingAgreement", !form.needOperatingAgreement)
                  }
                />

                <ToggleService
                  checked={form.needStripePaypalDocs}
                  title={isFr ? "Préparation Stripe / PayPal" : "Stripe / PayPal preparation"}
                  text={
                    isFr
                      ? "Checklist et documents utiles pour préparer vos demandes de comptes."
                      : "Checklist and useful documents to prepare account applications."
                  }
                  price="$49"
                  onClick={() =>
                    updateField("needStripePaypalDocs", !form.needStripePaypalDocs)
                  }
                />

                <ToggleService
                  checked={form.needComplianceReminders}
                  title={isFr ? "Rappels de conformité" : "Compliance reminders"}
                  text={
                    isFr
                      ? "Rappels internes pour les échéances importantes de votre société."
                      : "Internal reminders for important company deadlines."
                  }
                  price={isFr ? "Inclus" : "Included"}
                  onClick={() =>
                    updateField("needComplianceReminders", !form.needComplianceReminders)
                  }
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-3xl font-black">
                {isFr ? "Paiement sécurisé" : "Secure payment"}
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-600">
                {isFr
                  ? "Le paiement sera intégré dans cette page avec Stripe Payment Element."
                  : "Payment will be embedded in this page using Stripe Payment Element."}
              </p>

              <div className="mt-5 h-px bg-red-100" />

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {[
                  [isFr ? "Société" : "Company", fullCompanyName],
                  [isFr ? "État" : "State", form.jurisdiction],
                  [isFr ? "Formule" : "Package", form.packageName],
                  [isFr ? "Client" : "Client", `${form.firstName} ${form.lastName}`],
                  ["Email", form.email],
                  [isFr ? "Téléphone" : "Phone", phoneE164],
                  [isFr ? "Pays" : "Country", residenceCountry.name],
                  [isFr ? "Management" : "Management", form.managementType],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 font-black text-[#111a33]">{value || "-"}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c51f32]">
                      Stripe Payment Element
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      {isFr ? "Paiement dans le site" : "On-site payment"}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm font-semibold leading-7 text-slate-600">
                      {isFr
                        ? "Le client restera sur Vemo Technology. Stripe affichera le champ carte bancaire sécurisé directement ici. Aucun numéro de carte ne sera stocké sur notre site."
                        : "The client will stay on Vemo Technology. Stripe will render the secure card payment field directly here. No card number will be stored on our website."}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-6 py-4 text-right">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      {c.total}
                    </p>
                    <p className="mt-1 text-3xl font-black text-[#c51f32]">
                      {money(total)}
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="font-black text-[#111a33]">
                      {isFr ? "Carte bancaire" : "Card payment"}
                    </p>

                    <div className="flex gap-2 text-xs font-black">
                      <span className="rounded bg-[#111a33] px-2 py-1 text-white">VISA</span>
                      <span className="rounded bg-red-100 px-2 py-1 text-[#c51f32]">MC</span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">AMEX</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-400">
                    {isFr
                      ? "Ici apparaîtra le composant sécurisé Stripe Payment Element."
                      : "The secure Stripe Payment Element will appear here."}
                  </div>

                  <p className="mt-4 text-xs font-semibold leading-6 text-slate-500">
                    {isFr
                      ? "Cette zone sera remplacée par le vrai composant Stripe après configuration de la clé publique, de la clé secrète et de l’API PaymentIntent."
                      : "This area will be replaced by the real Stripe component after configuring the publishable key, secret key and PaymentIntent API."}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <FieldLabel>{isFr ? "Message complémentaire" : "Additional message"}</FieldLabel>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder={
                    isFr
                      ? "Ajoutez toute information utile avant l’envoi..."
                      : "Add any useful information before submitting..."
                  }
                  className="vemo-input mt-2 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <aside className="vemo-card sticky top-28 rounded-[2rem] p-7">
          <h2 className="text-2xl font-black">{c.orderSummary}</h2>

          <div className="mt-5 h-px bg-red-100" />

          <div className="mt-6 space-y-5">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-black">{c.serviceFee}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {form.packageName}
                </p>
              </div>
              <p className="font-black">{money(serviceFee)}</p>
            </div>

            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-black">{c.stateFee}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {form.jurisdiction}
                </p>
              </div>
              <p className="font-black">{stateFee ? money(stateFee) : "TBD"}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-600">Registered Agent</p>
              <p className="font-black text-[#c51f32]">
                {isFr ? "À confirmer" : "To confirm"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-600">Operating Agreement</p>
              <p className="font-black">
                {form.needOperatingAgreement ? (isFr ? "Inclus" : "Included") : "-"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-600">EIN</p>
              <p className="font-black">
                {form.needEin ? (isFr ? "Inclus" : "Included") : "-"}
              </p>
            </div>

            {form.needStripePaypalDocs && (
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-600">Stripe / PayPal</p>
                <p className="font-black">$49</p>
              </div>
            )}
          </div>

          <div className="mt-7 rounded-[1.25rem] bg-slate-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xl font-black">{c.total}</p>
              <p className="text-2xl font-black text-[#c51f32]">{money(total)}</p>
            </div>
          </div>

          <p className="mt-5 text-xs font-semibold leading-6 text-slate-500">
            {c.note}
          </p>

          <div className="mt-7 space-y-3">
            <button type="submit" className="vemo-button-primary w-full">
              {step === c.steps.length - 1 ? c.submit : c.continue}
            </button>

            {step > 0 && (
              <button
                type="button"
                onClick={previousStep}
                className="vemo-button-secondary w-full"
              >
                {c.back}
              </button>
            )}
          </div>

          <div className="mt-6 rounded-[1.25rem] bg-[#111a33] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">
              Stripe intégré
            </p>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
              {isFr
                ? "Le paiement final sera intégré dans cette page via Stripe Payment Element."
                : "Final payment will be embedded on this page using Stripe Payment Element."}
            </p>
          </div>
        </aside>
      </form>
    </section>
  );
}

