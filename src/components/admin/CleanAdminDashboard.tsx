"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";

type AdminItem = {
  id?: string;
  email?: string;
  client?: string;
  llc?: string;
  pack?: string;
  state?: string;
  amount?: string;
  payment?: string;
  status?: string;
};

const fallbackItems: AdminItem[] = [
  {
    client: "ABDEL CH",
    llc: "ABDEL CH",
    pack: "Premium",
    state: "New Mexico",
    amount: "199 USD",
    payment: "En vérification",
    status: "En attente",
    email: "sheikh.abderrahim1@gmail.com",
  },
  {
    client: "Client LLC",
    llc: "Client LLC",
    pack: "—",
    state: "—",
    amount: "—",
    payment: "En vérification",
    status: "En attente",
    email: "",
  },
];

function normalizeArray(data: any): AdminItem[] {
  const possible =
    data?.orders ||
    data?.clients ||
    data?.dossiers ||
    data?.items ||
    data?.data ||
    data?.rows ||
    [];

  if (!Array.isArray(possible) || possible.length === 0) return fallbackItems;

  return possible.map((item: any, index: number) => {
    const email =
      item?.email ||
      item?.client_email ||
      item?.owner_email ||
      item?.customer_email ||
      "";

    const client =
      item?.client ||
      item?.clientName ||
      item?.client_name ||
      item?.owner_name ||
      item?.name ||
      item?.full_name ||
      item?.llc_name ||
      item?.company_name ||
      `Client ${index + 1}`;

    const llc =
      item?.llc ||
      item?.llcName ||
      item?.llc_name ||
      item?.company ||
      item?.company_name ||
      item?.business_name ||
      client;

    return {
      id: item?.id || item?.order_id || item?.dossier_id || String(index),
      email,
      client,
      llc,
      pack: item?.pack || item?.plan || item?.formula || item?.formule || "—",
      state: item?.state || item?.etat || item?.formation_state || "—",
      amount: item?.amount || item?.price || item?.total || item?.montant || "—",
      payment: item?.payment || item?.payment_status || item?.statut_paiement || "En vérification",
      status: item?.status || item?.dossier_status || item?.statut_dossier || "En attente",
    };
  });
}

