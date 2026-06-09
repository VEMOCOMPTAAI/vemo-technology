"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";
type Tab = "overview" | "documents" | "services" | "messages" | "account";

type Props = {
  lang: Lang;
  email?: string;
  tab?: Tab;
};

type DocItem = {
  id?: string;
  name?: string;
  filename?: string;
  title?: string;
  url?: string;
  file_url?: string;
  created_at?: string;
  uploaded_at?: string;
};

type ServiceItem = {
  id?: string;
  name?: string;
  nameFr?: string;
  nameEn?: string;
  status?: string;
  statusFr?: string;
  statusEn?: string;
  value?: string;
  expiresAt?: string;
  expiration?: string;
  renewalDueAt?: string;
  renewal?: string;
};

type MessageItem = {
  id?: string;
  subject?: string;
  message?: string;
  body?: string;
  from?: string;
  created_at?: string;
  createdAt?: string;
};

function cleanEmail(email?: string) {
  return email && email.includes("@") ? email : "sheikh.abderrahim1@gmail.com";
}

function normalizeTab(value?: string): Tab {
  if (value === "documents" || value === "services" || value === "messages" || value === "account") return value;
  return "overview";
}

function safeDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR");
}

export default function ClientPortalWorkspace({ lang, email, tab = "overview" }: Props) {
  const isFr = lang === "fr";
  const activeTab = normalizeTab(tab);
  const clientEmail = cleanEmail(email);

  const [status, setStatus] = useState<any>(null);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [account, setAccount] = useState<{ name: string; email: string; passwordUpdatedAt?: string | null }>({
    name: "Client VEMO",
    email: clientEmail,
    passwordUpdatedAt: null,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const basePath = isFr ? "/fr/espace-client" : "/en/client-portal";
  const oppositePath = isFr ? "/en/client-portal" : "/fr/espace-client";

  const hrefFor = (nextTab?: Tab) => {
    const params = new URLSearchParams();
    params.set("email", clientEmail);
    if (nextTab && nextTab !== "overview") params.set("tab", nextTab);
    return `${basePath}?${params.toString()}`;
  };

  const switchHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("email", clientEmail);
    if (activeTab !== "overview") params.set("tab", activeTab);
    return `${oppositePath}?${params.toString()}`;
  }, [activeTab, clientEmail, oppositePath]);

  const t = isFr
    ? {
        subtitle: "US LLC pour non-résidents",
        home: "Statut",
        documents: "Documents",
        services: "Mes services",
        messages: "Messages",
        account: "Mon compte",
        lang: "EN",
        logout: "Se déconnecter",
        progress: "Suivi",
        statusTitle: "État de mon dossier",
        payment: "Paiement",
        file: "Dossier",
        currentStep: "Étape actuelle",
        paymentValue: "En vérification",
        fileValue: "En attente",
        stepValue: "Réception du dossier",
        documentsTitle: "Documents",
        noDocuments: "Aucun document disponible pour le moment.",
        open: "Ouvrir",
        servicesTitle: "Mes services",
        noServices: "Aucun service ajouté pour le moment.",
        expiration: "Expiration",
        renewal: "Renouvellement",
        messagesTitle: "Messages",
        reply: "Répondre à VEMO",
        subject: "Objet",
        message: "Votre message...",
        send: "Envoyer",
        noMessages: "Aucun message disponible.",
        accountTitle: "Mon compte",
        accountText: "Gérez l’accès à votre espace client.",
        name: "Nom",
        email: "Email",
        readonly: "Non modifiable",
        password: "Mot de passe",
        currentPassword: "Mot de passe actuel",
        newPassword: "Nouveau mot de passe",
        confirmPassword: "Confirmation du mot de passe",
        updatePassword: "Mettre à jour le mot de passe",
        passwordUpdated: "Mot de passe mis à jour.",
        passwordError: "Vérifiez les informations saisies.",
        accountTitle: "Mon compte",
        accountText: "Gérez l’accès à votre espace client.",
        name: "Nom",
        email: "Email",
        readonly: "Non modifiable",
        password: "Mot de passe",
        currentPassword: "Mot de passe actuel",
        newPassword: "Nouveau mot de passe",
        confirmPassword: "Confirmation du mot de passe",
        updatePassword: "Mettre à jour le mot de passe",
        passwordUpdated: "Mot de passe mis à jour.",
        passwordError: "Vérifiez les informations saisies.",
      }
    : {
        subtitle: "US LLC for non-residents",
        home: "Status",
        documents: "Documents",
        services: "My services",
        messages: "Messages",
        account: "My account",
        lang: "FR",
        logout: "Sign out",
        progress: "Progress",
        statusTitle: "My file status",
        payment: "Payment",
        file: "File",
        currentStep: "Current step",
        paymentValue: "Under review",
        fileValue: "Pending",
        stepValue: "File received",
        documentsTitle: "Documents",
        noDocuments: "No document available yet.",
        open: "Open",
        servicesTitle: "My services",
        noServices: "No service added yet.",
        expiration: "Expiration",
        renewal: "Renewal",
        messagesTitle: "Messages",
        reply: "Reply to VEMO",
        subject: "Subject",
        message: "Your message...",
        send: "Send",
        noMessages: "No message available.",
        accountTitle: "My account",
        accountText: "Manage access to your client portal.",
        name: "Name",
        email: "Email",
        readonly: "Read only",
        password: "Password",
        currentPassword: "Current password",
        newPassword: "New password",
        confirmPassword: "Confirm password",
        updatePassword: "Update password",
        passwordUpdated: "Password updated.",
        passwordError: "Please check the information entered.",
        accountTitle: "My account",
        accountText: "Manage access to your client portal.",
        name: "Name",
        email: "Email",
        readonly: "Read only",
        password: "Password",
        currentPassword: "Current password",
        newPassword: "New password",
        confirmPassword: "Confirm password",
        updatePassword: "Update password",
        passwordUpdated: "Password updated.",
        passwordError: "Please check the information entered.",
      };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [statusRes, docsRes, servicesRes, messagesRes, accountRes] = await Promise.all([
          fetch(`/api/client-portal/status?email=${encodeURIComponent(clientEmail)}`, { cache: "no-store" }),
          fetch(`/api/client-portal/documents?email=${encodeURIComponent(clientEmail)}`, { cache: "no-store" }),
          fetch(`/api/client-portal/services?email=${encodeURIComponent(clientEmail)}`, { cache: "no-store" }),
          fetch(`/api/client-portal/messages?email=${encodeURIComponent(clientEmail)}`, { cache: "no-store" }),
          fetch(`/api/client-portal/account?email=${encodeURIComponent(clientEmail)}`, { cache: "no-store" }),
          fetch(`/api/client-portal/account?email=${encodeURIComponent(clientEmail)}`, { cache: "no-store" }),
        ]);

        const statusJson = await statusRes.json().catch(() => null);
        const docsJson = await docsRes.json().catch(() => null);
        const servicesJson = await servicesRes.json().catch(() => null);
        const messagesJson = await messagesRes.json().catch(() => null);
        const accountJson = await accountRes.json().catch(() => null);

        if (cancelled) return;

        setStatus(statusJson?.status || statusJson || null);
        setDocuments(Array.isArray(docsJson?.documents) ? docsJson.documents : Array.isArray(docsJson) ? docsJson : []);
        setServices(Array.isArray(servicesJson?.services) ? servicesJson.services : Array.isArray(servicesJson) ? servicesJson : []);
        setMessages(Array.isArray(messagesJson?.messages) ? messagesJson.messages : Array.isArray(messagesJson) ? messagesJson : []);
        if (accountJson?.account) {
          setAccount(accountJson.account);
        }
        if (accountJson?.account) {
          setAccount(accountJson.account);
        }
      } catch {
        if (!cancelled) {
          setStatus(null);
          setDocuments([]);
          setServices([]);
          setMessages([]);
        }
      }
    }

    load();

    
  const IconOpen = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6" />
      <path d="M10 14L20 4" />
      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
    </svg>
  );

  const IconDownload = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );

