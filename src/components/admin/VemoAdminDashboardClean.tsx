"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "fr" | "en";

type ClientRow = {
  id?: string;
  email?: string;
  client_email?: string;
  dossier_number?: string;
  llc_name?: string;
  phone?: string;
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
    subtitle: "Vue premium des dossiers LLC, paiements, statuts et actions administratives.",
    refresh: "Actualiser",
    clients: "Clients",
    paid: "Payés",
    pending: "En attente",
    shown: "Affichés",
    quickSelection: "Sélection rapide par nom LLC",
    allClients: "Tous les clients",
    search: "Recherche rapide",
    searchPlaceholder: "Nom LLC, numéro dossier, téléphone, statut...",
    hideTests: "Masquer les dossiers test",
    openFolder: "Ouvrir dossier",
    no: "N° dossier",
    llc: "Nom LLC",
    phone: "Téléphone",
    created: "Date création",
    payment: "Statut paiement",
    folder: "Statut dossier",
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
    subtitle: "Premium overview of LLC files, payments, statuses and admin actions.",
    refresh: "Refresh",
    clients: "Clients",
    paid: "Paid",
    pending: "Pending",
    shown: "Shown",
    quickSelection: "Quick selection by LLC name",
    allClients: "All clients",
    search: "Quick search",
    searchPlaceholder: "LLC name, file number, phone, status...",
    hideTests: "Hide test files",
    openFolder: "Open file",
    no: "File no.",
    llc: "LLC name",
    phone: "Phone",
    created: "Created",
    payment: "Payment status",
    folder: "File status",
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

    if (raw.includes("unpaid")) {
      return locale === "fr" ? "Non payé" : "Unpaid";
    }

    if (raw.includes("pending") || raw.includes("attente") || raw.includes("verification") || raw.includes("vérification")) {
      return locale === "fr" ? "En attente de vérification" : "Pending verification";
    }

    if (raw.includes("reject") || raw.includes("rejet") || raw.includes("refus")) {
      return locale === "fr" ? "Paiement rejeté" : "Payment rejected";
    }

    if (raw.includes("sent")) {
      return locale === "fr" ? "Envoyé" : "Sent";
    }
  }

  if (type === "dossier") {
    if (raw.includes("in progress") || raw.includes("progress") || raw.includes("cours")) {
      return locale === "fr" ? "En cours" : "In progress";
    }

    if (raw.includes("completed") || raw.includes("done") || raw.includes("termine") || raw.includes("terminé")) {
      return locale === "fr" ? "Terminé" : "Completed";
    }

    if (raw.includes("payment confirmed") || raw.includes("confirmed")) {
      return locale === "fr" ? "Paiement confirmé" : "Payment confirmed";
    }

    if (raw.includes("pending") || raw.includes("attente") || raw.includes("verification")) {
      return locale === "fr" ? "En attente" : "Pending";
    }

    if (raw.includes("sent")) {
      return locale === "fr" ? "Envoyé" : "Sent";
    }
  }

  return raw
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function badge(value: string | undefined, locale: Locale, type: "payment" | "dossier") {
  const label = statusLabel(value, locale, type).replace(/[-_]/g, " ");
  const low = normalizeForSearch(value);

  const cls =
    low.includes("paid") || low.includes("confirmed") || low.includes("payé") || low.includes("valid") || low.includes("completed")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : low.includes("pending") || low.includes("attente") || low.includes("verification") || low.includes("progress")
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : low.includes("reject") || low.includes("rejet") || low.includes("refus")
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={`inline-flex max-w-full rounded-full border px-3 py-1 text-[11px] font-black ${cls}`}>
      <span className="truncate">{label}</span>
    </span>
  );
}

function isTestClient(client: ClientRow) {
  const haystack = `${client.llc_name || ""} ${client.dossier_number || ""}`.toLowerCase();
  return haystack.includes("test") || haystack.includes("demo") || haystack.includes("dossier llc") || haystack.includes("sans nom");
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

      if (data?.debug) {
        console.table(data.debug);
      }
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
        return `${displayName(c)} ${c.dossier_number || ""} ${c.phone || ""} ${statusLabel(c.payment_status || c.status, locale, "payment")} ${statusLabel(c.dossier_status || c.status, locale, "dossier")}`
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
          <div>
            <div className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
              VEMO <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
              {t.adminSpace}
            </div>
          </div>

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
              className="rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]"
            >
              Paramètres
            </a>

            <button
              onClick={load}
              className="rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]"
            >
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
                    {displayName(client)}
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
                className="h-[54px] w-full rounded-[16px] bg-[#F15A24] px-5 text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)] transition hover:bg-[#D94A1B]"
              >
                {t.openFolder} →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#E8E2DC] bg-white shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
          <div className="grid grid-cols-[130px_minmax(180px,1fr)_150px_145px_165px_165px_105px] bg-[#FBFCFD] px-5 py-4 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
            <div>{t.no}</div>
            <div>{t.llc}</div>
            <div>{t.phone}</div>
            <div>{t.created}</div>
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
                  className="grid grid-cols-[130px_minmax(180px,1fr)_150px_145px_165px_165px_105px] items-center px-5 py-4"
                >
                  <div className="truncate text-xs font-black text-[#123A63]">
                    {client.dossier_number || "—"}
                  </div>
                  <div className="truncate font-black text-[#111827]">
                    {displayName(client)}
                  </div>
                  <div className="truncate text-sm font-black text-slate-600">
                    {client.phone || "—"}
                  </div>
                  <div className="text-sm font-black text-[#123A63]">
                    {fmtDate(client.created_at)}
                  </div>
                  <div>{badge(client.payment_status || client.status, locale, "payment")}</div>
                  <div>{badge(client.dossier_status || client.status, locale, "dossier")}</div>
                  <div className="text-right">
                    <button
                      onClick={() => openClient(client)}
                      className="inline-flex rounded-[14px] bg-[#F15A24] px-4 py-3 text-xs font-black text-white shadow-[0_10px_22px_rgba(241,90,36,.18)] transition hover:bg-[#D94A1B]"
                    >
                      {t.manage} →
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
