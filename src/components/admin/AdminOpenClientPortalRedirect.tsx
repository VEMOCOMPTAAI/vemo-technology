"use client";

import { useEffect } from "react";

export default function AdminOpenClientPortalRedirect() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const path = window.location.pathname;

      if (path !== "/fr/admin" && path !== "/en/admin") return;

      const target = event.target as HTMLElement | null;
      const button = target?.closest("a,button") as HTMLElement | null;

      if (!button) return;

      const text = (button.textContent || "").trim().toLowerCase();

      if (text === "ouvrir" || text === "open") {
        event.preventDefault();
        event.stopPropagation();

        window.location.href =
          path === "/en/admin"
            ? "/en/admin/client-portal"
            : "/fr/admin/client-portal";
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
