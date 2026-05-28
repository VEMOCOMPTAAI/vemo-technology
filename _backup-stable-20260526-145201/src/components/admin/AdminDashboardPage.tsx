
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type Lang = "fr" | "en";

type AdminStats = {
  totalClients: number;
  pendingPayments: number;
  pendingDocuments: number;
  openMessages: number;
};

const copy = {
  fr: {
    title: "Tableau de bord admin",
    subtitle: "Vue d’ensemble des clients, paiements, documents et messages.",
    clients: "Clients",
    pendingPayments: "Paiements à vérifier",
    pendingDocuments: "Documents à contrôler",
    openMessages: "Messages ouverts",
    recentCases: "Dossiers récents",
    pending: "En attente",
    verified: "Vérifié",
    view: "Ouvrir",
    empty: "Aucune donnée connectée pour le moment.",
  },
  en: {
    title: "Admin dashboard",
    subtitle: "Overview of clients, payments, documents and messages.",
    clients: "Clients",
    pendingPayments: "Payments to verify",
    pendingDocuments: "Documents to review",
    openMessages: "Open messages",
    recentCases: "Recent cases",
    pending: "Pending",
    verified: "Verified",
    view: "Open",
    empty: "No connected data yet.",
  },
};

const fallbackStats: AdminStats = {
  totalClients: 0,
  pendingPayments: 0,
  pendingDocuments: 0,
  openMessages: 0,
};

export default function AdminDashboardPage({ lang }: { lang: Lang }) {
  const t = copy[lang];

  const [stats, setStats] = useState<AdminStats>(fallbackStats);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/admin/overview", {
          headers: {
            "x-vemo-admin-session": localStorage.getItem("vemo_admin_session") || "",
          },
        });

        if (!response.ok) {
          setNotice(
            lang === "fr"
              ? "API admin non encore connectée. L’interface est prête, les données seront branchées ensuite."
              : "Admin API is not connected yet. The interface is ready; data will be connected next."
          );
          setLoading(false);
          return;
        }

        const data = await response.json();

        setStats({
          totalClients: Number(data.totalClients || 0),
          pendingPayments: Number(data.pendingPayments || 0),
          pendingDocuments: Number(data.pendingDocuments || 0),
          openMessages: Number(data.openMessages || 0),
        });

        setLoading(false);
      } catch {
        setNotice(
          lang === "fr"
            ? "API admin non encore connectée. L’interface est prête, les données seront branchées ensuite."
            : "Admin API is not connected yet. The interface is ready; data will be connected next."
        );
        setLoading(false);
      }
    }

    loadStats();
  }, [lang]);

  const base = lang === "fr" ? "/fr/admin" : "/en/admin";

  return (
    <AdminShell lang={lang}>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
            Vemo Technology
          </div>

          <h2 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.06em] text-[#2B2F36]">
            {t.title}
          </h2>

          <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
            {t.subtitle}
          </p>
        </div>

        <Link
          href={base + "/dossiers"}
          className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#F15A24] px-6 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)]"
        >
          {lang === "fr" ? "Voir les dossiers" : "View cases"}
        </Link>
      </div>

      {notice ? (
        <div className="mt-8 rounded-[12px] border border-orange-200 bg-[#FFF7F1] px-5 py-4 text-sm font-bold leading-7 text-[#123A63]">
          {notice}
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t.clients} value={loading ? "..." : String(stats.totalClients)} />
        <StatCard title={t.pendingPayments} value={loading ? "..." : String(stats.pendingPayments)} accent />
        <StatCard title={t.pendingDocuments} value={loading ? "..." : String(stats.pendingDocuments)} />
        <StatCard title={t.openMessages} value={loading ? "..." : String(stats.openMessages)} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[16px] border border-[#E8E2DC] bg-white p-7 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl font-black tracking-[-0.04em] text-[#2B2F36]">
              {t.recentCases}
            </h3>
            <Link href={base + "/dossiers"} className="text-sm font-black text-[#F15A24]">
              {t.view} →
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-[12px] border border-[#E8E2DC]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FFF7F1] text-xs font-black uppercase tracking-[0.14em] text-[#123A63]">
                <tr>
                  <th className="px-4 py-4">Client</th>
                  <th className="px-4 py-4">Pack</th>
                  <th className="px-4 py-4">Statut</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["client@email.com", "New Mexico Standard", t.pending],
                  ["founder@email.com", "Wyoming Standard", t.verified],
                  ["order@email.com", "New Mexico Starter", t.pending],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-[#E8E2DC]">
                    <td className="px-4 py-4 font-bold text-[#2B2F36]">{row[0]}</td>
                    <td className="px-4 py-4 font-bold text-[#2B2F36]/62">{row[1]}</td>
                    <td className="px-4 py-4">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-black",
                          row[2] === t.verified
                            ? "bg-[#FFF7F1] text-[#F15A24]"
                            : "bg-orange-50 text-orange-700",
                        ].join(" ")}
                      >
                        {row[2]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={base + "/dossiers"} className="font-black text-[#123A63]">
                        {t.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[16px] border border-[#E8E2DC] bg-white p-7 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
          <h3 className="text-2xl font-black tracking-[-0.04em] text-[#2B2F36]">
            {lang === "fr" ? "Actions prioritaires" : "Priority actions"}
          </h3>

          <div className="mt-6 space-y-4">
            <ActionItem title={t.pendingPayments} href={base + "/paiements"} />
            <ActionItem title={t.pendingDocuments} href={base + "/documents"} />
            <ActionItem title={t.openMessages} href={base + "/messages"} />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function StatCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <article className="rounded-[16px] border border-[#E8E2DC] bg-white p-6 shadow-[0_18px_45px_rgba(43,47,54,0.06)]">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-[#123A63]">
        {title}
      </div>
      <div
        className={[
          "mt-5 text-5xl font-black tracking-[-0.06em]",
          accent ? "text-[#F15A24]" : "text-[#2B2F36]",
        ].join(" ")}
      >
        {value}
      </div>
    </article>
  );
}

function ActionItem({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-[12px] border border-[#E8E2DC] bg-[#FFF7F1] px-5 py-4 text-sm font-black text-[#2B2F36] transition hover:border-[#F15A24] hover:bg-white"
    >
      {title}
      <span className="text-[#F15A24]">→</span>
    </Link>
  );
}
