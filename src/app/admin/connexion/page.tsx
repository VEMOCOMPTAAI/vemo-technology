"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      let result: { ok?: boolean; error?: string } = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error || "Connexion impossible.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin/dossiers";
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Impossible de contacter l’API admin. Relance le serveur local puis réessaie."
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#111a33]">
      <section className="mx-auto flex min-h-screen max-w-xl items-center px-6">
        <div className="w-full rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111a33] text-lg font-black text-white">
              V
            </div>

            <div>
              <p className="text-2xl font-black">Vemo Technology</p>
              <p className="text-sm font-bold text-slate-500">Admin sécurisé</p>
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-black">Connexion admin</h1>

          <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
            Entrez le mot de passe admin pour accéder aux dossiers LLC.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Mot de passe
            </label>

            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-5 py-4 font-bold outline-none focus:border-[#c51f32]"
              placeholder="Mot de passe admin"
            />

            {errorMessage && (
              <div className="mt-4 rounded-2xl bg-red-50 px-5 py-4 text-sm font-black text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-[#c51f32] px-6 py-4 font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <a
            href="/fr"
            className="mt-5 block text-center text-sm font-black text-slate-500 hover:text-[#c51f32]"
          >
            Retour au site
          </a>
        </div>
      </section>
    </main>
  );
}
