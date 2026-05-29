"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

type ClientDoc = {
  id?: string;
  title?: string;
  name?: string;
  filename?: string;
  url?: string;
  public_url?: string;
  created_at?: string;
};

type ClientMessage = {
  id?: string;
  subject?: string;
  message?: string;
  content?: string;
  sender?: string;
  created_at?: string;
};

export default function AdminClientPage() {
  const params = useSearchParams();
  const email = useMemo(
    () => String(params.get("email") || "").trim().toLowerCase(),
    [params]
  );

  const [documents, setDocuments] = useState<ClientDoc[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingDoc, setSavingDoc] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadClientData() {
    if (!email) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [docsRes, msgRes] = await Promise.all([
        fetch(`/api/admin/client-portal/documents?email=${encodeURIComponent(email)}`, {
          cache: "no-store",
        }),
        fetch(`/api/admin/client-portal/messages?email=${encodeURIComponent(email)}`, {
          cache: "no-store",
        }),
      ]);

      const docsData = await docsRes.json().catch(() => null);
      const msgData = await msgRes.json().catch(() => null);

      setDocuments(Array.isArray(docsData?.documents) ? docsData.documents : []);
      setMessages(Array.isArray(msgData?.messages) ? msgData.messages : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClientData();
  }, [email]);

  async function uploadDocument() {
    setNotice("");

    if (!email) {
      setNotice("Email client introuvable.");
      return;
    }

    if (!uploadFile) {
      setNotice("Choisis un fichier.");
      return;
    }

    setSavingDoc(true);

    try {
      const form = new FormData();
      form.append("email", email);
      form.append("client_email", email);
      form.append("title", uploadTitle || uploadFile.name);
      form.append("file", uploadFile);

      const res = await fetch("/api/admin/client-portal/documents", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setNotice(data?.error || "Erreur upload document.");
        return;
      }

      setUploadFile(null);
      setUploadTitle("");
      setNotice("Document ajouté à l’espace client.");
      await loadClientData();
    } finally {
      setSavingDoc(false);
    }
  }

  async function sendMessage() {
    setNotice("");

    if (!email) {
      setNotice("Email client introuvable.");
      return;
    }

    if (!messageContent.trim()) {
      setNotice("Écris un message.");
      return;
    }

    setSendingMessage(true);

    try {
      const res = await fetch("/api/admin/client-portal/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          client_email: email,
          subject: messageSubject || "Message VEMO",
          message: messageContent,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setNotice(data?.error || "Erreur envoi message.");
        return;
      }

      setMessageSubject("");
      setMessageContent("");
      setNotice("Message envoyé au client.");
      await loadClientData();
    } finally {
      setSendingMessage(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <section className="mx-auto max-w-[1180px] px-6 py-8">
        <div className="rounded-[2rem] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <a
                href="/fr/admin"
                className="text-sm font-black text-[#F15A24] hover:text-[#DB4F1C]"
              >
                ← Retour admin
              </a>

              <h1 className="mt-4 text-[34px] font-black tracking-[-0.06em] text-[#111827]">
                Fiche client
              </h1>

              <p className="mt-1 text-sm font-bold text-slate-500">
                {email || "Aucun client sélectionné"}
              </p>
            </div>

            <a
              href="/fr/admin/parametres"
              className="inline-flex h-[46px] items-center justify-center rounded-[15px] border border-[#E6EDF5] bg-white px-5 text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
            >
              Paramètres packs
            </a>
          </div>

          {notice ? (
            <div className="mt-5 rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-3 text-sm font-black text-[#123A63]">
              {notice}
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Documents
                </p>
                <h2 className="mt-2 text-[25px] font-black tracking-[-0.05em] text-[#111827]">
                  Documents visibles client
                </h2>
              </div>

              <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
                {documents.length}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Titre : Articles of Organization, EIN, Operating Agreement..."
                className="h-[52px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="h-[52px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <button
                type="button"
                onClick={uploadDocument}
                disabled={savingDoc}
                className="h-[52px] w-full rounded-[16px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
              >
                {savingDoc ? "Upload..." : "Uploader document"}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Chargement...
                </div>
              ) : documents.length === 0 ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Aucun document pour ce client.
                </div>
              ) : (
                documents.map((doc, index) => {
                  const url = doc.public_url || doc.url || "";
                  const title = doc.title || doc.name || doc.filename || `Document ${index + 1}`;

                  return (
                    <div
                      key={doc.id || `${title}-${index}`}
                      className="rounded-[16px] border border-[#E6EDF5] bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-[#123A63]">{title}</p>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            {doc.created_at
                              ? new Date(doc.created_at).toLocaleString("fr-FR")
                              : ""}
                          </p>
                        </div>

                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-[12px] bg-[#F15A24] px-4 py-2 text-xs font-black text-white transition hover:bg-[#DB4F1C]"
                          >
                            Ouvrir
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Messages
                </p>
                <h2 className="mt-2 text-[25px] font-black tracking-[-0.05em] text-[#111827]">
                  Communication client
                </h2>
              </div>

              <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
                {messages.length}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <input
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Objet du message"
                className="h-[52px] w-full rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Message destiné au client..."
                rows={6}
                className="w-full resize-none rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={sendingMessage}
                className="h-[52px] w-full rounded-[16px] bg-[#F15A24] text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
              >
                {sendingMessage ? "Envoi..." : "Envoyer message"}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Chargement...
                </div>
              ) : messages.length === 0 ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Aucun message pour ce client.
                </div>
              ) : (
                messages.map((item, index) => (
                  <div
                    key={item.id || `${item.created_at}-${index}`}
                    className="rounded-[16px] border border-[#E6EDF5] bg-white p-4"
                  >
                    <p className="text-sm font-black text-[#123A63]">
                      {item.subject || "Message VEMO"}
                    </p>

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
