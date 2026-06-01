import Link from "next/link";

const packs = [
  {
    name: "Starter",
    price: "129$",
    state: "New Mexico",
    description:
      "Création LLC simple avec les documents essentiels et Registered Agent offert la première année.",
    features: [
      "Documents de création LLC",
      "Frais de dépôt inclus",
      "Registered Agent offert 1 an",
      "US Phone Number offert 3 mois",
    ],
  },
  {
    name: "Standard",
    price: "149$",
    state: "New Mexico",
    description:
      "La formule équilibrée pour démarrer avec LLC, EIN et assistance bancaire.",
    features: [
      "Tout Starter",
      "Demande EIN",
      "Assistance Stripe",
      "Assistance Mercury",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "199$",
    state: "New Mexico",
    description:
      "Pack complet pour entrepreneurs qui veulent lancer leur activité plus rapidement.",
    features: [
      "Tout Standard",
      "Assistance PayPal",
      "Wise / Payoneer",
      "Shopify 3 mois + domaine 1 an",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Choisissez votre formule",
    text: "Starter, Standard ou Premium selon votre besoin.",
  },
  {
    number: "02",
    title: "Complétez vos informations",
    text: "Nous préparons votre dossier LLC avec les informations nécessaires.",
  },
  {
    number: "03",
    title: "Payez en ligne ou par virement",
    text: "Stripe ou virement avec justificatif envoyé depuis la plateforme.",
  },
  {
    number: "04",
    title: "Suivez votre dossier",
    text: "Documents, messages et statuts dans votre espace client.",
  },
];

const benefits = [
  "Parcours pensé pour les entrepreneurs non-résidents",
  "Suivi dossier depuis un espace client dédié",
  "Documents centralisés et archivés",
  "Communication directe avec VEMO",
  "Packs clairs et prix transparents",
  "Interface française et anglaise",
];

function WhatsAppOrangeButton() {
  return (
    <a
      href="https://wa.me/212708069471"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter VEMO sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#F15A24] text-white transition hover:bg-[#DB4F1C]"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.02 4C9.4 4 4.02 9.36 4.02 15.95c0 2.1.55 4.15 1.6 5.96L4 28l6.25-1.58a12.05 12.05 0 0 0 5.77 1.47c6.62 0 12-5.36 12-11.94C28.02 9.36 22.64 4 16.02 4Zm0 21.86c-1.78 0-3.52-.48-5.04-1.4l-.36-.21-3.7.94.98-3.6-.24-.37a9.84 9.84 0 0 1-1.51-5.27c0-5.47 4.43-9.92 9.87-9.92s9.87 4.45 9.87 9.92-4.43 9.91-9.87 9.91Zm5.42-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.29-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.29-.02-.45.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.48.71.3 1.27.49 1.7.63.71.22 1.36.19 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}

function HeroIllustration() {
  return (
    <div className="relative overflow-hidden rounded-[2.2rem] border border-[#E6EDF5] bg-white p-5">
      <div className="rounded-[1.8rem] bg-[#202731] p-5">
        <div className="grid gap-5">
          <div className="flex items-center justify-between rounded-[1.4rem] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#F15A24] text-sm font-black text-white">
                V
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
                  VEMO Technology
                </p>
                <p className="mt-1 text-lg font-black tracking-[-0.04em] text-[#111827]">
                  Business setup made simple
                </p>
              </div>
            </div>
            <div className="hidden rounded-full bg-[#FFF0EA] px-4 py-2 text-xs font-black text-[#F15A24] sm:block">
              Client portal
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Payment
              </p>
              <p className="mt-3 text-lg font-black text-[#123A63]">Under review</p>
              <div className="mt-4 h-2 rounded-full bg-[#E6EDF5]">
                <div className="h-2 w-2/3 rounded-full bg-[#F15A24]" />
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                File
              </p>
              <p className="mt-3 text-lg font-black text-[#123A63]">In progress</p>
              <div className="mt-4 flex gap-2">
                <span className="h-8 w-8 rounded-full bg-[#F15A24]" />
                <span className="h-8 w-8 rounded-full bg-[#FFF0EA]" />
                <span className="h-8 w-8 rounded-full bg-[#E6EDF5]" />
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Documents
              </p>
              <p className="mt-3 text-lg font-black text-[#123A63]">Ready</p>
              <div className="mt-4 rounded-[14px] border border-[#E6EDF5] bg-[#F8FAFC] px-3 py-2 text-xs font-black text-[#123A63]">
                EIN confirmation
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.6rem] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Timeline
                </p>
                <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
                  Live
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {["LLC form submitted", "State filing", "EIN request", "Final documents"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-black",
                          index < 2
                            ? "bg-[#F15A24] text-white"
                            : "bg-[#FFF0EA] text-[#F15A24]",
                        ].join(" ")}
                      >
                        {index < 2 ? "✓" : index + 1}
                      </span>
                      <span className="text-sm font-black text-[#123A63]">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-[1.6rem] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Messages
              </p>
              <div className="mt-4 rounded-[1.2rem] bg-white p-4">
                <p className="text-sm font-black text-[#123A63]">VEMO</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
                  Your LLC file is being reviewed by our team.
                </p>
              </div>
              <div className="mt-3 rounded-[1.2rem] bg-[#FFF0EA] p-4">
                <p className="text-sm font-black text-[#F15A24]">Client</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-600">
                  Thank you, document received.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-4 top-12 hidden rounded-[1.2rem] border border-[#E6EDF5] bg-white p-4 md:block">
        <p className="text-sm font-black text-[#111827]">Trustindex</p>
        <p className="mt-2 text-[#F15A24]">★★★★★</p>
        <p className="mt-1 text-2xl font-black text-[#111827]">4.8</p>
      </div>

      <div className="absolute -right-4 bottom-16 hidden rounded-[1.2rem] border border-[#E6EDF5] bg-white p-4 md:block">
        <p className="text-sm font-black text-[#111827]">Google</p>
        <p className="mt-2 text-[#F15A24]">★★★★★</p>
        <p className="mt-1 text-2xl font-black text-[#111827]">4.8</p>
      </div>
    </div>
  );
}

export default function FrenchHomePage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/fr" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#F15A24] text-sm font-black text-white">
              V
            </span>
            <span>
              <span className="block text-sm font-black tracking-[-0.03em] text-[#123A63]">
                VEMO Technology
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                US LLC Formation
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-black text-[#123A63] md:flex">
            <Link href="/fr/tarifs" className="transition hover:text-[#F15A24]">
              Tarifs
            </Link>
            <Link href="/fr/faq" className="transition hover:text-[#F15A24]">
              FAQ
            </Link>
            <Link href="/fr/contact" className="transition hover:text-[#F15A24]">
              Contact
            </Link>
            <Link href="/en" className="transition hover:text-[#F15A24]">
              EN
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/fr/connexion"
              className="hidden rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24] sm:inline-flex"
            >
              Connexion
            </Link>
            <Link
              href="/fr/commencer"
              className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
            >
              Créer ma LLC
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-16">
        <div className="rounded-[2.4rem] bg-white p-8 md:p-12">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            Création LLC aux États-Unis
          </p>

          <h1 className="mt-6 max-w-4xl text-[44px] font-black leading-[0.95] tracking-[-0.075em] text-[#111827] md:text-[72px]">
            Lancez votre LLC US avec un accompagnement clair et structuré.
          </h1>

          <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-slate-500 md:text-lg">
            VEMO accompagne les entrepreneurs non-résidents dans la création de leur LLC,
            la demande EIN, l’assistance Stripe, Mercury, Wise, Payoneer et le suivi administratif
            depuis un espace client dédié.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/fr/commencer"
              className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
            >
              Commencer maintenant
            </Link>
            <Link
              href="/fr/tarifs"
              className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]"
            >
              Voir les tarifs
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[22px] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">48h+</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                préparation et suivi selon l’État
              </p>
            </div>
            <div className="rounded-[22px] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">FR/EN</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                parcours client bilingue
              </p>
            </div>
            <div className="rounded-[22px] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">Cloud</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                documents et messages centralisés
              </p>
            </div>
          </div>
        </div>

        <HeroIllustration />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-[2.4rem] bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
                Fonctionnement
              </p>
              <h2 className="mt-4 text-[36px] font-black tracking-[-0.065em] text-[#111827] md:text-[52px]">
                Un parcours simple en 4 étapes.
              </h2>
            </div>
            <Link
              href="/fr/commencer"
              className="rounded-[16px] border border-[#E6EDF5] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]"
            >
              Démarrer
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="rounded-[24px] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
                <span className="text-xs font-black text-[#F15A24]">{step.number}</span>
                <h3 className="mt-4 text-lg font-black tracking-[-0.04em] text-[#123A63]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm font-bold leading-6 text-slate-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="overflow-hidden rounded-[2.4rem] bg-[#202731] p-8 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
                Pourquoi VEMO
              </p>
              <h2 className="mt-4 text-[36px] font-black leading-tight tracking-[-0.065em] md:text-[48px]">
                Une plateforme pensée pour vendre, suivre et livrer le service.
              </h2>
              <p className="mt-5 text-sm font-bold leading-7 text-white/70">
                Le client commande, paie, crée son accès, reçoit ses documents et suit son dossier
                depuis un espace unique.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">
                    ✓
                  </span>
                  <p className="mt-4 text-sm font-black leading-6 text-white/85">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-[2.4rem] bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
                Packs
              </p>
              <h2 className="mt-4 text-[36px] font-black tracking-[-0.065em] text-[#111827] md:text-[52px]">
                Des formules simples et lisibles.
              </h2>
            </div>
            <Link
              href="/fr/tarifs"
              className="rounded-[16px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
            >
              Comparer les packs
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {packs.map((pack) => (
              <div
                key={pack.name}
                className={[
                  "rounded-[2rem] border p-6",
                  pack.highlighted
                    ? "border-[#F15A24] bg-[#FFF7F4]"
                    : "border-[#E6EDF5] bg-[#F8FAFC]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.05em] text-[#111827]">
                      {pack.name}
                    </h3>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      {pack.state}
                    </p>
                  </div>
                  {pack.highlighted ? (
                    <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
                      Recommandé
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 text-[42px] font-black leading-none tracking-[-0.075em] text-[#123A63]">
                  {pack.price}
                </p>
                <p className="mt-4 text-sm font-bold leading-7 text-slate-500">
                  {pack.description}
                </p>

                <div className="mt-6 space-y-3">
                  {pack.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-[#F15A24]">
                        ✓
                      </span>
                      <span className="text-sm font-bold text-[#123A63]">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/fr/commencer?plan=${pack.name.toLowerCase()}`}
                  className={[
                    "mt-7 flex justify-center rounded-[16px] px-5 py-4 text-sm font-black transition",
                    pack.highlighted
                      ? "bg-[#F15A24] text-white hover:bg-[#DB4F1C]"
                      : "border border-[#E6EDF5] bg-white text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]",
                  ].join(" ")}
                >
                  Choisir {pack.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2.4rem] bg-[#111827] p-8 text-white md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
                Prêt à démarrer ?
              </p>
              <h2 className="mt-4 max-w-3xl text-[36px] font-black leading-tight tracking-[-0.065em] md:text-[54px]">
                Créez votre LLC et suivez chaque étape depuis votre espace VEMO.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/fr/commencer"
                className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Créer ma LLC
              </Link>
              <Link
                href="/fr/contact"
                className="rounded-[16px] border border-white/15 bg-white/5 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                Contacter VEMO
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppOrangeButton />

      <footer className="border-t border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <p className="text-sm font-black text-[#123A63]">VEMO Technology</p>
          <div className="flex flex-wrap gap-4 text-xs font-black text-slate-400">
            <Link href="/fr/conditions" className="hover:text-[#F15A24]">
              Conditions
            </Link>
            <Link href="/fr/confidentialite" className="hover:text-[#F15A24]">
              Confidentialité
            </Link>
            <Link href="/fr/remboursement" className="hover:text-[#F15A24]">
              Remboursement
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
