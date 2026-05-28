"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type ClientAccount = {
  email: string;
  name?: string;
  company_name?: string;
  payment_status?: string;
  account_status?: string;
  portal_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ClientDocument = {
  id: string;
  client_email: string;
  title?: string;
  document_type?: string;
  file_name?: string;
  file_url?: string;
  storage_path?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type ClientMessage = {
  id: string;
  client_email: string;
  sender?: string;
  message?: string;
  created_at?: string;
};

const DOC_TYPES = [
  { value: "company_document", label: "Company Document" },
  { value: "ein_letter", label: "EIN" },
  { value: "operating_agreement", label: "Operating Agreement" },
  { value: "receipt", label: "Reçu de paiement" },
  { value: "registered_agent_certificate", label: "Certificat Registered Agent" },
  { value: "banking", label: "Banking" },
  { value: "other", label: "Autre document" },
];

function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

function VemoLogo() {
  return (
    <div className="inline-flex flex-col leading-none">
      <div className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
        VEMO <span className="text-[#F15A24]">TECH</span>
      </div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
        ADMIN SPACE
      </div>
    </div>
  );
}

function formatDateFR(value?: string) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatDateTimeFR(value?: string) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function getClientDisplayName(client?: ClientAccount | null) {
  if (!client) return "Dossier client";
  return client.company_name || client.name || "Client LLC";
}

function docLabel(type?: string) {
  return DOC_TYPES.find((item) => item.value === type)?.label || type || "Document";
}

function StatusBadge({ value }: { value?: string }) {
  const v = value || "non défini";

  const tone =
    v.includes("paid") || v.includes("active") || v.includes("termine") || v.includes("confirmed")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : v.includes("pending") || v.includes("attente") || v.includes("verification")
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : v.includes("rejected") || v.includes("refus")
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${tone}`}>
      {v}
    </span>
  );
}


function IconOpen() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 5h5v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L19 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 14v4.5A1.5 1.5 0 0 1 17.5 20h-12A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5H10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconReplace() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 2l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11V9a3 3 0 0 1 3-3h15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 22l-4-4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 13v2a3 3 0 0 1-3 3H3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 11v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 11v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 7l1 14h10l1-14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.8rem] border border-dashed border-[#E8E2DC] bg-white p-7 text-center">
      <p className="text-lg font-black text-[#111827]">{title}</p>
      <p className="mt-2 text-sm font-bold leading-7 text-slate-500">{text}</p>
    </div>
  );
}

export default function VemoAdminClientDetail() {
  const [authState, setAuthState] = useState<"loading" | "allowed" | "denied">("loading");
  const [client, setClient] = useState<ClientAccount | null>(null);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [messageText, setMessageText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState("company_document");
  const [replaceDocumentId, setReplaceDocumentId] = useState("");

  const email = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    return String(url.searchParams.get("email") || "").trim().toLowerCase();
  }, []);

  async function checkAdmin() {
    const supabase = getSupabaseBrowser();

    if (!supabase) {
      setAuthState("denied");
      return false;
    }

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      setAuthState("denied");
      return false;
    }

    const userEmail = String(user.email || "").toLowerCase();

    const role =
      user.user_metadata?.role ||
      user.user_metadata?.app_role ||
      user.app_metadata?.role ||
      user.app_metadata?.app_role ||
      "";

    const isAdmin =
      userEmail === "contact@vemo-technology.com" ||
      role === "admin" ||
      user.user_metadata?.is_admin === true ||
      user.app_metadata?.is_admin === true;

    setAuthState(isAdmin ? "allowed" : "denied");
    return isAdmin;
  }

  async function loadClient() {
    setLoading(true);

    const res = await fetch(`/api/admin/client-detail?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    }).catch(() => null);

    const payload = await res?.json().catch(() => null);

    if (payload?.ok) {
      setClient(payload.client || null);
      setDocuments(payload.documents || []);
      setMessages(payload.messages || []);
    } else {
      setNotice(payload?.error || "Impossible de charger le dossier client.");
    }

    setLoading(false);
  }

  useEffect(() => {
    async function boot() {
      const ok = await checkAdmin();

      if (ok && email) {
        await loadClient();
      } else {
        setLoading(false);
      }
    }

    boot();
  }, [email]);

  async function changeStatus(status: string) {
    if (!client?.email) return;

    setNotice("");

    const res = await fetch("/api/admin/dossiers/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: client.email, status }),
    }).catch(() => null);

    if (res?.ok) {
      setNotice("Statut mis à jour.");
      await loadClient();
    } else {
      const payload = await res?.json().catch(() => ({}));
      setNotice(payload?.error || "Erreur pendant la mise à jour.");
    }
  }

  async function sendMessage() {
    if (!client?.email || !messageText.trim()) return;

    setNotice("");

    const res = await fetch("/api/admin/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: client.email, message: messageText }),
    }).catch(() => null);

    if (res?.ok) {
      setMessageText("");
      setNotice("Message envoyé.");
      await loadClient();
    } else {
      const payload = await res?.json().catch(() => ({}));
      setNotice(payload?.error || "Erreur pendant l’envoi.");
    }
  }

  async function uploadDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!client?.email) return;

    const formEl = event.currentTarget;
    const currentReplaceDocumentId = replaceDocumentId;

    setUploading(true);
    setNotice("");

    const form = new FormData(formEl);
    form.set("client_email", client.email);
    form.set("document_type", documentType);
    form.set("replace_document_id", currentReplaceDocumentId);

    const res = await fetch("/api/admin/documents/upload", {
      method: "POST",
      body: form,
    }).catch(() => null);

    if (res?.ok) {
      formEl.reset();
      setReplaceDocumentId("");
      setNotice(currentReplaceDocumentId ? "Document remplacé." : "Document ajouté.");
      await loadClient();
    } else {
      const payload = await res?.json().catch(() => ({}));
      setNotice(payload?.error || "Erreur pendant l’upload.");
    }

    setUploading(false);
  }

  async function deleteDocument(doc: ClientDocument) {
    const ok = window.confirm("Supprimer ce document ?");
    if (!ok) return;

    const res = await fetch("/api/admin/documents/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: doc.id, storage_path: doc.storage_path }),
    }).catch(() => null);

    if (res?.ok) {
      setNotice("Document supprimé.");
      await loadClient();
    } else {
      const payload = await res?.json().catch(() => ({}));
      setNotice(payload?.error || "Erreur pendant la suppression.");
    }
  }

  if (authState === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#F7FAFC] p-6">
        <div className="mx-auto mt-20 max-w-xl rounded-[2rem] border border-[#E8E2DC] bg-white p-8 text-center shadow-[0_22px_60px_rgba(18,58,99,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
            Vemo Admin
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#111827]">
            Chargement du dossier...
          </h1>
        </div>
      </main>
    );
  }

  if (authState === "denied") {
    return (
      <main className="min-h-screen bg-[#F7FAFC] p-6">
        <div className="mx-auto mt-20 max-w-xl rounded-[2rem] border border-[#F5D6C9] bg-white p-8 text-center shadow-[0_22px_60px_rgba(18,58,99,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
            Vemo Admin
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#111827]">
            Accès refusé
          </h1>
          <a
            href="/fr/admin/connexion"
            className="mt-7 inline-flex rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] transition hover:bg-[#D94A1B]"
          >
            Connexion admin
          </a>
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-[#F7FAFC] p-6">
        <div className="mx-auto mt-20 max-w-xl rounded-[2rem] border border-[#E8E2DC] bg-white p-8 text-center shadow-[0_22px_60px_rgba(18,58,99,0.08)]">
          <VemoLogo />

          <h1 className="mt-8 text-3xl font-black tracking-[-0.05em] text-[#111827]">
            Dossier client introuvable
          </h1>

          <a
            href="/fr/admin"
            className="mt-7 inline-flex rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] transition hover:bg-[#D94A1B]"
          >
            Retour au pilotage
          </a>
        </div>
      </main>
    );
  }

  return (
    <main data-vemo-admin="true" className="min-h-screen bg-[#F7FAFC] text-[#111827]">
      <div className="border-b border-[#E8E2DC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <VemoLogo />

          <a
            href="/fr/admin"
            className="rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]"
          >
            ← Retour admin
          </a>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2.5rem] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(18,58,99,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
                Dossier client
              </p>

              <h1 className="mt-3 text-5xl font-black tracking-[-0.07em] text-[#111827]">
                {getClientDisplayName(client)}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge value={client.payment_status} />
                <StatusBadge value={client.account_status} />
                <span className="inline-flex rounded-full border border-[#E8E2DC] bg-white px-3 py-1 text-xs font-black text-slate-600">
                  Créé le {formatDateFR(client.created_at || client.updated_at)}
                </span>
              </div>
            </div>

            <button
                  type="submit"
                  disabled={uploading}
                  data-vemo-upload-button="true"
                  className="vemo-upload-solid-btn rounded-[16px] px-5 py-4 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Upload..." : replaceDocumentId ? "Remplacer" : "Uploader"}
                </button>
          </div>
        </div>

        {notice && (
          <div className="mt-5 rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-black text-[#123A63]">
            {notice}
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-4">
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">
              Documents
            </p>
            <p className="mt-2 text-3xl font-black text-[#111827]">{documents.length}</p>
          </div>

          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">
              Messages
            </p>
            <p className="mt-2 text-3xl font-black text-[#111827]">{messages.length}</p>
          </div>

          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">
              Paiement
            </p>
            <div className="mt-3">
              <StatusBadge value={client.payment_status} />
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">
              Dossier
            </p>
            <div className="mt-3">
              <StatusBadge value={client.account_status} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">
                  Documents
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#111827]">
                  Documents du dossier
                </h2>
              </div>

              <span className="rounded-full bg-[#FFF7F2] px-4 py-2 text-xs font-black text-[#F15A24]">
                {documents.length} fichier(s)
              </span>
            </div>

            <form
              onSubmit={uploadDocument}
              className="mt-6 rounded-[1.8rem] border border-[#E8E2DC] bg-[#FBFCFD] p-5"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-[#123A63]">
                    Type de document
                  </span>
                  <select
                    value={documentType}
                    onChange={(event) => setDocumentType(event.target.value)}
                    className="w-full rounded-[16px] border border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  >
                    {DOC_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-[#123A63]">
                    Remplacer un document
                  </span>
                  <select
                    value={replaceDocumentId}
                    onChange={(event) => setReplaceDocumentId(event.target.value)}
                    className="w-full rounded-[16px] border border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
                  >
                    <option value="">Ajouter nouveau document</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {docLabel(doc.document_type)} — {doc.title || doc.file_name || "fichier"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_180px]">
                <input
                  name="file"
                  type="file"
                  required
                  className="w-full rounded-[16px] border border-dashed border-[#E8E2DC] bg-white px-4 py-4 text-sm font-black text-[#123A63] outline-none file:mr-4 file:rounded-[12px] file:border-0 file:bg-[#FFF7F2] file:px-4 file:py-2 file:text-xs file:font-black file:text-[#F15A24]"
                />

                <button
                  disabled={uploading}
                  type="submit"
                  style={{
                    background: "#F15A24",
                    backgroundColor: "#F15A24",
                    backgroundImage: "none",
                    WebkitAppearance: "none",
                    appearance: "none",
                  }}
                  className="vemo-uploader-orange rounded-[16px] px-5 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,.20)] transition hover:opacity-90 disabled:opacity-60"
                >
                  {uploading ? "Upload..." : replaceDocumentId ? "Remplacer" : "Uploader"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#111827]">
                  Liste des documents uploadés
                </h3>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Actions
                </span>
              </div>

              {documents.length === 0 ? (
                <EmptyState
                  title="Aucun document"
                  text="Ajoutez le premier document du dossier client."
                />
              ) : (
                <div className="overflow-hidden rounded-[1.8rem] border border-[#E8E2DC]">
                  <div className="grid grid-cols-[1.1fr_1fr_130px_210px] bg-[#FBFCFD] px-5 py-4 text-xs font-black uppercase tracking-[0.13em] text-slate-500">
                    <div>Document</div>
                    <div>Type</div>
                    <div>Date</div>
                    <div className="text-right">Actions</div>
                  </div>

                  <div className="divide-y divide-[#E8E2DC] bg-white">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-[1.1fr_1fr_130px_210px] items-center px-5 py-5"
                      >
                        <div>
                          <p className="text-sm font-black text-[#111827]">
                            {doc.title || doc.file_name || docLabel(doc.document_type)}
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            {doc.status || "actif"}
                          </p>
                        </div>

                        <div>
                          <span className="inline-flex rounded-full border border-[#E8E2DC] bg-white px-3 py-1 text-xs font-black text-[#123A63]">
                            {docLabel(doc.document_type)}
                          </span>
                        </div>

                        <div className="text-sm font-black text-[#123A63]">
                          {formatDateFR(doc.created_at)}
                        </div>

                        <div className="flex justify-end gap-2">
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ouvrir"
                              aria-label="Ouvrir"
                              className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#E8E2DC] bg-white text-[#123A63] shadow-[0_10px_22px_rgba(18,58,99,0.05)] transition hover:border-[#F15A24]/40 hover:bg-[#FFF7F2] hover:text-[#F15A24]"
                            >
                              <IconOpen />
                            </a>
                          )}

                          <button
                            onClick={() => {
                              setReplaceDocumentId(doc.id);
                              setDocumentType(doc.document_type || "other");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            title="Remplacer"
                            aria-label="Remplacer"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#E8E2DC] bg-white text-[#123A63] shadow-[0_10px_22px_rgba(18,58,99,0.05)] transition hover:border-[#F15A24]/40 hover:bg-[#FFF7F2] hover:text-[#F15A24]"
                          >
                            <IconReplace />
                          </button>

                          <button
                            onClick={() => deleteDocument(doc)}
                            title="Supprimer"
                            aria-label="Supprimer"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-red-200 bg-red-50 text-red-700 shadow-[0_10px_22px_rgba(220,38,38,0.06)] transition hover:bg-red-100"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">
                Paiement
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#111827]">
                Statut paiement
              </h2>

              <div className="mt-5 grid gap-3">
                {["pending_verification", "paid", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => changeStatus(status)}
                    className="rounded-[16px] border border-[#E8E2DC] bg-white px-5 py-4 text-left text-sm font-black text-[#123A63] transition hover:border-[#F15A24]/40 hover:bg-[#FFF7F2] hover:text-[#F15A24]"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">
                Dossier
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#111827]">
                État dossier
              </h2>

              <div className="mt-5 grid gap-3">
                {["en_preparation", "documents_requis", "en_cours", "termine"].map((status) => (
                  <button
                    key={status}
                    onClick={() => changeStatus(status)}
                    className="rounded-[16px] border border-[#E8E2DC] bg-white px-5 py-4 text-left text-sm font-black text-[#123A63] transition hover:border-[#F15A24]/40 hover:bg-[#FFF7F2] hover:text-[#F15A24]"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F15A24]">
                Messages
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#111827]">
                Conversation client
              </h2>

              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Votre message au client..."
                className="mt-5 min-h-[130px] w-full rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-bold outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
              />

              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="mt-4 w-full rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] transition hover:bg-[#D94A1B] disabled:opacity-60"
              >
                Envoyer →
              </button>

              <div className="mt-5 grid max-h-[380px] gap-3 overflow-auto pr-1">
                {messages.length === 0 ? (
                  <EmptyState
                    title="Aucun message"
                    text="Les échanges avec ce client apparaîtront ici."
                  />
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-[1.4rem] border border-[#E8E2DC] bg-[#FBFCFD] p-4"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">
                        {msg.sender || "message"}
                      </p>
                      <p className="mt-2 text-sm font-bold leading-7 text-[#111827]">
                        {msg.message}
                      </p>
                      <p className="mt-2 text-xs font-bold text-slate-400">
                        {formatDateTimeFR(msg.created_at)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
