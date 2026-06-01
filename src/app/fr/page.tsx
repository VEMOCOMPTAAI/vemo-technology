import Link from "next/link";

const services = [
  {
    icon: "L",
    title: "Création LLC",
    text: "Création de société LLC aux États-Unis pour entrepreneurs non-résidents.",
    href: "/fr/commencer",
  },
  {
    icon: "E",
    title: "Demande EIN",
    text: "Service EIN seul à 29 USD ou inclus selon le pack choisi.",
    href: "/fr/ein",
  },
  {
    icon: "B",
    title: "Banking guidance",
    text: "Assistance Stripe, Mercury, Wise, Payoneer, PayPal et Shopify.",
    href: "/fr/banking-guidance",
  },
  {
    icon: "P",
    title: "Espace client",
    text: "Documents, messages, statuts et suivi dossier centralisés.",
    href: "/fr/connexion",
  },
];

const steps = [
  ["01", "Choisir la formule", "Starter, Standard ou Premium selon votre besoin."],
  ["02", "Remplir le formulaire", "Ajoutez vos informations, l’État et les détails d’activité."],
  ["03", "Payer ou envoyer le justificatif", "Stripe ou virement avec justificatif depuis la plateforme."],
  ["04", "Suivre le dossier", "Documents, messages et statuts dans votre espace client."],
];

const packs = [
  {
    state: "New Mexico",
    items: [
      ["Starter", "129$", "Création LLC simple avec documents essentiels.", ["Création LLC", "Frais de dépôt inclus", "Registered Agent 1 an", "US Phone Number 3 mois"]],
      ["Standard", "149$", "LLC + EIN + assistance bancaire.", ["Tout Starter", "Demande EIN", "Assistance Stripe", "Assistance Mercury"], true],
      ["Premium", "199$", "Accompagnement complet au lancement.", ["Tout Standard", "PayPal", "Wise / Payoneer", "Shopify 3 mois + domaine"]],
    ],
  },
  {
    state: "Wyoming",
    items: [
      ["Starter", "179$", "Création LLC Wyoming avec documents essentiels.", ["Création LLC", "Frais de dépôt inclus", "Registered Agent 1 an", "US Phone Number 3 mois"]],
      ["Standard", "199$", "LLC Wyoming + EIN + assistance bancaire.", ["Tout Starter", "Demande EIN", "Assistance Stripe", "Assistance Mercury"], true],
      ["Premium", "249$", "Pack Wyoming complet pour lancement premium.", ["Tout Standard", "PayPal", "Wise / Payoneer", "Shopify 3 mois + domaine"]],
    ],
  },
];

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/212600000000"
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

