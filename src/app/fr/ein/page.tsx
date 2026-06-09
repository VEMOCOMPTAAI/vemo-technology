import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import Link from "next/link";

const benefits = [
  "Service EIN seul à 29 USD",
  "Préparation des informations nécessaires",
  "Accompagnement pour entrepreneurs non-résidents",
  "Utile pour Stripe, Mercury, Wise, Payoneer et PayPal",
  "Suivi clair depuis votre espace client",
  "Compatible avec une LLC déjà créée",
];

const steps = [
  ["01", "Vérification des informations", "Nous vérifions les informations nécessaires pour préparer la demande EIN."],
  ["02", "Préparation du dossier", "Nous organisons les éléments requis selon la situation de votre société."],
  ["03", "Suivi de la demande", "Vous suivez l’avancement et les messages depuis votre espace VEMO."],
  ["04", "Réception EIN", "Le numéro EIN est transmis dès réception et archivé dans votre espace client."],
];

function Check() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E6EDF5] bg-white text-xs font-black text-[#F15A24]">
      ✓
    </span>
  );
}

export default function FrenchEinPage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />
      <VemoPublicHeader locale="fr" />
<main className="vemo-public-zero-reflets min-h-screen bg-white text-[#111827]">
<section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[12px] border border-[#E6EDF5] bg-white px-4 py-2 text-sm font-black text-[#123A63]">
            <span className="text-[#F15A24]">29 USD</span>
            <span>service EIN seul</span>
          </div>

          <h1 className="mt-8 max-w-3xl text-[42px] font-black leading-[1.05] tracking-[-0.055em] text-[#111827] md:text-[60px]">
            Demandez votre <span className="text-[#F15A24]">EIN</span>
            <br />
            pour votre société US
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-500">
            VEMO vous accompagne dans la préparation et le suivi de votre demande EIN,
            utile pour vos démarches bancaires, Stripe, Mercury, PayPal, Wise ou Payoneer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/fr/order-ein" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]">
              Commander EIN 29 USD
            </Link>
            <Link href="/fr/contact" className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]">
              Poser une question
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E6EDF5] pb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F15A24]">
                Service dédié
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#111827]">
                EIN seul
              </h2>
            </div>
            <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
              29 USD
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-[18px] border border-[#E6EDF5] bg-white p-4">
                <Check />
                <span className="text-sm font-bold text-[#123A63]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E6EDF5] bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
              Processus
            </p>
            <h2 className="text-[36px] font-black tracking-[-0.06em] md:text-[52px]">
              Comment se déroule la demande EIN ?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-7 text-slate-500">
              Un processus simple, clair et suivi depuis votre espace VEMO.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {steps.map(([number, title, text]) => (
              <div key={number} className="rounded-[24px] border border-[#E6EDF5] bg-white p-6">
                <p className="text-[34px] font-black tracking-[-0.06em] text-[#F15A24]">{number}.</p>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#111827]">{title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[28px] border border-[#E6EDF5] bg-white p-8 text-center md:p-12">
          <h2 className="text-[34px] font-black tracking-[-0.06em] md:text-[52px]">
            Besoin uniquement d’un EIN ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-slate-500">
            Commandez le service EIN seul ou choisissez un pack LLC complet incluant la demande EIN.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/fr/order-ein" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">
              Commander EIN
            </Link>
            <Link href="/fr/tarifs" className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">
              Voir les packs LLC
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#0F3558] bg-[#123A63] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          <div>
            <p className="text-2xl font-black tracking-[-0.05em] text-white">
              VEMO<span className="text-[#F15A24]">TECH</span>
            </p>
            <p className="mt-5 max-w-xs text-sm font-bold leading-7 text-white/75">
              Accompagnement professionnel pour créer, structurer et suivre votre LLC US à distance.
            </p>
          </div>
          <div>
            <p className="text-sm font-black text-white">Navigation</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/fr" className="block hover:text-white">Accueil</Link>
              <Link href="/fr/tarifs" className="block hover:text-white">Tarifs</Link>
              <Link href="/fr/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-white">Services</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/fr/commencer" className="block hover:text-white">LLC Formation</Link>
              <Link href="/fr/ein" className="block hover:text-white">EIN</Link>
              <Link href="/fr/banking-guidance" className="block hover:text-white">Banking Guidance</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-white">Legal</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/fr/conditions" className="block hover:text-white">Terms</Link>
              <Link href="/fr/confidentialite" className="block hover:text-white">Privacy</Link>
              <Link href="/fr/remboursement" className="block hover:text-white">Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs font-black text-white/60">
          © 2026 Vemo Technology. All rights reserved.
        </div>
      </footer>
    </main>
    </>
  );
}
