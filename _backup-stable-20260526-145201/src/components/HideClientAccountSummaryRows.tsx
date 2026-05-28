"use client";

import { useEffect } from "react";

export default function HideClientAccountSummaryRows() {
  useEffect(() => {
    function hideRows() {
      const all = Array.from(document.querySelectorAll("div, section, article"));

      for (const el of all) {
        const text = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();

        const isClientAccount =
          text.includes("compte client") || text.includes("client account");

        const hasIncluded =
          text.includes("inclus") || text.includes("included");

        const isTooLarge = text.length > 160;

        if (isClientAccount && hasIncluded && !isTooLarge) {
          const htmlEl = el as HTMLElement;
          htmlEl.style.display = "none";
        }
      }
    }

    hideRows();

    const observer = new MutationObserver(() => hideRows());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}