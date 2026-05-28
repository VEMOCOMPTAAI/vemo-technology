
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

type Lang = "fr" | "en";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}

function firstValue(...values: Array<string | null | undefined>) {
  return values.find((v) => v && String(v).trim())?.trim() || "";
}

function cleanAmount(value: string) {
  if (!value) return "";
  const n = Number(value);
  if (Number.isFinite(n)) return n.toFixed(2);
  return value;
}

export default function PaymentSuccessUnifiedPage({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";

  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    return (
      email.trim().includes("@") &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword &&
      status !== "loading"
    );
  }, [email, password, confirmPassword, status]);

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);

    const emailFromUrl = firstValue(
      params.get("email"),
      params.get("client_email"),
      params.get("billing_email"),
      params.get("customer_email")
    );

    const nameFromUrl = firstValue(
      params.get("name"),
      params.get("full_name"),
      params.get("billing_name")
    );

    const packageFromUrl = firstValue(
      params.get("package_name"),
      params.get("package"),
      params.get("plan")
    );

    const amountFromUrl = firstValue(
      params.get("amount"),
      params.get("price")
    );

    const emailFromStorage = firstValue(
      localStorage.getItem("vemo_billing_email"),
      localStorage.getItem("vemo_client_email"),
      localStorage.getItem("billingEmail"),
      localStorage.getItem("clientEmail")
    );

    const nameFromStorage = firstValue(
      localStorage.getItem("vemo_billing_name"),
      localStorage.getItem("vemo_client_name")
    );

    const packageFromStorage = firstValue(
      localStorage.getItem("vemo_package_name")
    );

    const amountFromStorage = firstValue(
      localStorage.getItem("vemo_amount")
    );

    const finalEmail = emailFromUrl || emailFromStorage;
    const finalName = nameFromUrl || nameFromStorage;
    const finalPackage = packageFromUrl || packageFromStorage;
    const finalAmount = cleanAmount(amountFromUrl || amountFromStorage || "");

    setEmail(finalEmail);
    setFullName(finalName);
    setPackageName(finalPackage);
    setAmount(finalAmount);

    if (finalEmail) {
      localStorage.setItem("vemo_billing_email", finalEmail.toLowerCase());
      localStorage.setItem("vemo_client_email", finalEmail.toLowerCase());
    }
  }, []);

  async function createAccount() {
    if (!canSubmit) return;

    setStatus("loading");
    setMessage("");

    const supabase = getSupabaseClient();

    if (!supabase) {
      setStatus("error");
      setMessage(
        isFr
          ? "Configuration Supabase manquante. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY."
          : "Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();

      localStorage.setItem("vemo_billing_email", normalizedEmail);
      localStorage.setItem("vemo_client_email", normalizedEmail);
      if (fullName.trim()) localStorage.setItem("vemo_client_name", fullName.trim());

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/${lang}/espace-client`
          : undefined;

      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            payment_method: "card",
            payment_status: "confirmed",
            package_name: packageName,
            amount,
          },
        },
      });

      if (error) {
        const lower = error.message.toLowerCase();

        if (lower.includes("already") || lower.includes("registered") || lower.includes("user already")) {
          setStatus("success");
          setMessage(
            isFr
              ? "Un compte existe déjà avec cet email. Connectez-vous pour accéder à votre espace client."
              : "An account already exists with this email. Log in to access your client portal."
          );
          return;
        }

        if (lower.includes("rate limit")) {
          setStatus("success");
          setMessage(
            isFr
              ? "Votre paiement est confirmé. Les emails de vérification sont temporairement limités. Réessayez dans quelques minutes ou connectez-vous si le compte existe déjà."
              : "Your payment is confirmed. Verification emails are temporarily limited. Try again in a few minutes or log in if the account already exists."
          );
          return;
        }

        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("success");
      setMessage(
        isFr
          ? "Compte créé. Vérifiez votre email pour activer votre espace client."
          : "Account created. Check your email to activate your client portal."
      );
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : isFr
            ? "Erreur inattendue pendant la création du compte."
            : "Unexpected error while creating the account."
      );
    }
  }

  const portalHref = isFr ? "/fr/espace-client" : "/en/espace-client";
  const loginHref = isFr ? "/fr/connexion" : "/en/connexion";
  const pricingHref = isFr ? "/fr/tarifs" : "/en/pricing";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <SiteHeader lang={lang} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto max-w-7xl px-6 py-14">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF7F1] text-3xl font-black text-[#F15A24] ring-1 ring-[#F15A24]/25">
              ✓
            </div>

            <div className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-[#123A63]">
              {isFr ? "Paiement confirmé" : "Payment confirmed"}
            </div>

            <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.06em] text-[#2B2F36] md:text-6xl">
              {isFr ? "Votre paiement a bien été reçu." : "Your payment has been received."}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
              {isFr
                ? "Votre dossier est maintenant enregistré. Créez votre accès sécurisé pour suivre votre dossier, vos documents et vos messages."
                : "Your case is now registered. Create your secure access to track your case, documents and messages."}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="rounded-[16px] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#123A63]">
                {isFr ? "Résumé du paiement" : "Payment summary"}
              </div>

              <div className="mt-6 rounded-[12px] border border-[#E8E2DC] bg-[#FFF7F1] p-5">
                <SummaryRow label={isFr ? "Montant" : "Amount"} value={amount ? "$" + amount : "-"} />
                <SummaryRow label="Statut" value={isFr ? "Confirmé" : "Confirmed"} />
                <SummaryRow label="Pack" value={packageName || "-"} />
                <SummaryRow label="Email" value={email || isFr ? "À compléter" : "Required"} />
              </div>

              <div className="mt-8 space-y-4">
                <StatusStep number="01" title={isFr ? "Paiement reçu" : "Payment received"} done />
                <StatusStep number="02" title={isFr ? "Création du compte" : "Account creation"} active />
                <StatusStep number="03" title={isFr ? "Vérification email" : "Email verification"} />
                <StatusStep number="04" title={isFr ? "Espace client" : "Client portal"} />
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={loginHref}
                  className="flex h-12 items-center justify-center rounded-[8px] border border-[#123A63] bg-white text-sm font-black text-[#123A63]"
                >
                  {isFr ? "J’ai déjà un compte" : "I already have an account"}
                </Link>

                <Link
                  href={pricingHref}
                  className="flex h-12 items-center justify-center rounded-[8px] border border-[#E8E2DC] bg-white text-sm font-black text-[#2B2F36]"
                >
                  {isFr ? "Retour aux tarifs" : "Back to pricing"}
                </Link>
              </div>
            </aside>

            <section className="rounded-[16px] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#123A63]">
                {isFr ? "Compte client" : "Client account"}
              </div>

              <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.06em] text-[#2B2F36]">
                {isFr ? "Créez votre accès sécurisé." : "Create your secure access."}
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
                {isFr
                  ? "L’email est repris automatiquement quand il est disponible. Vous pouvez aussi le saisir ou le corriger manuellement."
                  : "The email is filled automatically when available. You can also enter or correct it manually."}
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <Field
                  label={isFr ? "Nom complet" : "Full name"}
                  value={fullName}
                  onChange={setFullName}
                  placeholder={isFr ? "Votre nom complet" : "Your full name"}
                />

                <Field
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="email@domaine.com"
                  type="email"
                />

                <PasswordField
                  label={isFr ? "Mot de passe" : "Password"}
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                />

                <PasswordField
                  label={isFr ? "Confirmer le mot de passe" : "Confirm password"}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="••••••••"
                />
              </div>

              {email && !email.includes("@") ? (
                <Notice type="error" text={isFr ? "Veuillez saisir un email valide." : "Please enter a valid email."} />
              ) : null}

              {password && password.length < 6 ? (
                <Notice type="error" text={isFr ? "Le mot de passe doit contenir au moins 6 caractères." : "Password must contain at least 6 characters."} />
              ) : null}

              {confirmPassword && password !== confirmPassword ? (
                <Notice type="error" text={isFr ? "Les mots de passe ne correspondent pas." : "Passwords do not match."} />
              ) : null}

              {message ? (
                <Notice type={status === "error" ? "error" : "success"} text={message} />
              ) : null}

              <button
                type="button"
                onClick={createAccount}
                disabled={!canSubmit}
                className="mt-7 h-14 w-full rounded-[10px] bg-[#F15A24] text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)] transition hover:bg-[#D84D1F] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {status === "loading"
                  ? isFr ? "Création en cours..." : "Creating account..."
                  : isFr ? "Créer mon compte sécurisé" : "Create my secure account"}
              </button>

              {status === "success" ? (
                <Link
                  href={portalHref}
                  className="mt-4 flex h-14 w-full items-center justify-center rounded-[10px] border border-[#123A63] bg-white text-sm font-black text-[#123A63]"
                >
                  {isFr ? "Accéder à mon espace client" : "Go to client portal"}
                </Link>
              ) : null}
            </section>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E8E2DC] py-3 first:pt-0 last:border-b-0 last:pb-0">
      <span className="text-sm font-black text-[#2B2F36]/55">{label}</span>
      <span className="text-right text-sm font-black text-[#123A63]">{value}</span>
    </div>
  );
}

function StatusStep({
  number,
  title,
  done,
  active,
}: {
  number: string;
  title: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={[
          "flex h-11 w-11 items-center justify-center rounded-full text-sm font-black",
          done
            ? "bg-[#F15A24] text-white"
            : active
              ? "border border-[#F15A24] bg-[#FFF7F1] text-[#F15A24]"
              : "border border-[#E8E2DC] bg-white text-[#94A3B8]",
        ].join(" ")}
      >
        {done ? "✓" : number}
      </div>

      <div className="text-sm font-black text-[#2B2F36]">{title}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#123A63]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-14 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold text-[#2B2F36] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#123A63]">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-14 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold text-[#2B2F36] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

function Notice({ text, type }: { text: string; type: "success" | "error" }) {
  return (
    <div
      className={[
        "mt-5 rounded-[10px] border px-5 py-4 text-sm font-bold leading-7",
        type === "success"
          ? "border-orange-200 bg-[#FFF7F1] text-[#123A63]"
          : "border-red-200 bg-red-50 text-red-700",
      ].join(" ")}
    >
      {text}
    </div>
  );
}
