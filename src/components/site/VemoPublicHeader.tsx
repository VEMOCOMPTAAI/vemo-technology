import Link from "next/link";

type Locale = "fr" | "en";

export default function VemoPublicHeader({ locale }: { locale: Locale }) {
  const isFr = locale === "fr";

  const nav = isFr
    ? [
        { label: "Accueil", href: "/fr" },
        { label: "Tarifs", href: "/fr/tarifs" },
        { label: "FAQ", href: "/fr/faq" },
        { label: "Contact", href: "/fr/contact" },
      ]
    : [
        { label: "Home", href: "/en" },
        { label: "Pricing", href: "/en/pricing" },
        { label: "FAQ", href: "/en/faq" },
        { label: "Contact", href: "/en/contact" },
      ];

  return (
    <header className="vemo-public-header sticky top-0 z-50 border-b border-[#E6EDF5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between px-6">
        <Link href={isFr ? "/fr" : "/en"} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">
            V
          </span>

          <span className="leading-none">
            <span className="block text-[22px] font-black tracking-[-0.04em] text-[#123A63]">
              VEMO<span className="text-[#F15A24]">TECH</span>
            </span>
            <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.32em] text-slate-400">
              {isFr ? "US LLC pour non-résidents" : "US LLC for non-residents"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-black text-[#111827] transition hover:text-[#F15A24]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={isFr ? "/en" : "/fr"}
            className="hidden rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24] sm:inline-flex"
          >
            {isFr ? "EN" : "FR"}
          </Link>

          <Link
            href={isFr ? "/fr/commencer" : "/en/start"}
            className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
          >
            {isFr ? "Démarrer →" : "Start →"}
          </Link>
        </div>
      </div>
    </header>
  );
}
