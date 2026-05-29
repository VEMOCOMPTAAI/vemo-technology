"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "fr" | "en";

type ClientRow = {
  id?: string;
  email?: string;
  client_email?: string;
  dossier_number?: string;
  llc_name?: string;
  full_name?: string;
  phone?: string;
  state?: string;
  package_name?: string;
  amount?: string | number;
  currency?: string;
  payment_status?: string;
  dossier_status?: string;
  status?: string;
  created_at?: string;
};

const text = {
  fr: {
    adminSpace: "ESPACE ADMIN",
    secure: "Pilotage sécurisé",
    title: "Dossiers clients VEMO",
    subtitle: "Sélectionnez un client, suivez son paiement, ses documents, ses messages et son avancement.",
    refresh: "Actualiser",
    settings: "Paramètres",
    clients: "Clients",
    paid: "Payés",
    pending: "En attente",
    shown: "Affichés",
    quickSelection: "Sélection client",
    allClients: "Tous les clients",
    search: "Recherche",
    searchPlaceholder: "Nom LLC, numéro dossier, téléphone, statut...",
    hideTests: "Masquer les dossiers test",
    openFolder: "Ouvrir dossier",
    no: "N° dossier",
    llc: "Nom LLC",
    client: "Client",
    phone: "Téléphone",
    pack: "Pack",
    created: "Date création",
    payment: "Paiement",
    folder: "Dossier",
    action: "Action",
    manage: "Gérer",
    loading: "Chargement...",
    empty: "Aucun dossier trouvé.",
    missingId: "Ce dossier n’a pas d’identifiant client exploitable.",
  },
  en: {
    adminSpace: "ADMIN SPACE",
    secure: "Secure management",
    title: "VEMO client files",
    subtitle: "Select a client, track payment, documents, messages and file progress.",
    refresh: "Refresh",
    settings: "Settings",
    clients: "Clients",
    paid: "Paid",
    pending: "Pending",
    shown: "Shown",
    quickSelection: "Client selection",
    allClients: "All clients",
    search: "Search",
    searchPlaceholder: "LLC name, file number, phone, status...",
    hideTests: "Hide test files",
    openFolder: "Open file",
    no: "File no.",
    llc: "LLC name",
    client: "Client",
    phone: "Phone",
    pack: "Package",
    created: "Created",
    payment: "Payment",
    folder: "File",
    action: "Action",
    manage: "Manage",
    loading: "Loading...",
    empty: "No file found.",
    missingId: "This file has no usable client identifier.",
  },
};

function fmtDate(value?: string) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("fr-FR");
  } catch {
    return "—";
  }
}

function displayName(client: ClientRow) {
  return client.llc_name || "Sans nom LLC";
}

function clientEmail(client: ClientRow) {
  return client.email || client.client_email || "";
}

function normalizeForSearch(value?: string) {
  return String(value || "").toLowerCase().replace(/[_-]+/g, " ");
}

function statusLabel(value: string | undefined, locale: Locale, type: "payment" | "dossier") {
  const raw = normalizeForSearch(value);

  if (!raw || raw === "non défini") {
    return locale === "fr" ? "Non défini" : "Not defined";
  }

  if (type === "payment") {
    if (raw.includes("paid") || raw.includes("payé") || raw.includes("payment confirmed") || raw.includes("confirmed")) {
      return locale === "fr" ? "Paiement confirmé" : "Payment confirmed";
    }
    if (raw.includes("unpaid")) return locale === "fr" ? "Non payé" : "Unpaid";
    if (raw.includes("pending") || raw.includes("attente") || raw.includes("verification") || raw.includes("vérification")) {
      return locale === "fr" ? "En attente de vérification" : "Pending verification";
    }
    if (raw.includes("reject") || raw.includes("rejet") || raw.includes("refus")) {
      return locale === "fr" ? "Paiement rejeté" : "Payment rejected";
    }
    if (raw.includes("sent")) return locale === "fr" ? "Envoyé" : "Sent";
  }

  if (type === "dossier") {
    if (raw.includes("new")) return locale === "fr" ? "Nouveau dossier" : "New file";
    if (raw.includes("in progress") || raw.includes("progress") || raw.includes("cours")) return locale === "fr" ? "En cours" : "In progress";
    if (raw.includes("waiting client")) return locale === "fr" ? "En attente client" : "Waiting for client";
    if (raw.includes("documents received")) return locale === "fr" ? "Documents reçus" : "Documents received";
    if (raw.includes("completed") || raw.includes("done") || raw.includes("termine") || raw.includes("terminé")) return locale === "fr" ? "Terminé" : "Completed";
    if (raw.includes("suspended")) return locale === "fr" ? "Suspendu" : "Suspended";
    if (raw.includes("payment confirmed") || raw.includes("confirmed")) return locale === "fr" ? "Paiement confirmé" : "Payment confirmed";
    if (raw.includes("pending") || raw.includes("attente") || raw.includes("verification")) return locale === "fr" ? "En attente" : "Pending";
    if (raw.includes("sent")) return locale === "fr" ? "Envoyé" : "Sent";
  }

  return raw
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function badge(value: string | undefined, locale: Locale, type: "payment" | "dossier") {
  const label = statusLabel(value, locale, type);
  const low = normalizeForSearch(value);

  const cls =
    low.includes("paid") || low.includes("confirmed") || low.includes("payé") || low.includes("valid") || low.includes("completed")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : low.includes("pending") || low.includes("attente") || low.includes("verification") || low.includes("progress") || low.includes("unpaid")
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : low.includes("reject") || low.includes("rejet") || low.includes("refus") || low.includes("suspended")
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={`inline-flex max-w-full rounded-full border px-3 py-1 text-[11px] font-black ${cls}`}>
      <span className="truncate">{label}</span>
    </span>
  );
}

