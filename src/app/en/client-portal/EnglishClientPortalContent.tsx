"use client";

import ClientPortalTopMenu from "@/components/client-portal/ClientPortalTopMenu";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type AnyItem = Record<string, any>;

function cleanDate(value: any) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function getDocName(doc: AnyItem) {
  return doc.title || doc.name || doc.filename || doc.file_name || "Document";
}

function getDocUrl(doc: AnyItem) {
  return doc.public_url || doc.publicUrl || doc.url || doc.file_url || doc.fileUrl || "#";
}

function getMessageSubject(message: AnyItem) {
  return message.subject || message.title || "Message";
}

function getMessageContent(message: AnyItem) {
  return message.content || message.message || message.body || "";
}

function getSenderLabel(message: AnyItem) {
  const sender = String(message.sender || message.from || message.author || "").toLowerCase();

  if (sender.includes("client")) return "Client";
  if (sender.includes("admin")) return "VEMO";
  if (sender.includes("vemo")) return "VEMO";

  return "VEMO";
}


function translateStatusValue(value: any) {
  const raw = String(value || "").trim();

  const dictionary: Record<string, string> = {
    "En vérification": "Under review",
    "En verification": "Under review",
    "Payé": "Paid",
    "Paye": "Paid",
    "Refusé": "Rejected",
    "Refuse": "Rejected",
    "Remboursé": "Refunded",
    "Rembourse": "Refunded",

    "En attente": "Pending",
    "En traitement": "In progress",
    "Documents demandés": "Documents requested",
    "Documents demandes": "Documents requested",
    "Terminé": "Completed",
    "Termine": "Completed",

    "Réception du dossier": "File received",
    "Reception du dossier": "File received",
    "Vérification des informations": "Information review",
    "Verification des informations": "Information review",
    "Dépôt auprès de l’État": "State filing",
    "Depot aupres de l'Etat": "State filing",
    "Documents de formation prêts": "Formation documents ready",
    "Documents de formation prets": "Formation documents ready",
    "EIN en cours": "EIN in progress",
    "Dossier finalisé": "File completed",
    "Dossier finalise": "File completed",
  };

  return dictionary[raw] || raw || "—";
}

