"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function readEmail() {
  if (typeof window === "undefined") return "";

  const url = new URL(window.location.href);
  const fromUrl = url.searchParams.get("email") || "";

  if (fromUrl.includes("@")) {
    window.localStorage.setItem("vemo_client_email", fromUrl);
    return fromUrl;
  }

  return window.localStorage.getItem("vemo_client_email") || "";
}

export default function ClientPortalTopMenu({ lang }: { lang: "en" | "fr" }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(readEmail());

    const hideOldButtons = () => {
      document.querySelectorAll("a,button").forEach((el) => {
        const text = (el.textContent || "").trim().toLowerCase();
        const insideNewNav = (el as HTMLElement).closest(".vemo-client-top-nav");

        if (!insideNewNav && ["home", "accueil", "refresh", "actualiser"].includes(text)) {
          (el as HTMLElement).style.display = "none";
        }
      });
    };

    hideOldButtons();

    const observer = new MutationObserver(hideOldButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const query = email ? `?email=${encodeURIComponent(email)}` : "";

  const labels =
    lang === "en"
      ? {
          files: "My files",
          services: "My services",
          messages: "Messages",
          status: "Status",
          lang: "FR",
          refresh: "Refresh",
          switchHref: `/fr/espace-client${query}`,
        }
      : {
          files: "Mes fichiers",
          services: "Mes services",
          messages: "Messages",
          status: "Statut",
          lang: "EN",
          refresh: "Actualiser",
          switchHref: `/en/client-portal${query}`,
        };

  return (
    <header className="vemo-client-top-nav fixed left-0 right-0 top-0 z-[90] border-b border-[#E6EDF5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between px-6">
        <Link href={lang === "en" ? `/en/client-portal${query}` : `/fr/espace-client${query}`} className="leading-none">
          <div className="text-[22px] font-black tracking-[-0.04em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>
          <div className="mt-1 text-[9px] font-black uppercase tracking-[0.38em] text-[#64748B]">
            US LLC for non-residents
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-black text-[#111827] md:flex">
          <a href="#documents" className="hover:text-[#F15A24]">{labels.files}</a>
          <a href="#services" className="hover:text-[#F15A24]">{labels.services}</a>
          <a href="#messages" className="hover:text-[#F15A24]">{labels.messages}</a>
          <a href="#status" className="hover:text-[#F15A24]">{labels.status}</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={labels.switchHref}
            className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#111827]"
          >
            {labels.lang}
          </Link>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#F15A24] px-6 text-sm font-black text-white"
          >
            {labels.refresh}
          </button>
        </div>
      </div>
    </header>
  );
}
