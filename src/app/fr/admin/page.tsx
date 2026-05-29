"use client";

import { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";

type AdminOrder = {
  id?: string;
  order_id?: string;
  client_name?: string;
  client_email?: string;
  email?: string;
  llc_name?: string;
  llcName?: string;
  company_name?: string;
  pack?: string;
  plan?: string;
  formula?: string;
  state?: string;
  amount?: number;
  price?: number;
  total?: number;
  currency?: string;
  payment_status?: string;
  paymentStatus?: string;
  dossier_status?: string;
  dossierStatus?: string;
  status?: string;
  created_at?: string;
};

function pickOrders(payload: any): AdminOrder[] {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.orders,
    payload?.data,
    payload?.items,
    payload?.dossiers,
    payload?.clients,
    payload?.payments,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function normalizeOrder(item: AdminOrder) {
  const email = String(item.client_email || item.email || "").trim().toLowerCase();

  const llcName =
    item.llc_name ||
    item.llcName ||
    item.company_name ||
    item.client_name ||
    "Dossier LLC";

  const formula = item.pack || item.plan || item.formula || "—";
  const state = item.state || "—";

  const amount = Number(item.amount || item.price || item.total || 0);
  const currency = item.currency || "USD";

  const paymentStatus =
    item.payment_status || item.paymentStatus || item.status || "En vérification";

  const dossierStatus =
    item.dossier_status || item.dossierStatus || "En attente";

  return {
    ...item,
    email,
    llcName,
    formula,
    state,
    amount,
    currency,
    paymentStatus,
    dossierStatus,
  };
}

export default function AdminFinalPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    setLoading(true);
    setMessage("");

    const endpoints = [
      "/api/admin/orders",
      "/api/admin/dashboard",
      "/api/admin/clients",
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        const data = await res.json().catch(() => null);

        const found = pickOrders(data).map(normalizeOrder);

        if (found.length > 0) {
          setOrders(found);
          setLoading(false);
          return;
        }
      } catch {}
    }

    setOrders([]);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const normalizedOrders = useMemo(() => {
    return orders.map(normalizeOrder);
  }, [orders]);

  const uniqueClients = useMemo(() => {
    const map = new Map<string, any>();

    for (const order of normalizedOrders) {
      if (!order.email) continue;

      if (!map.has(order.email)) {
        map.set(order.email, {
          email: order.email,
          llcName: order.llcName,
        });
      }
    }

    return Array.from(map.values());
  }, [normalizedOrders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return normalizedOrders.filter((order) => {
      const matchesSearch =
        !q ||
        [
          order.email,
          order.llcName,
          order.formula,
          order.state,
          order.paymentStatus,
          order.dossierStatus,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesClient = !selectedEmail || order.email === selectedEmail;

      return matchesSearch && matchesClient;
    });
  }, [normalizedOrders, search, selectedEmail]);

  const stats = useMemo(() => {
    const total = normalizedOrders.length;

    const paymentsToCheck = normalizedOrders.filter((order) =>
      String(order.paymentStatus || "")
        .toLowerCase()
        .includes("vérification")
    ).length;

    const inProgress = normalizedOrders.filter((order) =>
      String(order.dossierStatus || "")
        .toLowerCase()
        .includes("traitement")
    ).length;

    const done = normalizedOrders.filter((order) =>
      String(order.dossierStatus || "")
        .toLowerCase()
        .includes("termin")
    ).length;

    return { total, paymentsToCheck, inProgress, done };
  }, [normalizedOrders]);

  async function updateStatus(
    order: any,
    field: "payment_status" | "dossier_status",
    value: string
  ) {
    setMessage("");

    const id = order.id || order.order_id;

    if (!id) {
      setMessage("ID dossier introuvable.");
      return;
    }

    const endpoints = ["/api/admin/orders", "/api/admin/dossiers/status"];

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            order_id: id,
            [field]: value,
          }),
        });

        if (res.ok) {
          setOrders((prev) =>
            prev.map((item) => {
              const itemId = item.id || item.order_id;

              if (itemId !== id) return item;

              return {
                ...item,
                [field]: value,
              };
            })
          );

          setMessage("Statut mis à jour.");
          return;
        }
      } catch {}
    }

    setMessage("Statut modifié localement. Route API à finaliser.");
    setOrders((prev) =>
      prev.map((item) => {
        const itemId = item.id || item.order_id;

        if (itemId !== id) return item;

        return {
          ...item,
          [field]: value,
        };
      })
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="rounded-[2rem] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[30px] font-black uppercase leading-none tracking-[-0.06em]">
                <span className="text-[#123A63]">VEMO</span>
                <span className="text-[#F15A24]">TECH</span>
              </div>

              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">
                Admin
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/fr/admin/parametres"
                className="inline-flex h-[46px] items-center justify-center rounded-[15px] border border-[#E6EDF5] bg-white px-5 text-sm font-black text-[#123A63] transition hover:border-[#F15A24]"
              >
                Paramètres packs
              </a>

              <button
                type="button"
                onClick={loadOrders}
                className="inline-flex h-[46px] items-center justify-center rounded-[15px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Actualiser
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-[20px] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Dossiers
              </p>
              <p className="mt-3 text-[28px] font-black text-[#123A63]">
                {stats.total}
              </p>
            </div>

            <div className="rounded-[20px] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Paiements à vérifier
              </p>
              <p className="mt-3 text-[28px] font-black text-[#123A63]">
                {stats.paymentsToCheck}
              </p>
            </div>

            <div className="rounded-[20px] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                En traitement
              </p>
              <p className="mt-3 text-[28px] font-black text-[#123A63]">
                {stats.inProgress}
              </p>
            </div>

            <div className="rounded-[20px] border border-[#E6EDF5] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Terminés
              </p>
              <p className="mt-3 text-[28px] font-black text-[#123A63]">
                {stats.done}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher : nom LLC, email, statut..."
              className="h-[54px] rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-bold text-[#123A63] outline-none focus:border-[#F15A24]"
            />

            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="h-[54px] rounded-[16px] border border-[#E6EDF5] bg-white px-4 text-sm font-black text-[#123A63] outline-none focus:border-[#F15A24]"
            >
              <option value="">Tous les clients</option>
              {uniqueClients.map((client) => (
                <option key={client.email} value={client.email}>
                  {client.llcName} — {client.email}
                </option>
              ))}
            </select>
          </div>

          {message ? (
            <div className="mt-4 rounded-[15px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-3 text-sm font-black text-[#123A63]">
              {message}
            </div>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#E6EDF5]">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Client / LLC
                  </th>
                  <th className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Formule
                  </th>
                  <th className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    État
                  </th>
                  <th className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Montant
                  </th>
                  <th className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Paiement
                  </th>
                  <th className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Dossier
                  </th>
                  <th className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-sm font-bold text-slate-500"
                    >
                      Chargement...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-sm font-bold text-slate-500"
                    >
                      Aucun dossier trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => {
                    const id = order.id || order.order_id || `${order.email}-${index}`;
                    const openHref = order.email
                      ? `/fr/admin/client?email=${encodeURIComponent(order.email)}`
                      : "/fr/admin/client";

                    return (
                      <tr key={id} className="border-t border-[#E6EDF5]">
                        <td className="px-4 py-4">
                          <p className="text-sm font-black text-[#123A63]">
                            {order.llcName}
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-500">
                            {order.email || "Email non renseigné"}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-sm font-bold text-[#123A63]">
                          {order.formula}
                        </td>

                        <td className="px-4 py-4 text-sm font-bold text-[#123A63]">
                          {order.state}
                        </td>

                        <td className="px-4 py-4 text-sm font-black text-[#123A63]">
                          {order.amount ? `${order.amount} ${order.currency}` : "—"}
                        </td>

                        <td className="px-4 py-4">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              updateStatus(order, "payment_status", e.target.value)
                            }
                            className="h-[42px] rounded-[13px] border border-[#E6EDF5] bg-white px-3 text-xs font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                          >
                            <option>En vérification</option>
                            <option>Payé</option>
                            <option>Refusé</option>
                            <option>Remboursé</option>
                          </select>
                        </td>

                        <td className="px-4 py-4">
                          <select
                            value={order.dossierStatus}
                            onChange={(e) =>
                              updateStatus(order, "dossier_status", e.target.value)
                            }
                            className="h-[42px] rounded-[13px] border border-[#E6EDF5] bg-white px-3 text-xs font-black text-[#123A63] outline-none focus:border-[#F15A24]"
                          >
                            <option>En attente</option>
                            <option>En traitement</option>
                            <option>Documents demandés</option>
                            <option>Terminé</option>
                          </select>
                        </td>

                        <td className="px-4 py-4">
                          <a
                            href={openHref}
                            className="inline-flex h-[42px] min-w-[120px] items-center justify-center rounded-[13px] bg-[#F15A24] px-5 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
                          >
                            Ouvrir
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