return () => {
      cancelled = true;
    };
  }, [clientEmail]);

  async function sendMessage() {
    if (!subject.trim() && !message.trim()) return;

    const localMessage = {
      id: `local-${Date.now()}`,
      subject,
      message,
      from: "client",
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch("/api/client-portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clientEmail, subject, message }),
      });
    } catch {}

    setMessages((old) => [localMessage, ...old]);
    setSubject("");
    setMessage("");
  }

  function logout() {
    localStorage.removeItem("vemo_client_email");
    localStorage.removeItem("vemoClientEmail");
    localStorage.removeItem("clientEmail");
    localStorage.removeItem("email");
    window.location.href = isFr ? "/fr" : "/en";
  }

  async function updatePassword() {
    setAccountMessage("");

    if (!currentPassword || !newPassword || !confirmPassword || newPassword.length < 8 || newPassword !== confirmPassword) {
      setAccountMessage(t.passwordError);
      return;
    }

    try {
      const res = await fetch("/api/client-portal/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: clientEmail,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setAccountMessage(t.passwordError);
        return;
      }

      if (json.account) {
        setAccount(json.account);
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAccountMessage(t.passwordUpdated);
    } catch {
      setAccountMessage(t.passwordError);
    }
  }

  const paymentLabel = status?.payment_status || status?.paymentStatus || status?.payment || t.paymentValue;
  const fileLabel = status?.dossier_status || status?.file_status || status?.fileStatus || status?.file || t.fileValue;
  const stepLabel = status?.current_step || status?.currentStep || status?.step || t.stepValue;

  return (
    <main className="min-h-screen bg-[#F3F7FB] pb-12 text-[#111827]">
      <header className="vemo-client-header sticky top-0 z-50 border-b border-[#E6EDF5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between px-6">
          <Link href={hrefFor("overview")} className="leading-none">
            <div className="text-[22px] font-black tracking-[-0.04em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[9px] font-black uppercase tracking-[0.38em] text-[#64748B]">
              {t.subtitle}
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-black md:flex">
            <Link href={hrefFor("overview")} className={activeTab === "overview" ? "text-[#F15A24]" : "text-[#111827]"}>
              {t.home}
            </Link>
            <Link href={hrefFor("documents")} className={activeTab === "documents" ? "text-[#F15A24]" : "text-[#111827]"}>
              {t.documents}
            </Link>
            <Link href={hrefFor("services")} className={activeTab === "services" ? "text-[#F15A24]" : "text-[#111827]"}>
              {t.services}
            </Link>
            <Link href={hrefFor("messages")} className={activeTab === "messages" ? "text-[#F15A24]" : "text-[#111827]"}>
              {t.messages}
            </Link>
            <Link href={hrefFor("account")} className={activeTab === "account" ? "text-[#F15A24]" : "text-[#111827]"}>
              {t.account}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href={switchHref} className="rounded-[14px] border border-[#DDE7F2] bg-white px-5 py-3 text-sm font-black text-[#111827]">
              {t.lang}
            </Link>
            <button type="button" onClick={logout} className="inline-flex h-9 items-center justify-center rounded-[10px] bg-[#F15A24] px-4 text-xs font-black text-white">
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-10 max-w-5xl px-6">

        {activeTab === "overview" && (
          <section className="mt-6 rounded-[28px] bg-white p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
              {t.progress}
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
              {t.statusTitle}
            </h2>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                [t.payment, paymentLabel],
                [t.file, fileLabel],
                [t.currentStep, stepLabel],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
                    {label}
                  </p>
                  <p className="mt-4 text-sm font-black text-[#123A63]">{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "documents" && (
          <section className="mt-6 rounded-[28px] bg-white p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
                  {t.documents}
                </p>
                <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                  {t.documentsTitle}
                </h2>
              </div>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#F15A24] px-2 text-xs font-black text-white">
                {documents.length}
              </span>
            </div>

            <div className="mt-7 grid gap-3">
              {documents.length ? (
                documents.map((doc, index) => {
                  const name = doc.name || doc.title || doc.filename || `Document ${index + 1}`;
                  const url = doc.url || doc.file_url || "#";

                  return (
                    <div key={doc.id || index} className="flex items-center justify-between rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
                      <div>
                        <p className="text-sm font-black text-[#123A63]">{name}</p>
                        <p className="mt-1 text-xs font-bold text-[#64748B]">
                          {safeDate(doc.uploaded_at || doc.created_at)}
                        </p>
                      </div>
                      <a href={url} target="_blank" rel="noreferrer" className="rounded-[12px] bg-[#F15A24] px-4 py-3 text-xs font-black text-white">
                        {t.open}
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] p-5 text-sm font-black text-[#64748B]">
                  {t.noDocuments}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "services" && (
          <section className="mt-6 rounded-[28px] bg-white p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
                  {t.services}
                </p>
                <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                  {t.servicesTitle}
                </h2>
              </div>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#F15A24] px-2 text-xs font-black text-white">
                {services.length}
              </span>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {services.length ? (
                services.map((service, index) => {
                  const name = isFr
                    ? service.nameFr || service.name || service.nameEn || `Service ${index + 1}`
                    : service.nameEn || service.name || service.nameFr || `Service ${index + 1}`;

                  const statusLabel = isFr
                    ? service.statusFr || service.status || service.statusEn || "—"
                    : service.statusEn || service.status || service.statusFr || "—";

                  return (
                    <div key={service.id || index} className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-black text-[#123A63]">{name}</h3>
                          <p className="mt-2 text-sm font-bold text-[#64748B]">{service.value || "—"}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#F15A24]">
                          {statusLabel}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[14px] border border-[#DDE7F2] bg-white p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8AA0BC]">
                            {t.expiration}
                          </p>
                          <p className="mt-2 text-sm font-black text-[#123A63]">
                            {safeDate(service.expiresAt || service.expiration)}
                          </p>
                        </div>
                        <div className="rounded-[14px] border border-[#DDE7F2] bg-white p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8AA0BC]">
                            {t.renewal}
                          </p>
                          <p className="mt-2 text-sm font-black text-[#123A63]">
                            {safeDate(service.renewalDueAt || service.renewal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] p-5 text-sm font-black text-[#64748B]">
                  {t.noServices}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "messages" && (
          <section className="mt-6 rounded-[28px] bg-white p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
                  {t.messages}
                </p>
                <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                  {t.messagesTitle}
                </h2>
              </div>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#F15A24] px-2 text-xs font-black text-white">
                {messages.length}
              </span>
            </div>

            <div className="mt-7 rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <p className="text-sm font-black text-[#123A63]">{t.reply}</p>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t.subject}
                className="mt-4 h-12 w-full rounded-[14px] border border-[#E5D8CF] bg-white px-4 text-sm font-bold outline-none"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.message}
                className="mt-3 h-28 w-full resize-none rounded-[14px] border border-[#E5D8CF] bg-white px-4 py-4 text-sm font-bold outline-none"
              />
              <button type="button" onClick={sendMessage} className="mt-4 rounded-[14px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white">
                {t.send}
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {messages.length ? (
                messages.map((msg, index) => (
                  <div key={msg.id || index} className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-black text-[#123A63]">{msg.subject || "Message"}</p>
                      <p className="text-xs font-bold text-[#64748B]">{safeDate(msg.createdAt || msg.created_at)}</p>
                    </div>
                    <p className="mt-3 text-sm font-bold leading-6 text-[#64748B]">
                      {msg.message || msg.body}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] p-5 text-sm font-black text-[#64748B]">
                  {t.noMessages}
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
