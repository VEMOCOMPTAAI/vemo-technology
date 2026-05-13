"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  created_at: string;
  language: string | null;
  status: string | null;
  payment_status: string | null;
  package_name: string | null;
  jurisdiction: string | null;
  full_company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_e164: string | null;
  total_amount: number | null;
  currency: string | null;
  stripe_payment_intent_id: string | null;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function money(value: number | null, currency: string | null) {
  return `${value || 0} ${currency || "USD"}`;
}

function statusClass(status: string | null) {
  if (status === "paid") return "bg-green-50 text-green-700";
  if (status === "payment_pending") return "bg-amber-50 text-amber-700";
  if (status === "new") return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

async function logoutAdmin() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/connexion";
}

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadOrders() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("llc_orders")
      .select(`
        id,
        created_at,
        language,
        status,
        payment_status,
        package_name,
        jurisdiction,
        full_company_name,
        first_name,
        last_name,
        email,
        phone_e164,
        total_amount,
        currency,
        stripe_payment_intent_id
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage("Erreur lors du chargement des dossiers.");
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return orders;

    return orders.filter((order) => {
      return [
        order.full_company_name,
        order.first_name,
        order.last_name,
        order.email,
        order.phone_e164,
        order.jurisdiction,
        order.payment_status,
        order.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [orders, search]);

  const paidCount = orders.filter((order) => order.payment_status === "paid").length;
  const pendingCount = orders.filter((order) => order.payment_status !== "paid").length;
  const totalRevenue = orders
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#111a33]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-10 py-5">
          <div>
            <p className="text-2xl font-black">Vemo Technology Admin</p>
            <p className="text-sm font-bold text-slate-500">
              Gestion des dossiers LLC
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex gap-3">
            <a
              href="/fr"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black hover:border-[#c51f32]"
            >
              Retour au site
            </a>

            <button
              onClick={logoutAdmin}
              className="rounded-2xl bg-[#111a33] px-5 py-3 text-sm font-black text-white"
            >
              Déconnexion
            </button>
          </div>

          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-10 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">
              Dossiers
            </p>
            <p className="mt-2 text-4xl font-black">{orders.length}</p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">
              Payés
            </p>
            <p className="mt-2 text-4xl font-black text-green-700">{paidCount}</p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">
              CA test
            </p>
            <p className="mt-2 text-4xl font-black text-[#c51f32]">
              ${totalRevenue}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black">Dossiers LLC</h1>
              <p className="mt-1 text-sm font-bold text-slate-500">
                {pendingCount} dossier(s) en attente ou non payé(s)
              </p>
            </div>

            <div className="flex gap-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher..."
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 font-bold outline-none focus:border-[#c51f32] md:w-80"
              />

              <button
                onClick={loadOrders}
                className="rounded-2xl bg-[#111a33] px-5 py-3 font-black text-white"
              >
                Actualiser
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-2xl bg-red-50 px-5 py-4 text-sm font-black text-red-700">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="mt-8 rounded-2xl bg-slate-50 p-8 text-center font-black text-slate-500">
              Chargement des dossiers...
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[1100px] border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs font-black uppercase tracking-wide text-slate-500">
                    <th className="px-4">Date</th>
                    <th className="px-4">Société</th>
                    <th className="px-4">Client</th>
                    <th className="px-4">État</th>
                    <th className="px-4">Formule</th>
                    <th className="px-4">Paiement</th>
                    <th className="px-4">Total</th>
                    <th className="px-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="bg-slate-50">
                      <td className="rounded-l-2xl px-4 py-4 text-sm font-bold text-slate-600">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-black">
                          {order.full_company_name || "-"}
                        </p>
                        <p className="text-xs font-bold text-slate-500">
                          {order.stripe_payment_intent_id || "Aucun PaymentIntent"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-black">
                          {[order.first_name, order.last_name].filter(Boolean).join(" ") || "-"}
                        </p>
                        <p className="text-xs font-bold text-slate-500">
                          {order.email || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-4 font-bold">
                        {order.jurisdiction || "-"}
                      </td>

                      <td className="px-4 py-4 font-bold">
                        {order.package_name || "-"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={[
                            "rounded-full px-3 py-2 text-xs font-black uppercase",
                            statusClass(order.payment_status),
                          ].join(" ")}
                        >
                          {order.payment_status || "pending"}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-black">
                        {money(order.total_amount, order.currency)}
                      </td>

                      <td className="rounded-r-2xl px-4 py-4">
                        <a
                          href={`/admin/dossiers/${order.id}`}
                          className="rounded-xl bg-[#c51f32] px-4 py-3 text-sm font-black text-white"
                        >
                          Ouvrir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="rounded-2xl bg-slate-50 p-8 text-center font-black text-slate-500">
                  Aucun dossier trouvé.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
