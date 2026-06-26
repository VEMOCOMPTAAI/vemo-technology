"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type Lang = "fr" | "en";
type StateKey = "newMexico" | "wyoming";
type PackKey = "starter" | "standard" | "premium";
type PaymentMethod = "card" | "transfer" | "";
type Management = "member-managed" | "manager-managed";

type Country = {
  name: string;
  code: string;
  dial: string;
  flag: string;
  min: number;
  max: number;
};

type PackInfo = {
  name: string;
  price: number;
  descFr: string;
  descEn: string;
};

type Member = {
  name: string;
  country: string;
  role: string;
  percentage: string;
};

type Form = {
  state: StateKey;
  pack: PackKey;
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
  management: Management;
  members: Member[];
  services: string[];
  payment: PaymentMethod;
  proofName: string;
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
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

const defaultCountry = countries[0];

const packs: Record<StateKey, Record<PackKey, PackInfo>> = {
  newMexico: {
    starter: { name: "Starter", price: 129, descFr: "L’essentiel pour créer votre LLC.", descEn: "Essential package to form your LLC." },
    standard: { name: "Standard", price: 149, descFr: "La formule recommandée pour démarrer sérieusement.", descEn: "Recommended package to start seriously." },
    premium: { name: "Premium", price: 199, descFr: "L’offre complète pour structurer votre activité.", descEn: "Complete package to structure your business." },
  },
  wyoming: {
    starter: { name: "Starter", price: 149, descFr: "L’essentiel pour créer votre LLC Wyoming.", descEn: "Essential package to form your Wyoming LLC." },
    standard: { name: "Standard", price: 179, descFr: "Formule renforcée avec image corporate plus forte.", descEn: "Enhanced package with stronger corporate image." },
    premium: { name: "Premium", price: 229, descFr: "Accompagnement complet avec support prioritaire.", descEn: "Complete support with priority assistance." },
  },
};

const includedByPack: Record<PackKey, string[]> = {
  starter: ["llcDocs", "stateFiling", "registeredAgent"],
  standard: ["llcDocs", "stateFiling", "registeredAgent", "ein", "stripe", "mercury"],
  premium: ["llcDocs", "stateFiling", "registeredAgent", "ein", "stripe", "mercury", "wise", "paypal", "shopify", "priority"],
};

const serviceLabels = {
  fr: {
    llcDocs: "Documents de création LLC",
    stateFiling: "Frais de dépôt inclus",
    registeredAgent: "Registered Agent offert 1 an",
    ein: "Demande EIN",
    stripe: "Assistance Stripe",
    mercury: "Assistance Mercury",
    wise: "Wise / Payoneer",
    paypal: "PayPal",
    shopify: "Shopify 3 mois + domaine",
    priority: "Support prioritaire",
  },
  en: {
    llcDocs: "LLC formation documents",
    stateFiling: "State filing fees included",
    registeredAgent: "Registered Agent included for 1 year",
    ein: "EIN application",
    stripe: "Stripe assistance",
    mercury: "Mercury assistance",
    wise: "Wise / Payoneer",
    paypal: "PayPal",
    shopify: "Shopify 3 months + domain",
    priority: "Priority support",
  },
};

const copy = {
  fr: {
    steps: ["État & formule", "Nom LLC", "Activité", "Propriétaire", "Pays & téléphone", "Structure", "Services", "Paiement"],
    badge: "Création LLC US",
    title: "Créer votre LLC simplement",
    subtitle: "Tunnel premium en 8 étapes, avec validation obligatoire avant de continuer.",
    next: "Continuer",
    back: "Retour",
    final: "Finaliser le dossier",
    required: "Champ obligatoire.",
    invalid: "Information invalide.",
    summary: "Résumé",
    total: "Total estimé",
    state: "État",
    package: "Formule",
    services: "Services inclus",
    client: "Client",
    payment: "Paiement",
    chooseState: "État de création",
    choosePack: "Formule adaptée",
    llcName: "Nom de la LLC",
    noNameYet: "Je n’ai pas encore choisi le nom",
    designator: "Designator",
    altName: "Nom alternatif",
    activity: "Activité",
    sector: "Secteur",
    description: "Description de l’activité",
    owner: "Propriétaire et compte client",
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
    structure: "Structure et gestion",
    single: "LLC à membre unique",
    multi: "LLC à plusieurs membres",
    management: "Mode de gestion",
    memberManaged: "Member-managed",
    managerManaged: "Manager-managed",
    member: "Membre",
    role: "Rôle",
    percentage: "Pourcentage",
    addMember: "Ajouter un membre",
    servicesTitle: "Services de votre formule",
    paymentTitle: "Paiement et création espace client",
    card: "Carte bancaire",
    transfer: "Virement bancaire",
    cardHolder: "Titulaire de la carte",
    cardNumber: "Numéro de carte",
    expiry: "MM/AA",
    cvc: "CVC",
    upload: "Justificatif de virement",
    whatsapp: "Envoyer la preuve via WhatsApp",
    secured: "Paiement sécurisé. L’espace client sera créé après validation.",
    bankNote: "Votre dossier passera en attente de vérification après l’envoi du justificatif.",
    searchCountry: "Rechercher un pays...",
    searchDial: "Rechercher indicatif...",
    nm: "New Mexico",
    wy: "Wyoming",
    nmDesc: "Confidentialité, coût optimisé, structure simple.",
    wyDesc: "Image corporate plus forte, traitement généralement plus rapide.",
    ready: "Dossier prêt à être créé.",
  },
  en: {
    steps: ["State & package", "LLC name", "Activity", "Owner", "Country & phone", "Structure", "Services", "Payment"],
    badge: "US LLC formation",
    title: "Start your LLC smoothly",
    subtitle: "Premium 8-step flow with mandatory validation before continuing.",
    next: "Continue",
    back: "Back",
    final: "Finalize file",
    required: "Required field.",
    invalid: "Invalid information.",
    summary: "Summary",
    total: "Estimated total",
    state: "State",
    package: "Package",
    services: "Included services",
    client: "Client",
    payment: "Payment",
    chooseState: "Formation state",
    choosePack: "Selected package",
    llcName: "LLC name",
    noNameYet: "I have not chosen the name yet",
    designator: "Designator",
    altName: "Alternative name",
    activity: "Activity",
    sector: "Sector",
    description: "Activity description",
    owner: "Owner and client account",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    confirmEmail: "Confirm email",
    password: "Password",
    confirmPassword: "Confirm password",
    countryPhone: "Country, phone and address",
    country: "Residence country",
    dial: "Code",
    phone: "Phone / WhatsApp",
    city: "City",
    address: "Address",
    structure: "Structure and management",
    single: "Single-member LLC",
    multi: "Multi-member LLC",
    management: "Management mode",
    memberManaged: "Member-managed",
    managerManaged: "Manager-managed",
    member: "Member",
    role: "Role",
    percentage: "Percentage",
    addMember: "Add member",
    servicesTitle: "Services in your package",
    paymentTitle: "Payment and client portal creation",
    card: "Card payment",
    transfer: "Bank transfer",
    cardHolder: "Cardholder name",
    cardNumber: "Card number",
    expiry: "MM/YY",
    cvc: "CVC",
    upload: "Transfer proof",
    whatsapp: "Send proof via WhatsApp",
    secured: "Secure payment. The client portal will be created after validation.",
    bankNote: "Your file will be pending verification after proof upload.",
    searchCountry: "Search country...",
    searchDial: "Search code...",
    nm: "New Mexico",
    wy: "Wyoming",
    nmDesc: "Privacy, optimized cost, simple structure.",
    wyDesc: "Stronger corporate image, generally faster processing.",
    ready: "File ready to be created.",
  },
};

type Copy = typeof copy.fr;

export default function VemoPremiumStartFlow({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const labels = serviceLabels[lang];

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
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
    management: "manager-managed",
    members: [{ name: "", country: defaultCountry.name, role: "Manager", percentage: "100" }],
    services: includedByPack.standard,
    payment: "",
    proofName: "",
    cardHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const selectedPack = packs[form.state][form.pack];

  const total = useMemo(() => selectedPack.price, [selectedPack.price]);

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  function chooseState(state: StateKey) {
    setForm((old) => ({ ...old, state, services: includedByPack[old.pack] }));
  }

  function choosePack(pack: PackKey) {
    setForm((old) => ({ ...old, pack, services: includedByPack[pack] }));
  }

  function cleanLocalPhone(value: string, dial: Country) {
    let digits = value.replace(/\D/g, "");
    const dialDigits = dial.dial.replace(/\D/g, "");
    if (digits.startsWith(dialDigits)) digits = digits.slice(dialDigits.length);
    if (digits.startsWith("0")) digits = digits.slice(1);
    return digits;
  }

  function handlePhone(value: string) {
    const compact = value.replace(/\s/g, "");
    if (compact.startsWith("+")) {
      const found = [...countries].sort((a, b) => b.dial.length - a.dial.length).find((c) => compact.startsWith(c.dial));
      if (found) {
        const rest = compact.slice(found.dial.length).replace(/\D/g, "");
        setForm((old) => ({ ...old, dial: found, country: found, phone: rest }));
        return;
      }
    }
    update("phone", value);
  }

  function syncSingleMember() {
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    setForm((old) => ({
      ...old,
      structure: "single",
      members: [{ name: fullName, country: old.country.name, role: "Manager", percentage: "100" }],
      management: "manager-managed",
    }));
  }

  function validate(target = step) {
    const e: Record<string, string> = {};

    if (target === 1) {
      if (!form.noNameYet && form.llcName.trim().length < 3) e.llcName = lang === "fr" ? "Minimum 3 caractères." : "Minimum 3 characters.";
      if (!form.designator) e.designator = t.required;
    }

    if (target === 2) {
      if (!form.sector.trim()) e.sector = t.required;
      if (form.activityDesc.trim().length < 20) e.activityDesc = lang === "fr" ? "Minimum 20 caractères." : "Minimum 20 characters.";
    }

    if (target === 3) {
      if (!form.firstName.trim()) e.firstName = t.required;
      if (!form.lastName.trim()) e.lastName = t.required;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.invalid;
      if (form.email !== form.confirmEmail) e.confirmEmail = lang === "fr" ? "Les emails ne correspondent pas." : "Emails do not match.";
      if (form.password.length < 8) e.password = lang === "fr" ? "Mot de passe trop court." : "Password too short.";
      if (form.password !== form.confirmPassword) e.confirmPassword = lang === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match.";
    }

    if (target === 4) {
      const phone = cleanLocalPhone(form.phone, form.dial);
      if (!form.country?.name) e.country = t.required;
      if (!form.dial?.dial) e.dial = t.required;
      if (phone.length < form.dial.min || phone.length > form.dial.max) e.phone = t.invalid;
      if (!/^[A-Za-zÀ-ÿ\s'-]{2,}$/.test(form.city.trim())) e.city = t.invalid;
      if (form.address.trim().length < 8) e.address = t.invalid;
    }

    if (target === 5) {
      const totalPct = form.members.reduce((sum, m) => sum + Number(m.percentage || 0), 0);
      form.members.forEach((m, i) => {
        if (!m.name.trim()) e[`memberName${i}`] = t.required;
        if (!m.country.trim()) e[`memberCountry${i}`] = t.required;
        if (!m.role.trim()) e[`memberRole${i}`] = t.required;
      });
      if (totalPct !== 100) e.members = lang === "fr" ? "Le total doit être égal à 100%." : "Total must equal 100%.";
    }

    if (target === 7) {
      if (!form.payment) e.payment = t.required;
      if (form.payment === "card") {
        const cardDigits = form.cardNumber.replace(/\D/g, "");
        if (form.cardHolder.trim().length < 3) e.cardHolder = t.required;
        if (cardDigits.length < 12 || cardDigits.length > 19) e.cardNumber = t.invalid;
        if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = t.invalid;
        if (!/^\d{3,4}$/.test(form.cardCvc)) e.cardCvc = t.invalid;
      }
      if (form.payment === "transfer" && !form.proofName) e.proofName = lang === "fr" ? "Justificatif obligatoire." : "Proof is required.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate()) return;
    if (step === 7) {
      setSubmitted(true);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(7, s + 1));
  }

  function back() {
    setSubmitted(false);
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function goTo(i: number) {
    if (i <= step || validate()) {
      setSubmitted(false);
      setErrors({});
      setStep(i);
    }
  }

  function memberUpdate(index: number, key: keyof Member, value: string) {
    const nextMembers = [...form.members];
    nextMembers[index] = { ...nextMembers[index], [key]: value };
    update("members", nextMembers);
  }

  function addMember() {
    update("structure", "multi");
    update("members", [...form.members, { name: "", country: form.country.name, role: "Member", percentage: "" }]);
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
            {step === 0 && (
              <StepBlock kicker="01" title={t.chooseState}>
                <div className="vemo-flow-two">
                  <Choice active={form.state === "newMexico"} title={t.nm} desc={t.nmDesc} onClick={() => chooseState("newMexico")} />
                  <Choice active={form.state === "wyoming"} title={t.wy} desc={t.wyDesc} onClick={() => chooseState("wyoming")} />
                </div>

                <h3 className="vemo-flow-subtitle">{t.choosePack}</h3>
                <div className="vemo-flow-pack-row">
                  {(["starter", "standard", "premium"] as PackKey[]).map((key) => {
                    const pack = packs[form.state][key];
                    return (
                      <button key={key} className={`vemo-flow-pack ${form.pack === key ? "active" : ""}`} onClick={() => choosePack(key)}>
                        <span>{pack.name}</span>
                        <strong>{pack.price} USD</strong>
                        <small>{lang === "fr" ? pack.descFr : pack.descEn}</small>
                      </button>
                    );
                  })}
                </div>
              </StepBlock>
            )}

            {step === 1 && (
              <StepBlock kicker="02" title={t.llcName}>
                <label className="vemo-flow-check">
                  <input type="checkbox" checked={form.noNameYet} onChange={(e) => update("noNameYet", e.target.checked)} />
                  {t.noNameYet}
                </label>
                <div className="vemo-flow-two">
                  <Field label={t.llcName} value={form.llcName} onChange={(v) => update("llcName", v)} error={errors.llcName} disabled={form.noNameYet} />
                  <Select label={t.designator} value={form.designator} onChange={(v) => update("designator", v)} options={["LLC", "L.L.C.", "Limited Liability Company"]} error={errors.designator} />
                  <Field label={t.altName} value={form.altName} onChange={(v) => update("altName", v)} />
                </div>
              </StepBlock>
            )}

            {step === 2 && (
              <StepBlock kicker="03" title={t.activity}>
                <div className="vemo-flow-two">
                  <Select label={t.sector} value={form.sector} onChange={(v) => update("sector", v)} options={["E-commerce", "Consulting", "Digital services", "Agency", "Holding", "Trading", "Other"]} error={errors.sector} />
                  <Field label={t.description} value={form.activityDesc} onChange={(v) => update("activityDesc", v)} error={errors.activityDesc} textarea />
                </div>
              </StepBlock>
            )}

            {step === 3 && (
              <StepBlock kicker="04" title={t.owner}>
                <div className="vemo-flow-two">
                  <Field label={t.firstName} value={form.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
                  <Field label={t.lastName} value={form.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
                  <Field label={t.email} value={form.email} onChange={(v) => update("email", v)} error={errors.email} />
                  <Field label={t.confirmEmail} value={form.confirmEmail} onChange={(v) => update("confirmEmail", v)} error={errors.confirmEmail} />
                  <Field label={t.password} value={form.password} onChange={(v) => update("password", v)} error={errors.password} type="password" />
                  <Field label={t.confirmPassword} value={form.confirmPassword} onChange={(v) => update("confirmPassword", v)} error={errors.confirmPassword} type="password" />
                </div>
              </StepBlock>
            )}

            {step === 4 && (
              <StepBlock kicker="05" title={t.countryPhone}>
                <div className="vemo-flow-address-row">
                  <CountrySelect label={t.country} value={form.country} onChange={(c) => { update("country", c); update("dial", c); }} searchLabel={t.searchCountry} mode="country" error={errors.country} />
                  <Field label={t.city} value={form.city} onChange={(v) => update("city", v)} error={errors.city} />
                </div>

                <div className="vemo-flow-phone-row">
                  <CountrySelect label={t.dial} value={form.dial} onChange={(c) => update("dial", c)} searchLabel={t.searchDial} mode="dial" error={errors.dial} />
                  <Field label={t.phone} value={form.phone} onChange={handlePhone} error={errors.phone} placeholder="0651000000 / 651000000 / +212651000000" />
                </div>

                <Field label={t.address} value={form.address} onChange={(v) => update("address", v)} error={errors.address} />
              </StepBlock>
            )}

            {step === 5 && (
              <StepBlock kicker="06" title={t.structure}>
                <div className="vemo-flow-two">
                  <Choice active={form.structure === "single"} title={t.single} desc="100%" onClick={syncSingleMember} />
                  <Choice active={form.structure === "multi"} title={t.multi} desc="2+ members" onClick={() => update("structure", "multi")} />
                </div>

                <Select
                  label={t.management}
                  value={form.management}
                  onChange={(v) => update("management", v as Management)}
                  options={["member-managed", "manager-managed"]}
                />

                <div className="vemo-flow-members">
                  {form.members.map((m, i) => (
                    <div className="vemo-flow-member" key={i}>
                      <Field label={`${t.member} ${i + 1}`} value={m.name} onChange={(v) => memberUpdate(i, "name", v)} error={errors[`memberName${i}`]} />
                      <Field label={t.role} value={m.role} onChange={(v) => memberUpdate(i, "role", v)} error={errors[`memberRole${i}`]} />
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
                <div className="vemo-flow-service-note">
                  {form.state === "newMexico" ? t.nm : t.wy} · {selectedPack.name} · {selectedPack.price} USD
                </div>
                <div className="vemo-flow-services">
                  {form.services.map((key) => (
                    <div key={key} className="vemo-flow-service active">
                      <span>{labels[key as keyof typeof labels]}</span>
                      <strong>{lang === "fr" ? "Inclus" : "Included"}</strong>
                    </div>
                  ))}
                </div>
              </StepBlock>
            )}

            {step === 7 && (
              <StepBlock kicker="08" title={t.paymentTitle}>
                {submitted && <div className="vemo-flow-success">{t.ready}</div>}

                <div className="vemo-flow-pay-layout">
                  <div className="vemo-flow-pay-methods">
                    <Choice active={form.payment === "card"} title={t.card} desc="Stripe embedded" onClick={() => update("payment", "card")} />
                    <Choice active={form.payment === "transfer"} title={t.transfer} desc={t.upload} onClick={() => update("payment", "transfer")} />
                    {errors.payment && <p className="vemo-flow-error">{errors.payment}</p>}
                  </div>

                  <div className="vemo-flow-payment-panel">
                    {form.payment === "card" && (
                      <div className="vemo-flow-card-ui">
                        <Field label={t.cardHolder} value={form.cardHolder} onChange={(v) => update("cardHolder", v)} error={errors.cardHolder} />
                        <Field label={t.cardNumber} value={form.cardNumber} onChange={(v) => update("cardNumber", v)} error={errors.cardNumber} placeholder="4242 4242 4242 4242" />
                        <div className="vemo-flow-card-row">
                          <Field label={t.expiry} value={form.cardExpiry} onChange={(v) => update("cardExpiry", v)} error={errors.cardExpiry} placeholder="12/28" />
                          <Field label={t.cvc} value={form.cardCvc} onChange={(v) => update("cardCvc", v)} error={errors.cardCvc} placeholder="123" />
                        </div>
                        <p>{t.secured}</p>
                      </div>
                    )}

                    {form.payment === "transfer" && (
                      <div className="vemo-flow-transfer-ui">
                        <div>
                          <span>VEMO Technology</span>
                          <strong>{total} USD</strong>
                          <small>{t.bankNote}</small>
                        </div>
                        <label className="vemo-flow-upload">
                          {t.upload}
                          <input type="file" onChange={(e) => update("proofName", e.target.files?.[0]?.name || "")} />
                        </label>
                        {form.proofName && <b>{form.proofName}</b>}
                        {errors.proofName && <p className="vemo-flow-error">{errors.proofName}</p>}
                        <a className="vemo-flow-whatsapp" href="https://wa.me/" target="_blank">
                          {t.whatsapp}
                        </a>
                      </div>
                    )}

                    {!form.payment && (
                      <div className="vemo-flow-payment-empty">
                        <strong>{t.total}</strong>
                        <span>{total} USD</span>
                        <p>{lang === "fr" ? "Choisissez un moyen de paiement pour finaliser le dossier." : "Choose a payment method to finalize the file."}</p>
                      </div>
                    )}
                  </div>
                </div>
              </StepBlock>
            )}

            <div className="vemo-flow-actions">
              <button onClick={back} className="vemo-flow-back" disabled={step === 0}>← {t.back}</button>
              <button onClick={next} className="vemo-flow-next">{step === 7 ? t.final : t.next} →</button>
            </div>
          </article>

          <aside className="vemo-flow-side">
            <Summary t={t} form={form} selectedPack={selectedPack} total={total} labels={labels} />
          </aside>
        </div>
      </section>
    </main>
  );
}

function StepBlock({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
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

function Field({
  label,
  value,
  onChange,
  error,
  textarea = false,
  disabled = false,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  textarea?: boolean;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="vemo-flow-field">
      <span>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder={placeholder} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder={placeholder} />
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
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <em>{error}</em>}
    </label>
  );
}

function CountrySelect({
  label,
  value,
  onChange,
  searchLabel,
  error,
  mode,
}: {
  label: string;
  value: Country;
  onChange: (c: Country) => void;
  searchLabel: string;
  error?: string;
  mode: "country" | "dial";
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const list = countries.filter((c) => {
    const target = `${c.name} ${c.code} ${c.dial}`.toLowerCase();
    return target.includes(q.toLowerCase());
  });

  return (
    <div className={`vemo-flow-country ${mode === "dial" ? "is-dial" : "is-country"}`}>
      <span>{label}</span>
      <button type="button" onClick={() => setOpen(!open)}>
        <b>{value.flag}</b>
        <strong>{mode === "country" ? value.name : value.dial}</strong>
        {mode === "dial" && <small>{value.name}</small>}
      </button>

      {open && (
        <div className="vemo-flow-country-menu">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchLabel} />
          <div>
            {list.map((c) => (
              <button type="button" key={`${c.code}-${c.dial}`} onClick={() => { onChange(c); setOpen(false); setQ(""); }}>
                <b>{c.flag}</b>
                <span>{mode === "country" ? c.name : c.dial}</span>
                <strong>{mode === "country" ? c.code : c.name}</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <em>{error}</em>}
    </div>
  );
}

function Summary({
  t,
  form,
  selectedPack,
  total,
  labels,
}: {
  t: Copy;
  form: Form;
  selectedPack: PackInfo;
  total: number;
  labels: Record<string, string>;
}) {
  return (
    <div className="vemo-flow-summary">
      <h3>{t.summary}</h3>
      <Row label={t.state} value={form.state === "newMexico" ? t.nm : t.wy} />
      <Row label={t.package} value={`${selectedPack.name} — ${selectedPack.price} USD`} />
      <Row label={t.client} value={form.email || "—"} />
      <Row label={t.services} value={`${form.services.length} ${t.services}`} />
      <Row label={t.payment} value={form.payment || "—"} />
      <div className="vemo-flow-mini-services">
        {form.services.slice(0, 4).map((s) => <span key={s}>{labels[s]}</span>)}
      </div>
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
