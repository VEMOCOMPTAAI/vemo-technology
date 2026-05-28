"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

type Lang = "fr" | "en";

const copy = {
  fr: {
    badge: "CONTACT",
    title: "Contactez Vemo Technology",
    subtitle:
      "Une question sur la création de LLC, le paiement, votre dossier ou votre accompagnement ? Notre équipe vous répond avec une approche claire et professionnelle.",
    emailTitle: "Email",
    emailText: "Contactez-nous directement pour toute demande liée à votre dossier.",
    supportTitle: "Support client",
    supportText:
      "Les demandes sont traitées selon leur priorité : paiement, dossier en cours, création LLC, puis demandes générales.",
    prepareTitle: "Avant de nous contacter",
    prepareText:
      "Préparez votre nom complet, votre email de commande, le nom souhaité de votre LLC et votre pays de résidence.",
    whatsappTitle: "WhatsApp",
    whatsappText:
      "Contactez-nous via WhatsApp pour recevoir une réponse rapide et nos coordonnées de paiement si nécessaire.",
    cta: "Contacter sur WhatsApp",
    email: "contact@vemo-technology.com",
  },
  en: {
    badge: "CONTACT",
    title: "Contact Vemo Technology",
    subtitle:
      "Have a question about LLC formation, payment, your case or your support package? Our team will guide you with a clear and professional approach.",
    emailTitle: "Email",
    emailText: "Contact us directly for any request related to your case.",
    supportTitle: "Client support",
    supportText:
      "Requests are handled by priority: payment, active case, LLC formation, then general inquiries.",
    prepareTitle: "Before contacting us",
    prepareText:
      "Prepare your full name, order email, desired LLC name and country of residence.",
    whatsappTitle: "WhatsApp",
    whatsappText:
      "Contact us via WhatsApp to get a quick response and payment details when needed.",
    cta: "Contact on WhatsApp",
    email: "contact@vemo-technology.com",
  },
};

export default function ContactUnifiedPage({ lang }: { lang: Lang }) {
  const t = copy[lang];

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <SiteHeader lang={lang} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
            {t.badge}
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#2B2F36] md:text-6xl">
            {t.title}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-8 text-[#2B2F36]/72">
            {t.subtitle}
          </p>

          <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
            <InfoCard title={t.emailTitle} text={t.emailText} value={t.email} icon="@" />
            <InfoCard title={t.supportTitle} text={t.supportText} value="Priority support" icon="?" />
            <InfoCard title={t.prepareTitle} text={t.prepareText} value="Case details" icon="i" />
          </div>

          <div className="mt-8 rounded-[10px] border border-[#E8E2DC] bg-white p-8 text-left shadow-[0_20px_45px_rgba(43,47,54,0.08)] md:flex md:items-center md:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
                {t.whatsappTitle}
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#2B2F36]">
                {t.cta}
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/70">
                {t.whatsappText}
              </p>
            </div>

            <Link
              href="https://wa.me/212708069471"
              target="_blank"
              className="mt-6 inline-flex rounded-[4px] bg-[#F15A24] px-8 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.22)] md:mt-0"
            >
              {t.cta} →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}

function InfoCard({
  title,
  text,
  value,
  icon,
}: {
  title: string;
  text: string;
  value: string;
  icon: string;
}) {
  return (
    <article className="rounded-[10px] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_40px_rgba(43,47,54,0.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-[#E8E2DC] bg-[#FFF7F1] text-lg font-black text-[#F15A24]">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-[#2B2F36]">
        {title}
      </h3>

      <p className="mt-3 text-sm font-semibold leading-7 text-[#2B2F36]/70">
        {text}
      </p>

      <div className="mt-5 rounded-[6px] bg-[#FFF7F1] px-4 py-3 text-sm font-black text-[#123A63]">
        {value}
      </div>
    </article>
  );
}
