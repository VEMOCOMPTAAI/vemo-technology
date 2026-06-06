import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import Link from "next/link";
import EinOrderFlow from "@/components/ein/EinOrderFlow";

export default function EnglishOrderEinPage() {
  return (
    <>
      <VemoPublicHeader locale="en" />
      <main className="min-h-screen bg-white text-[#111827]">
<EinOrderFlow locale="en" />

      <footer className="border-t border-[#0F3558] bg-[#123A63] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          <div>
            <p className="text-2xl font-black tracking-[-0.05em] text-white">VEMO<span className="text-[#F15A24]">TECH</span></p>
            <p className="mt-5 max-w-xs text-sm font-bold leading-7 text-white/75">Professional support to form, structure and track your US LLC remotely.</p>
          </div>
          <div>
            <p className="text-sm font-black text-white">Navigation</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/en" className="block hover:text-white">Home</Link>
              <Link href="/en/pricing" className="block hover:text-white">Pricing</Link>
              <Link href="/en/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-white">Services</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/en/start" className="block hover:text-white">LLC Formation</Link>
              <Link href="/en/ein" className="block hover:text-white">EIN</Link>
              <Link href="/en/banking-guidance" className="block hover:text-white">Banking Guidance</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-white">Legal</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/en/terms" className="block hover:text-white">Terms</Link>
              <Link href="/en/privacy" className="block hover:text-white">Privacy</Link>
              <Link href="/en/refund-policy" className="block hover:text-white">Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs font-black text-white/60">© 2026 Vemo Technology. All rights reserved.</div>
      </footer>
    </main>
    </>
  );
}
