"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TUNNEL_PATHS = [
  "/fr/commencer",
  "/fr/demarrer",
  "/fr/start",
  "/en/start",
  "/en/commencer",
];

export default function VemoTunnelMobileScope() {
  const pathname = usePathname();

  useEffect(() => {
    const active = TUNNEL_PATHS.includes(pathname || "");
    document.body.classList.toggle("vemo-tunnel-mobile-only", active);

    return () => {
      document.body.classList.remove("vemo-tunnel-mobile-only");
    };
  }, [pathname]);

  return null;
}