function isTestClient(client: ClientRow) {
  const haystack = `${client.llc_name || ""} ${client.full_name || ""} ${client.dossier_number || ""}`.toLowerCase();
  return haystack.includes("test") || haystack.includes("demo") || haystack.includes("dossier llc") || haystack.includes("sans nom");
}

function ActionIcon({ type }: { type: "open" | "settings" | "refresh" }) {
  if (type === "settings") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" stroke="currentColor" strokeWidth="2.1" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2.1 2.1 0 0 1-2.97 2.97l-.06-.06A1.8 1.8 0 0 0 14.8 19.6a1.8 1.8 0 0 0-1.08 1.65V21.4a2.1 2.1 0 0 1-4.2 0v-.09A1.8 1.8 0 0 0 8.4 19.6a1.8 1.8 0 0 0-1.98.36l-.06.06a2.1 2.1 0 0 1-2.97-2.97l.06-.06A1.8 1.8 0 0 0 3.8 15a1.8 1.8 0 0 0-1.65-1.08H2.1a2.1 2.1 0 0 1 0-4.2h.09A1.8 1.8 0 0 0 3.8 8.4a1.8 1.8 0 0 0-.36-1.98l-.06-.06a2.1 2.1 0 0 1 2.97-2.97l.06.06A1.8 1.8 0 0 0 8.4 3.8 1.8 1.8 0 0 0 9.48 2.1V2a2.1 2.1 0 0 1 4.2 0v.09A1.8 1.8 0 0 0 14.8 3.8a1.8 1.8 0 0 0 1.98-.36l.06-.06a2.1 2.1 0 0 1 2.97 2.97l-.06.06A1.8 1.8 0 0 0 19.4 8.4a1.8 1.8 0 0 0 1.65 1.08h.09a2.1 2.1 0 0 1 0 4.2h-.09A1.8 1.8 0 0 0 19.4 15Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "refresh") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 6v5h-5M4 18v-5h5M5.6 9A7 7 0 0 1 17 6.7L20 11M4 13l3 4.3A7 7 0 0 0 18.4 15" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 5h5v5M10 14L19 5M19 14v4.5A1.5 1.5 0 0 1 17.5 20h-12A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5H10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VemoAdminDashboardClean() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("all");
  const [hideTests, setHideTests] = useState(true);

  const t = text[locale];

  async function load() {
    setLoading(true);
    setNotice("");

    try {
      const res = await fetch("/api/admin/clients", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      const rows =
        Array.isArray(data) ? data :
        Array.isArray(data?.clients) ? data.clients :
        Array.isArray(data?.data) ? data.data :
        Array.isArray(data?.items) ? data.items :
        [];

      setClients(rows);

      if (!res.ok || data?.error) {
        setNotice(data?.error || "Impossible de charger les clients.");
      }

      if (data?.debug) console.table(data.debug);
    } catch {
      setNotice("Impossible de charger les clients.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleClients = useMemo(() => {
    return hideTests ? clients.filter((client) => !isTestClient(client)) : clients;
  }, [clients, hideTests]);

  const selectedClient = useMemo(() => {
    if (selectedIndex === "all") return undefined;
    return visibleClients[Number(selectedIndex)];
  }, [selectedIndex, visibleClients]);

  const tableRows = useMemo(() => {
    let rows = selectedClient ? [selectedClient] : visibleClients;
    const q = search.trim().toLowerCase();

    if (q) {
      rows = rows.filter((c) => {
        return `${displayName(c)} ${c.full_name || ""} ${c.dossier_number || ""} ${c.phone || ""} ${c.package_name || ""} ${statusLabel(c.payment_status || c.status, locale, "payment")} ${statusLabel(c.dossier_status || c.status, locale, "dossier")}`
          .toLowerCase()
          .includes(q);
      });
    }

    return rows;
  }, [visibleClients, selectedClient, search, locale]);

  const paidCount = visibleClients.filter((c) => {
    const s = normalizeForSearch(c.payment_status || c.status);
    return s.includes("paid") || s.includes("confirmed") || s.includes("payé");
  }).length;

  const pendingCount = visibleClients.filter((c) => {
    const s = normalizeForSearch(c.payment_status || c.status);
    return s.includes("pending") || s.includes("attente") || s.includes("verification") || s.includes("unpaid");
  }).length;

  function openClient(client?: ClientRow) {
    const target = client || selectedClient;
    const email = target ? clientEmail(target) : "";

    if (!email) {
      setNotice(t.missingId);
      return;
    }

    window.location.href = `/fr/admin/client?email=${encodeURIComponent(email)}`;
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#111827]">
      <header className="border-b border-[#E8E2DC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/fr/admin" className="leading-none">
            <div className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
              VEMO<span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
              {t.adminSpace}
            </div>
          </a>

          <div className="flex items-center gap-3">
            <div className="flex items-center border-r border-[#E8E2DC] pr-4">
              {locale === "fr" ? (
                <button
                  onClick={() => setLocale("en")}
                  className="px-2 text-sm font-black text-[#111827] transition hover:text-[#F15A24]"
                >
                  EN
                </button>
              ) : (
                <button
                  onClick={() => setLocale("fr")}
                  className="px-2 text-sm font-black text-[#111827] transition hover:text-[#F15A24]"
                >
                  FR
                </button>
              )}
            </div>

            <a
              href="/fr/admin/parametres"
              className="inline-flex items-center gap-2 rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]"
            >
              <ActionIcon type="settings" />
              {t.settings}
            </a>

            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,.18)] transition hover:bg-[#D94A1B]"
            >
              <ActionIcon type="refresh" />
              {t.refresh}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2.5rem] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(18,58,99,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
            {t.secure}
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.06em] text-[#111827]">
                {t.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                {t.subtitle}
              </p>
            </div>

            <label className="flex items-center gap-3 rounded-[18px] border border-[#E8E2DC] bg-[#FBFCFD] px-5 py-4 text-sm font-black text-[#123A63]">
              <input
                type="checkbox"
                checked={hideTests}
                onChange={(e) => {
                  setHideTests(e.target.checked);
                  setSelectedIndex("all");
                }}
                className="h-4 w-4 accent-[#F15A24]"
              />
              {t.hideTests}
            </label>
          </div>
        </div>

        {notice && (
          <div className="mt-5 rounded-[18px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-black text-amber-800">
            {notice}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">{t.clients}</p>
            <p className="mt-2 text-3xl font-black">{visibleClients.length}</p>
          </div>
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">{t.paid}</p>
            <p className="mt-2 text-3xl font-black">{paidCount}</p>
          </div>
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">{t.pending}</p>
            <p className="mt-2 text-3xl font-black">{pendingCount}</p>
          </div>
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">{t.shown}</p>
            <p className="mt-2 text-3xl font-black">{tableRows.length}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr_170px]">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#F15A24]">
                {t.quickSelection}
              </label>
              <select
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
              >
                <option value="all">{t.allClients}</option>
                {visibleClients.map((client, index) => (
                  <option key={client.id || index} value={String(index)}>
                    {displayName(client)} {client.dossier_number ? `— ${client.dossier_number}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#F15A24]">
                {t.search}
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="h-[54px] w-full rounded-[16px] border border-[#E8E2DC] bg-[#FBFCFD] px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => openClient()}
                disabled={selectedIndex === "all"}
                className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#F15A24] px-5 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] transition hover:bg-[#D94A1B] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                <ActionIcon type="open" />
                {t.openFolder}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#E8E2DC] bg-white shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
          <div className="grid grid-cols-[130px_minmax(180px,1.1fr)_150px_135px_135px_155px_155px_95px] bg-[#FBFCFD] px-5 py-4 text-[10px] font-black uppercase tracking-[0.11em] text-slate-500">
            <div>{t.no}</div>
            <div>{t.llc}</div>
            <div>{t.client}</div>
            <div>{t.phone}</div>
            <div>{t.pack}</div>
            <div>{t.payment}</div>
            <div>{t.folder}</div>
            <div className="text-right">{t.action}</div>
          </div>

          <div className="divide-y divide-[#E8E2DC]">
            {loading ? (
              <div className="px-6 py-10 text-center text-sm font-black text-slate-500">{t.loading}</div>
            ) : tableRows.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm font-black text-slate-500">{t.empty}</div>
            ) : (
              tableRows.map((client, index) => (
                <div
                  key={client.id || index}
                  className="grid grid-cols-[130px_minmax(180px,1.1fr)_150px_135px_135px_155px_155px_95px] items-center px-5 py-4"
                >
                  <div className="truncate text-xs font-black text-[#123A63]">
                    {client.dossier_number || "—"}
                  </div>
                  <div className="truncate font-black text-[#111827]">
                    {displayName(client)}
                  </div>
                  <div className="truncate text-sm font-black text-slate-600">
                    {client.full_name || "—"}
                  </div>
                  <div className="truncate text-sm font-black text-slate-600">
                    {client.phone || "—"}
                  </div>
                  <div className="truncate text-sm font-black text-[#123A63]">
                    {client.package_name || "—"}
                  </div>
                  <div>{badge(client.payment_status || client.status, locale, "payment")}</div>
                  <div>{badge(client.dossier_status || client.status, locale, "dossier")}</div>
                  <div className="text-right">
                    <button
                      onClick={() => openClient(client)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#F15A24] text-white shadow-[0_10px_22px_rgba(241,90,36,.18)] transition hover:bg-[#D94A1B]"
                      title={t.manage}
                    >
                      <ActionIcon type="open" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
