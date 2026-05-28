"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) return null;

  return createClient(url, key);
}

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail || !cleanEmail.includes("@")) {
        setMessage("Veuillez saisir un email valide.");
        setLoading(false);
        return;
      }

      if (!password) {
        setMessage("Veuillez saisir votre mot de passe.");
        setLoading(false);
        return;
      }

      const supabase = getSupabaseBrowser();

      if (!supabase) {
        setMessage("Configuration Supabase manquante.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        const msg = String(error.message || "").toLowerCase();

        if (msg.includes("email not confirmed") || msg.includes("confirm")) {
          setMessage("Votre email n’est pas encore confirmé. Veuillez cliquer sur le dernier lien de confirmation reçu par email, ou demander un nouvel email de confirmation.");
        } else if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
          setMessage("Email ou mot de passe incorrect.");
        } else {
          setMessage(error.message || "Connexion impossible.");
        }

        setLoading(false);
        return;
      }

      const sessionEmail = data?.user?.email || cleanEmail;

      const mark = await fetch("/api/client-portal/mark-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sessionEmail,
        }),
      }).catch(() => null);

      if (!mark?.ok) {
        const payload = await mark?.json().catch(() => ({}));
        setMessage(
          payload?.error ||
            "Connexion réussie, mais l’activation de l’espace client a échoué."
        );
        setLoading(false);
        return;
      }

      window.location.href = `/fr/espace-client?email=${encodeURIComponent(sessionEmail)}`;
    } catch (error: any) {
      setMessage(error?.message || "Erreur pendant la connexion.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader lang="fr" />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[#E8E2DC] bg-white p-8 shadow-[0_22px_60px_rgba(18,58,99,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
            Connexion client
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[#111827]">
            Accéder à mon espace client
          </h1>

          <p className="mt-4 text-sm font-bold leading-7 text-slate-600">
            Connectez-vous avec l’email confirmé utilisé lors de votre commande.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#123A63]">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="email@domain.com"
                className="w-full rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-bold text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#123A63]">
                Mot de passe
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                className="w-full rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-bold text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
              />
            </label>

            {message && (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold leading-7 text-red-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] transition hover:bg-[#D94A1B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter →"}
            </button>
          </form>

          <div className="mt-6 rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4">
            <p className="text-xs font-bold leading-6 text-slate-500">
              Si vous venez de créer votre compte, vérifiez d’abord votre boîte mail puis cliquez sur le lien de confirmation.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter lang="fr" />
    </main>
  );
}
