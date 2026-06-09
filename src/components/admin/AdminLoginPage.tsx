"use client";

import { useState } from "react";

type Lang = "fr" | "en";

export default function AdminLoginPage({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = isFr
    ? {
        label: "Admin sécurisé",
        title: "Connexion administrateur",
        text: "Entrez le mot de passe admin pour accéder à l’espace de gestion.",
        password: "Mot de passe admin",
        login: "Se connecter",
        error: "Mot de passe incorrect.",
      }
    : {
        label: "Secure admin",
        title: "Admin sign in",
        text: "Enter the admin password to access the management area.",
        password: "Admin password",
        login: "Sign in",
        error: "Incorrect password.",
      };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      if (!res.ok) {
        setError(t.error);
        return;
      }

      window.location.href = isFr ? "/fr/admin/client-portal" : "/en/admin/client-portal";
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F7FB] px-6 py-12 text-[#111827]">
      <section className="mx-auto max-w-xl rounded-[30px] border border-[#E6EDF5] bg-white p-8">
        <div className="text-[24px] font-black tracking-[-0.04em]">
          <span className="text-[#123A63]">VEMO</span>
          <span className="text-[#F15A24]">TECH</span>
        </div>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.45em] text-[#F15A24]">
          {t.label}
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em]">
          {t.title}
        </h1>

        <p className="mt-4 text-sm font-bold leading-6 text-[#64748B]">
          {t.text}
        </p>

        <form onSubmit={submit} className="mt-7">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.password}
            className="h-14 w-full rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 text-sm font-black outline-none"
            autoFocus
          />

          {error ? (
            <p className="mt-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 h-14 w-full rounded-[16px] bg-[#F15A24] text-sm font-black text-white disabled:opacity-60"
          >
            {loading ? "..." : t.login}
          </button>
        </form>
      </section>
    </main>
  );
}
