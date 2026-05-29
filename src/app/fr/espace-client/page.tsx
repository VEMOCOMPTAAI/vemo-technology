"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function EspaceClientPage() {
  const params = useSearchParams();

  const queryEmail = useMemo(
    () => String(params.get("email") || "").trim().toLowerCase(),
    [params]
  );

  const [email, setEmail] = useState(queryEmail);
  const [documents, setDocuments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadData(targetEmail = email) {
    const cleanEmail = String(targetEmail || "").trim().toLowerCase();

    if (!cleanEmail) return;

    setLoading(true);

    const [docsRes, msgRes] = await Promise.all([
      fetch(`/api/client-portal/documents?email=${encodeURIComponent(cleanEmail)}`, {
        cache: "no-store",
      }),
      fetch(`/api/client-portal/messages?email=${encodeURIComponent(cleanEmail)}`, {
        cache: "no-store",
      }),
    ]);

    const docsData = await docsRes.json().catch(() => null);
    const msgData = await msgRes.json().catch(() => null);

    setDocuments(Array.isArray(docsData?.documents) ? docsData.documents : []);
    setMessages(Array.isArray(msgData?.messages) ? msgData.messages : []);
    setLoading(false);
  }

  useEffect(() => {
    if (queryEmail) {
      setEmail(queryEmail);
      loadData(queryEmail);
    }
  }, [queryEmail]);

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <section className="mx-auto max-w-[1120px] px-6 py-8">
        <div className="rounded-[2rem] bg-white p-6">
          <div className="text-[30px] font-black uppercase leading-none tracking-[-0.06em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>

          <h1 className="mt-6 text-[34px] font-black tracking-[-0.06em]">
            Espace client
          </h1>

          <p className="mt-1 text-sm font-bold text-slate-500">
            Documents et messages de votre dossier.
          </p>

          <div className="mt-5 flex gap-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="h-[52px] flex-1 rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
            />

            <button
              type="button"
              onClick={() => loadData(email)}
              className="h-[52px] rounded-[16px] bg-[#F15A24] px-6 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
            >
              Actualiser
            </button>
          </div>
        </div>

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

            <div className="mt-6 space-y-3">
              {messages.length === 0 ? (
                <div className="rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] p-4 text-sm font-bold text-slate-500">
                  Aucun message disponible.
                </div>
              ) : (
                messages.map((item, index) => (
                  <div
                    key={item.id || index}
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
