"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Lang = "fr" | "en";
type Tab = "status" | "documents" | "services" | "messages" | "account";

type Props = {
  lang?: Lang;
};

type ClientDocument = {
  id?: string;
  name?: string;
  title?: string;
  filename?: string;
  url?: string;
  fileUrl?: string;
  uploadedAt?: string;
  createdAt?: string;
};

type ClientService = {
  id?: string;
  name?: string;
  nameFr?: string;
  nameEn?: string;
  status?: string;
  statusFr?: string;
  statusEn?: string;
  detail?: string;
  value?: string;
  expiresAt?: string;
  renewalAt?: string;
};

type ClientMessage = {
  id?: string;
  from?: "admin" | "client";
  subject?: string;
  message?: string;
  body?: string;
  createdAt?: string;
};

type ClientStatus = {
  payment?: string;
  file?: string;
  currentStep?: string;
};

type Account = {
  name?: string;
  email?: string;
};

function Logo({ admin = false }: { admin?: boolean }) {
  return (
    <div className="leading-none">
      <div className="text-[22px] font-black tracking-[-0.04em]">
        <span className="text-[#123A63]">VEMO</span>
        <span className="text-[#F15A24]">TECH</span>
      </div>
      <div className="mt-1 text-[9px] font-black uppercase tracking-[0.36em] text-[#64748B]">
        {admin ? "ADMIN" : "US LLC POUR NON-RÉSIDENTS"}
      </div>
    </div>
  );
}

function IconOpen() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6" />
      <path d="M10 14L20 4" />
      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#E6EDF5] bg-white px-5 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#8AA0BC]">{label}</p>
      <p className="mt-3 text-sm font-black text-[#123A63]">{value || "—"}</p>
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#DDE7F2] bg-white px-5 py-6 text-sm font-black text-[#64748B]">
      {text}
    </div>
  );
}

