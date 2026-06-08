"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";

type PortalDocument = {
  id: string;
  name?: string;
  nameFr?: string;
  nameEn?: string;
  category?: string;
  uploadedAt?: string;
  url?: string;
};

type PortalService = {
  id: string;
  nameFr?: string;
  nameEn?: string;
  statusFr?: string;
  statusEn?: string;
  value?: string;
  expiresAt?: string;
  renewalDueAt?: string;
};

type PortalMessage = {
  id: string;
  from?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
};

type Portal = {
  status: {
    payment?: string;
    file?: string;
    currentStep?: string;
  };
  documents: PortalDocument[];
  services: PortalService[];
  messages: PortalMessage[];
};

const emptyPortal: Portal = {
  status: {
    payment: "under_review",
    file: "pending",
    currentStep: "file_received",
  },
  documents: [],
  services: [],
  messages: [],
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR");
}

function getStatusLabel(lang: Lang, type: "payment" | "file" | "currentStep", value?: string) {
  const map: Record<string, Record<Lang, string>> = {
    under_review: { fr: "En vérification", en: "Under review" },
    pending: { fr: "En attente", en: "Pending" },
    file_received: { fr: "Réception du dossier", en: "File received" },
  };

  return map[value || ""]?.[lang] || (type === "payment" ? (lang === "fr" ? "En vérification" : "Under review") : "—");
}

