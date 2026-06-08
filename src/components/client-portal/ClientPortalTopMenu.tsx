"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function getEmail() {
  if (typeof window === "undefined") return "";

  const url = new URL(window.location.href);
  const email = url.searchParams.get("email") || "";

  if (email.includes("@")) {
    window.localStorage.setItem("vemo_client_email", email);
    return email;
  }

  return window.localStorage.getItem("vemo_client_email") || "";
}

export default function ClientPortalTopMenu({ lang }: { lang: "fr" | "en" }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(getEmail());
  }, []);

  const query = email ? `?email=${encodeURIComponent(email)}` : "";

  const copy =
    lang === "fr"
      ? {
          files: "Mes fichiers",
          services: "Mes services",
          messages: "Messages",
          status: "Statut",
          lang: "EN",
          logout: "Se déconnecter",
          switchHref: `/en/client-portal${query}`,
          homeHref: `/fr/espace-client${query}`,
          logoutHref: "/fr",
          subtitle: "US LLC pour non-résidents",
        }
      : {
          files: "My files",
          services: "My services",
          messages: "Messages",
          status: "Status",
          lang: "FR",
          logout: "Sign out",
          switchHref: `/fr/espace-client${query}`,
          homeHref: `/en/client-portal${query}`,
          logoutHref: "/en",
          subtitle: "US LLC for non-residents",
        };

  function logout() {
    window.localStorage.removeItem("vemo_client_email");
    window.localStorage.removeItem("vemoClientEmail");
    window.localStorage.removeItem("clientEmail");
    window.localStorage.removeItem("email");
    window.location.href = copy.logoutHref;
  }

  return (
    <header className="vemo-client-top-nav fixed left-0 right-0 top-0 z-[999] border-b border-[#E6EDF5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between px-6">
        <Link href={copy.homeHref} className="leading-none">
          <div className="text-[22px] font-black tracking-[-0.04em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>
          <div className="mt-1 text-[9px] font-black uppercase tracking-[0.38em] text-[#64748B]">
            {copy.subtitle}
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-black text-[#111827] md:flex">
          <a href="#documents" className="hover:text-[#F15A24]">{copy.files}</a>
          <a href="#services" className="hover:text-[#F15A24]">{copy.services}</a>
          <a href="#messages" className="hover:text-[#F15A24]">{copy.messages}</a>
          <a href="#status" className="hover:text-[#F15A24]">{copy.status}</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={copy.switchHref}
            className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#111827]"
          >
            {copy.lang}
          </Link>

          <button
            type="button"
            onClick={logout}
            className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#F15A24] px-6 text-sm font-black text-white"
          >
            {copy.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
