"use client";

import Link from "next/link";
import { useState } from "react";

type Locale = "fr" | "en";

const copy = {
  fr: {
    eyebrow: "Compte client EIN",
    title: "Créez votre compte client",
    subtitle: "Votre dossier EIN sera suivi dans l’espace client VEMO après vérification du paiement.",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    create: "Créer le compte",
    login: "Se connecter",
    already: "Vous avez déjà un compte ?",
    required: "Champ obligatoire",
    passwordInvalid: "Mot de passe invalide",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    verificationTitle: "Vérification",
    verificationText: "Après création du compte, un email de vérification sera requis avant d’accéder à l’espace client.",
    portal: "Créer le compte et vérifier mon email",
  },
  en: {
    eyebrow: "EIN client account",
    title: "Create your client account",
    subtitle: "Your EIN file will be tracked in the VEMO client portal after payment review.",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    create: "Create account",
    login: "Log in",
    already: "Already have an account?",
    required: "Required field",
    passwordInvalid: "Invalid password",
    passwordMismatch: "Passwords do not match",
    verificationTitle: "Verification",
    verificationText: "After account creation, email verification is required before accessing the client portal.",
    portal: "Create account and verify my email",
  },
};

export default function EinAccountForm({
  locale,
  email,
}: {
  locale: Locale;
  email: string;
}) {
  const t = copy[locale];
  const [clientEmail, setClientEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const portalUrl =
    locale === "fr"
      ? `/fr/ein-verify?email=${encodeURIComponent(clientEmail)}`
      : `/en/ein-verify?email=${encodeURIComponent(clientEmail)}`;

  const loginUrl = locale === "fr" ? "/fr/connexion" : "/en/connexion";

  function validate() {
    const nextErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!clientEmail.trim()) {
      nextErrors.email = t.required;
    }

    if (!password.trim() || password.length < 8) {
      nextErrors.password = t.passwordInvalid;
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = t.required;
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = t.passwordMismatch;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    window.location.href = portalUrl;
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          {t.email}
        </span>
        <input
          value={clientEmail}
          onChange={(event) => {
            setClientEmail(event.target.value);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
          className={[
            "rounded-[16px] border bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]",
            errors.email ? "border-red-300" : "border-[#E6EDF5]",
          ].join(" ")}
        />
        {errors.email ? (
          <span className="text-xs font-black text-red-500">{errors.email}</span>
        ) : null}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {t.password}
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
            }}
            className={[
              "rounded-[16px] border bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]",
              errors.password ? "border-red-300" : "border-[#E6EDF5]",
            ].join(" ")}
          />
          {errors.password ? (
            <span className="text-xs font-black text-red-500">{errors.password}</span>
          ) : null}
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {t.confirmPassword}
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setErrors((current) => ({ ...current, confirmPassword: undefined }));
            }}
            className={[
              "rounded-[16px] border bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]",
              errors.confirmPassword ? "border-red-300" : "border-[#E6EDF5]",
            ].join(" ")}
          />
          {errors.confirmPassword ? (
            <span className="text-xs font-black text-red-500">
              {errors.confirmPassword}
            </span>
          ) : null}
        </label>
      </div>

      <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-5">
        <p className="text-sm font-black text-[#123A63]">{t.verificationTitle}</p>
        <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
          {t.verificationText}
        </p>
      </div>

      <button
        type="submit"
        className="rounded-[18px] bg-[#F15A24] px-6 py-4 text-center text-sm font-black text-white hover:bg-[#DB4F1C]"
      >
        {t.portal}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-slate-500">
        <span>{t.already}</span>
        <Link href={loginUrl} className="font-black text-[#F15A24] hover:text-[#DB4F1C]">
          {t.login}
        </Link>
      </div>
    </form>
  );
}
