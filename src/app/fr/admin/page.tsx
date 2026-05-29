"use client";

import { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";

type AdminItem = {
  id: string;
  source: string;
  email: string;
  clientEmail: string;
  llcName: string;
  clientName?: string;
  state?: string;
  plan?: string;
  amount?: number | string | null;
  paymentStatus?: string;
  dossierStatus?: string;
  createdAt?: string;
};

const PAYMENT_STATUSES = [
  ["pending_verification", "En vérification"],
  ["payment_verified", "Paiement validé"],
  ["payment_rejected", "Paiement rejeté"],
  ["paid", "Payé"],
];

const DOSSIER_STATUSES = [
  ["pending", "En attente"],
  ["email_confirmation_required", "Email à confirmer"],
  ["in_progress", "En traitement"],
  ["missing_information", "Informations manquantes"],
  ["documents_ready", "Documents prêts"],
  ["completed", "Terminé"],
];

function labelStatus(value?: string) {
  const v = String(value || "").toLowerCase();

  const all = [...PAYMENT_STATUSES, ...DOSSIER_STATUSES];
  const found = all.find(([key]) => key === v);
  if (found) return found[1];

  if (!value) return "En attente";
  return String(value).replaceAll("_", " ").replaceAll("-", " ");
}

function money(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return `${n.toLocaleString("fr-FR")} USD`;
}

export default function AdminFinalPage() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [query, setQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documentClientEmail, setDocumentClientEmail] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/final-dashboard", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((item) => {
      const text = [
        item.llcName,
        item.email,
        item.clientName,
        item.state,
        item.plan,
        item.paymentStatus,
        item.dossierStatus,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !q || text.includes(q);
      const matchesSelected = !selectedEmail || item.email === selectedEmail;

      return matchesQuery && matchesSelected;
    });
  }, [items, query, selectedEmail]);


  async function uploadClientDocument() {
    setMessage("");

    const targetEmail = documentClientEmail || selectedEmail;

    if (!targetEmail) {
      setMessage("Sélectionne d’abord un client.");
      return;
    }

    if (!uploadFile) {
      setMessage("Choisis un document à uploader.");
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.append("email", targetEmail);
      form.append("client_email", targetEmail);
      form.append("title", uploadTitle || uploadFile.name);
      form.append("file", uploadFile);

      const res = await fetch("/api/admin/client-portal/documents", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setMessage(data?.error || "Erreur upload document.");
        return;
      }

      setUploadFile(null);
      setUploadTitle("");
      setMessage("Document uploadé. Il sera visible dans l’espace client.");
    } catch (e: any) {
      setMessage(e?.message || "Erreur upload document.");
    } finally {
      setUploading(false);
    }
  }

  async function updateStatus(item: AdminItem, patch: Partial<AdminItem>) {
    setSavingId(item.id);
    setMessage("");

    try {
      const res = await fetch("/api/admin/final-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          email: item.email,
          paymentStatus: patch.paymentStatus,
          dossierStatus: patch.dossierStatus,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        setMessage(data?.error || "Erreur mise à jour.");
        return;
      }

      setItems((prev) =>
        prev.map((row) =>
          row.id === item.id
            ? {
                ...row,
                ...patch,
              }
            : row
        )
      );

      setMessage("Statut mis à jour.");
    } finally {
      setSavingId("");
    }
  }

  const uniqueClients = Array.from(
    new Map(items.filter((i) => i.email).map((i) => [i.email, i])).values()
  );

  return (
    <main className="min-h-screen bg-[#F5F8FB] px-6 py-8 text-[#111827]">
      <section className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-[#E6EDF5] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <a href="/fr" className="inline-flex flex-col">
              <div className="text-[30px] font-black uppercase leading-none tracking-[-0.06em]">
                <span className="text-[#123A63]">VEMO</span>
                <span className="text-[#F15A24]">TECH</span>
              </div>
              <div className="mt-2 text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">
                ADMIN
              </div>
            </a>

            <div className="flex flex-wrap gap-3">
              <a
                href="/fr/admin/parametres"
                className="inline-flex h-[48px] items-center rounded-[15px] border border-[#E6EDF5] bg-white px-5 text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
              >
                Paramètres packs
              </a>
              <button
                type="button"
                onClick={load}
                className="inline-flex h-[48px] items-center rounded-[15px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Actualiser
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-[1.4rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                Dossiers
              </p>
              <p className="mt-2 text-3xl font-black text-[#123A63]">{items.length}</p>
            </div>

            <div className="rounded-[1.4rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                Paiements à vérifier
              </p>
              <p className="mt-2 text-3xl font-black text-[#123A63]">
                {items.filter((i) => String(i.paymentStatus).includes("pending")).length}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                En traitement
              </p>
              <p className="mt-2 text-3xl font-black text-[#123A63]">
                {items.filter((i) => String(i.dossierStatus).includes("progress")).length}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                Terminés
              </p>
              <p className="mt-2 text-3xl font-black text-[#123A63]">
                {items.filter((i) => String(i.dossierStatus).includes("completed")).length}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-7 rounded-[2rem] border border-[#E6EDF5] bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher : nom LLC, email, statut..."
              className="h-[54px] rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none transition focus:border-[#F15A24]"
            />

            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="h-[54px] rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none transition focus:border-[#F15A24]"
            >
              <option value="">Tous les clients</option>
              {uniqueClients.map((item) => (
                <option key={item.email} value={item.email}>
                  {item.llcName} — {item.email}
                </option>
              ))}
            </select>
          </div>

          {message ? (
            <div className="mt-5 rounded-[16px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-3 text-sm font-black text-[#123A63]">
              {message}
            </div>
          ) : null}

          
          <div className="mt-6 rounded-[1.5rem] border border-[#E6EDF5] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-black tracking-[-0.04em] text-[#111827]">
                  Documents client
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Uploadez ici les documents qui apparaîtront dans l’espace client.
                </p>
              </div>

              <a
                href={selectedEmail ? `/fr/espace-client?email=${encodeURIComponent(selectedEmail)}` : "/fr/espace-client"}
                className="inline-flex h-[44px] items-center rounded-[14px] border border-[#E6EDF5] bg-white px-4 text-xs font-black text-[#123A63] transition hover:border-[#F15A24]"
              >
                Voir espace client
              </a>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[0.85fr_1fr_1fr_auto]">
              <select
                value={documentClientEmail || selectedEmail}
                onChange={(e) => setDocumentClientEmail(e.target.value)}
                className="h-[50px] rounded-[15px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
              >
                <option value="">Choisir client</option>
                {uniqueClients.map((item) => (
                  <option key={item.email} value={item.email}>
                    {item.llcName} — {item.email}
                  </option>
                ))}
              </select>

              <input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Titre document : Articles of Organization, EIN, Operating Agreement..."
                className="h-[50px] rounded-[15px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="h-[50px] rounded-[15px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
              />

              <button
                type="button"
                onClick={uploadClientDocument}
                disabled={uploading}
                className="h-[50px] rounded-[15px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C] disabled:opacity-60"
              >
                {uploading ? "Upload..." : "Uploader"}
              </button>
            </div>
          </div>

<div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#E6EDF5]">
            <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr_0.8fr_1fr_1fr_0.8fr] bg-[#F8FAFC] px-4 py-3 text-[11px] font-black uppercase tracking-[0.13em] text-slate-400">
              <div>Client / LLC</div>
              <div>Formule</div>
              <div>État</div>
              <div>Montant</div>
              <div>Paiement</div>
              <div>Dossier</div>
              <div>Actions</div>
            </div>

            {loading ? (
              <div className="px-4 py-8 text-sm font-bold text-slate-500">Chargement...</div>
            ) : filtered.length ? (
              filtered.map((item) => (
                <div
                  key={`${item.source}-${item.id}-${item.email}`}
                  className="grid grid-cols-[1.4fr_0.9fr_0.8fr_0.8fr_1fr_1fr_0.8fr] items-center gap-3 border-t border-[#E6EDF5] px-4 py-4 text-sm"
                >
                  <div>
                    <p className="font-black text-[#123A63]">{item.llcName}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{item.email || "—"}</p>
                  </div>

                  <div className="font-black text-[#123A63]">{item.plan || "—"}</div>
                  <div className="font-bold text-slate-600">{item.state || "—"}</div>
                  <div className="font-black text-[#123A63]">{money(item.amount)}</div>

                  <select
                    value={item.paymentStatus || "pending_verification"}
                    disabled={savingId === item.id}
                    onChange={(e) => updateStatus(item, { paymentStatus: e.target.value })}
                    className="h-[42px] rounded-[12px] border border-[#E6EDF5] bg-white px-3 text-xs font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                  >
                    {PAYMENT_STATUSES.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={item.dossierStatus || "pending"}
                    disabled={savingId === item.id}
                    onChange={(e) => updateStatus(item, { dossierStatus: e.target.value })}
                    className="h-[42px] rounded-[12px] border border-[#E6EDF5] bg-white px-3 text-xs font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                  >
                    {DOSSIER_STATUSES.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`/fr/espace-client?email=${encodeURIComponent(item.email || "")}`}
                      className="rounded-[12px] border border-[#E6EDF5] px-3 py-2 text-center text-xs font-black text-[#123A63] transition hover:border-[#F15A24]"
                    >
                      Espace
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-sm font-bold text-slate-500">
                Aucun dossier trouvé.
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
