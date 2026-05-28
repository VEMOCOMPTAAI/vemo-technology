
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

type Lang = "fr" | "en";
type Row = Record<string, any>;

function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}

function formatDate(value: any) {
  if (!value) return "-";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function display(value: any) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function money(amount: any, currency = "USD") {
  const number = Number(amount || 0);

  if (!Number.isFinite(number) || number <= 0) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(number);
}

function statusLabel(status: any, isFr: boolean) {
  const s = String(status || "").toLowerCase();

  const map: Record<string, string> = {
    active: isFr ? "Actif" : "Active",
    created: isFr ? "Créé" : "Created",
    in_progress: isFr ? "En cours" : "In progress",
    pending: isFr ? "En attente" : "Pending",
    pending_verification: isFr ? "À vérifier" : "To verify",
    verified: isFr ? "Vérifié" : "Verified",
    approved: isFr ? "Approuvé" : "Approved",
    available: isFr ? "Disponible" : "Available",
    open: isFr ? "Ouvert" : "Open",
    sent: isFr ? "Envoyé" : "Sent",
    closed: isFr ? "Traité" : "Closed",
  };

  return map[s] || display(status);
}

function docTitle(row: Row) {
  return display(row.title || row.file_name || row.filename || row.document_type || "Document");
}

export default function ClientPortalOperationalPage({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [warning, setWarning] = useState("");
  const [notice, setNotice] = useState("");

  const [orders, setOrders] = useState<Row[]>([]);
  const [documents, setDocuments] = useState<Row[]>([]);
  const [messages, setMessages] = useState<Row[]>([]);
  const [payments, setPayments] = useState<Row[]>([]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const latestOrder = useMemo(() => orders[0] || null, [orders]);

  async function getAccessToken() {
    const supabase = getSupabaseBrowser();

    if (!supabase) return "";

    const { data } = await supabase.auth.getSession();

    return data?.session?.access_token || "";
  }

  async function load() {
    setLoading(true);
    setWarning("");
    setNotice("");

    const supabase = getSupabaseBrowser();

    if (!supabase) {
      setWarning(isFr ? "Configuration Supabase manquante." : "Missing Supabase configuration.");
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    setAuthenticated(true);

    try {
      const response = await fetch("/api/client-portal/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setWarning(data?.message || (isFr ? "Impossible de charger l’espace client." : "Unable to load client portal."));
        setLoading(false);
        return;
      }

      setEmail(data.email || "");
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setDocuments(Array.isArray(data.documents) ? data.documents : []);
      setMessages(Array.isArray(data.messages) ? data.messages : []);
      setPayments(Array.isArray(data.payments) ? data.payments : []);

      setLoading(false);
    } catch {
      setWarning(isFr ? "Impossible de charger l’espace client." : "Unable to load client portal.");
      setLoading(false);
    }
  }

  async function sendMessage() {
    setNotice("");
    setWarning("");

    if (!message.trim()) {
      setWarning(isFr ? "Le message est obligatoire." : "Message is required.");
      return;
    }

    setSending(true);

    try {
      const token = await getAccessToken();

      if (!token) {
        setWarning(isFr ? "Session expirée. Reconnectez-vous." : "Session expired. Please log in again.");
        setSending(false);
        return;
      }

      const response = await fetch("/api/client-portal/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setWarning(data?.message || (isFr ? "Message non envoyé." : "Message not sent."));
        setSending(false);
        return;
      }

      setSubject("");
      setMessage("");
      setNotice(isFr ? "Message envoyé à Vemo." : "Message sent to Vemo.");
      setSending(false);
      await load();
    } catch {
      setWarning(isFr ? "Message non envoyé." : "Message not sent.");
      setSending(false);
    }
  }

  async function logout() {
    const supabase = getSupabaseBrowser();
    await supabase?.auth.signOut();
    window.location.href = isFr ? "/fr/connexion" : "/en/connexion";
  }

  useEffect(() => {
    load();
  }, []);

  const loginHref = isFr ? "/fr/connexion" : "/en/connexion";
  const startHref = isFr ? "/fr/commencer" : "/en/commencer";

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <SiteHeader lang={lang} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto max-w-7xl px-6 py-14">
          {loading ? (
            <Centered
              eyebrow={isFr ? "Chargement" : "Loading"}
              title={isFr ? "Chargement de votre espace..." : "Loading your portal..."}
              text={isFr ? "Merci de patienter quelques secondes." : "Please wait a few seconds."}
            />
          ) : !authenticated ? (
            <Centered
              eyebrow={isFr ? "Accès sécurisé" : "Secure access"}
              title={isFr ? "Connexion requise" : "Login required"}
              text={isFr ? "Connectez-vous pour accéder à vos dossiers, documents et messages." : "Log in to access your cases, documents and messages."}
              actions={
                <>
                  <Link href={loginHref} className="rounded-[8px] bg-[#F15A24] px-7 py-4 text-sm font-black text-white">
                    {isFr ? "Se connecter" : "Log in"}
                  </Link>

                  <Link href={startHref} className="rounded-[8px] border border-[#123A63] bg-white px-7 py-4 text-sm font-black text-[#123A63]">
                    {isFr ? "Nouveau dossier" : "New case"}
                  </Link>
                </>
              }
            />
          ) : (
            <>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
                    {isFr ? "Espace client" : "Client portal"}
                  </div>

                  <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.06em]">
                    {isFr ? "Votre espace Vemo." : "Your Vemo portal."}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
                    {email}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={load}
                    className="h-12 rounded-[8px] border border-[#E8E2DC] bg-white px-6 text-sm font-black text-[#123A63]"
                  >
                    {isFr ? "Actualiser" : "Refresh"}
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="h-12 rounded-[8px] bg-[#F15A24] px-6 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)]"
                  >
                    {isFr ? "Déconnexion" : "Log out"}
                  </button>
                </div>
              </div>

              {warning ? (
                <Alert tone="warning">{warning}</Alert>
              ) : null}

              {notice ? (
                <Alert tone="success">{notice}</Alert>
              ) : null}

              <div className="mt-8 grid gap-5 md:grid-cols-4">
                <Metric title={isFr ? "Dossiers" : "Cases"} value={orders.length} />
                <Metric title={isFr ? "Documents" : "Documents"} value={documents.length} />
                <Metric title={isFr ? "Messages" : "Messages"} value={messages.length} />
                <Metric title={isFr ? "Paiements" : "Payments"} value={payments.length} />
              </div>

              <section className="mt-8 rounded-[16px] border border-[#E8E2DC] bg-white p-7 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
                      {isFr ? "Dossier principal" : "Main case"}
                    </div>

                    <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#2B2F36]">
                      {latestOrder
                        ? display(latestOrder.company_name || latestOrder.package_name || "LLC")
                        : isFr ? "Aucun dossier créé" : "No case created"}
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/65">
                      {latestOrder
                        ? [
                            display(latestOrder.package_name),
                            display(latestOrder.state),
                            statusLabel(latestOrder.status, isFr),
                          ].filter((x) => x !== "-").join(" · ")
                        : isFr
                          ? "Votre dossier apparaîtra ici après validation du paiement ou création manuelle par Vemo."
                          : "Your case will appear here after payment validation or manual creation by Vemo."}
                    </p>
                  </div>

                  {latestOrder ? (
                    <div className="min-w-[220px] rounded-[14px] bg-[#FFF7F1] p-5">
                      <div className="text-xs font-black uppercase tracking-[0.14em] text-[#123A63]">
                        {isFr ? "Progression" : "Progress"}
                      </div>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-[#F15A24]"
                          style={{ width: Math.min(100, Math.max(0, Number(latestOrder.progress || 0))) + "%" }}
                        />
                      </div>

                      <div className="mt-3 text-2xl font-black text-[#F15A24]">
                        {Number(latestOrder.progress || 0)}%
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <DataCard
                  title={isFr ? "Mes dossiers" : "My cases"}
                  rows={orders}
                  empty={isFr ? "Aucun dossier pour le moment." : "No cases yet."}
                  render={(row) => (
                    <PortalItem
                      title={display(row.company_name || row.package_name || "LLC")}
                      subtitle={[
                        display(row.state),
                        display(row.entity_type),
                        statusLabel(row.status, isFr),
                      ].filter((x) => x !== "-").join(" · ")}
                      date={formatDate(row.created_at)}
                      badge={row.progress ? String(row.progress) + "%" : statusLabel(row.status, isFr)}
                    />
                  )}
                />

                <DataCard
                  title={isFr ? "Mes paiements" : "My payments"}
                  rows={payments}
                  empty={isFr ? "Aucun paiement pour le moment." : "No payments yet."}
                  render={(row) => (
                    <PortalItem
                      title={money(row.amount, row.currency || "USD")}
                      subtitle={[
                        display(row.payment_method),
                        statusLabel(row.payment_status || row.status, isFr),
                      ].filter((x) => x !== "-").join(" · ")}
                      date={formatDate(row.created_at)}
                      badge={statusLabel(row.status, isFr)}
                    />
                  )}
                />

                <DataCard
                  title={isFr ? "Mes documents" : "My documents"}
                  rows={documents}
                  empty={isFr ? "Aucun document pour le moment." : "No documents yet."}
                  render={(row) => {
                    const url = String(row.signed_url || row.file_url || "");

                    return (
                      <PortalItem
                        title={docTitle(row)}
                        subtitle={display(row.document_type || row.notes)}
                        date={formatDate(row.created_at)}
                        badge={statusLabel(row.status, isFr)}
                        actions={
                          url ? (
                            <>
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-[8px] border border-[#123A63] bg-white px-4 py-2 text-xs font-black text-[#123A63]"
                              >
                                {isFr ? "Visionner" : "View"}
                              </a>

                              <a
                                href={url}
                                download
                                className="rounded-[8px] bg-[#F15A24] px-4 py-2 text-xs font-black text-white"
                              >
                                {isFr ? "Télécharger" : "Download"}
                              </a>
                            </>
                          ) : (
                            <span className="rounded-[8px] bg-white px-4 py-2 text-xs font-black text-[#2B2F36]/50">
                              {isFr ? "Fichier indisponible" : "File unavailable"}
                            </span>
                          )
                        }
                      />
                    );
                  }}
                />

                <section className="rounded-[16px] border border-[#E8E2DC] bg-white p-7 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black tracking-[-0.04em] text-[#2B2F36]">
                        {isFr ? "Mes messages" : "My messages"}
                      </h2>

                      <p className="mt-2 text-sm font-semibold leading-7 text-[#2B2F36]/62">
                        {isFr
                          ? "Échangez directement avec l’équipe Vemo."
                          : "Exchange directly with the Vemo team."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[12px] border border-[#E8E2DC] bg-[#FFF7F1] p-5">
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={isFr ? "Objet optionnel" : "Optional subject"}
                      className="h-12 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold outline-none focus:border-[#F15A24]"
                    />

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isFr ? "Votre message..." : "Your message..."}
                      className="mt-3 min-h-[110px] w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 py-3 text-sm font-bold leading-7 outline-none focus:border-[#F15A24]"
                    />

                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={sending}
                      className="mt-3 h-12 w-full rounded-[8px] bg-[#F15A24] px-6 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)] disabled:bg-slate-300"
                    >
                      {sending
                        ? isFr ? "Envoi..." : "Sending..."
                        : isFr ? "Envoyer le message" : "Send message"}
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {messages.length === 0 ? (
                      <p className="rounded-[10px] bg-[#FFF7F1] p-5 text-sm font-bold leading-7 text-[#2B2F36]/65">
                        {isFr ? "Aucun message pour le moment." : "No messages yet."}
                      </p>
                    ) : (
                      messages.slice(0, 12).map((row, index) => (
                        <PortalItem
                          key={row.id || index}
                          title={display(row.subject || row.sender || "Message")}
                          subtitle={display(row.message)}
                          date={formatDate(row.created_at)}
                          badge={statusLabel(row.status, isFr)}
                        />
                      ))
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <article className="rounded-[14px] border border-[#E8E2DC] bg-white p-6 shadow-[0_18px_45px_rgba(43,47,54,0.06)]">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-[#123A63]">
        {title}
      </div>

      <div className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#F15A24]">
        {value}
      </div>
    </article>
  );
}

function DataCard({
  title,
  rows,
  empty,
  render,
}: {
  title: string;
  rows: Row[];
  empty: string;
  render: (row: Row, index: number) => React.ReactNode;
}) {
  return (
    <section className="rounded-[16px] border border-[#E8E2DC] bg-white p-7 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
      <h2 className="text-2xl font-black tracking-[-0.04em] text-[#2B2F36]">
        {title}
      </h2>

      {rows.length === 0 ? (
        <p className="mt-5 rounded-[10px] bg-[#FFF7F1] p-5 text-sm font-bold leading-7 text-[#2B2F36]/65">
          {empty}
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {rows.slice(0, 12).map((row, index) => (
            <div key={row.id || index}>
              {render(row, index)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PortalItem({
  title,
  subtitle,
  date,
  badge,
  actions,
}: {
  title: string;
  subtitle: string;
  date: string;
  badge?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-[#E8E2DC] bg-[#FFF7F1] p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="text-base font-black text-[#123A63]">
            {title}
          </div>

          <div className="mt-2 text-sm font-semibold leading-7 text-[#2B2F36]/68">
            {subtitle}
          </div>

          <div className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-[#2B2F36]/45">
            {date}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {badge ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#F15A24]">
              {badge}
            </span>
          ) : null}

          {actions}
        </div>
      </div>
    </div>
  );
}

function Alert({ children, tone }: { children: React.ReactNode; tone: "warning" | "success" }) {
  return (
    <div
      className={[
        "mt-8 rounded-[12px] border px-5 py-4 text-sm font-bold leading-7",
        tone === "success"
          ? "border-orange-200 bg-white text-[#123A63]"
          : "border-orange-200 bg-[#FFF7F1] text-[#123A63]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Centered({
  eyebrow,
  title,
  text,
  actions,
}: {
  eyebrow: string;
  title: string;
  text: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-[16px] border border-[#E8E2DC] bg-white p-10 text-center shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
      <div className="text-xs font-black uppercase tracking-[0.22em] text-[#F15A24]">
        {eyebrow}
      </div>

      <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-[#2B2F36]">
        {title}
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
        {text}
      </p>

      {actions ? <div className="mt-8 flex justify-center gap-3">{actions}</div> : null}
    </div>
  );
}
