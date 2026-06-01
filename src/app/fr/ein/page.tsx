import Link from "next/link";

export default function EinPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/fr" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">
              V
            </span>
            <span>
              <span className="block text-lg font-black tracking-[-0.04em] text-[#123A63]">
                VEMO <span className="text-[#F15A24]">TECH</span>
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                US LLC pour non-résidents
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/fr" className="rounded-[14px] border border-[#E6EDF5] px-4 py-3 text-sm font-black text-[#123A63]">
              Accueil
            </Link>
            <Link href="/fr/commencer?service=ein" className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white">
              Demander EIN
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            Service EIN seul
          </p>
          <h1 className="mt-5 text-[48px] font-black leading-[0.98] tracking-[-0.075em] md:text-[72px]">
            Demande EIN pour votre société US
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-500">
            VEMO vous accompagne dans la préparation et le suivi de votre demande EIN pour vos démarches bancaires, Stripe, PayPal, Mercury, Wise ou Payoneer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/fr/commencer?service=ein" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white">
              Commander pour 29 USD
            </Link>
            <Link href="/fr/contact" className="rounded-[16px] border border-[#E6EDF5] px-6 py-4 text-sm font-black text-[#123A63]">
              Poser une question
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#E6EDF5] bg-white p-6">
          <div className="grid gap-4">
            <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Prix</p>
              <p className="mt-3 text-[54px] font-black tracking-[-0.08em] text-[#123A63]">29 USD</p>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-500">Service EIN seul, hors création LLC complète.</p>
            </div>

            {[
              ["Préparation", "Vérification des informations nécessaires avant dépôt."],
              ["Suivi", "Accompagnement jusqu’au retour du numéro EIN."],
              ["Utilisation", "Compatible avec banques, Stripe, PayPal, Mercury et Wise."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[20px] border border-[#E6EDF5] bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#E6EDF5] text-[#F15A24]">✓</span>
                <h2 className="mt-4 text-xl font-black text-[#123A63]">{title}</h2>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
