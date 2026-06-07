"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function getStoredEmail() {
  if (typeof window === "undefined") return "";

  const url = new URL(window.location.href);
  const fromUrl =
    url.searchParams.get("email") ||
    url.searchParams.get("clientEmail") ||
    url.searchParams.get("customer_email") ||
    "";

  if (fromUrl && fromUrl.includes("@")) {
    window.localStorage.setItem("vemo_client_email", fromUrl);
    return fromUrl;
  }

  return (
    window.localStorage.getItem("vemo_client_email") ||
    window.localStorage.getItem("vemoClientEmail") ||
    window.localStorage.getItem("clientEmail") ||
    ""
  );
}

export default function ClientPortalMenu({ lang }: { lang: "fr" | "en" }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(getStoredEmail());

    // Supprimer uniquement le bouton Home / Accueil déjà présent dans les anciennes pages
    const hideHomeButtons = () => {
      const items = Array.from(document.querySelectorAll("a, button"));
      for (const item of items) {
        const text = (item.textContent || "").trim().toLowerCase();
        if (text === "home" || text === "accueil") {
          (item as HTMLElement).style.display = "none";
        }
      }
    };

    hideHomeButtons();

    const observer = new MutationObserver(hideHomeButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const query = email ? `?email=${encodeURIComponent(email)}` : "";

  const oppositeHref = useMemo(() => {
    return lang === "en"
      ? `/fr/espace-client${query}`
      : `/en/client-portal${query}`;
  }, [lang, query]);

  const labels =
    lang === "en"
      ? {
          switchLang: "FR",
          files: "My files",
          services: "My services",
          messages: "Messages",
          status: "Status",
        }
      : {
          switchLang: "EN",
          files: "Mes fichiers",
          services: "Mes services",
          messages: "Messages",
          status: "Statut",
        };

  const items = [
    { label: labels.files, href: "#documents" },
    { label: labels.services, href: "#services" },
    { label: labels.messages, href: "#messages" },
    { label: labels.status, href: "#status" },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#123A63] hover:border-[#F15A24]"
        >
          {item.label}
        </a>
      ))}

      <Link
        href={oppositeHref}
        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#DDE7F2] bg-white px-5 text-sm font-black text-[#111827] hover:border-[#F15A24]"
      >
        {labels.switchLang}
      </Link>
    </div>
  );
}
