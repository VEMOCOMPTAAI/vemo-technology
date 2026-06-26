import Link from "next/link";
import type { ReactNode } from "react";

type Lang = "fr" | "en";

export default function VemoPublicShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const isFr = lang === "fr";

  const routes = {
    home: isFr ? "/fr" : "/en",
    pricing: isFr ? "/fr/tarifs" : "/en/pricing",
    faq: isFr ? "/fr/faq" : "/en/faq",
    contact: isFr ? "/fr/contact" : "/en/contact",
    start: isFr ? "/fr/commencer" : "/en/start",
    switchLang: isFr ? "/en/start" : "/fr/commencer",
  };

  return (
    <div className="vemo-shell">
      <header className="vemo-shell-header">
        <div className="vemo-shell-header-inner">
          <Link href={routes.home} className="vemo-shell-logo" aria-label="VEMO Technology">
            <strong><span>VEMO</span><em>TECH</em></strong>
            <small>{isFr ? "US LLC POUR NON-RÉSIDENTS" : "US LLC FOR NON-RESIDENTS"}</small>
          </Link>

          <nav className="vemo-shell-nav">
            <Link href={routes.home}>{isFr ? "Accueil" : "Home"}</Link>
            <Link href={routes.pricing}>{isFr ? "Tarifs" : "Pricing"}</Link>
            <Link href={routes.faq}>FAQ</Link>
            <Link href={routes.contact}>Contact</Link>
          </nav>

          <div className="vemo-shell-actions">
            <Link href={routes.switchLang} className="vemo-shell-lang">{isFr ? "EN" : "FR"}</Link>
            <Link href={routes.start} className="vemo-shell-start">{isFr ? "Démarrer" : "Start"} →</Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="vemo-shell-footer">
        <div className="vemo-shell-footer-inner">
          <div>
            <div className="vemo-shell-footer-logo"><span>VEMO</span><em>TECH</em></div>
            <p>{isFr ? "Accompagnement professionnel pour créer, structurer et suivre votre LLC US à distance." : "Professional support to form, structure and track your US LLC remotely."}</p>
          </div>

          <div>
            <h4>{isFr ? "Navigation" : "Navigation"}</h4>
            <Link href={routes.home}>{isFr ? "Accueil" : "Home"}</Link>
            <Link href={routes.pricing}>{isFr ? "Tarifs" : "Pricing"}</Link>
            <Link href={routes.faq}>FAQ</Link>
            <Link href={routes.contact}>Contact</Link>
          </div>

          <div>
            <h4>{isFr ? "Services" : "Services"}</h4>
            <span>LLC Formation</span>
            <span>EIN</span>
            <span>Banking Guidance</span>
            <span>US Phone Number</span>
          </div>

          <div>
            <h4>{isFr ? "Légal" : "Legal"}</h4>
            <span>Terms</span>
            <span>Privacy</span>
            <span>Refund Policy</span>
          </div>
        </div>

        <div className="vemo-shell-footer-bottom">
          © 2026 VEMO Technology. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