export default function FrenchHomePage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/fr" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">V</span>
            <span>
              <span className="block text-lg font-black tracking-[-0.04em] text-[#123A63]">
                VEMO <span className="text-[#F15A24]">TECH</span>
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                US LLC pour non-résidents
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-black text-[#123A63] lg:flex">
            <Link href="/fr" className="hover:text-[#F15A24]">Accueil</Link>
            <Link href="/fr/commencer" className="hover:text-[#F15A24]">Business Setup</Link>
            <Link href="/fr/tarifs" className="hover:text-[#F15A24]">Tarifs</Link>
            <Link href="/fr/ein" className="hover:text-[#F15A24]">EIN</Link>
            <Link href="/fr/banking-guidance" className="hover:text-[#F15A24]">Banking</Link>
            <Link href="/fr/contact" className="hover:text-[#F15A24]">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/en" className="hidden border-l border-[#E6EDF5] pl-5 text-sm font-black text-[#123A63] hover:text-[#F15A24] sm:inline-flex">EN</Link>
            <Link href="/fr/connexion" className="hidden rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24] sm:inline-flex">Connexion</Link>
            <Link href="/fr/commencer" className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white hover:bg-[#DB4F1C]">Créer ma LLC</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div>
          <div className="inline-flex rounded-[12px] border border-[#E6EDF5] bg-white px-4 py-2 text-sm font-black text-[#123A63]">
            <span className="mr-2 text-[#F15A24]">15k+</span> entrepreneurs accompagnés
          </div>

          <h1 className="mt-8 max-w-4xl text-[48px] font-black leading-[0.98] tracking-[-0.075em] text-[#111827] md:text-[72px]">
            Création de LLC US & services pour non-résidents
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-500">
            VEMO Technology rend la création de LLC simple, structurée et suivie :
            choix de l’État, paiement, documents, messages et espace client.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/fr/commencer" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">
              Parler à un expert
            </Link>
            <Link href="/fr/tarifs" className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E6EDF5] bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[34px] font-black tracking-[-0.06em] md:text-[48px]">
            Calculez le coût de votre création LLC <span className="text-[#F15A24]">US LLC</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-7 text-slate-500">
            Choisissez l’État, la formule et les services adaptés à votre activité.
          </p>
          <Link href="/fr/commencer" className="mt-7 inline-flex rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">
            Obtenir mon coût
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-[36px] font-black tracking-[-0.06em] md:text-[52px]">
            Services VEMO Technology
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-7 text-slate-500">
            Des services opérationnels pour créer, suivre et organiser votre LLC.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="rounded-[22px] border border-[#E6EDF5] bg-white p-6 hover:border-[#F15A24]">
              <span className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#E6EDF5] bg-white text-sm font-black text-[#F15A24]">
                {service.icon}
              </span>
              <h3 className="mt-8 text-xl font-black tracking-[-0.04em] text-[#123A63]">{service.title}</h3>
              <p className="mt-4 text-sm font-bold leading-7 text-slate-500">{service.text}</p>
              <p className="mt-5 text-sm font-black text-[#F15A24]">En savoir plus</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E6EDF5] bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-[36px] font-black tracking-[-0.06em] md:text-[52px]">
              Choisissez le bon État pour votre LLC
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-7 text-slate-500">
              New Mexico et Wyoming sont les deux États proposés dans VEMO pour démarrer simplement.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              ["New Mexico", "À partir de 129 USD", "Option simple, discrète et économique pour beaucoup d’entrepreneurs non-résidents.", "Registered Agent renouvellement : 35 USD/an"],
              ["Wyoming", "À partir de 179 USD", "Option business-friendly, appréciée pour son image corporate et sa confidentialité.", "Registered Agent renouvellement : 25 USD/an"],
            ].map(([title, price, text, renewal]) => (
              <div key={title} className="rounded-[24px] border border-[#E6EDF5] bg-white p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-black tracking-[-0.05em] text-[#111827]">{title}</h3>
                    <p className="mt-2 text-sm font-black text-[#F15A24]">{price}</p>
                  </div>
                  <span className="rounded-full border border-[#E6EDF5] px-3 py-1 text-xs font-black text-[#123A63]">
                    LLC
                  </span>
                </div>
                <p className="mt-6 text-sm font-bold leading-7 text-slate-500">{text}</p>
                <div className="mt-5 rounded-[16px] border border-[#E6EDF5] bg-white p-4 text-sm font-black text-[#123A63]">
                  {renewal}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="rounded-[12px] border border-[#E6EDF5] bg-white px-4 py-2 text-sm font-black text-[#F15A24]">
            Step up to success
          </span>
          <h2 className="mt-8 text-[38px] font-black leading-tight tracking-[-0.065em] md:text-[52px]">
            Nos consultants vous accompagnent en 4 étapes simples
          </h2>
        </div>

        <div className="space-y-7">
          {steps.map(([number, title, text]) => (
            <div key={number} className="grid gap-4 sm:grid-cols-[72px_1fr]">
              <p className="text-[34px] font-black tracking-[-0.06em] text-[#F15A24]">{number}.</p>
              <div>
                <h3 className="text-2xl font-black tracking-[-0.04em] text-[#111827]">{title}</h3>
                <p className="mt-2 text-base font-bold leading-7 text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E6EDF5] bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">Packs</p>
              <h2 className="mt-4 text-[36px] font-black tracking-[-0.065em] text-[#111827] md:text-[52px]">
                Des formules simples et lisibles.
              </h2>
            </div>
            <Link href="/fr/tarifs" className="rounded-[16px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white hover:bg-[#DB4F1C]">
              Comparer les packs
            </Link>
          </div>

          <div className="mt-10 space-y-10">
            {packs.map((group) => (
              <div key={group.state}>
                <h3 className="text-2xl font-black tracking-[-0.05em] text-[#123A63]">{group.state}</h3>
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                  {group.items.map(([name, price, text, features, recommended]: any) => (
                    <div key={`${group.state}-${name}`} className="rounded-[24px] border border-[#E6EDF5] bg-white p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-2xl font-black tracking-[-0.05em] text-[#111827]">{name}</h4>
                          <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-400">{group.state}</p>
                        </div>
                        {recommended ? (
                          <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">Recommandé</span>
                        ) : null}
                      </div>

                      <p className="mt-5 text-[42px] font-black leading-none tracking-[-0.075em] text-[#123A63]">{price}</p>
                      <p className="mt-4 text-sm font-bold leading-7 text-slate-500">{text}</p>

                      <div className="mt-6 space-y-3">
                        {features.map((feature: string) => (
                          <div key={feature} className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E6EDF5] bg-white text-xs font-black text-[#F15A24]">✓</span>
                            <span className="text-sm font-bold text-[#123A63]">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/fr/commencer?state=${encodeURIComponent(group.state)}&plan=${String(name).toLowerCase()}`}
                        className={recommended ? "mt-7 flex justify-center rounded-[16px] bg-[#F15A24] px-5 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]" : "mt-7 flex justify-center rounded-[16px] border border-[#E6EDF5] bg-white px-5 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]"}
                      >
                        Choisir {name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[28px] border border-[#E6EDF5] bg-white p-8 text-center md:p-12">
          <h2 className="text-[34px] font-black tracking-[-0.06em] md:text-[52px]">
            Prêt à créer votre LLC ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-slate-500">
            Commencez votre dossier, choisissez votre formule et suivez chaque étape depuis VEMO.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/fr/commencer" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">Créer ma LLC</Link>
            <Link href="/fr/ein" className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">Demande EIN seule</Link>
            <Link href="/fr/contact" className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">Contacter VEMO</Link>
          </div>
        </div>
      </section>

      <WhatsAppButton />

      <footer className="border-t border-[#E6EDF5] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
          <div>
            <p className="text-2xl font-black tracking-[-0.05em] text-[#123A63]">
              VEMO<span className="text-[#F15A24]">TECH</span>
            </p>
            <p className="mt-5 text-sm font-bold leading-7 text-slate-500">
              Accompagnement professionnel pour créer, structurer et suivre votre LLC US à distance.
            </p>
          </div>

          <div>
            <p className="text-sm font-black text-[#111827]">Navigation</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-slate-500">
              <Link href="/fr" className="block hover:text-[#F15A24]">Accueil</Link>
              <Link href="/fr/tarifs" className="block hover:text-[#F15A24]">Tarifs</Link>
              <Link href="/fr/contact" className="block hover:text-[#F15A24]">Contact</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-[#111827]">Services</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-slate-500">
              <Link href="/fr/commencer" className="block hover:text-[#F15A24]">LLC Formation</Link>
              <Link href="/fr/ein" className="block hover:text-[#F15A24]">EIN</Link>
              <Link href="/fr/banking-guidance" className="block hover:text-[#F15A24]">Banking Guidance</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-[#111827]">Legal</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-slate-500">
              <Link href="/fr/conditions" className="block hover:text-[#F15A24]">Conditions</Link>
              <Link href="/fr/confidentialite" className="block hover:text-[#F15A24]">Confidentialité</Link>
              <Link href="/fr/remboursement" className="block hover:text-[#F15A24]">Remboursement</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E6EDF5] py-5 text-center text-xs font-black text-slate-400">
          © 2026 Vemo Technology. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}
