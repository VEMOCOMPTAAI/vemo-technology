
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Lang = "fr" | "en";

const copy = {
  fr: {
    dashboard: "Tableau de bord",
    clients: "Clients",
    orders: "Dossiers",
    payments: "Paiements",
    documents: "Documents",
    messages: "Messages",
    settings: "Paramètres",
    logout: "Déconnexion",
    title: "Vemo Admin",
    subtitle: "Pilotage interne",
  },
  en: {
    dashboard: "Dashboard",
    clients: "Clients",
    orders: "Cases",
    payments: "Payments",
    documents: "Documents",
    messages: "Messages",
    settings: "Settings",
    logout: "Log out",
    title: "Vemo Admin",
    subtitle: "Internal control",
  },
};

export function AdminShell({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const t = copy[lang];
  const pathname = usePathname();

  const base = lang === "fr" ? "/fr/admin" : "/en/admin";
  const login = lang === "fr" ? "/fr/admin/connexion" : "/en/admin/login";

  const links = [
    [t.dashboard, base],
    [t.clients, base + "/clients"],
    [t.orders, base + "/dossiers"],
    [t.payments, base + "/paiements"],
    [t.documents, base + "/documents"],
    [t.messages, base + "/messages"],
    [t.settings, base + "/parametres"],
  ];

  function logout() {
    try {
      localStorage.removeItem("vemo_admin_session");
      localStorage.removeItem("vemo_admin_email");
    } catch {}

    window.location.href = login;
  }

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <div className="fixed inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-[#E8E2DC] bg-white/90 backdrop-blur-xl lg:block">
          <div className="flex h-[84px] items-center border-b border-[#E8E2DC] px-7">
            <Link href={base} className="leading-none">
              <div className="text-[1.65rem] font-black tracking-[-0.04em]">
                <span className="text-[#123A63]">VEMO</span>
                <span className="text-[#F15A24]">TECH</span>
              </div>
              <div className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#2B2F36]/60">
                Admin console
              </div>
            </Link>
          </div>

          <nav className="space-y-2 p-5">
            {links.map(([label, href]) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "flex h-12 items-center rounded-[10px] px-4 text-sm font-black transition",
                    active
                      ? "bg-[#F15A24] text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)]"
                      : "text-[#2B2F36]/72 hover:bg-[#FFF7F1] hover:text-[#123A63]",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-[#E8E2DC] p-5">
            <button
              type="button"
              onClick={logout}
              className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#E8E2DC] bg-white text-sm font-black text-[#2B2F36] hover:border-[#F15A24]"
            >
              {t.logout}
            </button>
          </div>
        </aside>

        <section>
          <header className="sticky top-0 z-30 flex h-[84px] items-center justify-between border-b border-[#E8E2DC] bg-white/90 px-6 backdrop-blur-xl lg:px-10">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
                {t.subtitle}
              </div>
              <h1 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#2B2F36]">
                {t.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={lang === "fr" ? "/en/admin" : "/fr/admin"}
                className="rounded-[8px] border border-[#E8E2DC] bg-white px-4 py-3 text-sm font-black text-[#123A63]"
              >
                {lang === "fr" ? "EN" : "FR"}
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded-[8px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)]"
              >
                {t.logout}
              </button>
            </div>
          </header>

          <main className="px-6 py-8 lg:px-10">
            {children}
          </main>
        </section>
      </div>
    </div>
  );
}
