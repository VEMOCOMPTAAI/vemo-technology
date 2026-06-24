"use client";

import { useMemo, useState } from "react";

type Lang = "fr" | "en";
type StateKey = "newMexico" | "wyoming";
type PackKey = "starter" | "standard" | "premium";
type PaymentMethod = "card" | "transfer" | "";

type Country = {
  name: string;
  code: string;
  dial: string;
  flag: string;
  min: number;
  max: number;
};

const countries: Country[] = [
  { name: "Morocco", code: "MA", dial: "+212", flag: "🇲🇦", min: 9, max: 9 },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷", min: 9, max: 9 },
  { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸", min: 9, max: 9 },
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸", min: 10, max: 10 },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦", min: 10, max: 10 },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧", min: 10, max: 10 },
  { name: "Belgium", code: "BE", dial: "+32", flag: "🇧🇪", min: 8, max: 9 },
  { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱", min: 9, max: 9 },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪", min: 10, max: 11 },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹", min: 9, max: 10 },
  { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹", min: 9, max: 9 },
  { name: "Turkey", code: "TR", dial: "+90", flag: "🇹🇷", min: 10, max: 10 },
  { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪", min: 9, max: 9 },
  { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦", min: 9, max: 9 },
  { name: "Qatar", code: "QA", dial: "+974", flag: "🇶🇦", min: 8, max: 8 },
  { name: "Kuwait", code: "KW", dial: "+965", flag: "🇰🇼", min: 8, max: 8 },
  { name: "Bahrain", code: "BH", dial: "+973", flag: "🇧🇭", min: 8, max: 8 },
  { name: "Oman", code: "OM", dial: "+968", flag: "🇴🇲", min: 8, max: 8 },
  { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬", min: 10, max: 10 },
  { name: "Tunisia", code: "TN", dial: "+216", flag: "🇹🇳", min: 8, max: 8 },
  { name: "Algeria", code: "DZ", dial: "+213", flag: "🇩🇿", min: 9, max: 9 },
  { name: "Senegal", code: "SN", dial: "+221", flag: "🇸🇳", min: 9, max: 9 },
  { name: "Ivory Coast", code: "CI", dial: "+225", flag: "🇨🇮", min: 10, max: 10 },
  { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬", min: 10, max: 10 },
  { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦", min: 9, max: 9 },
  { name: "India", code: "IN", dial: "+91", flag: "🇮🇳", min: 10, max: 10 },
  { name: "Pakistan", code: "PK", dial: "+92", flag: "🇵🇰", min: 10, max: 10 },
  { name: "China", code: "CN", dial: "+86", flag: "🇨🇳", min: 11, max: 11 },
  { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵", min: 10, max: 10 },
  { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷", min: 10, max: 11 },
  { name: "Mexico", code: "MX", dial: "+52", flag: "🇲🇽", min: 10, max: 10 },
];

const packs = {
  newMexico: {
    starter: { name: "Starter", price: 129, descFr: "L’essentiel pour lancer votre LLC.", descEn: "Essential package to launch your LLC." },
    standard: { name: "Standard", price: 149, descFr: "La formule recommandée pour démarrer sérieusement.", descEn: "Recommended package to start seriously." },
    premium: { name: "Premium", price: 199, descFr: "L’offre complète pour structurer votre activité.", descEn: "Complete package to structure your business." },
  },
  wyoming: {
    starter: { name: "Starter", price: 149, descFr: "L’essentiel pour lancer votre LLC Wyoming.", descEn: "Essential package to launch your Wyoming LLC." },
    standard: { name: "Standard", price: 179, descFr: "La formule recommandée avec traitement plus rapide.", descEn: "Recommended package with faster processing." },
    premium: { name: "Premium", price: 229, descFr: "L’offre complète avec accompagnement renforcé.", descEn: "Complete package with enhanced support." },
  },
} as const;

const text = {
  fr: {
    steps: ["État & formule", "Nom LLC", "Activité", "Propriétaire", "Pays & téléphone", "Membres", "Services", "Paiement"],
    badge: "Création LLC US",
    title: "Créer votre LLC simplement",
    subtitle: "Un tunnel clair, premium et sécurisé pour récupérer les informations nécessaires, valider chaque étape et créer votre espace client.",
    next: "Continuer",
    back: "Retour",
    required: "Champ obligatoire.",
    invalid: "Information invalide.",
    edit: "Modifier",
    summary: "Résumé",
    total: "Total estimé",
    state: "État",
    package: "Formule",
    services: "Services",
    client: "Client",
    payment: "Paiement",
    included: "Inclus",
    chooseState: "Choisissez l’État de création",
    choosePack: "Choisissez votre formule",
    llcName: "Nom de la LLC",
    llcHint: "Le nom doit contenir au moins 3 caractères.",
    noNameYet: "Je n’ai pas encore choisi le nom",
    designator: "Designator",
    altName: "Nom alternatif",
    activity: "Activité",
    sector: "Secteur",
    description: "Description courte de l’activité",
    owner: "Propriétaire / compte client",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    confirmEmail: "Confirmation email",
    password: "Mot de passe",
    confirmPassword: "Confirmation mot de passe",
    countryPhone: "Pays, téléphone et adresse",
    country: "Pays de résidence",
    dial: "Indicatif",
    phone: "Téléphone / WhatsApp",
    city: "Ville",
    address: "Adresse",
    members: "Structure / membres",
    single: "LLC à membre unique",
    multi: "LLC à plusieurs membres",
    management: "Gestion",
    percentage: "Pourcentage",
    addMember: "Ajouter un membre",
    servicesTitle: "Services inclus et options",
    paymentTitle: "Résumé et paiement",
    card: "Carte bancaire",
    transfer: "Virement bancaire",
    upload: "Upload justificatif",
    whatsapp: "Envoyer via WhatsApp",
    searchCountry: "Rechercher un pays ou indicatif...",
    validateError: "Corrige les champs avant de continuer.",
    nm: "New Mexico",
    wy: "Wyoming",
    nmDesc: "Confidentialité, coût optimisé, structure simple.",
    wyDesc: "Image corporate plus forte, traitement généralement plus rapide.",
  },
  en: {
    steps: ["State & package", "LLC name", "Activity", "Owner", "Country & phone", "Members", "Services", "Payment"],
    badge: "US LLC formation",
    title: "Start your LLC smoothly",
    subtitle: "A clean, premium and secure flow to collect the required information, validate every step and create your client portal.",
    next: "Continue",
    back: "Back",
    required: "Required field.",
    invalid: "Invalid information.",
    edit: "Edit",
    summary: "Summary",
    total: "Estimated total",
    state: "State",
    package: "Package",
    services: "Services",
    client: "Client",
    payment: "Payment",
    included: "Included",
    chooseState: "Choose the formation state",
    choosePack: "Choose your package",
    llcName: "LLC name",
    llcHint: "The name must contain at least 3 characters.",
    noNameYet: "I have not chosen the name yet",
    designator: "Designator",
    altName: "Alternative name",
    activity: "Activity",
    sector: "Sector",
    description: "Short activity description",
    owner: "Owner / client account",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    confirmEmail: "Confirm email",
    password: "Password",
    confirmPassword: "Confirm password",
    countryPhone: "Country, phone and address",
    country: "Country of residence",
    dial: "Code",
    phone: "Phone / WhatsApp",
    city: "City",
    address: "Address",
    members: "Structure / members",
    single: "Single-member LLC",
    multi: "Multi-member LLC",
    management: "Management",
    percentage: "Percentage",
    addMember: "Add member",
    servicesTitle: "Included services and options",
    paymentTitle: "Summary and payment",
    card: "Card payment",
    transfer: "Bank transfer",
    upload: "Upload proof",
    whatsapp: "Send via WhatsApp",
    searchCountry: "Search country or code...",
    validateError: "Fix the fields before continuing.",
    nm: "New Mexico",
    wy: "Wyoming",
    nmDesc: "Privacy, optimized cost, simple structure.",
    wyDesc: "Stronger corporate image, generally faster processing.",
  },
};

type Member = {
  name: string;
  country: string;
  percentage: string;
};

type Form = {
  state: StateKey | "";
  pack: PackKey | "";
  llcName: string;
  noNameYet: boolean;
  designator: string;
  altName: string;
  sector: string;
  activityDesc: string;
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  country: Country;
  dial: Country;
  phone: string;
  city: string;
  address: string;
  structure: "single" | "multi";
  management: "member" | "manager";
  members: Member[];
  services: string[];
  payment: PaymentMethod;
  proofName: string;
};

const defaultCountry = countries[0];

const serviceOptions = [
  { key: "ein", labelFr: "Demande EIN", labelEn: "EIN application", price: 0 },
  { key: "stripe", labelFr: "Assistance Stripe", labelEn: "Stripe assistance", price: 0 },
  { key: "mercury", labelFr: "Assistance Mercury", labelEn: "Mercury assistance", price: 0 },
  { key: "wise", labelFr: "Wise / Payoneer", labelEn: "Wise / Payoneer", price: 0 },
  { key: "phone", labelFr: "US Phone Number", labelEn: "US Phone Number", price: 0 },
  { key: "priority", labelFr: "Support prioritaire", labelEn: "Priority support", price: 29 },
];

export default function VemoPremiumStartFlow({ lang }: { lang: Lang }) {
  const t = text[lang];
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Form>({
    state: "newMexico",
    pack: "standard",
    llcName: "",
    noNameYet: false,
    designator: "LLC",
    altName: "",
    sector: "",
    activityDesc: "",
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    country: defaultCountry,
    dial: defaultCountry,
    phone: "",
    city: "",
    address: "",
    structure: "single",
    management: "member",
    members: [{ name: "", country: defaultCountry.name, percentage: "100" }],
    services: ["ein", "stripe", "mercury"],
    payment: "",
    proofName: "",
  });

  const selectedPack = form.state && form.pack ? packs[form.state][form.pack] : null;

  const total = useMemo(() => {
    const base = selectedPack?.price || 0;
    const extra = serviceOptions.filter((s) => form.services.includes(s.key)).reduce((sum, s) => sum + s.price, 0);
    return base + extra;
  }, [selectedPack, form.services]);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  function validateStep(targetStep = step) {
    const e: Record<string, string> = {};

    if (targetStep === 0) {
      if (!form.state) e.state = t.required;
      if (!form.pack) e.pack = t.required;
    }

    if (targetStep === 1) {
      if (!form.noNameYet && form.llcName.trim().length < 3) e.llcName = t.llcHint;
      if (form.llcName.toLowerCase().split("llc").length > 2) e.llcName = t.invalid;
      if (!form.designator) e.designator = t.required;
    }

    if (targetStep === 2) {
      if (!form.sector.trim()) e.sector = t.required;
      if (form.activityDesc.trim().length < 20) e.activityDesc = lang === "fr" ? "Minimum 20 caractères." : "Minimum 20 characters.";
      if (["test", "business", "commerce"].includes(form.activityDesc.trim().toLowerCase())) e.activityDesc = t.invalid;
    }

    if (targetStep === 3) {
      if (!form.firstName.trim()) e.firstName = t.required;
      if (!form.lastName.trim()) e.lastName = t.required;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.invalid;
      if (form.email !== form.confirmEmail) e.confirmEmail = lang === "fr" ? "Les emails ne correspondent pas." : "Emails do not match.";
      if (form.password.length < 8) e.password = lang === "fr" ? "Mot de passe trop court." : "Password too short.";
      if (form.password !== form.confirmPassword) e.confirmPassword = lang === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match.";
    }

    if (targetStep === 4) {
      const phoneDigits = form.phone.replace(/\D/g, "");
      if (!form.country?.name) e.country = t.required;
      if (!form.dial?.dial) e.dial = t.required;
      if (phoneDigits.length < form.dial.min || phoneDigits.length > form.dial.max) e.phone = t.invalid;
      if (!/^[A-Za-zÀ-ÿ\s'-]{2,}$/.test(form.city.trim())) e.city = t.invalid;
      if (form.address.trim().length < 8) e.address = t.invalid;
    }

    if (targetStep === 5) {
      if (!form.members.length) e.members = t.required;
      const sum = form.members.reduce((acc, m) => acc + Number(m.percentage || 0), 0);
      form.members.forEach((m, i) => {
        if (!m.name.trim()) e[`memberName${i}`] = t.required;
        if (!m.country.trim()) e[`memberCountry${i}`] = t.required;
      });
      if (sum !== 100) e.members = lang === "fr" ? "Le total des pourcentages doit être égal à 100%." : "Total ownership must equal 100%.";
    }

    if (targetStep === 7) {
      if (!form.payment) e.payment = t.required;
      if (form.payment === "transfer" && !form.proofName) e.proofName = lang === "fr" ? "Justificatif obligatoire." : "Proof is required.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => Math.min(7, s + 1));
    setErrors({});
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
    setErrors({});
  }

  function goTo(i: number) {
    if (i <= step || validateStep()) {
      setStep(i);
      setErrors({});
    }
  }

  function toggleService(key: string) {
    set("services", form.services.includes(key) ? form.services.filter((s) => s !== key) : [...form.services, key]);
  }

  function memberUpdate(index: number, key: keyof Member, value: string) {
    const nextMembers = [...form.members];
    nextMembers[index] = { ...nextMembers[index], [key]: value };
    set("members", nextMembers);
  }

  function addMember() {
    set("members", [...form.members, { name: "", country: defaultCountry.name, percentage: "" }]);
  }

  return (
    <main className="vemo-flow">
      <section className="vemo-flow-inner">
        <div className="vemo-flow-head">
          <div>
            <span>{t.badge}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          <div className="vemo-flow-total">
            <small>{t.total}</small>
            <strong>{total} USD</strong>
          </div>
        </div>

        <div className="vemo-flow-stepper">
          {t.steps.map((label, i) => (
            <button key={label} onClick={() => goTo(i)} className={i === step ? "active" : i < step ? "done" : ""}>
              <strong>{String(i + 1).padStart(2, "0")}</strong>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="vemo-flow-grid">
          <article className="vemo-flow-card">
            {errors.global && <div className="vemo-flow-alert">{errors.global}</div>}
            {step === 0 && (
              <StepBlock kicker="01" title={t.chooseState}>
                <div className="vemo-flow-two">
                  <Choice active={form.state === "newMexico"} title={t.nm} desc={t.nmDesc} onClick={() => set("state", "newMexico")} />
                  <Choice active={form.state === "wyoming"} title={t.wy} desc={t.wyDesc} onClick={() => set("state", "wyoming")} />
                </div>
                <h3 className="vemo-flow-subtitle">{t.choosePack}</h3>
                <div className="vemo-flow-three">
                  {(["starter", "standard", "premium"] as PackKey[]).map((key) => {
                    const p = form.state ? packs[form.state][key] : null;
                    if (!p) return null;
                    return (
                      <button key={key} className={`vemo-flow-pack ${form.pack === key ? "active" : ""}`} onClick={() => set("pack", key)}>
                        <span>{p.name}</span>
                        <strong>{p.price} USD</strong>
                        <small>{lang === "fr" ? p.descFr : p.descEn}</small>
                      </button>
                    );
                  })}
                </div>
              </StepBlock>
            )}

            {step === 1 && (
              <StepBlock kicker="02" title={t.llcName}>
                <label className="vemo-flow-check">
                  <input type="checkbox" checked={form.noNameYet} onChange={(e) => set("noNameYet", e.target.checked)} />
                  {t.noNameYet}
                </label>
                <div className="vemo-flow-two">
                  <Field label={t.llcName} value={form.llcName} onChange={(v) => set("llcName", v)} error={errors.llcName} disabled={form.noNameYet} />
                  <Select label={t.designator} value={form.designator} onChange={(v) => set("designator", v)} options={["LLC", "L.L.C.", "Limited Liability Company"]} error={errors.designator} />
                  <Field label={t.altName} value={form.altName} onChange={(v) => set("altName", v)} />
                </div>
              </StepBlock>
            )}

            {step === 2 && (
              <StepBlock kicker="03" title={t.activity}>
                <div className="vemo-flow-two">
                  <Select label={t.sector} value={form.sector} onChange={(v) => set("sector", v)} options={["E-commerce", "Consulting", "Digital services", "Agency", "Holding", "Trading", "Other"]} error={errors.sector} />
                  <Field label={t.description} value={form.activityDesc} onChange={(v) => set("activityDesc", v)} error={errors.activityDesc} textarea />
                </div>
              </StepBlock>
            )}

            {step === 3 && (
              <StepBlock kicker="04" title={t.owner}>
                <div className="vemo-flow-two">
                  <Field label={t.firstName} value={form.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} />
                  <Field label={t.lastName} value={form.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} />
                  <Field label={t.email} value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
                  <Field label={t.confirmEmail} value={form.confirmEmail} onChange={(v) => set("confirmEmail", v)} error={errors.confirmEmail} />
                  <Field label={t.password} value={form.password} onChange={(v) => set("password", v)} error={errors.password} type="password" />
                  <Field label={t.confirmPassword} value={form.confirmPassword} onChange={(v) => set("confirmPassword", v)} error={errors.confirmPassword} type="password" />
                </div>
              </StepBlock>
            )}

            {step === 4 && (
              <StepBlock kicker="05" title={t.countryPhone}>
                <div className="vemo-flow-two">
                  <CountrySelect label={t.country} value={form.country} onChange={(c) => { set("country", c); set("dial", c); }} searchLabel={t.searchCountry} error={errors.country} />
                  <CountrySelect label={t.dial} value={form.dial} onChange={(c) => set("dial", c)} searchLabel={t.searchCountry} error={errors.dial} dialOnly />
                  <Field label={t.phone} value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
                  <Field label={t.city} value={form.city} onChange={(v) => set("city", v)} error={errors.city} />
                  <Field label={t.address} value={form.address} onChange={(v) => set("address", v)} error={errors.address} />
                </div>
              </StepBlock>
            )}

            {step === 5 && (
              <StepBlock kicker="06" title={t.members}>
                <div className="vemo-flow-two">
                  <Choice active={form.structure === "single"} title={t.single} desc="100%" onClick={() => { set("structure", "single"); set("members", [{ name: form.firstName + " " + form.lastName, country: form.country.name, percentage: "100" }]); }} />
                  <Choice active={form.structure === "multi"} title={t.multi} desc="2+ members" onClick={() => set("structure", "multi")} />
                </div>
                <Select label={t.management} value={form.management} onChange={(v) => set("management", v as Form["management"])} options={["member", "manager"]} />
                <div className="vemo-flow-members">
                  {form.members.map((m, i) => (
                    <div className="vemo-flow-member" key={i}>
                      <Field label={`${t.client} ${i + 1}`} value={m.name} onChange={(v) => memberUpdate(i, "name", v)} error={errors[`memberName${i}`]} />
                      <Field label={t.country} value={m.country} onChange={(v) => memberUpdate(i, "country", v)} error={errors[`memberCountry${i}`]} />
                      <Field label={t.percentage} value={m.percentage} onChange={(v) => memberUpdate(i, "percentage", v.replace(/\D/g, ""))} />
                    </div>
                  ))}
                </div>
                {errors.members && <p className="vemo-flow-error">{errors.members}</p>}
                <button className="vemo-flow-light" onClick={addMember}>{t.addMember}</button>
              </StepBlock>
            )}

            {step === 6 && (
              <StepBlock kicker="07" title={t.servicesTitle}>
                <div className="vemo-flow-services">
                  {serviceOptions.map((s) => (
                    <button key={s.key} className={`vemo-flow-service ${form.services.includes(s.key) ? "active" : ""}`} onClick={() => toggleService(s.key)}>
                      <span>{lang === "fr" ? s.labelFr : s.labelEn}</span>
                      <strong>{s.price ? `+${s.price} USD` : t.included}</strong>
                    </button>
                  ))}
                </div>
              </StepBlock>
            )}

            {step === 7 && (
              <StepBlock kicker="08" title={t.paymentTitle}>
                <div className="vemo-flow-summary-mobile">
                  <Summary t={t} form={form} selectedPack={selectedPack} total={total} lang={lang} />
                </div>
                <div className="vemo-flow-two">
                  <Choice active={form.payment === "card"} title={t.card} desc="Stripe embedded" onClick={() => set("payment", "card")} />
                  <Choice active={form.payment === "transfer"} title={t.transfer} desc={t.upload} onClick={() => set("payment", "transfer")} />
                </div>
                {errors.payment && <p className="vemo-flow-error">{errors.payment}</p>}
                {form.payment === "transfer" && (
                  <div className="vemo-flow-upload">
                    <label>
                      {t.upload}
                      <input type="file" onChange={(e) => set("proofName", e.target.files?.[0]?.name || "")} />
                    </label>
                    {form.proofName && <span>{form.proofName}</span>}
                    {errors.proofName && <p className="vemo-flow-error">{errors.proofName}</p>}
                  </div>
                )}
              </StepBlock>
            )}

            <div className="vemo-flow-actions">
              <button onClick={back} className="vemo-flow-back" disabled={step === 0}>← {t.back}</button>
              <button onClick={next} className="vemo-flow-next">{step === 7 ? t.paymentTitle : t.next} →</button>
            </div>
          </article>

          <aside className="vemo-flow-side">
            <Summary t={t} form={form} selectedPack={selectedPack} total={total} lang={lang} />
          </aside>
        </div>
      </section>
    </main>
  );
}

function StepBlock({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="vemo-flow-kicker">STEP {kicker}</div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Choice({ active, title, desc, onClick }: { active: boolean; title: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" className={`vemo-flow-choice ${active ? "active" : ""}`} onClick={onClick}>
      <span>{title}</span>
      <small>{desc}</small>
    </button>
  );
}

function Field({ label, value, onChange, error, textarea = false, disabled = false, type = "text" }: { label: string; value: string; onChange: (v: string) => void; error?: string; textarea?: boolean; disabled?: boolean; type?: string }) {
  return (
    <label className="vemo-flow-field">
      <span>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      )}
      {error && <em>{error}</em>}
    </label>
  );
}

function Select({ label, value, onChange, options, error }: { label: string; value: string; onChange: (v: string) => void; options: string[]; error?: string }) {
  return (
    <label className="vemo-flow-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <em>{error}</em>}
    </label>
  );
}

function CountrySelect({ label, value, onChange, searchLabel, error, dialOnly = false }: { label: string; value: Country; onChange: (c: Country) => void; searchLabel: string; error?: string; dialOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const list = countries.filter((c) => {
    const target = `${c.name} ${c.code} ${c.dial}`.toLowerCase();
    return target.includes(q.toLowerCase());
  });

  return (
    <div className="vemo-flow-country">
      <span>{label}</span>
      <button type="button" onClick={() => setOpen(!open)}>
        <b>{value.flag}</b>
        <strong>{dialOnly ? value.dial : value.name}</strong>
        <small>{dialOnly ? value.name : value.dial}</small>
      </button>
      {open && (
        <div className="vemo-flow-country-menu">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchLabel} />
          <div>
            {list.map((c) => (
              <button type="button" key={`${c.code}-${c.dial}`} onClick={() => { onChange(c); setOpen(false); setQ(""); }}>
                <b>{c.flag}</b>
                <span>{c.name}</span>
                <strong>{c.dial}</strong>
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <em>{error}</em>}
    </div>
  );
}

function Summary({ t, form, selectedPack, total, lang }: { t: typeof text.fr; form: Form; selectedPack: { name: string; price: number; descFr: string; descEn: string } | null; total: number; lang: Lang }) {
  return (
    <div className="vemo-flow-summary">
      <h3>{t.summary}</h3>
      <Row label={t.state} value={form.state === "newMexico" ? t.nm : t.wy} />
      <Row label={t.package} value={selectedPack ? `${selectedPack.name} — ${selectedPack.price} USD` : "—"} />
      <Row label={t.client} value={form.email || "—"} />
      <Row label={t.services} value={form.services.length ? `${form.services.length} ${t.included}` : "—"} />
      <Row label={t.payment} value={form.payment || "—"} />
      <div className="vemo-flow-total-card">
        <span>{t.total}</span>
        <strong>{total} USD</strong>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="vemo-flow-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
