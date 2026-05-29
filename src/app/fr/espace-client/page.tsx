"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type PortalData = {
  ok?: boolean;
  order?: any;
  profile?: any;
  documents?: any[];
  messages?: any[];
  error?: string;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function statusLabel(value?: string) {
  const v = String(value || "").toLowerCase();

  if (!v) return "En attente";
  if (["paid", "payment_verified", "validated", "validé", "valide"].includes(v)) return "Validé";
  if (["pending", "pending_verification", "payment_pending_verification"].includes(v)) return "En vérification";
  if (["email_confirmation_required"].includes(v)) return "Email à confirmer";
  if (["rejected", "refused"].includes(v)) return "Refusé";
  if (["in_progress", "processing"].includes(v)) return "En traitement";
  if (["completed", "done"].includes(v)) return "Terminé";

  return value
    ? String(value).replaceAll("_", " ").replaceAll("-", " ")
    : "En attente";
}

export default function ClientPortalPage() {
  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const emailFromUrl = params.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [data, setData] = useState<PortalData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkAuthAndLoad() {
      setChecking(true);
      setLoading(true);
      setError("");

      const supabase = getSupabase();

      if (!supabase) {
        setError("Configuration Supabase manquante.");
        setChecking(false);
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        window.location.href = `/fr/connexion?email=${encodeURIComponent(emailFromUrl)}`;
        return;
      }

      const confirmed = Boolean(user.email_confirmed_at || user.confirmed_at);

      if (!confirmed) {
        await supabase.auth.signOut();
        window.location.href = `/fr/connexion?email=${encodeURIComponent(user.email || emailFromUrl)}&confirm=required`;
        return;
      }

      const userEmail = user.email || emailFromUrl;
      setEmail(userEmail);
      setChecking(false);

      try {
        const [profileRes, orderRes, docsRes, messagesRes] = await Promise.all([
          fetch(`/api/client-portal/profile?email=${encodeURIComponent(userEmail)}`).catch(() => null),
          fetch(`/api/client-portal/order?email=${encodeURIComponent(userEmail)}`).catch(() => null),
          fetch(`/api/client-portal/documents?email=${encodeURIComponent(userEmail)}`).catch(() => null),
          fetch(`/api/client-portal/messages?email=${encodeURIComponent(userEmail)}`).catch(() => null),
        ]);

        const [profile, order, documents, messages] = await Promise.all([
          profileRes?.json().catch(() => null),
          orderRes?.json().catch(() => null),
          docsRes?.json().catch(() => null),
          messagesRes?.json().catch(() => null),
        ]);

        setData({
          ok: true,
          profile: profile?.profile || profile?.client || profile || null,
          order: order?.order || order?.data || order || null,
          documents: documents?.documents || documents?.data || [],
          messages: messages?.messages || messages?.data || [],
        });
      } catch (e: any) {
        setError(e?.message || "Erreur chargement espace client.");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndLoad();
  }, [emailFromUrl]);

  async function logout() {
    const supabase = getSupabase();
    await supabase?.auth.signOut();
    window.location.href = "/fr/connexion";
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F8FB] px-6 text-[#123A63]">
        <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-8 text-center shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-black">Vérification de l’accès...</p>
        </div>
      </main>
    );
  }

  const order = data?.order || {};
  const docs = Array.isArray(data?.documents) ? data.documents : [];
  const messages = Array.isArray(data?.messages) ? data.messages : [];

  return (
    <main className="min-h-screen bg-[#F5F8FB] px-6 py-8 text-[#111827]">
      <section className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[#E6EDF5] bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <a href="/fr" className="inline-flex flex-col">
            <div className="text-[28px] font-black uppercase leading-none tracking-[-0.06em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">
              ESPACE CLIENT
            </div>
          </a>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-2 text-xs font-black text-[#123A63]">
              {email}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-2 text-xs font-black text-[#123A63] transition hover:border-[#F15A24]"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-[#E6EDF5] bg-white p-7 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F15A24]">
              Dossier LLC
            </p>

            <h1 className="mt-3 text-[38px] font-black tracking-[-0.07em] text-[#111827]">
              {order?.llc_name || order?.company_name || order?.business_name || "Votre dossier"}
            </h1>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Paiement
                </p>
                <p className="mt-2 text-lg font-black text-[#123A63]">
                  {statusLabel(order?.payment_status || order?.status)}
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Dossier
                </p>
                <p className="mt-2 text-lg font-black text-[#123A63]">
                  {statusLabel(order?.dossier_status || order?.file_status || order?.account_status)}
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Formule
                </p>
                <p className="mt-2 text-lg font-black text-[#123A63]">
                  {order?.plan || order?.pack || "—"}
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  État
                </p>
                <p className="mt-2 text-lg font-black text-[#123A63]">
                  {order?.state || order?.formation_state || "—"}
                </p>
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            ) : null}

            {loading ? (
              <p className="mt-5 text-sm font-bold text-slate-500">Chargement...</p>
            ) : null}
          </section>

          <section className="grid gap-6">
            <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-7 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[26px] font-black tracking-[-0.05em] text-[#111827]">
                  Documents
                </h2>
                <span className="rounded-full bg-[#FFF7F2] px-3 py-1 text-xs font-black text-[#F15A24]">
                  {docs.length}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {docs.length ? (
                  docs.map((doc: any, index: number) => (
                    <a
                      key={doc.id || doc.name || index}
                      href={doc.url || doc.signedUrl || doc.download_url || "#"}
                      target="_blank"
                      className="flex items-center justify-between rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-4 text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
                    >
                      <span>{doc.name || doc.filename || doc.title || `Document ${index + 1}`}</span>
                      <span className="text-[#F15A24]">Ouvrir</span>
                    </a>
                  ))
                ) : (
                  <p className="rounded-[18px] border border-dashed border-[#DCE7F3] bg-[#F8FAFC] px-4 py-5 text-sm font-bold text-slate-500">
                    Aucun document disponible pour le moment.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E6EDF5] bg-white p-7 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[26px] font-black tracking-[-0.05em] text-[#111827]">
                  Messages
                </h2>
                <span className="rounded-full bg-[#FFF7F2] px-3 py-1 text-xs font-black text-[#F15A24]">
                  {messages.length}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {messages.length ? (
                  messages.map((msg: any, index: number) => (
                    <div
                      key={msg.id || index}
                      className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-4"
                    >
                      <p className="text-sm font-black text-[#123A63]">
                        {msg.subject || msg.sender || "VEMO"}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        {msg.message || msg.body || msg.content || "Message"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-[18px] border border-dashed border-[#DCE7F3] bg-[#F8FAFC] px-4 py-5 text-sm font-bold text-slate-500">
                    Aucun message pour le moment.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
