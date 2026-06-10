"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const ADMIN_PASSWORD = "123456";
const STORAGE_KEY = "vemo_admin_authenticated";

function Logo() {
  return (
    <div>
      <div className="text-[24px] font-black tracking-[-0.04em]">
        <span className="text-[#123A63]">VEMO</span>
        <span className="text-[#F15A24]">TECH</span>
      </div>
      <div className="mt-1 text-[9px] font-black uppercase tracking-[0.38em] text-[#64748B]">
        ADMIN
      </div>
    </div>
  );
}

export default function AdminPasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isFr = pathname.startsWith("/fr");
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const t = useMemo(() => {
    return isFr
      ? {
          secure: "ADMIN SÉCURISÉ",
          title: "Connexion administrateur",
          subtitle: "Entrez le mot de passe admin pour accéder à l’espace de gestion.",
          placeholder: "Mot de passe admin",
          button: "Se connecter",
          error: "Mot de passe incorrect.",
          lang: "EN",
          signOut: "Se déconnecter",
        }
      : {
          secure: "SECURE ADMIN",
          title: "Admin login",
          subtitle: "Enter the admin password to access the management area.",
          placeholder: "Admin password",
          button: "Sign in",
          error: "Incorrect password.",
          lang: "FR",
          signOut: "Sign out",
        };
  }, [isFr]);

  useEffect(() => {
    const ok = window.localStorage.getItem(STORAGE_KEY) === "yes";
    setAuthenticated(ok);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button,a") as HTMLElement | null;
      if (!button) return;

      const text = (button.textContent || "").trim().toLowerCase();

      if (
        text === "se déconnecter" ||
        text === "sign out" ||
        text === "déconnexion" ||
        text === "logout"
      ) {
        event.preventDefault();
        event.stopPropagation();
        window.localStorage.removeItem(STORAGE_KEY);
        document.cookie = "vemo_admin_authenticated=; Max-Age=0; path=/";
        setAuthenticated(false);
        router.push(isFr ? "/fr/admin" : "/en/admin");
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [authenticated, isFr, router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (password.trim() !== ADMIN_PASSWORD) {
      setError(t.error);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, "yes");
    document.cookie = "vemo_admin_authenticated=yes; path=/; max-age=86400";
    setAuthenticated(true);
    setError("");
    setPassword("");
  }

  function switchLang() {
    if (pathname.startsWith("/fr/admin/client-portal")) {
      router.push("/en/admin/client-portal");
      return;
    }

    if (pathname.startsWith("/en/admin/client-portal")) {
      router.push("/fr/admin/client-portal");
      return;
    }

    router.push(isFr ? "/en/admin" : "/fr/admin");
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#F3F7FB]" />
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#F3F7FB] text-[#111827]">
        <header className="border-b border-[#E6EDF5] bg-white">
          <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between px-6">
            <Logo />

            <button
              type="button"
              onClick={switchLang}
              className="rounded-[14px] border border-[#DDE7F2] bg-white px-5 py-3 text-sm font-black text-[#123A63]"
            >
              {t.lang}
            </button>
          </div>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-86px)] max-w-7xl items-center justify-center px-6 py-12">
          <form
            onSubmit={submit}
            className="w-full max-w-xl rounded-[32px] border border-[#DDE7F2] bg-white p-10"
          >
            <Logo />

            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.45em] text-[#F15A24]">
              {t.secure}
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-[#111827]">
              {t.title}
            </h1>

            <p className="mt-5 text-sm font-bold leading-6 text-[#64748B]">
              {t.subtitle}
            </p>

            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder={t.placeholder}
              className="mt-8 h-14 w-full rounded-[16px] border border-[#D8E2EF] bg-white px-5 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
            />

            {error ? (
              <p className="mt-4 rounded-[14px] border border-[#FBD2C4] bg-[#FFF3EF] px-4 py-3 text-sm font-black text-[#F15A24]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-5 h-14 w-full rounded-[16px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C]"
            >
              {t.button}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
