"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) return null;

  return createClient(url, key);
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function sendResetLink() {
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage("Renseigne ton email.");
      return;
    }

    const supabase = supabaseClient();

    if (!supabase) {
      setMessage("Configuration Supabase manquante.");
      return;
    }

    setLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/fr/reinitialiser-mot-de-passe`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo,
      });

      if (error) {
        setMessage(error.message || "Erreur pendant l’envoi du lien.");
        return;
      }

      setMessage("Lien de réinitialisation envoyé. Vérifie ta boîte email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <section className="mx-auto flex min-h-screen max-w-[560px] items-center px-6 py-10">
        <div className="w-full rounded-[2rem] bg-white p-7">
          <a href="/fr/connexion" className="text-sm font-black text-[#F15A24]">
            ← Retour connexion
          </a>

          <div className="mt-8 text-[30px] font-black uppercase leading-none tracking-[-0.06em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.30em] text-slate-400">
            Espace client
          </p>

          <h1 className="mt-8 text-[34px] font-black tracking-[-0.06em]">
            Mot de passe oublié
          </h1>

          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Saisis ton email. Tu recevras un lien sécurisé pour choisir un nouveau mot de passe.
          </p>

          <div className="mt-6 space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email client"
              className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
            />

            <button
              type="button"
              onClick={sendResetLink}
              disabled={loading}
              className="h-[54px] w-full rounded-[16px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>

            {message ? (
              <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-3 text-sm font-black text-[#123A63]">
                {message}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
