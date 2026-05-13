type HeaderProps = {
  lang: "fr" | "en";
  active?: "home" | "pricing" | "start";
};

export function SiteHeader({ lang, active = "home" }: HeaderProps) {
  const isFr = lang === "fr";

  const links = isFr
    ? [
        { label: "Accueil", href: "/fr", key: "home" },
        { label: "Tarifs", href: "/fr/tarifs", key: "pricing" },
        { label: "Commencer", href: "/fr/commencer", key: "start" },
      ]
    : [
        { label: "Home", href: "/en", key: "home" },
        { label: "Pricing", href: "/en/pricing", key: "pricing" },
        { label: "Start", href: "/en/start", key: "start" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-2xl">
      <div className="vemo-container flex items-center justify-between py-4">
        <a href={isFr ? "/fr" : "/en"} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111a33] text-base font-black text-white shadow-lg">
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

        <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm md:flex">
          {links.map((link) => (
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
        </nav>

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
    </header>
  );
}

export function SiteFooter({ lang }: { lang: "fr" | "en" }) {
  const isFr = lang === "fr";

  return (
    <footer className="bg-[#111a33] px-6 py-12 text-white">
      <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-3">
        <div>
          <p className="text-2xl font-black">Vemo Technology</p>
          <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-slate-300">
            {isFr
              ? "Plateforme bilingue pour accompagner les entrepreneurs non-résidents dans la création de leur LLC américaine."
              : "A bilingual platform helping non-resident entrepreneurs set up their US LLC."}
          </p>
        </div>

        <div>
          <p className="font-black">Navigation</p>
          <div className="mt-3 space-y-2 text-sm font-bold text-slate-300">
            <p><a href={isFr ? "/fr" : "/en"}>{isFr ? "Accueil" : "Home"}</a></p>
            <p><a href={isFr ? "/fr/tarifs" : "/en/pricing"}>{isFr ? "Tarifs" : "Pricing"}</a></p>
            <p><a href={isFr ? "/fr/commencer" : "/en/start"}>{isFr ? "Commencer" : "Start"}</a></p>
          </div>
        </div>

        <div>
          <p className="font-black">{isFr ? "Note légale" : "Legal note"}</p>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-300">
            {isFr
              ? "Vemo Technology fournit un accompagnement administratif et documentaire. Ce service ne remplace pas un avocat, un CPA ou un conseiller fiscal."
              : "Vemo Technology provides administrative and document support. This service does not replace an attorney, CPA or tax advisor."}
          </p>
        </div>
      </div>
    </footer>
  );
}
