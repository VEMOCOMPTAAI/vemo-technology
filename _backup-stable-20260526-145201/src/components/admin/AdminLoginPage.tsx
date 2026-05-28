
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";

const copy = {
  fr: {
    eyebrow: "Connexion admin",
    title: "Accéder à Vemo Admin.",
    subtitle: "Espace réservé aux administrateurs autorisés.",
    email: "Email admin",
    password: "Mot de passe",
    submit: "Se connecter à l’admin",
    loading: "Connexion...",
    client: "Connexion client",
    success: "Connexion réussie. Redirection...",
    error: "Identifiants admin incorrects ou endpoint admin non configuré.",
  },
  en: {
    eyebrow: "Admin login",
    title: "Access Vemo Admin.",
    subtitle: "Restricted area for authorized administrators.",
    email: "Admin email",
    password: "Password",
    submit: "Log in to admin",
    loading: "Signing in...",
    client: "Client login",
    success: "Login successful. Redirecting...",
    error: "Invalid admin credentials or admin endpoint not configured.",
  },
};

export default function AdminLoginPage({ lang }: { lang: Lang }) {
  const t = copy[lang];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().includes("@") && password.length >= 4 && status !== "loading";
  }, [email, password, status]);

  async function login() {
    if (!canSubmit) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (!response.ok) {
        setStatus("error");
        setMessage(t.error);
        return;
      }

      const data = await response.json().catch(() => ({}));

      try {
        localStorage.setItem("vemo_admin_session", data?.token || "active");
        localStorage.setItem("vemo_admin_email", email.trim().toLowerCase());
      } catch {}

      setStatus("success");
      setMessage(t.success);

      window.location.href = lang === "fr" ? "/fr/admin" : "/en/admin";
    } catch {
      setStatus("error");
      setMessage(t.error);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
        <div className="fixed inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="rounded-[16px] border border-[#E8E2DC] bg-white px-8 py-6 text-sm font-black text-[#123A63] shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
            Chargement de Vemo Admin...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <div className="fixed inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

      <header className="relative z-10 border-b border-[#E8E2DC] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
          <Link href={lang === "fr" ? "/fr" : "/en"} className="leading-none">
            <div className="text-[1.65rem] font-black tracking-[-0.04em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#2B2F36]/70">
              Admin console
            </div>
          </Link>

          <Link
            href={lang === "fr" ? "/fr/connexion" : "/en/connexion"}
            className="rounded-[8px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63]"
          >
            {t.client}
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-14">
        <section className="w-full max-w-xl rounded-[18px] border border-[#E8E2DC] bg-white p-9 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
          <div className="inline-flex rounded-md bg-[#FFF7F1] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#123A63]">
            {t.eyebrow}
          </div>

          <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-[-0.06em] text-[#2B2F36]">
            {t.title}
          </h1>

          <p className="mt-4 text-sm font-semibold leading-7 text-[#2B2F36]/68">
            {t.subtitle}
          </p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-black text-[#123A63]">{t.email}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="mt-2 h-14 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold text-[#2B2F36] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-orange-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-[#123A63]">{t.password}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            disabled={!mounted || !canSubmit}
            className="mt-7 h-14 w-full rounded-[10px] bg-[#F15A24] text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)] transition hover:bg-[#D84D1F] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {status === "loading" ? t.loading : t.submit}
          </button>
        </section>
      </main>
    </div>
  );
}
