"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Locale = "fr" | "en";

const alternatePaths: Record<string, string> = {
  "/fr": "/en",
  "/en": "/fr",

  "/fr/tarifs": "/en/pricing",
  "/en/pricing": "/fr/tarifs",

  "/fr/faq": "/en/faq",
  "/en/faq": "/fr/faq",

  "/fr/contact": "/en/contact",
  "/en/contact": "/fr/contact",

  "/fr/commencer": "/en/start",
  "/en/start": "/fr/commencer",

  "/fr/banking-guidance": "/en/banking-guidance",
  "/en/banking-guidance": "/fr/banking-guidance",

  "/fr/ein": "/en/ein",
  "/en/ein": "/fr/ein",

  "/fr/order-ein": "/en/order-ein",
  "/en/order-ein": "/fr/order-ein",

  "/fr/ein-payment": "/en/ein-payment",
  "/en/ein-payment": "/fr/ein-payment",

  "/fr/ein-account": "/en/ein-account",
  "/en/ein-account": "/fr/ein-account",

  "/fr/ein-verify": "/en/ein-verify",
  "/en/ein-verify": "/fr/ein-verify",
};

function getAlternatePath(pathname: string, locale: Locale) {
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "") || pathname;

  if (alternatePaths[cleanPath]) {
    return alternatePaths[cleanPath];
  }

  if (locale === "fr") {
    return cleanPath.replace(/^\/fr/, "/en");
  }

  return cleanPath.replace(/^\/en/, "/fr");
}

export default function VemoPublicHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const isFr = locale === "fr";
  const languageHref = getAlternatePath(pathname || (isFr ? "/fr" : "/en"), locale);

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
    <header className="sticky top-0 z-50 border-b border-[#E6EDF5] bg-white/95 backdrop-blur">
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
            href={languageHref}
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
