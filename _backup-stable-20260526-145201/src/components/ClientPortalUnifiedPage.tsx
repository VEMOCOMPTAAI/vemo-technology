
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

type Lang = "fr" | "en";

type PortalStatus = "loading" | "unauthenticated" | "ready" | "soft-error";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}

function friendlyError(message: string, isFr: boolean) {
  const lower = message.toLowerCase();

  if (lower.includes("duplicate key") || lower.includes("client_accounts_email_key")) {
    return isFr
      ? "Votre espace client existe déjà. Connectez-vous avec l’email utilisé lors de votre commande."
      : "Your client portal already exists. Log in with the email used for your order.";
  }

  if (lower.includes("row-level security") || lower.includes("permission")) {
    return isFr
      ? "Votre espace est protégé. Connectez-vous pour consulter vos informations."
      : "Your portal is protected. Please log in to view your information.";
  }

  return isFr
    ? "Nous n’avons pas pu charger votre espace client pour le moment."
    : "We could not load your client portal at the moment.";
}

export default function ClientPortalUnifiedPage({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";

  const [status, setStatus] = useState<PortalStatus>("loading");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setStatus("soft-error");
        setNotice(
          isFr
            ? "Configuration Supabase manquante. Vérifiez les variables publiques."
            : "Missing Supabase configuration. Check public variables."
        );
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email || "";

      if (!userEmail) {
        setStatus("unauthenticated");
        return;
      }

      setEmail(userEmail);

      try {
        const { data: existing, error: selectError } = await supabase
          .from("client_accounts")
          .select("*")
          .eq("email", userEmail)
          .maybeSingle();

        if (selectError) {
          setStatus("ready");
          setNotice(friendlyError(selectError.message, isFr));
          return;
        }

        if (existing) {
          setStatus("ready");
          return;
        }

        const { error: insertError } = await supabase
          .from("client_accounts")
          .insert({
            email: userEmail,
            portal_enabled: true,
            status: "active",
          });

        if (insertError) {
          setStatus("ready");
          setNotice(friendlyError(insertError.message, isFr));
          return;
        }

        setStatus("ready");
      } catch {
        setStatus("ready");
        setNotice(
          isFr
            ? "Votre espace client est disponible, mais certaines informations n’ont pas encore été synchronisées."
            : "Your client portal is available, but some information has not been synced yet."
        );
      }
    }

    load();
  }, [isFr]);

  async function logout() {
    const supabase = getSupabaseClient();
    await supabase?.auth.signOut();
    window.location.href = isFr ? "/fr/connexion" : "/en/connexion";
  }

  const loginHref = isFr ? "/fr/connexion" : "/en/connexion";
  const contactHref = isFr ? "/fr/contact" : "/en/contact";
  const startHref = isFr ? "/fr/commencer" : "/en/commencer";

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <SiteHeader lang={lang} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto max-w-7xl px-6 py-16">
          {status === "loading" ? (
            <CenteredCard
              eyebrow={isFr ? "Chargement" : "Loading"}
              title={isFr ? "Chargement de votre espace client..." : "Loading your client portal..."}
              text={isFr ? "Merci de patienter quelques secondes." : "Please wait a few seconds."}
            />
          ) : status === "unauthenticated" ? (
            <CenteredCard
              eyebrow={isFr ? "Accès sécurisé" : "Secure access"}
              title={isFr ? "Connexion requise" : "Login required"}
              text={
                isFr
                  ? "Connectez-vous avec l’email utilisé lors de votre commande pour accéder à vos documents et messages."
                  : "Log in with the email used for your order to access your documents and messages."
              }
              actions={
                <>
                  <Link href={loginHref} className="rounded-[8px] bg-[#F15A24] px-7 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)]">
                    {isFr ? "Se connecter" : "Log in"}
                  </Link>
                  <Link href={contactHref} className="rounded-[8px] border border-[#123A63] bg-white px-7 py-4 text-sm font-black text-[#123A63]">
                    Contact Vemo
                  </Link>
                </>
              }
            />
          ) : (
            <div>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
                    {isFr ? "Espace client" : "Client portal"}
                  </div>

                  <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-[-0.06em]">
                    {isFr ? "Bienvenue dans votre espace." : "Welcome to your portal."}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
                    {isFr
                      ? "Suivez votre dossier, vos documents et vos messages avec Vemo Technology."
                      : "Track your case, documents and messages with Vemo Technology."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="h-12 rounded-[8px] border border-[#E8E2DC] bg-white px-6 text-sm font-black text-[#2B2F36] hover:border-[#F15A24]"
                >
                  {isFr ? "Déconnexion" : "Log out"}
                </button>
              </div>

              {notice ? (
                <div className="mt-8 rounded-[12px] border border-orange-200 bg-[#FFF7F1] px-5 py-4 text-sm font-bold leading-7 text-[#123A63]">
                  {notice}
                </div>
              ) : null}

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <PortalCard
                  title={isFr ? "Statut du dossier" : "Case status"}
                  value={isFr ? "En vérification" : "Under verification"}
                  text={isFr ? "Votre dossier est en cours de traitement." : "Your case is being processed."}
                />
                <PortalCard
                  title={isFr ? "Documents" : "Documents"}
                  value="0"
                  text={isFr ? "Les documents seront ajoutés ici." : "Documents will appear here."}
                />
                <PortalCard
                  title={isFr ? "Messages" : "Messages"}
                  value="0"
                  text={isFr ? "Les messages Vemo seront affichés ici." : "Vemo messages will appear here."}
                />
              </div>

              <div className="mt-8 rounded-[14px] border border-[#E8E2DC] bg-white p-8 shadow-[0_18px_45px_rgba(43,47,54,0.06)]">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[#123A63]">
                  {isFr ? "Compte" : "Account"}
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                  {email || "-"}
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
                  {isFr
                    ? "Si vous venez d’effectuer un paiement par virement, la validation apparaîtra après vérification manuelle par l’équipe Vemo."
                    : "If you just paid by bank transfer, validation will appear after manual verification by the Vemo team."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={startHref} className="rounded-[8px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white">
                    {isFr ? "Nouveau dossier" : "New case"}
                  </Link>
                  <Link href={contactHref} className="rounded-[8px] border border-[#123A63] bg-white px-6 py-3 text-sm font-black text-[#123A63]">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}

function CenteredCard({
  eyebrow,
  title,
  text,
  actions,
}: {
  eyebrow: string;
  title: string;
  text: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-[16px] border border-[#E8E2DC] bg-white p-10 text-center shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
      <div className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
        {eyebrow}
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-[#2B2F36]">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
        {text}
      </p>
      {actions ? <div className="mt-8 flex justify-center gap-3">{actions}</div> : null}
    </div>
  );
}

function PortalCard({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <article className="rounded-[14px] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(43,47,54,0.06)]">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-[#123A63]">
        {title}
      </div>
      <div className="mt-5 text-4xl font-black tracking-[-0.05em] text-[#F15A24]">
        {value}
      </div>
      <p className="mt-3 text-sm font-semibold leading-7 text-[#2B2F36]/68">
        {text}
      </p>
    </article>
  );
}
