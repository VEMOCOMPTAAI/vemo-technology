import Link from "next/link";

type Locale = "fr" | "en";

export default function VemoPublicFooter({ locale }: { locale: Locale }) {
  const isFr = locale === "fr";

  return (
    <footer className="mt-20 bg-[#123A63] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="text-[22px] font-black tracking-[-0.04em]">
            VEMO<span className="text-[#F15A24]">TECH</span>
          </p>
          <p className="mt-5 max-w-[260px] text-sm font-bold leading-7 text-white/75">
            {isFr
              ? "Accompagnement professionnel pour créer, structurer et suivre votre LLC US à distance."
              : "Professional support to form, structure and track your US LLC remotely."}
          </p>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">
            {isFr ? "Navigation" : "Navigation"}
          </p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-white/80">
            <Link href={isFr ? "/fr" : "/en"} className="hover:text-white">
              {isFr ? "Accueil" : "Home"}
            </Link>
            <Link href={isFr ? "/fr/tarifs" : "/en/pricing"} className="hover:text-white">
              {isFr ? "Tarifs" : "Pricing"}
            </Link>
            <Link href={isFr ? "/fr/faq" : "/en/faq"} className="hover:text-white">
              FAQ
            </Link>
            <Link href={isFr ? "/fr/contact" : "/en/contact"} className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">
            {isFr ? "Services" : "Services"}
          </p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-white/80">
            <Link href={isFr ? "/fr/commencer" : "/en/start"} className="hover:text-white">
              {isFr ? "Création LLC" : "LLC Formation"}
            </Link>
            <Link href={isFr ? "/fr/ein" : "/en/ein"} className="hover:text-white">
              EIN
            </Link>
            <Link href={isFr ? "/fr/banking-guidance" : "/en/banking-guidance"} className="hover:text-white">
              Banking Guidance
            </Link>
            <Link href={isFr ? "/fr/order-ein" : "/en/order-ein"} className="hover:text-white">
              {isFr ? "EIN application seule" : "EIN only"}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">
            Legal
          </p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-white/80">
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs font-bold text-white/55">
        © 2026 Vemo Technology. All rights reserved.
      </div>
    </footer>
  );
}
