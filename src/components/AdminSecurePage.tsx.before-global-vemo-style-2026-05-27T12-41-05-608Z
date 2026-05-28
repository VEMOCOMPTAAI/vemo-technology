"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AdminClientPortalManager from "@/components/AdminClientPortalManager";

type Lang = "fr" | "en";

declare global {
  interface Window {
    __VEMO_ADMIN_FETCH_PATCHED__?: boolean;
    __VEMO_ADMIN_TOKEN__?: string;
  }
}

const copy = {
  fr: {
    checking: "Vérification de l’accès admin...",
    denied: "Accès admin refusé",
    deniedText:
      "Vous devez être connecté avec un compte administrateur autorisé pour accéder à cet espace.",
    login: "Connexion admin",
    home: "Retour accueil",
    configError:
      "Variables Supabase publiques manquantes : NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  },
  en: {
    checking: "Checking admin access...",
    denied: "Admin access denied",
    deniedText:
      "You must be logged in with an authorized admin account to access this area.",
    login: "Admin login",
    home: "Back home",
    configError:
      "Missing public Supabase variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  },
};

function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) return null;

  return createClient(url, anon);
}

function patchAdminFetch(token: string) {
  if (typeof window === "undefined") return;

  window.__VEMO_ADMIN_TOKEN__ = token;

  if (window.__VEMO_ADMIN_FETCH_PATCHED__) return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    if (url.includes("/api/admin/")) {
      const headers = new Headers(init?.headers || {});

      if (!headers.has("Authorization") && window.__VEMO_ADMIN_TOKEN__) {
        headers.set("Authorization", `Bearer ${window.__VEMO_ADMIN_TOKEN__}`);
      }

      return originalFetch(input, {
        ...init,
        headers,
      });
    }

    return originalFetch(input, init);
  };

  window.__VEMO_ADMIN_FETCH_PATCHED__ = true;
}

export default function AdminSecurePage({ lang }: { lang: Lang }) {
  const t = copy[lang];

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      setLoading(true);
      setError("");

      try {
        const supabase = getSupabaseBrowser();

        if (!supabase) {
          throw new Error(t.configError);
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(t.deniedText);
        }

        const response = await fetch("/api/admin/me", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || t.deniedText);
        }

        patchAdminFetch(session.access_token);

        if (!cancelled) {
          setAuthorized(true);
        }
      } catch (err) {
        if (!cancelled) {
          setAuthorized(false);
          setError(err instanceof Error ? err.message : t.deniedText);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [t.configError, t.deniedText]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] px-6 text-slate-950">
        <div className="w-full max-w-xl rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-200/70">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-xl font-black text-[#0e7490]">
            V
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-[#0e7490]">
            Vemo Admin
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.05em]">
            {t.checking}
          </h1>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] px-6 text-slate-950">
        <div className="w-full max-w-xl rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-xl shadow-slate-200/70">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl font-black text-red-600">
            !
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-[#0e7490]">
            Vemo Admin
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em]">
            {t.denied}
          </h1>

          <p className="mt-4 text-sm font-bold leading-7 text-slate-500">
            {error || t.deniedText}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`/${lang}/admin/connexion`}
              className="rounded-2xl bg-[#0e7490] px-6 py-4 text-sm font-black text-white shadow-lg shadow-cyan-900/20"
            >
              {t.login}
            </a>

            <a
              href={`/${lang}`}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-950"
            >
              {t.home}
            </a>
          </div>
        </div>
      </main>
    );
  }

  return <AdminClientPortalManager />;
}