import Link from "next/link";

const requiredInfo = [
  "Nom de la société US",
  "État de création de la société",
  "Nom du responsable",
  "Adresse email",
  "Pays de résidence",
  "Copie ou informations utiles selon votre situation",
];

function Check() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E6EDF5] bg-white text-xs font-black text-[#F15A24]">
      ✓
    </span>
  );
}

export default function FrenchOrderEinPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/fr" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">
              V
            </span>
            <span>
              <span className="block text-lg font-black tracking-[-0.04em] text-[#123A63]">
                VEMO <span className="text-[#F15A24]">TECH</span>
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                Demande EIN dédiée
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/fr/ein" className="rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">
              Retour EIN
            </Link>
            <Link href="/en/order-ein" className="hidden border-l border-[#E6EDF5] pl-5 text-sm font-black text-[#123A63] hover:text-[#F15A24] sm:inline-flex">
              EN
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[12px] border border-[#E6EDF5] bg-white px-4 py-2 text-sm font-black text-[#123A63]">
            <span className="text-[#F15A24]">29 USD</span>
            <span>commande EIN uniquement</span>
          </div>

          <h1 className="mt-8 max-w-3xl text-[42px] font-black leading-[1.05] tracking-[-0.055em] text-[#111827] md:text-[60px]">
            Commander votre <span className="text-[#F15A24]">EIN</span>
            <br />
            sans créer une nouvelle LLC
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-500">
            Ce tunnel est dédié uniquement à la demande EIN. Il ne lance pas le parcours complet
            de création LLC. Il est adapté si votre société est déjà créée ou si vous voulez commander
            uniquement le service EIN.
          </p>

          <div className="mt-8 rounded-[28px] border border-[#E6EDF5] bg-white p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F15A24]">
              Informations nécessaires
            </p>
            <div className="mt-5 grid gap-3">
              {requiredInfo.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check />
                  <span className="text-sm font-bold text-[#123A63]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-6">
          <div className="border-b border-[#E6EDF5] pb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F15A24]">
              Formulaire EIN
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#111827]">
              Demande EIN — 29 USD
            </h2>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
              Remplissez ces informations. Le paiement et le suivi pourront ensuite être finalisés depuis votre espace VEMO.
            </p>
          </div>

          <form action="/fr/merci?service=ein" className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Nom complet</span>
                <input required name="fullName" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Votre nom" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Email</span>
                <input required type="email" name="email" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="email@exemple.com" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Nom de la LLC</span>
                <input required name="companyName" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Ex: Vemo LLC" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">État</span>
                <select required name="state" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]">
                  <option value="">Choisir</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="Wyoming">Wyoming</option>
                  <option value="Other">Autre État</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Pays de résidence</span>
                <input required name="country" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Ex: Maroc" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Téléphone / WhatsApp</span>
                <input name="phone" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="+212..." />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Message ou précision</span>
              <textarea name="message" rows={4} className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Ajoutez une précision sur votre situation..." />
            </label>

            <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-[#123A63]">Service EIN seul</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">Hors création complète LLC</p>
                </div>
                <p className="text-3xl font-black tracking-[-0.06em] text-[#F15A24]">29 USD</p>
              </div>
            </div>

            <button type="submit" className="rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">
              Continuer la commande EIN
            </button>
          </form>
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
  );
}
