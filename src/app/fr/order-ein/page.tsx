import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import Link from "next/link";
import EinOrderFlow from "@/components/ein/EinOrderFlow";

export default function FrenchOrderEinPage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />
      <main className="vemo-public-zero-reflets min-h-screen bg-white text-[#111827]">
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
    </>
  );
}
