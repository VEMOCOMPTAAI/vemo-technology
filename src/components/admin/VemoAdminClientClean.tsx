"use client";

import { useEffect, useState } from "react";

type DocumentRow = {
  id?: string;
  title?: string;
  file_name?: string;
  document_type?: string;
  file_url?: string;
  created_at?: string;
};

const docTypes = [
  "Company Document",
  "EIN",
  "Operating Agreement",
  "Reçu de paiement",
  "Certificat Registered Agent",
  "Banking",
  "Autre document",
];

function fmtDate(value?: string) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("fr-FR");
  } catch {
    return "—";
  }
}

function Icon({ type }: { type: "open" | "replace" | "delete" }) {
  if (type === "delete") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "replace") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M14 5h5v5M10 14L19 5M19 14v4.5A1.5 1.5 0 0 1 17.5 20h-12A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5H10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VemoAdminClientClean() {
  const [email, setEmail] = useState("");
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [notice, setNotice] = useState("");
  const [docType, setDocType] = useState(docTypes[0]);
  const [replaceId, setReplaceId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentEmail = params.get("email") || "";
    setEmail(currentEmail);
    loadDocs(currentEmail);
  }, []);

  async function loadDocs(currentEmail = email) {
    if (!currentEmail) return;

    try {
      const res = await fetch(`/api/admin/documents?email=${encodeURIComponent(currentEmail)}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);

      const rows =
        Array.isArray(data) ? data :
        Array.isArray(data?.documents) ? data.documents :
        Array.isArray(data?.data) ? data.data :
        [];

      setDocs(rows);
    } catch {
      setDocs([]);
    }
  }

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice("Upload prêt. Connexion API à finaliser proprement.");
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#111827]">
      <header className="border-b border-[#E8E2DC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
              VEMO <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
              DOSSIER CLIENT
            </div>
          </div>

          <a href="/fr/admin" className="rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]">
            ← Retour admin
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2.5rem] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(18,58,99,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">Dossier client</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em]">Gestion premium du dossier</h1>
          <p className="mt-3 break-all text-sm font-bold text-slate-500">{email || "Aucun client sélectionné"}</p>
        </div>

        {notice && (
          <div className="mt-5 rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-black text-[#123A63]">
            {notice}
          </div>
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">Documents</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">Documents du dossier</h2>

            <form onSubmit={upload} className="mt-6 rounded-[1.8rem] border border-[#E8E2DC] bg-[#FBFCFD] p-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">Type de document</span>
                  <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full rounded-[16px] border border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10">
                    {docTypes.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">Remplacer un document</span>
                  <select value={replaceId} onChange={(e) => setReplaceId(e.target.value)} className="w-full rounded-[16px] border border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10">
                    <option value="">Ajouter nouveau document</option>
                    {docs.map((d, i) => <option key={d.id || i} value={d.id || ""}>{d.title || d.file_name || d.document_type || "Document"}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_180px]">
                <input name="file" type="file" className="w-full rounded-[16px] border border-dashed border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black text-[#123A63] file:mr-4 file:rounded-[12px] file:border-0 file:bg-[#FFF7F2] file:px-4 file:py-2 file:text-xs file:font-black file:text-[#F15A24]" />
                <button type="submit" className="rounded-[16px] bg-[#F15A24] px-5 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,.20)] transition hover:bg-[#D94A1B]">
                  {replaceId ? "Remplacer" : "Uploader"}
                </button>
              </div>
            </form>

            <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-[#E8E2DC]">
              <div className="grid grid-cols-[1.2fr_1fr_120px_160px] bg-[#FBFCFD] px-5 py-4 text-xs font-black uppercase tracking-[0.13em] text-slate-500">
                <div>Document</div>
                <div>Type</div>
                <div>Date</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="divide-y divide-[#E8E2DC] bg-white">
                {docs.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm font-black text-slate-500">Aucun document uploadé.</div>
                ) : (
                  docs.map((doc, i) => (
                    <div key={doc.id || i} className="grid grid-cols-[1.2fr_1fr_120px_160px] items-center px-5 py-5">
                      <div className="text-sm font-black">{doc.title || doc.file_name || "Document"}</div>
                      <div className="text-xs font-black text-[#123A63]">{doc.document_type || "—"}</div>
                      <div className="text-xs font-black text-slate-500">{fmtDate(doc.created_at)}</div>
                      <div className="flex justify-end gap-2">
                        <a href={doc.file_url || "#"} target="_blank" className="inline-flex h-10 w-10 items-center justify-center rounded-[13px] border border-[#E8E2DC] bg-white text-[#123A63] hover:bg-[#FFF7F2] hover:text-[#F15A24]"><Icon type="open" /></a>
                        <button onClick={() => setReplaceId(doc.id || "")} className="inline-flex h-10 w-10 items-center justify-center rounded-[13px] border border-[#E8E2DC] bg-white text-[#123A63] hover:bg-[#FFF7F2] hover:text-[#F15A24]"><Icon type="replace" /></button>
                        <button onClick={() => setNotice("Suppression à connecter proprement à l’API.")} className="inline-flex h-10 w-10 items-center justify-center rounded-[13px] border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"><Icon type="delete" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">Paiement</p>
              <h2 className="mt-2 text-2xl font-black">Statut paiement</h2>
              <div className="mt-5 grid gap-3">
                {["En attente de vérification", "Payé", "Rejeté"].map((s) => (
                  <button key={s} className="rounded-[16px] border border-[#E8E2DC] bg-white px-5 py-4 text-left text-sm font-black text-[#123A63] hover:bg-[#FFF7F2] hover:text-[#F15A24]">{s}</button>
                ))}
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">Messages</p>
              <h2 className="mt-2 text-2xl font-black">Conversation client</h2>
              <textarea placeholder="Votre message au client..." className="mt-5 min-h-[130px] w-full rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-bold outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10" />
              <button className="mt-4 w-full rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] hover:bg-[#D94A1B]">
                Envoyer →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
