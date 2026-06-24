"use client";

import { useMemo, useState } from "react";

type Lang = "fr" | "en";
type StateKey = "newMexico" | "wyoming";
type PackKey = "starter" | "standard" | "premium";

type FormState = {
  state: StateKey;
  pack: PackKey;
  llcName: string;
  altName: string;
  activity: string;
  email: string;
  phone: string;
  ownerName: string;
  country: string;
  members: string;
  address: string;
  services: string[];
  payment: "card" | "transfer";
};

const packs: Record<StateKey, Record<PackKey, { label: string; price: number; desc: string }>> = {
  newMexico: {
    starter: { label: "Starter", price: 129, desc: "LLC formation documents and registered agent first year." },
    standard: { label: "Standard", price: 149, desc: "LLC documents, EIN request and support." },
    premium: { label: "Premium", price: 199, desc: "Full package with banking guidance and priority support." },
  },
  wyoming: {
    starter: { label: "Starter", price: 149, desc: "Wyoming LLC formation documents and registered agent first year." },
    standard: { label: "Standard", price: 179, desc: "Wyoming LLC documents, EIN request and support." },
    premium: { label: "Premium", price: 229, desc: "Full Wyoming package with banking guidance and priority support." },
  },
};

const copy = {
  fr: {
    backHome: "Retour accueil",
    steps: ["État", "Formule", "Nom LLC", "Activité", "Compte", "Membres", "Adresse", "Services", "Résumé", "Paiement"],
    title: "Créer votre LLC US",
    subtitle: "Un tunnel clair en 10 étapes pour créer votre société, préparer l’EIN et suivre votre dossier.",
    next: "Continuer",
    previous: "Retour",
    stateTitle: "Choisissez l’État de création",
    stateText: "L’État doit être choisi avant la formule, car les prix et les délais peuvent changer.",
    nm: "New Mexico",
    wy: "Wyoming",
    nmText: "Confidentialité, coût optimisé et structure simple pour les entrepreneurs non-résidents.",
    wyText: "État reconnu, image corporate plus forte et traitement généralement plus rapide.",
    packTitle: "Choisissez votre formule",
    llcTitle: "Nom de votre LLC",
    activityTitle: "Activité de la société",
    accountTitle: "Compte client",
    membersTitle: "Membres / propriétaire",
    addressTitle: "Adresse",
    servicesTitle: "Services inclus",
    summaryTitle: "Résumé",
    paymentTitle: "Paiement",
    summary: "Résumé",
    total: "Total estimé",
    included: "Inclus",
    toChoose: "À choisir",
    fields: {
      llcName: "Nom souhaité de la LLC",
      altName: "Nom alternatif",
      activity: "Activité",
      email: "Email",
      phone: "Téléphone",
      ownerName: "Nom complet du propriétaire",
      country: "Pays",
      members: "Membres / associés",
      address: "Adresse",
    },
    services: ["Demande EIN", "Assistance Stripe", "Assistance Mercury", "Wise / Payoneer", "US Phone Number"],
    card: "Carte bancaire",
    transfer: "Virement bancaire",
  },
  en: {
    backHome: "Back home",
    steps: ["State", "Package", "LLC name", "Activity", "Account", "Members", "Address", "Services", "Summary", "Payment"],
    title: "Start your US LLC",
    subtitle: "A clean 10-step flow to form your company, apply for EIN and track your file.",
    next: "Continue",
    previous: "Back",
    stateTitle: "Choose the formation state",
    stateText: "Choose the state before selecting a package, because pricing and timelines may vary.",
    nm: "New Mexico",
    wy: "Wyoming",
    nmText: "Privacy, optimized cost, and a simple structure for non-resident entrepreneurs.",
    wyText: "Recognized state, stronger corporate image, and generally faster processing.",
    packTitle: "Choose your package",
    llcTitle: "Your LLC name",
    activityTitle: "Business activity",
    accountTitle: "Client account",
    membersTitle: "Members / owner",
    addressTitle: "Address",
    servicesTitle: "Included services",
    summaryTitle: "Summary",
    paymentTitle: "Payment",
    summary: "Summary",
    total: "Estimated total",
    included: "Included",
    toChoose: "To choose",
    fields: {
      llcName: "Desired LLC name",
      altName: "Alternative name",
      activity: "Activity",
      email: "Email",
      phone: "Phone",
      ownerName: "Owner full name",
      country: "Country",
      members: "Members / owners",
      address: "Address",
    },
    services: ["EIN application", "Stripe assistance", "Mercury assistance", "Wise / Payoneer", "US Phone Number"],
    card: "Card payment",
    transfer: "Bank transfer",
  },
};

