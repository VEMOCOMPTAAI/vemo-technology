
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

type Lang = "fr" | "en";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}

export default function ClientLoginUnifiedPage({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().includes("@") && password.length >= 6 && status !== "loading";
  }, [email, password, status]);

  async function login() {
    if (!canSubmit) return;

    setStatus("loading");
    setMessage("");

    const supabase = getSupabaseClient();

    if (!supabase) {
      setStatus("error");
      setMessage(
        isFr
          ? "Configuration Supabase manquante. Vérifiez les variables publiques du projet."
          : "Missing Supabase configuration. Check your public project variables."
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setStatus("error");
      setMessage(
        isFr
          ? "Identifiants incorrects ou email non vérifié."
          : "Invalid credentials or unverified email."
      );
      return;
    }

    setStatus("success");
    setMessage(isFr ? "Connexion réussie. Redirection..." : "Login successful. Redirecting...");

    window.location.href = isFr ? "/fr/espace-client" : "/en/espace-client";
  }

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <SiteHeader lang={lang} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-6 py-16">
          <div className="w-full max-w-xl rounded-[16px] border border-[#E8E2DC] bg-white p-9 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
            <div className="inline-flex rounded-md bg-[#FFF7F1] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#123A63]">
              {isFr ? "Connexion client" : "Client login"}
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-[-0.06em] text-[#2B2F36]">
              {isFr ? "Accéder à mon espace." : "Access my portal."}
            </h1>

            <p className="mt-4 text-sm font-semibold leading-7 text-[#2B2F36]/68">
              {isFr
                ? "Connectez-vous avec l’email utilisé lors de votre commande pour suivre votre dossier, vos documents et vos messages."
                : "Sign in with the email used for your order to track your case, documents and messages."}
            </p>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm font-black text-[#123A63]">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domaine.com"
                  className="mt-2 h-14 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold text-[#2B2F36] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#123A63]">
                  {isFr ? "Mot de passe" : "Password"}
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isFr ? "Votre mot de passe" : "Your password"}
                  className="mt-2 h-14 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold text-[#2B2F36] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-orange-100"
                />
              </label>
            </div>

            {message ? (
              <div
                className={[
                  "mt-5 rounded-[10px] border px-4 py-3 text-sm font-bold leading-6",
                  status === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-orange-200 bg-[#FFF7F1] text-[#123A63]",
                ].join(" ")}
              >
                {message}
              </div>
            ) : null}

            <button
              type="button"
              onClick={login}
              disabled={!canSubmit}
              className="mt-7 h-14 w-full rounded-[10px] bg-[#F15A24] text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)] transition hover:bg-[#D84D1F] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {status === "loading"
                ? isFr ? "Connexion..." : "Signing in..."
                : isFr ? "Se connecter" : "Log in"}
            </button>

            <div className="mt-6 border-t border-[#E8E2DC] pt-5 text-center text-sm font-bold text-[#2B2F36]/65">
              {isFr ? "Pas encore de compte ?" : "No account yet?"}{" "}
              <Link
                href={isFr ? "/fr/commencer" : "/en/commencer"}
                className="text-[#F15A24] hover:text-[#D84D1F]"
              >
                {isFr ? "Commencer un dossier" : "Start a case"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
