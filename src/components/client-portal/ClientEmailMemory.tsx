"use client";

import { useEffect } from "react";

const STORAGE_KEYS = [
  "vemo_client_email",
  "vemoClientEmail",
  "clientEmail",
  "email",
];

export default function ClientEmailMemory({
  redirectWhenMissing = false,
  targetPath,
}: {
  redirectWhenMissing?: boolean;
  targetPath?: string;
}) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const emailFromUrl =
      url.searchParams.get("email") ||
      url.searchParams.get("clientEmail") ||
      url.searchParams.get("customer_email");

    if (emailFromUrl && emailFromUrl.includes("@")) {
      for (const key of STORAGE_KEYS) {
        window.localStorage.setItem(key, emailFromUrl);
      }
      return;
    }

    const savedEmail = STORAGE_KEYS
      .map((key) => window.localStorage.getItem(key))
      .find((value) => value && value.includes("@"));

    if (redirectWhenMissing && savedEmail && !url.searchParams.get("email")) {
      url.searchParams.set("email", savedEmail);
      window.location.replace(targetPath ? `${targetPath}?email=${encodeURIComponent(savedEmail)}` : url.toString());
    }
  }, [redirectWhenMissing, targetPath]);

  return null;
}
