"use client";

import { useEffect, useMemo, useState } from "react";

type ClientRow = {
  id?: string;
  email?: string;
  client_email?: string;
  name?: string;
  company_name?: string;
  llc_name?: string;
  payment_status?: string;
  account_status?: string;
  status?: string;
  created_at?: string;
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
  return client.llc_name || client.company_name || client.name || "Dossier LLC";
}

function clientEmail(client: ClientRow) {
  return client.email || client.client_email || "";
}

function badge(value?: string) {
  const v = value || "non défini";
  const cls =
    v.includes("paid") || v.includes("actif") || v.includes("active") || v.includes("termine")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : v.includes("pending") || v.includes("attente") || v.includes("verification")
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : v.includes("reject") || v.includes("refus")
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${cls}`}>{v}</span>;
}

export default function VemoAdminDashboardClean() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

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
      if (!res.ok) setNotice(data?.error || "Impossible de charger les clients.");
    } catch {
      setNotice("API clients indisponible. La page reste stable.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;

    return clients.filter((c) => {
      return `${displayName(c)} ${clientEmail(c)} ${c.payment_status || ""} ${c.account_status || ""} ${c.status || ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [clients, search]);

  const paidCount = clients.filter((c) => String(c.payment_status || "").includes("paid")).length;
  const pendingCount = clients.filter((c) => String(c.payment_status || "").includes("pending") || String(c.payment_status || "").includes("attente")).length;

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#111827]">
      <header className="border-b border-[#E8E2DC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-[28px] font-black tracking-[-0.06em] text-[#123A63]">
              VEMO <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
              ADMIN SPACE
            </div>
          </div>

          <button
            onClick={load}
            className="rounded-[18px] border border-[#E8E2DC] bg-white px-5 py-3 text-sm font-black text-[#123A63] transition hover:bg-[#FFF7F2] hover:text-[#F15A24]"
          >
            Actualiser
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2.5rem] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(18,58,99,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
            Pilotage sécurisé
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.06em] text-[#111827]">
                Dossiers clients VEMO
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                Suivi des LLC, paiements, documents et échanges client/admin.
              </p>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un dossier..."
              className="w-full rounded-[18px] border border-[#E8E2DC] bg-[#FBFCFD] px-5 py-4 text-sm font-bold outline-none transition focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 lg:max-w-sm"
            />
          </div>
        </div>

        {notice && (
          <div className="mt-5 rounded-[18px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-black text-amber-800">
            {notice}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">Clients</p>
            <p className="mt-2 text-3xl font-black">{clients.length}</p>
          </div>
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">Payés</p>
            <p className="mt-2 text-3xl font-black">{paidCount}</p>
          </div>
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">En attente</p>
            <p className="mt-2 text-3xl font-black">{pendingCount}</p>
          </div>
          <div className="rounded-[1.6rem] border border-[#E8E2DC] bg-white p-5 shadow-[0_12px_28px_rgba(18,58,99,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F15A24]">Affichés</p>
            <p className="mt-2 text-3xl font-black">{filtered.length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#E8E2DC] bg-white shadow-[0_18px_45px_rgba(18,58,99,0.06)]">
          <div className="grid grid-cols-[1.2fr_160px_180px_140px] bg-[#FBFCFD] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            <div>Nom LLC</div>
            <div>Date création</div>
            <div>Paiement</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-[#E8E2DC]">
            {loading ? (
              <div className="px-6 py-10 text-center text-sm font-black text-slate-500">Chargement...</div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm font-black text-slate-500">Aucun dossier trouvé.</div>
            ) : (
              filtered.map((client, index) => {
                const email = clientEmail(client);
                return (
                  <div key={client.id || email || index} className="grid grid-cols-[1.2fr_160px_180px_140px] items-center px-6 py-5">
                    <div>
                      <p className="font-black text-[#111827]">{displayName(client)}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">Dossier client</p>
                    </div>
                    <div className="text-sm font-black text-[#123A63]">{fmtDate(client.created_at)}</div>
                    <div>{badge(client.payment_status || client.status)}</div>
                    <div className="text-right">
                      <a
                        href={`/fr/admin/client?email=${encodeURIComponent(email)}`}
                        className="inline-flex rounded-[14px] bg-[#F15A24] px-4 py-3 text-xs font-black text-white shadow-[0_10px_22px_rgba(241,90,36,.18)] transition hover:bg-[#D94A1B]"
                      >
                        Gérer →
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
