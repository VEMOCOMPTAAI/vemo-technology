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

type MessageRow = {
  id?: string;
  sender?: string;
  message?: string;
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

function fmtTime(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("fr-FR");
  } catch {
    return "";
  }
}

export default function VemoAdminClientClean() {
  const [email, setEmail] = useState("");
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [docType, setDocType] = useState(docTypes[0]);
  const [replaceId, setReplaceId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentEmail = params.get("email") || "";
    setEmail(currentEmail);
    if (currentEmail) {
      loadDocs(currentEmail);
      loadMessages(currentEmail);
    }
  }, []);

  function ok(msg: string) {
    setError("");
    setNotice(msg);
    setTimeout(() => setNotice(""), 4500);
  }

  function ko(msg: string) {
    setNotice("");
    setError(msg);
    setTimeout(() => setError(""), 6000);
  }

  async function loadDocs(currentEmail = email) {
    if (!currentEmail) return;

    try {
      const res = await fetch(`/api/admin/documents?email=${encodeURIComponent(currentEmail)}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error) {
        setDocs([]);
        if (data?.error) ko(data.error);
        return;
      }

      setDocs(data?.documents || []);
    } catch {
      setDocs([]);
      ko("Impossible de charger les documents.");
    }
  }

  async function loadMessages(currentEmail = email) {
    if (!currentEmail) return;

    try {
      const res = await fetch(`/api/admin/messages?email=${encodeURIComponent(currentEmail)}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error) {
        setMessages([]);
        return;
      }

      setMessages(data?.messages || []);
    } catch {
      setMessages([]);
    }
  }

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email) {
      ko("Email client manquant.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const file = form.get("file");

    if (!(file instanceof File) || !file.name) {
      ko("Sélectionne un fichier.");
      return;
    }

    form.set("email", email);
    form.set("document_type", docType);
    form.set("replace_id", replaceId);

    setBusy(true);

    try {
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error || data?.ok === false) {
        ko(data?.error || "Erreur pendant l’upload.");
        return;
      }

      e.currentTarget.reset();
      setReplaceId("");
      await loadDocs();
      await loadMessages();
      ok(replaceId ? "Document remplacé avec succès." : "Document uploadé avec succès.");
    } catch (err: any) {
      ko(`Erreur réseau pendant l’upload : ${err?.message || "requête interrompue"}`);
    } finally {
      setBusy(false);
    }
  }

  async function deleteDoc(id?: string) {
    if (!id) return;

    const confirmed = window.confirm("Supprimer ce document ?");
    if (!confirmed) return;

    setBusy(true);

    try {
      const res = await fetch("/api/admin/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error || data?.ok === false) {
        ko(data?.error || "Erreur suppression document.");
        return;
      }

      await loadDocs();
      await loadMessages();
      ok("Document supprimé.");
    } catch {
      ko("Erreur réseau pendant la suppression.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage() {
    const text = message.trim();

    if (!email) {
      ko("Email client manquant.");
      return;
    }

    if (!text) {
      ko("Message vide.");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: text }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error || data?.ok === false) {
        ko(data?.error || "Erreur envoi message.");
        return;
      }

      setMessage("");
      await loadMessages();
      ok("Message envoyé au client.");
    } catch {
      ko("Erreur réseau pendant l’envoi.");
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(payment_status: string) {
    if (!email) {
      ko("Email client manquant.");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/admin/dossier-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, payment_status }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error || data?.ok === false) {
        ko(data?.error || "Erreur statut paiement.");
        return;
      }

      await loadMessages();
      ok(`Statut paiement mis à jour : ${payment_status}`);
    } catch {
      ko("Erreur réseau pendant la mise à jour du statut.");
    } finally {
      setBusy(false);
    }
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

          <a
            href="/fr/admin"
            className="rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]"
          >
            ← Retour admin
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2.5rem] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(18,58,99,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
            Dossier client
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em]">
            Gestion premium du dossier
          </h1>
          <p className="mt-3 break-all text-sm font-bold text-slate-500">
            {email || "Aucun client sélectionné"}
          </p>
        </div>

        {notice && (
          <div className="mt-5 rounded-[18px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800">
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-800">
            {error}
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
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full rounded-[16px] border border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  >
                    {docTypes.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-black text-[#123A63]">Remplacer un document</span>
                  <select
                    value={replaceId}
                    onChange={(e) => setReplaceId(e.target.value)}
                    className="w-full rounded-[16px] border border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  >
                    <option value="">Ajouter nouveau document</option>
                    {docs.map((d, i) => (
                      <option key={d.id || i} value={d.id || ""}>
                        {d.title || d.file_name || d.document_type || "Document"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_180px]">
                <input
                  name="file"
                  type="file"
                  className="w-full rounded-[16px] border border-dashed border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black text-[#123A63] file:mr-4 file:rounded-[12px] file:border-0 file:bg-[#FFF7F2] file:px-4 file:py-2 file:text-xs file:font-black file:text-[#F15A24]"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-[16px] bg-[#F15A24] px-5 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,.20)] transition hover:bg-[#D94A1B] disabled:opacity-60"
                >
                  {busy ? "Traitement..." : replaceId ? "Remplacer" : "Uploader"}
                </button>
              </div>
            </form>

            <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-[#E8E2DC]">
              <div className="grid grid-cols-[1.2fr_1fr_120px_180px] bg-[#FBFCFD] px-5 py-4 text-xs font-black uppercase tracking-[0.13em] text-slate-500">
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
                    <div key={doc.id || i} className="grid grid-cols-[1.2fr_1fr_120px_180px] items-center px-5 py-5">
                      <div className="text-sm font-black">{doc.title || doc.file_name || "Document"}</div>
                      <div className="text-xs font-black text-[#123A63]">{doc.document_type || "—"}</div>
                      <div className="text-xs font-black text-slate-500">{fmtDate(doc.created_at)}</div>
                      <div className="flex justify-end gap-2">
                        <a
                          href={doc.file_url || "#"}
                          target="_blank"
                          className="rounded-[13px] border border-[#E8E2DC] bg-white px-3 py-2 text-xs font-black text-[#123A63] hover:bg-[#FFF7F2] hover:text-[#F15A24]"
                        >
                          Ouvrir
                        </a>
                        <button
                          onClick={() => setReplaceId(doc.id || "")}
                          className="rounded-[13px] border border-[#E8E2DC] bg-white px-3 py-2 text-xs font-black text-[#123A63] hover:bg-[#FFF7F2] hover:text-[#F15A24]"
                        >
                          Remplacer
                        </button>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          className="rounded-[13px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                        >
                          Suppr.
                        </button>
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
                {[
                  ["pending_admin_validation", "En attente de vérification"],
                  ["paid", "Payé"],
                  ["rejected", "Rejeté"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    disabled={busy}
                    onClick={() => updateStatus(value)}
                    className="rounded-[16px] border border-[#E8E2DC] bg-white px-5 py-4 text-left text-sm font-black text-[#123A63] hover:bg-[#FFF7F2] hover:text-[#F15A24] disabled:opacity-60"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">Messages</p>
              <h2 className="mt-2 text-2xl font-black">Conversation client</h2>

              <div className="mt-5 max-h-[220px] space-y-3 overflow-auto rounded-[18px] border border-[#E8E2DC] bg-[#FBFCFD] p-4">
                {messages.length === 0 ? (
                  <p className="text-sm font-black text-slate-400">Aucun message.</p>
                ) : (
                  messages.map((m, i) => (
                    <div key={m.id || i} className="rounded-[16px] border border-[#E8E2DC] bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#F15A24]">
                          {m.sender || "message"}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400">{fmtTime(m.created_at)}</p>
                      </div>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{m.message}</p>
                    </div>
                  ))
                )}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message au client..."
                className="mt-5 min-h-[130px] w-full rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-bold outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
              />
              <button
                onClick={sendMessage}
                disabled={busy}
                className="mt-4 w-full rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] hover:bg-[#D94A1B] disabled:opacity-60"
              >
                Envoyer →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