export default function VemoStartFlowClean({ language }: { language: Lang }) {
  const t = copy[language];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    state: "newMexico",
    pack: "starter",
    llcName: "",
    altName: "",
    activity: "",
    email: "",
    phone: "",
    ownerName: "",
    country: "Morocco",
    members: "",
    address: "",
    services: [],
    payment: "card",
  });

  const currentPack = packs[form.state][form.pack];

  const total = useMemo(() => {
    let value = currentPack.price;
    if (form.services.includes(t.services[4])) value += 0;
    return value;
  }, [currentPack.price, form.services, t.services]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  function toggleService(service: string) {
    setForm((old) => ({
      ...old,
      services: old.services.includes(service)
        ? old.services.filter((s) => s !== service)
        : [...old.services, service],
    }));
  }

  function input(key: keyof FormState, label: string) {
    return (
      <label className="vemo10-field">
        <span>{label}</span>
        <input
          value={String(form[key] || "")}
          onChange={(e) => update(key as any, e.target.value as any)}
        />
      </label>
    );
  }

  function renderStep() {
    if (step === 0) {
      return (
        <>
          <div className="vemo10-kicker">STEP 01</div>
          <h1>{t.stateTitle}</h1>
          <p className="vemo10-lead">{t.stateText}</p>

          <div className="vemo10-choice-grid">
            <button className={`vemo10-choice ${form.state === "newMexico" ? "active" : ""}`} onClick={() => update("state", "newMexico")}>
              <span>{t.nm}</span>
              <small>{t.nmText}</small>
            </button>
            <button className={`vemo10-choice ${form.state === "wyoming" ? "active" : ""}`} onClick={() => update("state", "wyoming")}>
              <span>{t.wy}</span>
              <small>{t.wyText}</small>
            </button>
          </div>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <div className="vemo10-kicker">STEP 02</div>
          <h1>{t.packTitle}</h1>
          <div className="vemo10-pack-list">
            {(Object.keys(packs[form.state]) as PackKey[]).map((key) => (
              <button key={key} className={`vemo10-pack ${form.pack === key ? "active" : ""}`} onClick={() => update("pack", key)}>
                <span>
                  {form.state === "newMexico" ? "New Mexico" : "Wyoming"} {packs[form.state][key].label}
                </span>
                <strong>{packs[form.state][key].price} USD</strong>
                <small>{packs[form.state][key].desc}</small>
              </button>
            ))}
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <div className="vemo10-kicker">STEP 03</div>
          <h1>{t.llcTitle}</h1>
          <div className="vemo10-form-grid">
            {input("llcName", t.fields.llcName)}
            {input("altName", t.fields.altName)}
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <div className="vemo10-kicker">STEP 04</div>
          <h1>{t.activityTitle}</h1>
          {input("activity", t.fields.activity)}
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <div className="vemo10-kicker">STEP 05</div>
          <h1>{t.accountTitle}</h1>
          <div className="vemo10-form-grid">
            {input("email", t.fields.email)}
            {input("phone", t.fields.phone)}
          </div>
        </>
      );
    }

    if (step === 5) {
      return (
        <>
          <div className="vemo10-kicker">STEP 06</div>
          <h1>{t.membersTitle}</h1>
          <div className="vemo10-form-grid">
            {input("ownerName", t.fields.ownerName)}
            {input("members", t.fields.members)}
          </div>
        </>
      );
    }

    if (step === 6) {
      return (
        <>
          <div className="vemo10-kicker">STEP 07</div>
          <h1>{t.addressTitle}</h1>
          <div className="vemo10-form-grid">
            {input("country", t.fields.country)}
            {input("address", t.fields.address)}
          </div>
        </>
      );
    }

    if (step === 7) {
      return (
        <>
          <div className="vemo10-kicker">STEP 08</div>
          <h1>{t.servicesTitle}</h1>
          <div className="vemo10-services">
            {t.services.map((service) => (
              <button key={service} className={`vemo10-service ${form.services.includes(service) ? "active" : ""}`} onClick={() => toggleService(service)}>
                <span>{service}</span>
                <small>{t.included}</small>
              </button>
            ))}
          </div>
        </>
      );
    }

    if (step === 8) {
      return (
        <>
          <div className="vemo10-kicker">STEP 09</div>
          <h1>{t.summaryTitle}</h1>
          <div className="vemo10-summary-box">
            <Row label={t.steps[0]} value={form.state === "newMexico" ? t.nm : t.wy} />
            <Row label={t.steps[1]} value={`${currentPack.label} — ${currentPack.price} USD`} />
            <Row label={t.steps[2]} value={form.llcName || t.toChoose} />
            <Row label={t.steps[7]} value={form.services.length ? form.services.join(", ") : t.included} />
            <Row label={t.total} value={`${total} USD`} strong />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="vemo10-kicker">STEP 10</div>
        <h1>{t.paymentTitle}</h1>
        <div className="vemo10-choice-grid">
          <button className={`vemo10-choice ${form.payment === "card" ? "active" : ""}`} onClick={() => update("payment", "card")}>
            <span>{t.card}</span>
            <small>Stripe</small>
          </button>
          <button className={`vemo10-choice ${form.payment === "transfer" ? "active" : ""}`} onClick={() => update("payment", "transfer")}>
            <span>{t.transfer}</span>
            <small>Upload proof</small>
          </button>
        </div>
      </>
    );
  }

  return (
    <main className="vemo10">
      <section className="vemo10-wrap">
        <div className="vemo10-stepper">
          {t.steps.map((label, index) => (
            <button key={label} className={`vemo10-step ${index === step ? "active" : ""}`} onClick={() => setStep(index)}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="vemo10-grid">
          <article className="vemo10-card">
            {renderStep()}

            <div className="vemo10-actions">
              <button className="vemo10-secondary" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                ← {t.previous}
              </button>
              <button className="vemo10-primary" onClick={() => setStep((s) => Math.min(9, s + 1))}>
                {t.next} →
              </button>
            </div>
          </article>

          <aside className="vemo10-side">
            <h2>{t.summary}</h2>
            <div className="vemo10-progress">
              <span style={{ width: `${(step + 1) * 10}%` }} />
            </div>
            <Row label={t.steps[0]} value={form.state === "newMexico" ? t.nm : t.wy} />
            <Row label={t.steps[1]} value={currentPack.label} />
            <Row label={t.steps[7]} value={form.services.length ? form.services.length + " " + t.included : t.included} />
            <div className="vemo10-total">
              <span>{t.total}</span>
              <strong>{total} USD</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="vemo10-row">
      <span>{label}</span>
      <strong className={strong ? "is-strong" : ""}>{value}</strong>
    </div>
  );
}