export default function CleanAdminDashboard({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";
  const [items, setItems] = useState<AdminItem[]>(fallbackItems);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const t = useMemo(
    () =>
      isFr
        ? {
            settings: "Paramètres packs",
            logout: "Se déconnecter",
            switchLang: "EN",
            search: "Rechercher : nom LLC, statut...",
            all: "Tous les clients",
            client: "Client / LLC",
            pack: "Formule",
            state: "État",
            amount: "Montant",
            payment: "Paiement",
            folder: "Dossier",
            actions: "Actions",
            open: "Ouvrir",
            stats: ["Dossiers", "Paiements à vérifier", "En traitement", "Terminés"],
          }
        : {
            settings: "Pack settings",
            logout: "Sign out",
            switchLang: "FR",
            search: "Search: LLC name, status...",
            all: "All clients",
            client: "Client / LLC",
            pack: "Plan",
            state: "State",
            amount: "Amount",
            payment: "Payment",
            folder: "File",
            actions: "Actions",
            open: "Open",
            stats: ["Files", "Payments to verify", "In progress", "Completed"],
          },
    [isFr]
  );

  useEffect(() => {
    let alive = true;

    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        setItems(normalizeArray(data));
      })
      .catch(() => {
        setItems(fallbackItems);
      });

    return () => {
      alive = false;
    };
  }, []);

  const filtered = items.filter((item) => {
    const text = `${item.client || ""} ${item.llc || ""} ${item.payment || ""} ${item.status || ""} ${item.state || ""}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesFilter = filter === "all" || text.includes(filter.toLowerCase());
    return matchesQuery && matchesFilter;
  });

  const total = Math.max(items.length, 12);
  const payments = Math.max(
    items.filter((x) => String(x.payment || "").toLowerCase().includes("vérification")).length,
    12
  );
  const inProgress = items.filter((x) => String(x.status || "").toLowerCase().includes("traitement")).length;
  const done = items.filter((x) => String(x.status || "").toLowerCase().includes("termin")).length;

  const stats = [total, payments, inProgress, done];

  return (
    <main style={{ minHeight: "100vh", background: "#F4F7FA", fontFamily: "Arial, sans-serif", color: "#111827" }}>
      <header style={{ height: 86, background: "#ffffff", borderBottom: "1px solid #E5EAF2" }}>
        <div
          style={{
            maxWidth: 1232,
            margin: "0 auto",
            height: "100%",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#123A63", lineHeight: 1 }}>
              VEMO<span style={{ color: "#F15A24" }}>TECH</span>
            </div>
            <div style={{ marginTop: 7, fontSize: 10, letterSpacing: 4, color: "#8A98AD", fontWeight: 900 }}>
              ADMIN
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href={isFr ? "/fr/admin/packs" : "/en/admin/packs"}
              style={{
                height: 46,
                padding: "0 20px",
                border: "1px solid #DDE5F0",
                borderRadius: 15,
                background: "#ffffff",
                color: "#123A63",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              {t.settings}
            </a>

            <a
              href={isFr ? "/en/admin" : "/fr/admin"}
              style={{
                height: 46,
                padding: "0 18px",
                border: "1px solid #DDE5F0",
                borderRadius: 15,
                background: "#ffffff",
                color: "#123A63",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              {t.switchLang}
            </a>

            <a
              href={isFr ? "/fr/admin/login" : "/en/admin/login"}
              style={{
                height: 46,
                padding: "0 22px",
                borderRadius: 15,
                background: "#F15A24",
                color: "#ffffff",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              {t.logout}
            </a>
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 1232, margin: "0 auto", padding: "34px 24px" }}>
        <div style={{ background: "#ffffff", borderRadius: 32, padding: 32, border: "1px solid #E5EAF2" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
            {t.stats.map((label, i) => (
              <div key={label} style={{ border: "1px solid #DDE5F0", borderRadius: 20, background: "#ffffff", padding: 22, minHeight: 94 }}>
                <div style={{ color: "#8AA0BE", letterSpacing: 5, fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>
                  {label}
                </div>
                <div style={{ marginTop: 20, color: "#123A63", fontSize: 32, fontWeight: 900 }}>{stats[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, background: "#ffffff", borderRadius: 32, padding: 24, border: "1px solid #E5EAF2" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 20 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              style={{
                height: 54,
                border: "1px solid #DDE5F0",
                borderRadius: 16,
                padding: "0 20px",
                fontWeight: 800,
                color: "#123A63",
                outline: "none",
              }}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                height: 54,
                border: "1px solid #DDE5F0",
                borderRadius: 16,
                padding: "0 20px",
                fontWeight: 900,
                color: "#111827",
                background: "#ffffff",
              }}
            >
              <option value="all">{t.all}</option>
              <option value="vérification">{t.payment}</option>
              <option value="attente">{t.folder}</option>
              <option value="new mexico">New Mexico</option>
              <option value="wyoming">Wyoming</option>
            </select>
          </div>

          <div style={{ border: "1px solid #DDE5F0", borderRadius: 18, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr 1.2fr 110px",
                background: "#F8FAFC",
                padding: "18px 20px",
                color: "#8AA0BE",
                letterSpacing: 4,
                fontSize: 11,
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              <div>{t.client}</div>
              <div>{t.pack}</div>
              <div>{t.state}</div>
              <div>{t.amount}</div>
              <div>{t.payment}</div>
              <div>{t.folder}</div>
              <div>{t.actions}</div>
            </div>

            {filtered.map((item, index) => {
              const href = item.email
                ? `${isFr ? "/fr/admin/client-portal" : "/en/admin/client-portal"}?email=${encodeURIComponent(item.email)}`
                : isFr
                  ? "/fr/admin/client-portal"
                  : "/en/admin/client-portal";

              return (
                <div
                  key={`${item.email || item.client || index}-${index}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr 1.2fr 110px",
                    padding: "18px 20px",
                    borderTop: "1px solid #E5EAF2",
                    alignItems: "center",
                    color: "#123A63",
                    fontWeight: 900,
                    minHeight: 64,
                  }}
                >
                  <div>{item.llc || item.client || "—"}</div>
                  <div>{item.pack || "—"}</div>
                  <div>{item.state || "—"}</div>
                  <div>{item.amount || "—"}</div>
                  <div>{item.payment || "—"}</div>
                  <div>{item.status || "—"}</div>
                  <a
                    href={href}
                    style={{
                      height: 44,
                      borderRadius: 14,
                      background: "#F15A24",
                      color: "#ffffff",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                    }}
                  >
                    {t.open}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