export default function EnglishClientPortalContent() {
  const params = useSearchParams();

  const previewEmail = useMemo(() => {
    return String(params.get("email") || "").trim().toLowerCase();
  }, [params]);

  const [email, setEmail] = useState("");
  const [documents, setDocuments] = useState<AnyItem[]>([]);
  const [messages, setMessages] = useState<AnyItem[]>([]);
  const [clientStatus, setClientStatus] = useState<AnyItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [replySubject, setReplySubject] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  async function loadData(targetEmail: string) {
    const cleanEmail = String(targetEmail || "").trim().toLowerCase();

    if (!cleanEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotice("");

    try {
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
    } catch (error: any) {
      setNotice(error?.message || "Unable to load your client portal.");
    } finally {
      setLoading(false);
    }
  }

  async function sendClientReply() {
    setNotice("");

    if (!email) {
      setNotice("Client email is missing.");
      return;
    }

    if (!replyContent.trim()) {
      setNotice("Please write your message before sending.");
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
          email,
          client_email: email,
          subject: replySubject.trim() || "Client reply",
          content: replyContent.trim(),
          message: replyContent.trim(),
          sender: "client",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setNotice(data?.error || "Unable to send your reply.");
        return;
      }

      setReplySubject("");
      setReplyContent("");
      setNotice("Your reply has been sent.");
      await loadData(email);
    } finally {
      setSendingReply(false);
    }
  }

  useEffect(() => {
    if (previewEmail) {
      setEmail(previewEmail);
      loadData(previewEmail);
      return;
    }

    setLoading(false);
  }, [previewEmail]);

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <ClientPortalTopMenu lang="en" />



      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#F15A24]">
                Client portal
              </p>
              <h1 className="mt-3 text-[34px] font-black tracking-[-0.06em] text-[#111827] md:text-[46px]">
                My VEMO space
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                Access your documents, messages and LLC file progress.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/en"
                className="rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]"
              >
                Home
              </a>

              <button
                type="button"
                onClick={() => loadData(email)}
                className="rounded-[14px] bg-[#F15A24] px-4 py-3 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Refresh
              </button>
            </div>
          </div>

          {email ? (
            <div className="mt-5 rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Client email
              </p>
              <p className="mt-1 break-all text-sm font-black text-[#123A63]">{email}</p>
            </div>
          ) : (
            <div className="mt-5 rounded-[18px] border border-[#FAD7CC] bg-[#FFF7F4] p-4 text-sm font-black text-[#F15A24]">
              No client email found. Open the portal from your secure login link or add ?email=test@mail.com for testing.
            </div>
          )}

          {notice ? (
            <div className="mt-5 rounded-[18px] border border-[#FAD7CC] bg-[#FFF7F4] p-4 text-sm font-black text-[#F15A24]">
              {notice}
            </div>
          ) : null}
        </div>

        <section className="mt-6 rounded-[2rem] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Progress
              </p>
              <h2 className="mt-2 text-[25px] font-black tracking-[-0.05em]">
                <span id="status"></span><span id="status"></span>My file status
              </h2>
            </div>

            <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
              Live
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Payment
              </p>
              <p className="mt-2 text-sm font-black text-[#123A63]">
                {translateStatusValue(clientStatus?.payment_status || "Under review")}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                File
              </p>
              <p className="mt-2 text-sm font-black text-[#123A63]">
                {translateStatusValue(clientStatus?.dossier_status || "Pending")}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Current step
              </p>
              <p className="mt-2 text-sm font-black text-[#123A63]">
                {translateStatusValue(clientStatus?.current_step || "File received")}
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Documents
                </p>
                <h2 className="mt-2 text-[25px] font-black tracking-[-0.05em]">
                  <span id="documents"></span><span id="documents"></span>Available documents
                </h2>
              </div>

              <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
                {documents.length}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Loading documents...
                </div>
              ) : documents.length === 0 ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  No document available yet.
                </div>
              ) : (
                documents.map((doc, index) => (
                  <div
                    key={doc.id || index}
                    className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[#123A63]">{getDocName(doc)}</p>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          Added on {cleanDate(doc.created_at || doc.uploaded_at)}
                        </p>
                      </div>

                      <a
                        href={getDocUrl(doc)}
                        target="_blank"
                        className="rounded-[12px] bg-[#F15A24] px-4 py-2 text-xs font-black text-white transition hover:bg-[#DB4F1C]"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Messages
                </p>
                <h2 className="mt-2 text-[25px] font-black tracking-[-0.05em]">
                  <span id="messages"></span><span id="messages"></span>Communication with VEMO
                </h2>
              </div>

              <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
                {messages.length}
              </span>
            </div>

            <div className="mt-5 rounded-[20px] border border-[#E6EDF5] bg-[#F8FAFC] p-4">
              <p className="text-sm font-black text-[#123A63]">Reply to VEMO</p>

              <input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Subject"
                className="mt-4 h-[46px] w-full rounded-[14px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your message..."
                className="mt-3 min-h-[120px] w-full resize-none rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <button
                type="button"
                onClick={sendClientReply}
                disabled={sendingReply}
                className="mt-3 rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
              >
                {sendingReply ? "Sending..." : "Send reply"}
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  No message yet.
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className="rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[#123A63]">
                          {getMessageSubject(message)}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          {cleanDate(message.created_at || message.date)}
                        </p>
                      </div>

                      <span className="rounded-full border border-[#E6EDF5] bg-white px-3 py-1 text-xs font-black text-[#123A63]">
                        {getSenderLabel(message)}
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm font-bold leading-7 text-slate-600">
                      {getMessageContent(message)}
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
