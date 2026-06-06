import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import Link from "next/link";

const tools = [
  ["Stripe", "Préparation des informations nécessaires pour ouvrir ou configurer Stripe."],
  ["PayPal", "Orientation pour préparer votre compte business."],
  ["Mercury", "Assistance documentaire pour compte bancaire business US."],
  ["Wise", "Préparation et organisation des informations business."],
  ["Payoneer", "Orientation selon votre activité et votre pays."],
  ["Shopify", "Aide au lancement e-commerce avec votre LLC."],
];

export default function BankingGuidancePage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />
      <main className="min-h-screen bg-white text-[#111827]">
<section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
          Banking & payments
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-center text-[46px] font-black leading-[1] tracking-[-0.075em] md:text-[68px]">
          Assistance pour vos outils bancaires et paiements
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-bold leading-8 text-slate-500">
          VEMO vous aide à préparer les informations et documents nécessaires pour vos comptes Stripe, PayPal, Mercury, Wise, Payoneer et Shopify.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map(([title, text]) => (
            <div key={title} className="rounded-[24px] border border-[#E6EDF5] bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#E6EDF5] text-[#F15A24]">
                ◦
              </span>
              <h2 className="mt-6 text-2xl font-black tracking-[-0.04em] text-[#123A63]">{title}</h2>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-500">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] border border-[#E6EDF5] bg-white p-8 text-center">
          <h2 className="text-3xl font-black tracking-[-0.05em]">Besoin d’un accompagnement complet ?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-7 text-slate-500">
            Choisissez un pack Standard ou Premium pour combiner création LLC, EIN et assistance bancaire.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/fr/tarifs" className="rounded-[16px] border border-[#E6EDF5] px-6 py-4 text-sm font-black text-[#123A63]">
              Voir les packs
            </Link>
            <Link href="/fr/commencer" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white">
              Commencer
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
