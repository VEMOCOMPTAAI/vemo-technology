import Link from "next/link";
import { PublicShell } from "@/components/SiteChrome";

type Lang = "fr" | "en";

function base(lang: Lang) {
  return lang === "fr" ? "/fr" : "/en";
}

function Grid() {
  return (
    <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />
  );
}

function Hero({
  lang,
  title,
  text,
}: {
  lang: Lang;
  title: string;
  text: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 py-20">
      <Grid />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-center">
        <div>
          <div className="inline-flex rounded-[8px] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#F15A24] shadow-sm ring-1 ring-[#E8E2DC]">
            Vemo Technology
          </div>

          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.04] tracking-[-0.06em] text-[#2B2F36] md:text-7xl">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-semibold leading-9 text-[#2B2F36]/70">
            {text}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={base(lang) + "/commencer"}
              className="rounded-[8px] bg-[#F15A24] px-8 py-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(241,90,36,0.22)]"
            >
              {lang === "fr" ? "Calculer mon coût" : "Get Your Instant Cost"} →
            </Link>

            <Link
              href={base(lang) + "/tarifs"}
              className="rounded-[8px] border border-[#123A63] bg-white px-8 py-5 text-sm font-black text-[#123A63]"
            >
              {lang === "fr" ? "Voir les tarifs" : "View Pricing"}
            </Link>

            <Link
              href={base(lang) + "/contact"}
              className="rounded-[8px] border border-[#E8E2DC] bg-white px-8 py-5 text-sm font-black text-[#2B2F36]"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#E8E2DC] bg-white p-8 shadow-[0_30px_80px_rgba(43,47,54,0.10)]">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[14px] bg-[#FFF7F1] p-6">
              <div className="text-xl font-black text-[#123A63]">Trustindex</div>
              <div className="mt-3 text-[#F15A24]">★★★★★</div>
              <div className="mt-3 text-4xl font-black">4.8</div>
              <div className="mt-1 text-xs font-semibold text-[#2B2F36]/60">
                Based on 900+ reviews
              </div>
            </div>

            <div className="rounded-[14px] bg-[#FFF7F1] p-6">
              <div className="text-xl font-black text-[#123A63]">Google</div>
              <div className="mt-3 text-[#F15A24]">★★★★★</div>
              <div className="mt-3 text-4xl font-black">4.8</div>
              <div className="mt-1 text-xs font-semibold text-[#2B2F36]/60">
                Client support
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[14px] bg-[#123A63] p-8 text-white">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-white/70">
              Client portal
            </div>
            <div className="mt-4 text-3xl font-black tracking-[-0.04em]">
              Documents, messages, payments and case tracking.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesGrid({ lang }: { lang: Lang }) {
  const items =
    lang === "fr"
      ? [
          ["Création LLC", "Accompagnement pour créer votre LLC américaine à distance."],
          ["EIN", "Préparation et suivi pour obtenir votre identifiant fiscal US."],
          ["Banking", "Préparation des documents pour banques et processeurs de paiement."],
          ["Espace client", "Suivi documents, messages, paiements et dossier."],
          ["Compliance", "Suivi administratif et rappels importants."],
          ["Documents société", "Operating Agreement, documents LLC et livrables."],
          ["Paiements", "Préparation Stripe, PayPal, Wise et autres outils."],
          ["Support business", "Assistance administrative pour entrepreneurs non-résidents."],
        ]
      : [
          ["LLC Formation", "Remote support to create your US LLC."],
          ["EIN", "Preparation and follow-up to obtain your US tax ID."],
          ["Banking", "Document readiness for banks and payment processors."],
          ["Client Portal", "Track documents, messages, payments and case progress."],
          ["Compliance", "Administrative follow-up and key reminders."],
          ["Company Documents", "Operating Agreement, LLC documents and deliverables."],
          ["Payments", "Preparation for Stripe, PayPal, Wise and other tools."],
          ["Business Support", "Administrative support for non-resident founders."],
        ];

  return (
    <section className="bg-[#FFF7F1] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-4xl font-black tracking-[-0.05em] text-[#2B2F36]">
          {lang === "fr"
            ? "Services proposés par Vemo Technology"
            : "Services offered by Vemo Technology"}
        </h2>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {items.map(([title, text]) => (
            <article
              key={title}
              className="rounded-[14px] border border-[#E8E2DC] bg-white p-8 shadow-[0_16px_40px_rgba(43,47,54,0.06)]"
            >
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-[8px] border border-[#E8E2DC] text-[#F15A24]">
                ◆
              </div>
              <h3 className="text-xl font-black text-[#123A63]">{title}</h3>
              <p className="mt-4 text-sm font-semibold leading-7 text-[#2B2F36]/65">
                {text}
              </p>
              <Link
                href={base(lang) + "/services"}
                className="mt-6 inline-flex text-sm font-black text-[#F15A24]"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <PublicShell lang={lang}>
      <main>
        <Hero
          lang={lang}
          title={
            lang === "fr"
              ? "Création de LLC américaine pour non-résidents."
              : "US LLC setup consultants & services for non-residents."
          }
          text={
            lang === "fr"
              ? "Vemo Technology vous accompagne pour créer votre LLC, préparer vos documents, obtenir votre EIN et suivre votre dossier en ligne."
              : "Vemo Technology helps you form your LLC, prepare documents, obtain your EIN and track your case online."
          }
        />

        <section className="bg-white px-6 py-16 text-center">
          <h2 className="text-4xl font-black tracking-[-0.05em] text-[#2B2F36]">
            {lang === "fr"
              ? "Calculez le coût de création de votre LLC"
              : "Calculate cost of US LLC setup"}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-[#2B2F36]/65">
            {lang === "fr"
              ? "Un parcours clair pour choisir votre pack, votre État et suivre chaque étape."
              : "A clear flow to choose your package, state and track every step."}
          </p>

          <div className="mt-8">
            <Link
              href={base(lang) + "/commencer"}
              className="rounded-[8px] bg-[#F15A24] px-8 py-4 text-sm font-black text-white"
            >
              {lang === "fr" ? "Commencer" : "Start now"}
            </Link>
          </div>
        </section>

        <ServicesGrid lang={lang} />
      </main>
    </PublicShell>
  );
}

export function PricingPage({ lang }: { lang: Lang }) {
  const plans: [string, number][] = [
    ["New Mexico Starter", 119],
    ["New Mexico Standard", 179],
    ["New Mexico Advanced", 199],
    ["Wyoming Starter", 189],
    ["Wyoming Standard", 239],
    ["Wyoming Advanced", 299],
  ];

  return (
    <PublicShell lang={lang}>
      <Hero
        lang={lang}
        title={lang === "fr" ? "Choisissez le bon pack LLC." : "Choose the right LLC package."}
        text={
          lang === "fr"
            ? "Des offres simples et transparentes pour lancer votre LLC américaine."
            : "Simple and transparent packages to launch your US LLC."
        }
      />

      <section className="mx-auto grid max-w-7xl gap-7 px-6 pb-20 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(([name, price]) => (
          <article
            key={name}
            className="rounded-[14px] border border-[#E8E2DC] bg-white p-8 shadow-[0_16px_40px_rgba(43,47,54,0.06)]"
          >
            <h3 className="text-2xl font-black text-[#123A63]">{name}</h3>
            <div className="mt-4 text-4xl font-black text-[#2B2F36]">${price}</div>

            <ul className="mt-6 space-y-3 border-t border-[#E8E2DC] pt-6 text-sm font-semibold text-[#2B2F36]/70">
              <li>✓ LLC Formation</li>
              <li>✓ Registered Agent</li>
              <li>✓ EIN Guidance</li>
              <li>✓ Digital documents</li>
            </ul>

            <Link
              href={
                base(lang) +
                "/commencer?package_name=" +
                encodeURIComponent(name) +
                "&amount=" +
                price
              }
              className="mt-8 block rounded-[8px] bg-[#F15A24] px-6 py-4 text-center text-sm font-black text-white"
            >
              Choose Plan
            </Link>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}

export function ServicesPage({ lang }: { lang: Lang }) {
  return (
    <PublicShell lang={lang}>
      <Hero lang={lang} title={lang === "fr" ? "Services Vemo Technology." : "Vemo Technology services."} text={lang === "fr" ? "Création LLC, EIN, banking, documents et suivi client." : "LLC formation, EIN, banking, documents and client tracking."} />
      <ServicesGrid lang={lang} />
    </PublicShell>
  );
}

export function BankingPage({ lang }: { lang: Lang }) {
  return (
    <PublicShell lang={lang}>
      <Hero lang={lang} title={lang === "fr" ? "Préparez vos outils bancaires." : "Prepare your banking and payment tools."} text={lang === "fr" ? "Préparation des documents pour banques, Stripe, PayPal, Wise et autres solutions." : "Document readiness for banks, Stripe, PayPal, Wise and other tools."} />
      <ServicesGrid lang={lang} />
    </PublicShell>
  );
}

export function ResourcesPage({ lang }: { lang: Lang }) {
  return (
    <PublicShell lang={lang}>
      <Hero lang={lang} title={lang === "fr" ? "Ressources pour entrepreneurs." : "Resources for founders."} text={lang === "fr" ? "Guides simples pour comprendre LLC, EIN, banking et obligations." : "Simple guides to understand LLC, EIN, banking and obligations."} />
      <ServicesGrid lang={lang} />
    </PublicShell>
  );
}

export function ContactPage({ lang }: { lang: Lang }) {
  return (
    <PublicShell lang={lang}>
      <Hero lang={lang} title={lang === "fr" ? "Contactez Vemo Technology." : "Contact Vemo Technology."} text={lang === "fr" ? "Une question sur votre dossier, votre paiement ou la création de votre LLC ?" : "A question about your case, payment or LLC formation?"} />

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-[16px] border border-[#E8E2DC] bg-white p-8 shadow">
          <h3 className="text-2xl font-black text-[#123A63]">Email</h3>
          <p className="mt-4 font-semibold text-[#2B2F36]/70">
            contact@vemo-technology.com
          </p>
        </div>
      </section>
    </PublicShell>
  );
}

export function LegalPage({
  lang,
  type,
}: {
  lang: Lang;
  type: "terms" | "privacy" | "refund";
}) {
  const title =
    type === "terms"
      ? "Terms of Use"
      : type === "privacy"
      ? "Privacy Policy"
      : "Refund Policy";

  return (
    <PublicShell lang={lang}>
      <Hero lang={lang} title={title} text="Important information about using Vemo Technology services." />
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-[16px] border border-[#E8E2DC] bg-white p-8 text-sm font-semibold leading-8 text-[#2B2F36]/70 shadow">
          Vemo Technology provides administrative and business support services for non-resident entrepreneurs. Contact: contact@vemo-technology.com.
        </div>
      </section>
    </PublicShell>
  );
}
