"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";


function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) return null;

  return createClient(url, key);
}

export default function ClientPortalContent() {
  const params = useSearchParams();

  const previewEmail = useMemo(
    () => String(params.get("email") || "").trim().toLowerCase(),
    [params]
  );

  const [email, setEmail] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [clientStatus, setClientStatus] = useState<any>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  async function loadData(targetEmail: string) {
    const cleanEmail = String(targetEmail || "").trim().toLowerCase();

    if (!cleanEmail) {
      setDocuments([]);
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [docsRes, msgRes, statusRes] = await Promise.all([
      fetch(`/api/client-portal/documents?email=${encodeURIComponent(cleanEmail)}`, {
        cache: "no-store",
      }),
      fetch(`/api/client-portal/messages?email=${encodeURIComponent(cleanEmail)}`, {
        cache: "no-store",
      }),
      fetch(`/api/client-portal/status?email=${encodeURIComponent(cleanEmail)}`, {
        cache: "no-store",
      }),
    ]);

    const docsData = await docsRes.json().catch(() => null);
    const msgData = await msgRes.json().catch(() => null);
    const statusData = await statusRes.json().catch(() => null);

    setDocuments(Array.isArray(docsData?.documents) ? docsData.documents : []);
    setMessages(Array.isArray(msgData?.messages) ? msgData.messages : []);
    setClientStatus(statusData?.status || null);
    setLoading(false);
  }


  async function sendClientReply() {
    setNotice("");

    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanEmail) {
      setNotice("Email client introuvable.");
      return;
    }

    if (!replyContent.trim()) {
      setNotice("Écris un message.");
      return;
    }

    setSendingReply(true);

    try {
      const res = await fetch("/api/client-portal/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          client_email: cleanEmail,
          subject: replySubject || "Réponse client",
          message: replyContent,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setNotice(data?.error || "Erreur envoi message.");
        return;
      }

      setReplySubject("");
      setReplyContent("");
      setNotice("Message envoyé.");
      await loadData(cleanEmail);
    } finally {
      setSendingReply(false);
    }
  }

  useEffect(() => {
    async function boot() {
      setNotice("");

      if (previewEmail) {
        setEmail(previewEmail);
        await loadData(previewEmail);
        return;
      }

      const supabase = supabaseClient();

      if (!supabase) {
        setNotice("Configuration Supabase manquante.");
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getUser();
      const sessionEmail = data?.user?.email?.trim().toLowerCase() || "";

      if (!sessionEmail) {
        window.location.href = "/fr/connexion";
        return;
      }

      setEmail(sessionEmail);
      await loadData(sessionEmail);
    }

    boot();
  }, [previewEmail]);

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <section className="mx-auto max-w-[1120px] px-6 py-8">
        <div className="rounded-[2rem] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[30px] font-black uppercase leading-none tracking-[-0.06em]">
                <span className="text-[#123A63]">VEMO</span>
                <span className="text-[#F15A24]">TECH</span>
              </div>

              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.30em] text-slate-400">
                Espace client
              </p>

              <h1 className="mt-6 text-[34px] font-black tracking-[-0.06em]">
                Mon espace client
              </h1>

              <p className="mt-1 text-sm font-bold text-slate-500">
                {email || "Connexion en cours..."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadData(email)}
              className="inline-flex h-[46px] items-center justify-center rounded-[15px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
            >
              Actualiser
            </button>
          </div>

          {notice ? (
            <div className="mt-5 rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-3 text-sm font-black text-[#123A63]">
              {notice}
            </div>
          ) : null}
        </div>

        
        
        
        



<section className="mt-6 rounded-[2rem] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Suivi
              </p>
              <h2 className="mt-2 text-[25px] font-black tracking-[-0.05em]">
                État de mon dossier
              </h2>
            </div>

            <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
              En direct
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Paiement
              </p>
              <p className="mt-2 text-sm font-black text-[#123A63]">
                {clientStatus?.payment_status || "En vérification"}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Dossier
              </p>
              <p className="mt-2 text-sm font-black text-[#123A63]">
                {clientStatus?.dossier_status || "En attente"}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Étape actuelle
              </p>
              <p className="mt-2 text-sm font-black text-[#123A63]">
                {clientStatus?.current_step || "Réception du dossier"}
              </p>
            </div>
          </div>

          {clientStatus?.note ? (
            <div className="mt-4 rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-[#123A63]">
              {clientStatus.note}
            </div>
          ) : null}
        </section>

<div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Documents
                </p>
                <h2 className="mt-2 text-[25px] font-black tracking-[-0.05em]">
                  Mes documents
                </h2>
              </div>

              <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
                {documents.length}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Chargement...
                </div>
              ) : documents.length === 0 ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Aucun document disponible.
                </div>
              ) : (
                documents.map((doc, index) => {
                  const url = doc.public_url || doc.url || "";
                  const title = doc.title || doc.name || doc.filename || `Document ${index + 1}`;

                  return (
                    <div
                      key={doc.id || index}
                      className="flex items-center justify-between gap-4 rounded-[16px] border border-[#E6EDF5] bg-white p-4"
                    >
                      <div>
                        <p className="text-sm font-black text-[#123A63]">{title}</p>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          {doc.filename || "Document"}
                        </p>
                      </div>

                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 items-center justify-center rounded-[13px] bg-[#F15A24] px-4 text-xs font-black text-white transition hover:bg-[#DB4F1C]"
                        >
                          Ouvrir ↗
                        </a>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Messages
                </p>
                <h2 className="mt-2 text-[25px] font-black tracking-[-0.05em]">
                  Messages VEMO
                </h2>
              </div>

              <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
                {messages.length}
              </span>
            </div>

            <div className="mt-6 space-y-3 rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-sm font-black text-[#123A63]">
                Répondre à VEMO
              </p>

              <input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Objet"
                className="h-[48px] w-full rounded-[14px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Votre message..."
                rows={4}
                className="w-full resize-none rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <button
                type="button"
                onClick={sendClientReply}
                disabled={sendingReply}
                className="h-[48px] w-full rounded-[14px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
              >
                {sendingReply ? "Envoi..." : "Envoyer"}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Chargement...
                </div>
              ) : messages.length === 0 ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Aucun message disponible.
                </div>
              ) : (
                messages.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="rounded-[16px] border border-[#E6EDF5] bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-[#123A63]">
                        {item.subject || "Message VEMO"}
                      </p>

                      <span className={item.sender === "client" ? "rounded-full bg-[#F15A24] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white" : "rounded-full bg-[#EEF3F8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#123A63]"}>
                        {item.sender === "client" ? "Client" : "VEMO"}
                      </span>
                    </div>

                    <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-slate-600">
                      {item.message || item.content || ""}
                    </p>

                    <p className="mt-3 text-xs font-bold text-slate-400">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("fr-FR")
                        : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