export default function ClientPortalWorkspace({
  lang,
  email,
}: {
  lang: Lang;
  email?: string;
}) {
  const isFr = lang === "fr";
  const [portal, setPortal] = useState<Portal>(emptyPortal);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const clientEmail = useMemo(() => {
    return email || "sheikh.abderrahim1@gmail.com";
  }, [email]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/client-portal/overview?email=${encodeURIComponent(clientEmail)}`, {
          cache: "no-store",
        });
        const json = await res.json();

        if (!cancelled) {
          setPortal(json.portal || emptyPortal);
        }
      } catch {
        if (!cancelled) setPortal(emptyPortal);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [clientEmail]);

  async function sendMessage() {
    if (!subject.trim() && !message.trim()) return;

    const res = await fetch("/api/client-portal/overview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: clientEmail, subject, message }),
    });

    const json = await res.json();

    if (json.portal) {
      setPortal(json.portal);
      setSubject("");
      setMessage("");
    }
  }

  const t = isFr
    ? {
        portal: "Espace client",
        title: "Mon espace client",
        subtitle: "Suivez votre dossier, consultez vos documents et échangez avec VEMO.",
        tracking: "Suivi",
        fileStatus: "État de mon dossier",
        payment: "Paiement",
        file: "Dossier",
        currentStep: "Étape actuelle",
        documents: "Documents",
        documentText: "Les documents ajoutés par l’admin seront visibles ici.",
        noDocuments: "Aucun document disponible pour le moment.",
        services: "Mes services",
        servicesText: "Les services ajoutés par l’admin seront affichés ici.",
        noServices: "Aucun service ajouté pour le moment.",
        expiresAt: "Expiration",
        renewal: "Renouvellement",
        messages: "Messages",
        messagesTitle: "Messagerie avec VEMO",
        reply: "Répondre à VEMO",
        subject: "Objet",
        message: "Votre message...",
        send: "Envoyer",
        noMessages: "Aucun message disponible.",
        loading: "Chargement de votre espace...",
        download: "Ouvrir",
      }
    : {
        portal: "Client portal",
        title: "My client space",
        subtitle: "Track your file, view your documents and communicate with VEMO.",
        tracking: "Progress",
        fileStatus: "My file status",
        payment: "Payment",
        file: "File",
        currentStep: "Current step",
        documents: "Documents",
        documentText: "Documents uploaded by the admin will appear here.",
        noDocuments: "No document available yet.",
        services: "My services",
        servicesText: "Services added by the admin will appear here.",
        noServices: "No service added yet.",
        expiresAt: "Expiration",
        renewal: "Renewal",
        messages: "Messages",
        messagesTitle: "Communication with VEMO",
        reply: "Reply to VEMO",
        subject: "Subject",
        message: "Your message...",
        send: "Send",
        noMessages: "No message available.",
        loading: "Loading your portal...",
        download: "Open",
      };

  return (
    <main className="min-h-screen bg-[#F3F7FB] px-6 pb-10 text-[#111827]">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[28px] bg-white p-8">
          <div className="text-[28px] font-black tracking-[-0.04em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
            {t.portal}
          </p>

          <h1 className="mt-8 text-3xl font-black tracking-[-0.04em]">
            {t.title}
          </h1>

          <p className="mt-4 text-sm font-black text-[#64748B]">
            {clientEmail}
          </p>

          <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-[#64748B]">
            {t.subtitle}
          </p>
        </div>

        <section className="mt-6 rounded-[28px] bg-white p-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
              {t.tracking}
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
              {t.fileStatus}
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
                {t.payment}
              </p>
              <p className="mt-4 text-sm font-black text-[#123A63]">
                {getStatusLabel(lang, "payment", portal.status?.payment)}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
                {t.file}
              </p>
              <p className="mt-4 text-sm font-black text-[#123A63]">
                {getStatusLabel(lang, "file", portal.status?.file)}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
                {t.currentStep}
              </p>
              <p className="mt-4 text-sm font-black text-[#123A63]">
                {getStatusLabel(lang, "currentStep", portal.status?.currentStep)}
              </p>
            </div>
          </div>
        </section>

        <section id="documents" className="mt-6 rounded-[28px] bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
                {t.documents}
              </p>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                {t.documents}
              </h2>
              <p className="mt-3 text-sm font-bold text-[#64748B]">
                {t.documentText}
              </p>
            </div>

            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F15A24] px-2 text-xs font-black text-white">
              {portal.documents?.length || 0}
            </span>
          </div>

          <div className="mt-7 grid gap-3">
            {loading ? (
              <div className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4 text-sm font-black text-[#64748B]">
                {t.loading}
              </div>
            ) : portal.documents?.length ? (
              portal.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-4 rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4">
                  <div>
                    <p className="text-sm font-black text-[#123A63]">
                      {isFr ? doc.nameFr || doc.name : doc.nameEn || doc.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#64748B]">
                      {doc.category || "Document"} · {formatDate(doc.uploadedAt)}
                    </p>
                  </div>

                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noreferrer" className="rounded-[12px] bg-[#F15A24] px-4 py-3 text-xs font-black text-white">
                      {t.download}
                    </a>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4 text-sm font-black text-[#64748B]">
                {t.noDocuments}
              </div>
            )}
          </div>
        </section>

        <section id="services" className="mt-6 rounded-[28px] bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
                {t.services}
              </p>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                {t.services}
              </h2>
              <p className="mt-3 text-sm font-bold text-[#64748B]">
                {t.servicesText}
              </p>
            </div>

            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F15A24] px-2 text-xs font-black text-white">
              {portal.services?.length || 0}
            </span>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {loading ? (
              <div className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4 text-sm font-black text-[#64748B]">
                {t.loading}
              </div>
            ) : portal.services?.length ? (
              portal.services.map((service) => (
                <div key={service.id} className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-[#123A63]">
                        {isFr ? service.nameFr || service.nameEn : service.nameEn || service.nameFr}
                      </h3>
                      <p className="mt-2 text-sm font-bold text-[#64748B]">
                        {service.value || "—"}
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#F15A24]">
                      {isFr ? service.statusFr || service.statusEn : service.statusEn || service.statusFr}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[14px] border border-[#DDE7F2] bg-white p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8AA0BC]">
                        {t.expiresAt}
                      </p>
                      <p className="mt-2 text-sm font-black text-[#123A63]">
                        {formatDate(service.expiresAt)}
                      </p>
                    </div>

                    <div className="rounded-[14px] border border-[#DDE7F2] bg-white p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8AA0BC]">
                        {t.renewal}
                      </p>
                      <p className="mt-2 text-sm font-black text-[#123A63]">
                        {formatDate(service.renewalDueAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4 text-sm font-black text-[#64748B]">
                {t.noServices}
              </div>
            )}
          </div>
        </section>

        <section id="messages" className="mt-6 rounded-[28px] bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
                {t.messages}
              </p>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                {t.messagesTitle}
              </h2>
            </div>

            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F15A24] px-2 text-xs font-black text-white">
              {portal.messages?.length || 0}
            </span>
          </div>

          <div className="mt-7 rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
            <p className="text-sm font-black text-[#123A63]">
              {t.reply}
            </p>

            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder={t.subject}
              className="mt-4 h-12 w-full rounded-[14px] border border-[#E5D8CF] bg-white px-4 text-sm font-bold outline-none"
            />

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t.message}
              className="mt-3 h-28 w-full resize-none rounded-[14px] border border-[#E5D8CF] bg-white px-4 py-4 text-sm font-bold outline-none"
            />

            <button
              type="button"
              onClick={sendMessage}
              className="mt-4 h-12 rounded-[14px] bg-[#F15A24] px-6 text-sm font-black text-white"
            >
              {t.send}
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {portal.messages?.length ? (
              portal.messages.map((msg) => (
                <div key={msg.id} className="rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-black text-[#123A63]">
                      {msg.subject || "Message"}
                    </p>
                    <p className="text-xs font-bold text-[#64748B]">
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                  <p className="mt-3 text-sm font-bold leading-6 text-[#64748B]">
                    {msg.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[14px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4 text-sm font-black text-[#64748B]">
                {t.noMessages}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
