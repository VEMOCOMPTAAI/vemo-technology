"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/en/client-portal";
  const [message, setMessage] = useState("Confirmation du compte...");

  useEffect(() => {
    async function handleCallback() {
      try {
        const supabase = createBrowserSupabaseClient();
        const code = searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data } = await supabase.auth.getSession();

        if (data.session?.access_token) {
          await fetch("/api/client-portal/mark-session", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          });
        }

        setMessage("Account confirmed. Redirecting...");
        router.replace(next);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Impossible de confirmer le compte."
        );
      }
    }

    handleCallback();
  }, [router, searchParams, next]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/70">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F15A24]">
            Email confirmation
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950">
            {message}
          </h1>
        </div>
      </div>
    </section>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fa] text-slate-950">
      <SiteHeader lang="fr" active="start" />

      <Suspense fallback={<section className="p-10">Chargement...</section>}>
        <CallbackContent />
      </Suspense>

      <SiteFooter lang="fr" />
    </main>
  );
}


