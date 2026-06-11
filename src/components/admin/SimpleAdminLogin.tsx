"use client";

import { useState } from "react";

type Props = {
  lang: "fr" | "en";
};

export default function SimpleAdminLogin({ lang }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const t = {
    fr: {
      title: "Accès administrateur",
      subtitle: "Connectez-vous pour gérer les dossiers clients.",
      password: "Mot de passe",
      button: "Se connecter",
      error: "Mot de passe incorrect.",
    },
    en: {
      title: "Admin access",
      subtitle: "Sign in to manage client files.",
      password: "Password",
      button: "Sign in",
      error: "Incorrect password.",
    },
  }[lang];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== "123456") {
      setError(t.error);
      return;
    }

    try {
      localStorage.setItem("vemo_admin_access", "true");
      localStorage.setItem("vemo_admin_login_at", new Date().toISOString());
      document.cookie = "vemo_admin_access=true; path=/; max-age=86400; SameSite=Lax";
    } catch {}

    window.location.href = lang === "fr" ? "/fr/admin/client-portal" : "/en/admin/client-portal";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 440,
          border: "1px solid #E5EAF2",
          borderRadius: 28,
          padding: 32,
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 16,
              background: "#F15A24",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
            }}
          >
            V
          </div>
          <div>
            <div style={{ fontWeight: 900, color: "#123A63", fontSize: 21 }}>
              VEMO<span style={{ color: "#F15A24" }}>TECH</span>
            </div>
            <div style={{ color: "#8A98AD", fontSize: 10, letterSpacing: 4, fontWeight: 800 }}>
              ADMIN
            </div>
          </div>
        </div>

        <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, color: "#111827", fontWeight: 900 }}>
          {t.title}
        </h1>

        <p style={{ marginTop: 12, marginBottom: 28, color: "#667085", fontWeight: 700, lineHeight: 1.6 }}>
          {t.subtitle}
        </p>

        <label style={{ display: "block", color: "#123A63", fontWeight: 900, fontSize: 13, marginBottom: 8 }}>
          {t.password}
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            height: 54,
            border: "1px solid #DDE5F0",
            borderRadius: 16,
            padding: "0 16px",
            fontSize: 16,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {error ? (
          <div style={{ marginTop: 14, color: "#C2410C", fontWeight: 800, fontSize: 14 }}>
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          style={{
            marginTop: 22,
            width: "100%",
            height: 54,
            border: "none",
            borderRadius: 16,
            background: "#F15A24",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          {t.button}
        </button>
      </form>
    </main>
  );
}
