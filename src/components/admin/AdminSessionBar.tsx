"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSessionBar() {
  const pathname = usePathname();
  const isFr = pathname.startsWith("/fr");
  const isLogin = pathname.includes("/admin/login");

  if (isLogin) return null;

  const switchHref = isFr
    ? pathname.replace(/^\/fr/, "/en")
    : pathname.replace(/^\/en/, "/fr");

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => null);
    window.location.href = isFr ? "/fr/admin/login" : "/en/admin/login";
  }

  return (
    <div className="sticky top-0 z-[90] border-b border-[#E6EDF5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6">
        <Link href={isFr ? "/fr/admin/client-portal" : "/en/admin/client-portal"} className="leading-none">
          <div className="text-[20px] font-black tracking-[-0.04em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>
          <div className="mt-1 text-[9px] font-black uppercase tracking-[0.38em] text-[#64748B]">
            Admin
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={switchHref}
            className="rounded-[14px] border border-[#DDE7F2] bg-white px-5 py-3 text-sm font-black text-[#123A63]"
          >
            {isFr ? "EN" : "FR"}
          </Link>

          <button
            type="button"
            onClick={logout}
            className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white"
          >
            {isFr ? "Se déconnecter" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
