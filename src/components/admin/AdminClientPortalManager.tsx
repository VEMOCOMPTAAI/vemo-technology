"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";

type Props = {
  lang: Lang;
};

type ClientRow = {
  email: string;
  label: string;
  documentsCount?: number;
  servicesCount?: number;
  messagesCount?: number;
};

const DEFAULT_EMAIL = "sheikh.abderrahim1@gmail.com";

export default function AdminClientPortalManager({ lang }: Props) {
  const isFr = lang === "fr";

  const t = isFr
    ? {
        title: "Gestion espace client",
        subtitle: "Sélectionnez un dossier client puis gérez uniquement ses éléments visibles dans son espace.",
        selectClient: "Dossier client",
        search: "Rechercher par nom LLC...",
        choose: "Choisir un dossier",
        openClient: "Ouvrir l’espace client",
        status: "Statut du dossier",
        payment: "Paiement",
        file: "Dossier",
        step: "Étape actuelle",
        saveStatus: "Enregistrer le statut",
        documents: "Documents du dossier",
        docTitle: "Nom du document",
        upload: "Uploader le document",
        noDocuments: "Aucun document pour ce dossier.",
        services: "Services du dossier",
        serviceNote: "Ajoutez uniquement les services réellement inclus pour ce client.",
        nameFr: "Nom FR",
        nameEn: "Nom EN",
        statusFr: "Statut FR",
        statusEn: "Statut EN",
        value: "Détail / valeur",
        expiration: "Expiration",
        renewal: "Renouvellement",
        addService: "Ajouter le service",
        noServices: "Aucun service pour ce dossier.",
        messages: "Messages du dossier",
        subject: "Objet",
        message: "Message",
        send: "Répondre au client",
        noMessages: "Aucun message pour ce dossier.",
        delete: "Supprimer",
        saved: "Enregistré.",
        loading: "Chargement..."
      }
    : {
        title: "Client portal management",
        subtitle: "Select a client file, then manage only the items visible in that client portal.",
        selectClient: "Client file",
        search: "Search by LLC name...",
        choose: "Choose a file",
        openClient: "Open client portal",
        status: "File status",
        payment: "Payment",
        file: "File",
        step: "Current step",
        saveStatus: "Save status",
        documents: "File documents",
        docTitle: "Document name",
        upload: "Upload document",
        noDocuments: "No document for this file.",
        services: "File services",
        serviceNote: "Add only the services actually included for this client.",
        nameFr: "French name",
        nameEn: "English name",
        statusFr: "French status",
        statusEn: "English status",
        value: "Detail / value",
        expiration: "Expiration",
        renewal: "Renewal",
        addService: "Add service",
        noServices: "No service for this file.",
        messages: "File messages",
        subject: "Subject",
        message: "Message",
        send: "Reply to client",
        noMessages: "No message for this file.",
        delete: "Delete",
        saved: "Saved.",
        loading: "Loading..."
      };

  const [clients, setClients] = useState<ClientRow[]>([]);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [portal, setPortal] = useState<any>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const [payment, setPayment] = useState("under_review");
  const [file, setFile] = useState("pending");
  const [currentStep, setCurrentStep] = useState("file_received");

  const [docTitle, setDocTitle] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  const [service, setService] = useState({
    nameFr: "",
    nameEn: "",
    statusFr: "Actif",
    statusEn: "Active",
    value: "",
    expiresAt: "",
    renewalDueAt: ""
  });

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((client) => client.label.toLowerCase().includes(q));
  }, [clients, search]);

  const clientUrl = useMemo(() => {
    const base = isFr ? "/fr/espace-client" : "/en/client-portal";
    return `${base}?email=${encodeURIComponent(email)}`;
  }, [email, isFr]);

  async function loadClients() {
    const res = await fetch("/api/admin/client-portal/manage", { cache: "no-store" });
    const json = await res.json();

    const rows = Array.isArray(json?.clients) ? json.clients : [];
    setClients(rows);

    const first = rows.find((item: ClientRow) => item.email === email) || rows[0];

    if (first) {
      setEmail(first.email);
      setSelectedLabel(first.label);
      await loadClient(first.email);
    } else {
      await loadClient(email);
    }
  }

  async function loadClient(nextEmail = email) {
    setLoading(true);
    setNotice("");

    try {
      const res = await fetch(`/api/admin/client-portal/manage?email=${encodeURIComponent(nextEmail)}`, {
        cache: "no-store"
      });

      const json = await res.json();

      if (json?.portal) {
        setEmail(nextEmail);
        setSelectedLabel(json.label || "");
        setPortal(json.portal);
        setPayment(json.portal.status?.payment || "under_review");
        setFile(json.portal.status?.file || "pending");
        setCurrentStep(json.portal.status?.currentStep || "file_received");
      }
    } finally {
      setLoading(false);
    }
  }

  async function post(action: string, body: Record<string, any> = {}) {
    const res = await fetch("/api/admin/client-portal/manage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        action,
        ...body
      })
    });

    const json = await res.json();

    if (json?.portal) {
      setPortal(json.portal);
      setSelectedLabel(json.label || selectedLabel);
      setNotice(t.saved);
      await loadClients();
    }
  }

  async function saveStatus() {
    await post("updateStatus", {
      payment,
      file,
      currentStep
    });
  }

  async function addService() {
    if (!service.nameFr && !service.nameEn) return;

    await post("addService", service);

    setService({
      nameFr: "",
      nameEn: "",
      statusFr: "Actif",
      statusEn: "Active",
      value: "",
      expiresAt: "",
      renewalDueAt: ""
    });
  }

  async function uploadDocument() {
    if (!docFile) return;

    const form = new FormData();
    form.append("email", email);
    form.append("title", docTitle);
    form.append("file", docFile);

    const res = await fetch("/api/admin/client-portal/upload-document", {
      method: "POST",
      body: form
    });

    const json = await res.json();

    if (json?.portal) {
      setPortal(json.portal);
      setNotice(t.saved);
      setDocTitle("");
      setDocFile(null);
      await loadClients();
    }
  }

  async function sendMessage() {
    if (!subject && !message) return;

    await post("sendMessage", {
      subject,
      message
    });

    setSubject("");
    setMessage("");
  }

  useEffect(() => {
    loadClients().catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F7FB] px-6 py-8 text-[#111827]">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[28px] bg-white p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#F15A24]">Admin</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.05em]">{t.title}</h1>
              <p className="mt-3 max-w-2xl text-sm font-bold text-[#64748B]">{t.subtitle}</p>
            </div>

            <a href={clientUrl} target="_blank" rel="noreferrer" className="rounded-[14px] border border-[#DDE7F2] bg-white px-5 py-3 text-sm font-black text-[#123A63]">
              {t.openClient}
            </a>
          </div>

          <div className="mt-7 rounded-[22px] border border-[#DDE7F2] bg-[#F8FAFC] p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
              {t.selectClient}
            </p>

            <div className="grid gap-3 md:grid-cols-[1fr_1.4fr]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none"
              />

              <select
                value={email}
                onChange={(e) => loadClient(e.target.value)}
                className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none"
              >
                {filteredClients.length ? (
                  filteredClients.map((client) => (
                    <option key={client.email} value={client.email}>
                      {client.label}
                    </option>
                  ))
                ) : (
                  <option value={email}>{selectedLabel || t.choose}</option>
                )}
              </select>
            </div>

            {selectedLabel ? (
              <div className="mt-4 rounded-[16px] border border-[#DDE7F2] bg-white p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
                  Dossier ouvert
                </p>
                <p className="mt-2 text-lg font-black text-[#123A63]">{selectedLabel}</p>
              </div>
            ) : null}
          </div>

          {notice ? <p className="mt-4 rounded-[14px] bg-[#ECFDF3] px-4 py-3 text-sm font-black text-[#087443]">{notice}</p> : null}
          {loading ? <p className="mt-4 text-sm font-black text-[#64748B]">{t.loading}</p> : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] bg-white p-6">
            <h2 className="text-2xl font-black tracking-[-0.04em]">{t.status}</h2>

            <div className="mt-5 grid gap-4">
              <select value={payment} onChange={(e) => setPayment(e.target.value)} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black">
                <option value="under_review">{isFr ? "En vérification" : "Under review"}</option>
                <option value="paid">{isFr ? "Payé" : "Paid"}</option>
                <option value="pending">{isFr ? "En attente" : "Pending"}</option>
                <option value="rejected">{isFr ? "Rejeté" : "Rejected"}</option>
              </select>

              <select value={file} onChange={(e) => setFile(e.target.value)} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black">
                <option value="pending">{isFr ? "En attente" : "Pending"}</option>
                <option value="in_progress">{isFr ? "En cours" : "In progress"}</option>
                <option value="completed">{isFr ? "Terminé" : "Completed"}</option>
              </select>

              <select value={currentStep} onChange={(e) => setCurrentStep(e.target.value)} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black">
                <option value="file_received">{isFr ? "Réception du dossier" : "File received"}</option>
                <option value="payment_review">{isFr ? "Vérification paiement" : "Payment review"}</option>
                <option value="llc_processing">{isFr ? "Création LLC" : "LLC processing"}</option>
                <option value="documents_ready">{isFr ? "Documents disponibles" : "Documents ready"}</option>
              </select>

              <button onClick={saveStatus} className="rounded-[14px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white">
                {t.saveStatus}
              </button>
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6">
            <h2 className="text-2xl font-black tracking-[-0.04em]">{t.documents}</h2>

            <div className="mt-5 grid gap-3">
              <input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder={t.docTitle} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />
              <input type="file" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="rounded-[14px] border border-[#DDE7F2] bg-white px-4 py-3 text-sm font-black" />
              <button onClick={uploadDocument} className="rounded-[14px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white">{t.upload}</button>
            </div>

            <div className="mt-5 grid gap-3">
              {portal?.documents?.length ? portal.documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between gap-3 rounded-[14px] border border-[#DDE7F2] bg-[#F8FAFC] p-4">
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm font-black text-[#123A63]">{doc.name || doc.filename}</a>
                  <button onClick={() => post("deleteDocument", { id: doc.id })} className="text-xs font-black text-[#F15A24]">{t.delete}</button>
                </div>
              )) : (
                <p className="rounded-[14px] border border-[#DDE7F2] bg-[#F8FAFC] p-4 text-sm font-black text-[#64748B]">{t.noDocuments}</p>
              )}
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-[-0.04em]">{t.services}</h2>
                <p className="mt-2 text-sm font-bold text-[#64748B]">{t.serviceNote}</p>
              </div>
              <span className="rounded-full bg-[#F15A24] px-3 py-2 text-xs font-black text-white">{portal?.services?.length || 0}</span>
            </div>

            <div className="mt-5 grid gap-3">
              <input value={service.nameFr} onChange={(e) => setService({ ...service, nameFr: e.target.value })} placeholder={t.nameFr} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />
              <input value={service.nameEn} onChange={(e) => setService({ ...service, nameEn: e.target.value })} placeholder={t.nameEn} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />

              <div className="grid gap-3 md:grid-cols-2">
                <input value={service.statusFr} onChange={(e) => setService({ ...service, statusFr: e.target.value })} placeholder={t.statusFr} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />
                <input value={service.statusEn} onChange={(e) => setService({ ...service, statusEn: e.target.value })} placeholder={t.statusEn} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />
              </div>

              <input value={service.value} onChange={(e) => setService({ ...service, value: e.target.value })} placeholder={t.value} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />

              <div className="grid gap-3 md:grid-cols-2">
                <input type="date" value={service.expiresAt} onChange={(e) => setService({ ...service, expiresAt: e.target.value })} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />
                <input type="date" value={service.renewalDueAt} onChange={(e) => setService({ ...service, renewalDueAt: e.target.value })} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />
              </div>

              <button onClick={addService} className="rounded-[14px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white">{t.addService}</button>
            </div>

            <div className="mt-5 grid gap-3">
              {portal?.services?.length ? portal.services.map((item: any) => (
                <div key={item.id} className="rounded-[14px] border border-[#DDE7F2] bg-[#F8FAFC] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#123A63]">{isFr ? item.nameFr || item.nameEn : item.nameEn || item.nameFr}</p>
                      <p className="mt-1 text-xs font-bold text-[#64748B]">{item.value || "—"}</p>
                    </div>
                    <button onClick={() => post("deleteService", { id: item.id })} className="text-xs font-black text-[#F15A24]">{t.delete}</button>
                  </div>
                </div>
              )) : (
                <p className="rounded-[14px] border border-[#DDE7F2] bg-[#F8FAFC] p-4 text-sm font-black text-[#64748B]">{t.noServices}</p>
              )}
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6">
            <h2 className="text-2xl font-black tracking-[-0.04em]">{t.messages}</h2>

            <div className="mt-5 grid gap-3">
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t.subject} className="h-12 rounded-[14px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none" />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.message} className="h-32 resize-none rounded-[14px] border border-[#DDE7F2] bg-white px-4 py-4 text-sm font-black outline-none" />
              <button onClick={sendMessage} className="rounded-[14px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white">{t.send}</button>
            </div>

            <div className="mt-5 grid gap-3">
              {portal?.messages?.length ? portal.messages.map((msg: any) => (
                <div key={msg.id} className="rounded-[14px] border border-[#DDE7F2] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8AA0BC]">{msg.from || "admin"}</p>
                  <p className="mt-2 text-sm font-black text-[#123A63]">{msg.subject || "Message"}</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#64748B]">{msg.message}</p>
                </div>
              )) : (
                <p className="rounded-[14px] border border-[#DDE7F2] bg-[#F8FAFC] p-4 text-sm font-black text-[#64748B]">{t.noMessages}</p>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
