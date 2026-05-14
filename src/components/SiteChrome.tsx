type HeaderProps = {
  lang: "fr" | "en";
  active?: "home" | "pricing" | "start";
};

export function SiteHeader({ lang, active = "home" }: HeaderProps) {
  const isFr = lang === "fr";

  const mainLinks = isFr
    ? [
        { label: "Accueil", href: "/fr", key: "home" },
        { label: "Tarifs", href: "/fr/tarifs", key: "pricing" },
        { label: "FAQ", href: "/fr/faq", key: "faq" },
        { label: "Contact", href: "/fr/contact", key: "contact" },
      ]
    : [
        { label: "Home", href: "/en", key: "home" },
        { label: "Pricing", href: "/en/pricing", key: "pricing" },
        { label: "FAQ", href: "/en/faq", key: "faq" },
        { label: "Contact", href: "/en/contact", key: "contact" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl">
      <div className="vemo-container flex items-center justify-between gap-5 py-4">
        <a href={isFr ? "/fr" : "/en"} className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111a33] text-base font-black text-white shadow-lg">
            V
          </div>

          <div>
            <p className="text-lg font-black tracking-tight text-[#111a33]">
              Vemo Technology
            </p>
            <p className="hidden text-xs font-bold text-slate-500 sm:block">
              {isFr ? "US LLC pour non-résidents" : "US LLC for non-residents"}
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm lg:flex">
          {mainLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={[
                "rounded-full px-4 py-2 text-sm font-black transition",
                active === link.key
                  ? "bg-[#111a33] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#111a33]",
              ].join(" ")}
            >
              {link.label}
            </a>
          ))}

          <a
            href={isFr ? "/fr/commencer" : "/en/start"}
            className={[
              "rounded-full px-5 py-2 text-sm font-black transition",
              active === "start"
                ? "bg-[#c51f32] text-white"
                : "bg-[#111a33] text-white hover:bg-[#c51f32]",
            ].join(" ")}
          >
            {isFr ? "Commencer" : "Start"}
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={isFr ? "/fr/commencer" : "/en/start"}
            className="hidden rounded-full bg-[#c51f32] px-4 py-2 text-xs font-black text-white shadow-sm md:inline-flex lg:hidden"
          >
            {isFr ? "Commencer" : "Start"}
          </a>

          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <a
              href="/fr"
              className={[
                "rounded-full px-3 py-2 text-xs font-black",
                isFr ? "bg-[#c51f32] text-white" : "text-slate-500 hover:text-[#c51f32]",
              ].join(" ")}
            >
              FR
            </a>

            <a
              href="/en"
              className={[
                "rounded-full px-3 py-2 text-xs font-black",
                !isFr ? "bg-[#c51f32] text-white" : "text-slate-500 hover:text-[#c51f32]",
              ].join(" ")}
            >
              EN
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-white/90 lg:hidden">
        <div className="vemo-container flex gap-2 overflow-x-auto py-3">
          {mainLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ lang }: { lang: "fr" | "en" }) {
  const isFr = lang === "fr";

  const commercialLinks = isFr
    ? [
        { label: "Accueil", href: "/fr" },
        { label: "Tarifs", href: "/fr/tarifs" },
        { label: "FAQ", href: "/fr/faq" },
        { label: "Contact", href: "/fr/contact" },
        { label: "Commencer", href: "/fr/commencer" },
      ]
    : [
        { label: "Home", href: "/en" },
        { label: "Pricing", href: "/en/pricing" },
        { label: "FAQ", href: "/en/faq" },
        { label: "Contact", href: "/en/contact" },
        { label: "Start", href: "/en/start" },
      ];

  const legalLinks = isFr
    ? [
        { label: "Conditions d’utilisation", href: "/fr/conditions" },
        { label: "Confidentialité", href: "/fr/confidentialite" },
        { label: "Remboursement", href: "/fr/remboursement" },
      ]
    : [
        { label: "Terms of Use", href: "/en/terms" },
        { label: "Privacy Policy", href: "/en/privacy" },
        { label: "Refund Policy", href: "/en/refund-policy" },
      ];

  return (
    <footer className="bg-[#111a33] px-6 py-12 text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-base font-black text-[#111a33]">
              V
            </div>

            <div>
              <p className="text-2xl font-black">Vemo Technology</p>
              <p className="text-xs font-bold text-slate-400">
                {isFr ? "US LLC pour non-résidents" : "US LLC for non-residents"}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-slate-300">
            {isFr
              ? "Plateforme bilingue pour accompagner les entrepreneurs non-résidents dans la création de leur LLC américaine."
              : "A bilingual platform helping non-resident entrepreneurs set up their US LLC."}
          </p>
        </div>

        <div>
          <p className="font-black">{isFr ? "Navigation" : "Navigation"}</p>

          <div className="mt-4 space-y-3 text-sm font-bold text-slate-300">
            {commercialLinks.map((link) => (
              <p key={link.href}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="font-black">{isFr ? "Légal" : "Legal"}</p>

          <div className="mt-4 space-y-3 text-sm font-bold text-slate-300">
            {legalLinks.map((link) => (
              <p key={link.href}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="font-black">{isFr ? "Note importante" : "Important note"}</p>

          <p className="mt-4 text-sm font-medium leading-7 text-slate-300">
            {isFr
              ? "Vemo Technology fournit un accompagnement administratif et documentaire. Ce service ne remplace pas un avocat, un CPA ou un conseiller fiscal."
              : "Vemo Technology provides administrative and document support. This service does not replace an attorney, CPA or tax advisor."}
          </p>

          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm font-bold text-slate-200">
            © {new Date().getFullYear()} Vemo Technology
          </div>
        </div>
      </div>
    </footer>
  );
}
