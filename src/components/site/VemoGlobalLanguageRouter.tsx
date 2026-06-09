"use client";

import { useEffect } from "react";

function getTargetPath(currentPath: string, targetLang: "fr" | "en") {
  const pairs: Array<[string, string]> = [
    ["/fr", "/en"],
    ["/fr/tarifs", "/en/pricing"],
    ["/fr/contact", "/en/contact"],
    ["/fr/faq", "/en/faq"],
    ["/fr/commencer", "/en/start"],
    ["/fr/espace-client", "/en/client-portal"],
    ["/fr/admin", "/en/admin"],
    ["/fr/payment-pending-verification", "/en/payment-pending-verification"],

    ["/en", "/fr"],
    ["/en/pricing", "/fr/tarifs"],
    ["/en/contact", "/fr/contact"],
    ["/en/faq", "/fr/faq"],
    ["/en/start", "/fr/commencer"],
    ["/en/client-portal", "/fr/espace-client"],
    ["/en/client-space", "/fr/espace-client"],
    ["/en/admin", "/fr/admin"],
    ["/en/payment-pending-verification", "/fr/payment-pending-verification"],
  ];

  const normalized = currentPath.replace(/\/$/, "") || "/";

  for (const [frPath, enPath] of pairs) {
    if (targetLang === "en" && normalized === frPath) return enPath;
    if (targetLang === "fr" && normalized === enPath) return frPath;
  }

  if (targetLang === "en") {
    if (normalized.startsWith("/fr/")) return normalized.replace(/^\/fr/, "/en");
    if (normalized === "/fr") return "/en";
  }

  if (targetLang === "fr") {
    if (normalized.startsWith("/en/")) return normalized.replace(/^\/en/, "/fr");
    if (normalized === "/en") return "/fr";
  }

  return targetLang === "fr" ? "/fr" : "/en";
}

export default function VemoGlobalLanguageRouter() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("a,button") as HTMLElement | null;
      if (!clickable) return;

      const label = (clickable.textContent || "").trim().toUpperCase();

      if (label !== "FR" && label !== "EN") return;

      event.preventDefault();
      event.stopPropagation();

      const targetLang = label === "FR" ? "fr" : "en";
      const nextPath = getTargetPath(window.location.pathname, targetLang);

      window.location.href = `${nextPath}${window.location.search}${window.location.hash}`;
    }

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
