"use client";

import { useMemo, useState } from "react";

export const dynamic = "force-dynamic";

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
}

export default function PaymentPendingVerificationPage() {
  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialEmail = params.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function createClientSpace() {
    setError("");
    setMessage("");

    if (!emailIsValid(email)) {
      setError("Merci de renseigner un email valide.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/client-portal/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          source: "payment_pending_verification"
        })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setError(data?.error || "Impossible de créer l’espace client.");
        return;
      }

      setMessage("Email de confirmation envoyé.");
    } catch (e: any) {
      setError(e?.message || "Erreur pendant la création de l’espace client.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F8FB] px-6 py-12 text-[#111827]">
      <section className="mx-auto max-w-5xl">
        <a href="/fr" className="inline-flex flex-col">
          <div className="text-[28px] font-black uppercase leading-none tracking-[-0.06em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>
          <div className="mt-2 text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">
            US LLC POUR NON-RÉSIDENTS
          </div>
        </a>

        <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#F15A24]/20 bg-[#FFF7F2] text-2xl">
              ⏳
            </div>

            <p className="mt-7 text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
              Paiement par virement
            </p>

            <h1 className="mt-3 text-[42px] font-black leading-tight tracking-[-0.06em] text-[#111827]">
              Paiement en attente de vérification
            </h1>

            <p className="mt-5 max-w-2xl text-[16px] font-semibold leading-8 text-slate-600">
              Votre justificatif de virement a été reçu. L’équipe Vemo Technology vérifiera le paiement.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.3rem] border border-[#E6EDF5] bg-white p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Étape 01
                </p>
                <p className="mt-2 text-sm font-black text-[#123A63]">
                  Justificatif reçu
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-[#E6EDF5] bg-white p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Étape 02
                </p>
                <p className="mt-2 text-sm font-black text-[#123A63]">
                  Vérification paiement
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-[#E6EDF5] bg-white p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Étape 03
                </p>
                <p className="mt-2 text-sm font-black text-[#123A63]">
                  Suivi du dossier
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/fr/contact"
                className="inline-flex h-[52px] items-center justify-center rounded-[16px] border border-[#E6EDF5] bg-white px-6 text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
              >
                Contact
              </a>

              <a
                href="/fr"
                className="inline-flex h-[52px] items-center justify-center rounded-[16px] bg-[#F15A24] px-6 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Retour accueil
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
              Espace client
            </p>

            <h2 className="mt-3 text-[32px] font-black tracking-[-0.06em] text-[#111827]">
              Créer votre accès client
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
              Créez votre espace client pour suivre le paiement, consulter les messages VEMO et recevoir vos documents.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Email
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domaine.com"
                  className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Mot de passe
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Confirmation mot de passe
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le mot de passe"
                  className="h-[54px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24]"
                />
              </label>
            </div>

            {error ? (
              <div className="mt-5 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mt-5 rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                {message}
              </div>
            ) : null}

            <button
              type="button"
              onClick={createClientSpace}
              disabled={busy}
              className="mt-6 h-[56px] w-full rounded-[18px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
            >
              {busy ? "Création en cours..." : "Créer mon espace client →"}
            </button>

            <a
              href={`/fr/connexion?email=${encodeURIComponent(email)}`}
              className="mt-4 inline-flex h-[52px] w-full items-center justify-center rounded-[18px] border border-[#E6EDF5] bg-white text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
            >
              Se connecter
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
