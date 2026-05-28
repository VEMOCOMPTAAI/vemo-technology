
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

export default function PaymentPendingVerificationPage({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [fileName, setFileName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim() && password.length >= 6 && password === confirmPassword && status !== "loading";
  }, [email, password, confirmPassword, status]);

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);

    const storedEmail =
      params.get("email") ||
      localStorage.getItem("vemo_billing_email") ||
      localStorage.getItem("vemo_client_email") ||
      "";

    const storedName =
      params.get("name") ||
      localStorage.getItem("vemo_billing_name") ||
      localStorage.getItem("vemo_client_name") ||
      "";

    const storedPackage =
      params.get("package_name") ||
      localStorage.getItem("vemo_package_name") ||
      "";

    const storedAmount =
      params.get("amount") ||
      localStorage.getItem("vemo_amount") ||
      "";

    const storedFile =
      params.get("file") ||
      localStorage.getItem("vemo_bank_file_name") ||
      "";

    setEmail(storedEmail);
    setFullName(storedName);
    setPackageName(storedPackage);
    setAmount(storedAmount);
    setFileName(storedFile);
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
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/${lang}/espace-client`
          : undefined;

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            payment_method: "bank_transfer",
            payment_status: "pending_verification",
            package_name: packageName,
            amount,
            payment_proof_file: fileName,
          },
        },
      });

      if (error) {
        const msg = error.message || "";

        if (msg.toLowerCase().includes("already")) {
          setStatus("success");
          setMessage(
            isFr
              ? "Un compte existe déjà avec cet email. Connectez-vous à votre espace client pour suivre votre dossier."
              : "An account already exists with this email. Log in to your client portal to track your case."
          );
          return;
        }

        if (msg.toLowerCase().includes("rate limit")) {
          setStatus("success");
          setMessage(
            isFr
              ? "Votre dossier est bien enregistré. Les emails de vérification sont temporairement limités. Réessayez dans quelques minutes ou connectez-vous si le compte existe déjà."
              : "Your case is registered. Verification emails are temporarily limited. Try again in a few minutes or log in if the account already exists."
          );
          return;
        }

        setStatus("error");
        setMessage(msg);
        return;
      }

      setStatus("success");
      setMessage(
        isFr
          ? "Compte créé. Vérifiez votre email pour activer l’accès à votre espace client."
          : "Account created. Check your email to activate access to your client portal."
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

  const loginHref = isFr ? "/fr/connexion" : "/en/connexion";
  const portalHref = isFr ? "/fr/espace-client" : "/en/espace-client";
  const contactHref = isFr ? "/fr/contact" : "/en/contact";

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <SiteHeader lang={lang} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
              {isFr ? "Paiement en attente" : "Payment pending"}
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-[-0.05em] md:text-6xl">
              {isFr ? "Paiement en attente de vérification" : "Payment pending verification"}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-[#2B2F36]/70">
              {isFr
                ? "Votre justificatif a été ajouté au dossier. Créez maintenant votre compte sécurisé pour suivre la vérification et accéder à votre espace client."
                : "Your payment proof has been attached to your case. Create your secure account now to track verification and access your client portal."}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="rounded-[14px] border border-[#E8E2DC] bg-white p-8 shadow-[0_18px_45px_rgba(43,47,54,0.06)]">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">
                {isFr ? "Statut du dossier" : "Case status"}
              </div>

              <div className="mt-6 space-y-5">
                <StatusLine n="01" title={isFr ? "Justificatif reçu" : "Payment proof received"} active done />
                <StatusLine n="02" title={isFr ? "Vérification Vemo" : "Vemo verification"} active />
                <StatusLine n="03" title={isFr ? "Création du compte client" : "Client account creation"} />
                <StatusLine n="04" title={isFr ? "Accès espace client" : "Client portal access"} />
              </div>

              <div className="mt-8 rounded-[10px] bg-[#FFF7F1] p-5">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[#123A63]">
                  {isFr ? "Résumé" : "Summary"}
                </div>

                <div className="mt-4 space-y-3 text-sm font-bold text-[#2B2F36]/75">
                  <SummaryRow label="Pack" value={packageName || "-"} />
                  <SummaryRow label={isFr ? "Montant" : "Amount"} value={amount ? "$" + amount : "-"} />
                  <SummaryRow label={isFr ? "Fichier" : "File"} value={fileName || "-"} />
                  <SummaryRow label="Email" value={email || "-"} />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={loginHref}
                  className="flex h-12 items-center justify-center rounded-[8px] border border-[#123A63] bg-white text-sm font-black text-[#123A63]"
                >
                  {isFr ? "J’ai déjà un compte" : "I already have an account"}
                </Link>

                <Link
                  href={contactHref}
                  className="flex h-12 items-center justify-center rounded-[8px] border border-[#E8E2DC] bg-white text-sm font-black text-[#2B2F36]"
                >
                  Contact
                </Link>
              </div>
            </aside>

            <section className="rounded-[14px] border border-[#E8E2DC] bg-white p-8 shadow-[0_18px_45px_rgba(43,47,54,0.06)]">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#123A63]">
                {isFr ? "Création de compte" : "Account creation"}
              </div>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em]">
                {isFr ? "Créez votre accès sécurisé" : "Create your secure access"}
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
                {isFr
                  ? "Utilisez le même email que celui indiqué dans le formulaire. Vous recevrez un email de vérification avant l’accès complet à l’espace client."
                  : "Use the same email provided in the form. You will receive a verification email before full client portal access."}
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
                  placeholder="email@business.com"
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

              {password && password.length < 6 ? (
                <div className="mt-4 rounded-[8px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
                  {isFr ? "Le mot de passe doit contenir au moins 6 caractères." : "Password must contain at least 6 characters."}
                </div>
              ) : null}

              {confirmPassword && password !== confirmPassword ? (
                <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {isFr ? "Les mots de passe ne correspondent pas." : "Passwords do not match."}
                </div>
              ) : null}

              {message ? (
                <div
                  className={[
                    "mt-5 rounded-[10px] border px-5 py-4 text-sm font-bold leading-7",
                    status === "success"
                      ? "border-orange-200 bg-[#FFF7F1] text-[#123A63]"
                      : "border-red-200 bg-red-50 text-red-700",
                  ].join(" ")}
                >
                  {message}
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canSubmit}
                onClick={createAccount}
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

function StatusLine({
  n,
  title,
  active,
  done,
}: {
  n: string;
  title: string;
  active?: boolean;
  done?: boolean;
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
        {done ? "✓" : n}
      </div>
      <div className="text-sm font-black text-[#2B2F36]">{title}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E8E2DC] pb-2 last:border-b-0">
      <span className="text-[#2B2F36]/55">{label}</span>
      <span className="text-right text-[#123A63]">{value}</span>
    </div>
  );
}

function Field({
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
