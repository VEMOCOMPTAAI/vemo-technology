"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = Record<string, any>;

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function FieldCard({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words font-black text-[#111a33]">
        {value === null || value === undefined || value === "" ? "-" : String(value)}
      </p>
    </div>
  );
}

export default function AdminOrderDetail() {
  const params = useParams();
  const id = String(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadOrder() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("llc_orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setErrorMessage("Impossible de charger ce dossier.");
      setLoading(false);
      return;
    }

    setOrder(data);
    setLoading(false);
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#111a33]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-10 py-5">
          <div>
            <p className="text-2xl font-black">Détail dossier LLC</p>
            <p className="text-sm font-bold text-slate-500">
              Vemo Technology Admin
            </p>
          </div>

          <a
            href="/admin/dossiers"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black hover:border-[#c51f32]"
          >
            Retour dossiers
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-10 py-10">
        {loading && (
          <div className="rounded-[2rem] bg-white p-8 text-center font-black shadow-sm">
            Chargement du dossier...
          </div>
        )}

        {errorMessage && (
          <div className="rounded-[2rem] bg-red-50 p-8 font-black text-red-700">
            {errorMessage}
          </div>
        )}

        {order && (
          <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#c51f32]">
                    Dossier
                  </p>

                  <h1 className="mt-3 text-4xl font-black">
                    {order.full_company_name || "Sans nom"}
                  </h1>

                  <p className="mt-2 text-sm font-bold text-slate-500">
                    Créé le {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-5 py-4 text-right">
                  <p className="text-xs font-black uppercase text-slate-500">
                    Paiement
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#c51f32]">
                    {order.payment_status || "pending"}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-black">Client</h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <FieldCard label="Prénom" value={order.first_name} />
                  <FieldCard label="Nom" value={order.last_name} />
                  <FieldCard label="Email" value={order.email} />
                  <FieldCard label="Téléphone" value={order.phone_e164} />
                  <FieldCard label="Pays résidence" value={order.residence_country} />
                  <FieldCard label="Langue" value={order.language} />
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-black">Société</h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <FieldCard label="Nom société" value={order.company_name} />
                  <FieldCard label="Nom complet" value={order.full_company_name} />
                  <FieldCard label="Type entité" value={order.entity_type} />
                  <FieldCard label="État" value={order.jurisdiction} />
                  <FieldCard label="Formule" value={order.package_name} />
                  <FieldCard label="Management" value={order.management_type} />
                  <FieldCard label="Public listing" value={order.public_listing} />
                  <FieldCard label="Activité" value={order.business_activity} />
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-black">Membre / Manager</h2>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <FieldCard label="Prénom" value={order.member_first_name} />
                  <FieldCard label="Nom" value={order.member_last_name} />
                  <FieldCard label="Pays" value={order.member_country} />
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-black">Message</h2>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 font-bold leading-7 text-slate-700">
                  {order.message || "Aucun message."}
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black">Résumé paiement</h2>

              <div className="mt-6 space-y-5">
                <div className="flex justify-between gap-5">
                  <p className="font-bold text-slate-600">Service</p>
                  <p className="font-black">${order.service_fee || 0}</p>
                </div>

                <div className="flex justify-between gap-5">
                  <p className="font-bold text-slate-600">Frais État</p>
                  <p className="font-black">${order.state_fee || 0}</p>
                </div>

                <div className="flex justify-between gap-5">
                  <p className="font-bold text-slate-600">Options</p>
                  <p className="font-black">${order.options_fee || 0}</p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5">
                  <div className="flex justify-between gap-5">
                    <p className="text-xl font-black">Total</p>
                    <p className="text-2xl font-black text-[#c51f32]">
                      ${order.total_amount || 0}
                    </p>
                  </div>
                </div>

                <FieldCard
                  label="Stripe PaymentIntent"
                  value={order.stripe_payment_intent_id}
                />

                <FieldCard label="Statut dossier" value={order.status} />
                <FieldCard label="Statut paiement" value={order.payment_status} />
              </div>

              <button
                onClick={loadOrder}
                className="mt-8 w-full rounded-2xl bg-[#111a33] px-5 py-4 font-black text-white"
              >
                Actualiser
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
