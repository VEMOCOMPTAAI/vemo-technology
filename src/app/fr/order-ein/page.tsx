import Link from "next/link";
import EinOrderFlow from "@/components/ein/EinOrderFlow";

export default function FrenchOrderEinPage() {
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

      <EinOrderFlow locale="fr" />

      <footer className="border-t border-[#0F3558] bg-[#123A63] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          <div>
            <p className="text-2xl font-black tracking-[-0.05em] text-white">VEMO<span className="text-[#F15A24]">TECH</span></p>
            <p className="mt-5 max-w-xs text-sm font-bold leading-7 text-white/75">Accompagnement professionnel pour créer, structurer et suivre votre LLC US à distance.</p>
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
        <div className="border-t border-white/10 py-5 text-center text-xs font-black text-white/60">© 2026 Vemo Technology. All rights reserved.</div>
      </footer>
    </main>
  );
}
