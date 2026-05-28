
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import Link from "next/link";

type Lang = "fr" | "en";

const data = {
  fr: {
    services: ["Services", "Création LLC, EIN, conformité, documents et accompagnement administratif pour non-résidents."],
    banking: ["Banking", "Préparation des solutions bancaires et de paiement : Stripe, PayPal, Wise, Mercury et alternatives."],
    resources: ["Resources", "Guides, informations utiles, modèles et ressources pour structurer votre business US."],
  },
  en: {
    services: ["Services", "LLC formation, EIN, compliance, documents and administrative support for non-residents."],
    banking: ["Banking", "Prepare banking and payment solutions: Stripe, PayPal, Wise, Mercury and alternatives."],
    resources: ["Resources", "Guides, useful information, templates and resources to structure your US business."],
  },
};

export default function SimpleInfoPage({
  lang,
  page,
}: {
  lang: Lang;
  page: "services" | "banking" | "resources";
}) {
  const [title, subtitle] = data[lang][page];
  const startHref = lang === "fr" ? "/fr/commencer" : "/en/commencer";
  const contactHref = lang === "fr" ? "/fr/contact" : "/en/contact";

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <SiteHeader lang={lang} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
            VEMO TECHNOLOGY
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-8 text-[#2B2F36]/72">
            {subtitle}
          </p>

          <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
            {[
              ["01", "Clear setup", "A structured process with transparent steps."],
              ["02", "Expert guidance", "Human support for important decisions."],
              ["03", "Secure portal", "Documents and case follow-up in one place."],
            ].map(([n, h, p]) => (
              <div key={n} className="rounded-[10px] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_40px_rgba(43,47,54,0.06)]">
                <div className="text-3xl font-semibold text-[#F15A24]">{n}</div>
                <h2 className="mt-4 text-2xl font-semibold text-[#123A63]">{h}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#2B2F36]/70">{p}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <Link href={startHref} className="rounded-[4px] bg-[#F15A24] px-8 py-4 text-sm font-black text-white">
              {lang === "fr" ? "Commencer" : "Start"}
            </Link>
            <Link href={contactHref} className="rounded-[4px] border border-[#123A63] bg-white px-8 py-4 text-sm font-black text-[#123A63]">
              Contact
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