export default function ClientPortalWorkspace({ lang = "fr" }: Props) {
  const isFr = lang === "fr";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const initialTab = (searchParams.get("tab") || "status") as Tab;

  const [activeTab, setActiveTab] = useState<Tab>(
    ["status", "documents", "services", "messages", "account"].includes(initialTab) ? initialTab : "status"
  );

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [services, setServices] = useState<ClientService[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [status, setStatus] = useState<ClientStatus>({});
  const [account, setAccount] = useState<Account>({ email });

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");

  const t = useMemo(() => {
    return isFr
      ? {
          status: "Statut",
          documents: "Documents",
          services: "Mes services",
          messages: "Messages",
          account: "Mon compte",
          signOut: "Se déconnecter",
          titleStatus: "État de mon dossier",
          subtitle: "Espace client sécurisé",
          payment: "Paiement",
          file: "Dossier",
          currentStep: "Étape actuelle",
          docsTitle: "Documents",
          docsSubtitle: "Tous les fichiers ajoutés par VEMO sont disponibles ici.",
          noDocs: "Aucun document disponible pour le moment.",
          open: "Ouvrir",
          download: "Télécharger",
          servicesTitle: "Mes services",
          servicesSubtitle: "Suivi des services actifs, renouvellements et échéances.",
          noServices: "Aucun service ajouté pour le moment.",
          expiration: "Expiration",
          renewal: "Renouvellement",
          messagesTitle: "Messagerie avec VEMO",
          messagesSubtitle: "Échangez avec l’équipe VEMO depuis votre espace sécurisé.",
          noMessages: "Aucun message disponible.",
          reply: "Répondre à VEMO",
          subject: "Objet",
          yourMessage: "Votre message...",
          send: "Envoyer",
          accountTitle: "Mon compte",
          accountSubtitle: "Vos informations de compte sont sécurisées.",
          fullName: "Nom complet",
          email: "Email",
          readOnly: "Non modifiable",
          password: "Mot de passe",
          currentPassword: "Mot de passe actuel",
          newPassword: "Nouveau mot de passe",
          confirmPassword: "Confirmation du mot de passe",
          updatePassword: "Mettre à jour le mot de passe",
          saved: "Message envoyé.",
          passwordSaved: "Mot de passe mis à jour.",
          passwordError: "Les mots de passe ne correspondent pas.",
          langSwitch: "EN",
        }
      : {
          status: "Status",
          documents: "Documents",
          services: "My services",
          messages: "Messages",
          account: "My account",
          signOut: "Sign out",
          titleStatus: "My file status",
          subtitle: "Secure client portal",
          payment: "Payment",
          file: "File",
          currentStep: "Current step",
          docsTitle: "Documents",
          docsSubtitle: "All files added by VEMO are available here.",
          noDocs: "No document available yet.",
          open: "Open",
          download: "Download",
          servicesTitle: "My services",
          servicesSubtitle: "Track active services, renewals and deadlines.",
          noServices: "No service added yet.",
          expiration: "Expiration",
          renewal: "Renewal",
          messagesTitle: "Communication with VEMO",
          messagesSubtitle: "Message the VEMO team from your secure portal.",
          noMessages: "No message available yet.",
          reply: "Reply to VEMO",
          subject: "Subject",
          yourMessage: "Write your message...",
          send: "Send",
          accountTitle: "My account",
          accountSubtitle: "Your account information is secure.",
          fullName: "Full name",
          email: "Email",
          readOnly: "Read only",
          password: "Password",
          currentPassword: "Current password",
          newPassword: "New password",
          confirmPassword: "Confirm password",
          updatePassword: "Update password",
          saved: "Message sent.",
          passwordSaved: "Password updated.",
          passwordError: "Passwords do not match.",
          langSwitch: "FR",
        };
  }, [isFr]);

  function setTab(tab: Tab) {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function switchLang() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", activeTab);
    router.push(isFr ? `/en/client-portal?${params.toString()}` : `/fr/espace-client?${params.toString()}`);
  }

  function signOut() {
    router.push(isFr ? "/fr" : "/en");
  }

  async function loadAll() {
    if (!email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const qs = `?email=${encodeURIComponent(email)}`;

    const [docsRes, servicesRes, statusRes, messagesRes, accountRes] = await Promise.all([
      fetch(`/api/client-portal/documents${qs}`, { cache: "no-store" }).catch(() => null),
      fetch(`/api/client-portal/services${qs}`, { cache: "no-store" }).catch(() => null),
      fetch(`/api/client-portal/status${qs}`, { cache: "no-store" }).catch(() => null),
      fetch(`/api/client-portal/messages${qs}`, { cache: "no-store" }).catch(() => null),
      fetch(`/api/client-portal/account${qs}`, { cache: "no-store" }).catch(() => null),
    ]);

    const docsJson = await docsRes?.json().catch(() => null);
    const servicesJson = await servicesRes?.json().catch(() => null);
    const statusJson = await statusRes?.json().catch(() => null);
    const messagesJson = await messagesRes?.json().catch(() => null);
    const accountJson = await accountRes?.json().catch(() => null);

    setDocuments(Array.isArray(docsJson?.documents) ? docsJson.documents : []);
    setServices(Array.isArray(servicesJson?.services) ? servicesJson.services : []);
    setStatus(statusJson?.status || statusJson || {});
    setMessages(Array.isArray(messagesJson?.messages) ? messagesJson.messages : []);
    setAccount(accountJson?.account || accountJson?.profile || { email });

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [email]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !message.trim()) return;

    await fetch(`/api/client-portal/messages?email=${encodeURIComponent(email)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message, from: "client" }),
    }).catch(() => null);

    setSubject("");
    setMessage("");
    setNotice(t.saved);
    await loadAll();
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setNotice(t.passwordError);
      return;
    }

    await fetch(`/api/client-portal/account?email=${encodeURIComponent(email)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    }).catch(() => null);

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNotice(t.passwordSaved);
  }

  const menu: { key: Tab; label: string }[] = [
    { key: "status", label: t.status },
    { key: "documents", label: t.documents },
    { key: "services", label: t.services },
    { key: "messages", label: t.messages },
    { key: "account", label: t.account },
  ];

  return (
    <main className="vemo-client-clean min-h-screen bg-[#F6F9FC] text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between px-6">
          <Logo />

          <nav className="hidden items-center gap-2 md:flex">
            {menu.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`rounded-[14px] px-4 py-3 text-sm font-black transition ${
                  activeTab === item.key ? "bg-[#FFF3EF] text-[#F15A24]" : "text-[#111827] hover:bg-[#F8FAFC]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={switchLang}
              className="rounded-[14px] border border-[#DDE7F2] bg-white px-5 py-3 text-sm font-black text-[#123A63]"
            >
              {t.langSwitch}
            </button>

            <button
              type="button"
              onClick={signOut}
              className="vemo-client-flat-btn rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white"
            >
              {t.signOut}
            </button>
          </div>
        </div>

        <div className="border-t border-[#EEF3F8] bg-white px-4 py-3 md:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {menu.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`shrink-0 rounded-[12px] px-4 py-2 text-xs font-black ${
                  activeTab === item.key ? "bg-[#F15A24] text-white" : "border border-[#DDE7F2] bg-white text-[#123A63]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-7 rounded-[28px] border border-[#E6EDF5] bg-white px-7 py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#F15A24]">{t.subtitle}</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-[-0.05em] text-[#111827]">
                {activeTab === "status" && t.titleStatus}
                {activeTab === "documents" && t.docsTitle}
                {activeTab === "services" && t.servicesTitle}
                {activeTab === "messages" && t.messagesTitle}
                {activeTab === "account" && t.accountTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-[#64748B]">
                {activeTab === "status" && t.subtitle}
                {activeTab === "documents" && t.docsSubtitle}
                {activeTab === "services" && t.servicesSubtitle}
                {activeTab === "messages" && t.messagesSubtitle}
                {activeTab === "account" && t.accountSubtitle}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#F15A24] text-sm font-black text-white">
              {activeTab === "documents" && documents.length}
              {activeTab === "services" && services.length}
              {activeTab === "messages" && messages.length}
              {activeTab === "status" && "✓"}
              {activeTab === "account" && "•"}
            </div>
          </div>
        </div>

        {notice ? (
          <div className="mb-5 rounded-[16px] border border-[#BFE8D3] bg-[#ECFDF5] px-5 py-4 text-sm font-black text-[#047857]">
            {notice}
          </div>
        ) : null}

        {activeTab === "status" && (
          <section className="rounded-[28px] border border-[#E6EDF5] bg-white p-7">
            <div className="grid gap-4 md:grid-cols-3">
              <FieldBox label={t.payment} value={status.payment || (isFr ? "En vérification" : "Under review")} />
              <FieldBox label={t.file} value={status.file || (isFr ? "En attente" : "Pending")} />
              <FieldBox label={t.currentStep} value={status.currentStep || (isFr ? "Réception du dossier" : "File received")} />
            </div>
          </section>
        )}

        {activeTab === "documents" && (
          <section className="rounded-[28px] border border-[#E6EDF5] bg-white p-7">
            <div className="grid gap-4">
              {loading ? (
                <EmptyBox text="..." />
              ) : documents.length ? (
                documents.map((doc) => {
                  const title = doc.name || doc.title || doc.filename || "Document";
                  const filename = doc.filename || title;
                  const url = doc.url || doc.fileUrl || "#";

                  return (
                    <div
                      key={doc.id || title}
                      className="group flex flex-col gap-4 rounded-[20px] border border-[#DDE7F2] bg-white px-5 py-5 transition hover:border-[#F15A24] md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#FFF3EF] text-[#F15A24]">
                          <IconFile />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#123A63]">{title}</p>
                          <p className="mt-1 text-xs font-bold text-[#8AA0BC]">{filename}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="vemo-client-flat-btn inline-flex h-11 items-center gap-2 rounded-[14px] bg-[#F15A24] px-4 text-xs font-black text-white"
                        >
                          <IconOpen />
                          {t.open}
                        </a>

                        <a
                          href={url}
                          download={filename}
                          className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-xs font-black text-[#123A63]"
                        >
                          <IconDownload />
                          {t.download}
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyBox text={t.noDocs} />
              )}
            </div>
          </section>
        )}

        {activeTab === "services" && (
          <section className="rounded-[28px] border border-[#E6EDF5] bg-white p-7">
            <div className="grid gap-4 md:grid-cols-2">
              {services.length ? (
                services.map((service) => (
                  <div key={service.id || service.name} className="rounded-[22px] border border-[#DDE7F2] bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-black text-[#123A63]">
                          {isFr ? service.nameFr || service.name : service.nameEn || service.name}
                        </h2>
                        <p className="mt-2 text-sm font-bold text-[#64748B]">{service.detail || service.value || ""}</p>
                      </div>
                      <span className="rounded-full bg-[#FFF3EF] px-3 py-2 text-[11px] font-black text-[#F15A24]">
                        {isFr ? service.statusFr || service.status || "Actif" : service.statusEn || service.status || "Active"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <FieldBox label={t.expiration} value={service.expiresAt || "—"} />
                      <FieldBox label={t.renewal} value={service.renewalAt || "—"} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2">
                  <EmptyBox text={t.noServices} />
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "messages" && (
          <section className="rounded-[28px] border border-[#E6EDF5] bg-white p-7">
            <form onSubmit={sendMessage} className="rounded-[22px] border border-[#DDE7F2] bg-white p-5">
              <p className="text-sm font-black text-[#123A63]">{t.reply}</p>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t.subject}
                className="mt-4 h-12 w-full rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none focus:border-[#F15A24]"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.yourMessage}
                className="mt-3 h-32 w-full resize-none rounded-[14px] border border-[#DDE7F2] bg-white px-4 py-4 text-sm font-black outline-none focus:border-[#F15A24]"
              />
              <button className="vemo-client-flat-btn mt-3 rounded-[14px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white">
                {t.send}
              </button>
            </form>

            <div className="mt-6 grid gap-3">
              {messages.length ? (
                messages.map((msg) => (
                  <div key={msg.id || msg.createdAt} className="rounded-[18px] border border-[#DDE7F2] bg-white p-5">
                    <p className="text-sm font-black text-[#123A63]">{msg.subject || "Message"}</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-[#64748B]">{msg.message || msg.body}</p>
                  </div>
                ))
              ) : (
                <EmptyBox text={t.noMessages} />
              )}
            </div>
          </section>
        )}

        {activeTab === "account" && (
          <section className="rounded-[28px] border border-[#E6EDF5] bg-white p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldBox label={`${t.fullName} — ${t.readOnly}`} value={account.name || ""} />
              <FieldBox label={`${t.email} — ${t.readOnly}`} value={account.email || email} />
            </div>

            <form onSubmit={updatePassword} className="mt-7 rounded-[22px] border border-[#DDE7F2] bg-white p-5">
              <p className="text-sm font-black text-[#123A63]">{t.password}</p>

              <div className="mt-4 grid gap-3">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder={t.currentPassword}
                  className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none focus:border-[#F15A24]"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.newPassword}
                  className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none focus:border-[#F15A24]"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPassword}
                  className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none focus:border-[#F15A24]"
                />
              </div>

              <button className="vemo-client-flat-btn mt-4 rounded-[14px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white">
                {t.updatePassword}
              </button>
            </form>
          </section>
        )}
      </section>
    </main>
  );
}
