
"use client";

import { useEffect } from "react";

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function VemoFormMemoryRuntime() {
  useEffect(() => {
    function saveFromInputs() {
      try {
        const inputs = Array.from(document.querySelectorAll("input")) as HTMLInputElement[];

        for (const input of inputs) {
          const name = (input.name || "").toLowerCase();
          const id = (input.id || "").toLowerCase();
          const placeholder = (input.placeholder || "").toLowerCase();
          const type = (input.type || "").toLowerCase();
          const value = (input.value || "").trim();

          if (!value) continue;

          if (
            type === "email" ||
            name.includes("email") ||
            id.includes("email") ||
            placeholder.includes("email") ||
            looksLikeEmail(value)
          ) {
            if (looksLikeEmail(value)) {
              localStorage.setItem("vemo_billing_email", value.toLowerCase());
              localStorage.setItem("vemo_client_email", value.toLowerCase());
            }
          }

          if (
            name.includes("name") ||
            id.includes("name") ||
            placeholder.includes("nom") ||
            placeholder.includes("full name")
          ) {
            if (!looksLikeEmail(value) && value.length >= 2) {
              localStorage.setItem("vemo_billing_name", value);
              localStorage.setItem("vemo_client_name", value);
            }
          }
        }

        const params = new URLSearchParams(window.location.search);

        const packageName =
          params.get("package_name") ||
          params.get("package") ||
          params.get("plan") ||
          "";

        const amount =
          params.get("amount") ||
          params.get("price") ||
          "";

        const state =
          params.get("state") ||
          "";

        if (packageName) localStorage.setItem("vemo_package_name", packageName);
        if (amount) localStorage.setItem("vemo_amount", amount);
        if (state) localStorage.setItem("vemo_state", state);
      } catch {}
    }

    saveFromInputs();

    document.addEventListener("input", saveFromInputs, true);
    document.addEventListener("change", saveFromInputs, true);
    document.addEventListener("click", () => setTimeout(saveFromInputs, 50), true);

    return () => {
      document.removeEventListener("input", saveFromInputs, true);
      document.removeEventListener("change", saveFromInputs, true);
    };
  }, []);

  return null;
}
