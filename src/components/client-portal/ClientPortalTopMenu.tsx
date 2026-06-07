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

    const removeOldHome = () => {
      document.querySelectorAll("a,button").forEach((el) => {
        const text = (el.textContent || "").trim().toLowerCase();
        if (text === "home" || text === "accueil") {
          (el as HTMLElement).style.display = "none";
        }
      });
    };

    removeOldHome();

    const observer = new MutationObserver(removeOldHome);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const query = email ? `?email=${encodeURIComponent(email)}` : "";

  const labels =
    lang === "en"
      ? {
          switchLang: "FR",
          files: "My files",
          services: "My services",
          messages: "Messages",
          status: "Status",
          refresh: "Refresh",
          switchHref: `/fr/espace-client${query}`,
        }
      : {
          switchLang: "EN",
          files: "Mes fichiers",
          services: "Mes services",
          messages: "Messages",
          status: "Statut",
          refresh: "Actualiser",
          switchHref: `/en/client-portal${query}`,
        };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      <a href="#documents" className="inline-flex h-11 items-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#123A63]">
        {labels.files}
      </a>
      <a href="#services" className="inline-flex h-11 items-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#123A63]">
        {labels.services}
      </a>
      <a href="#messages" className="inline-flex h-11 items-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#123A63]">
        {labels.messages}
      </a>
      <a href="#status" className="inline-flex h-11 items-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#123A63]">
        {labels.status}
      </a>
      <Link href={labels.switchHref} className="inline-flex h-11 items-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#111827]">
        {labels.switchLang}
      </Link>
      <button onClick={() => window.location.reload()} className="inline-flex h-11 items-center rounded-[14px] bg-[#F15A24] px-5 text-sm font-black text-white">
        {labels.refresh}
      </button>
    </div>
  );
}
