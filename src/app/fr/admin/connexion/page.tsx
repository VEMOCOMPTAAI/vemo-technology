"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

function AdminLogo() {
  return (
    <div className="inline-flex flex-col leading-none">
      <div className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
        VEMO <span className="text-[#F15A24]">TECH</span>
      </div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
        ADMIN SPACE
      </div>
    </div>
  );
}

export default function AdminConnexionPage() {
  const [email, setEmail] = useState("contact@vemo-technology.com");
  const [password, setPassword] = useState("Admin2026!");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowser();

      if (!supabase) {
        setMessage("Configuration Supabase manquante.");
        setLoading(false);
        return;
      }

      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setMessage("Email ou mot de passe admin incorrect.");
        setLoading(false);
        return;
      }

      const user = data?.user;

      const role =
        user?.user_metadata?.role ||
        user?.user_metadata?.app_role ||
        user?.app_metadata?.role ||
        user?.app_metadata?.app_role ||
        "";

      const isAdmin =
        cleanEmail === "contact@vemo-technology.com" ||
        role === "admin" ||
        user?.user_metadata?.is_admin === true ||
        user?.app_metadata?.is_admin === true;

      if (!isAdmin) {
        setMessage("Ce compte n’a pas les droits administrateur.");
        setLoading(false);
        return;
      }

      window.location.href = "/fr/admin";
    } catch (error: any) {
      setMessage(error?.message || "Erreur pendant la connexion admin.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC] px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-xl items-center justify-center">
        <section className="w-full rounded-[2.5rem] border border-[#E8E2DC] bg-white p-8 shadow-[0_28px_80px_rgba(18,58,99,0.10)] md:p-10">
          <AdminLogo />

          <div className="mt-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
              Connexion admin
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[#111827]">
              Accéder à Vemo Admin
            </h1>

            <p className="mt-4 text-sm font-bold leading-7 text-slate-600">
              Connectez-vous avec le compte administrateur autorisé.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#123A63]">
                Email admin
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
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
                placeholder="Mot de passe admin"
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
        </section>
      </div>
    </main>
  );
}
