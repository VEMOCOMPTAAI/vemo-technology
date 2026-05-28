
"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type Lang = "fr" | "en";

type Settings = {
  company: {
    brandName: string;
    legalName: string;
    email: string;
    whatsapp: string;
    supportTextFr: string;
    supportTextEn: string;
  };
  pricing: {
    currency: string;
    newMexicoStarter: number;
    newMexicoStandard: number;
    newMexicoAdvanced: number;
    wyomingStarter: number;
    wyomingStandard: number;
    wyomingAdvanced: number;
  };
  bank: {
    bankName: string;
    accountName: string;
    iban: string;
    swift: string;
    instructionsFr: string;
    instructionsEn: string;
  };
  portal: {
    requireEmailVerification: boolean;
    allowClientMessages: boolean;
    allowDocumentDownload: boolean;
    adminNotificationEmail: string;
  };
};

const fallback: Settings = {
  company: {
    brandName: "Vemo Technology",
    legalName: "Vemo Technology LLC",
    email: "contact@vemo-technology.com",
    whatsapp: "+212600000000",
    supportTextFr: "Support client Vemo",
    supportTextEn: "Vemo client support",
  },
  pricing: {
    currency: "USD",
    newMexicoStarter: 119,
    newMexicoStandard: 179,
    newMexicoAdvanced: 199,
    wyomingStarter: 189,
    wyomingStandard: 239,
    wyomingAdvanced: 299,
  },
  bank: {
    bankName: "Bank details pending",
    accountName: "Vemo Technology LLC",
    iban: "",
    swift: "",
    instructionsFr: "Les coordonnées bancaires seront communiquées après validation.",
    instructionsEn: "Bank details will be provided after validation.",
  },
  portal: {
    requireEmailVerification: true,
    allowClientMessages: true,
    allowDocumentDownload: true,
    adminNotificationEmail: "contact@vemo-technology.com",
  },
};

export default function AdminSettingsPage({ lang }: { lang: Lang }) {
  const isFr = lang === "fr";

  const [settings, setSettings] = useState<Settings>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");

  const currencyOptions = useMemo(() => ["USD", "MAD", "EUR"], []);

  function update(section: keyof Settings, key: string, value: string | number | boolean) {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...(current[section] as any),
        [key]: value,
      },
    }));
  }

  async function load() {
    setLoading(true);
    setMessage("");
    setWarning("");

    try {
      const token = localStorage.getItem("vemo_admin_session") || "";

      const response = await fetch("/api/admin/settings", {
        headers: {
          "x-vemo-admin-session": token,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setWarning(data?.message || "Impossible de charger les paramètres.");
        setLoading(false);
        return;
      }

      setSettings({
        ...fallback,
        ...(data.settings || {}),
        company: { ...fallback.company, ...(data.settings?.company || {}) },
        pricing: { ...fallback.pricing, ...(data.settings?.pricing || {}) },
        bank: { ...fallback.bank, ...(data.settings?.bank || {}) },
        portal: { ...fallback.portal, ...(data.settings?.portal || {}) },
      });

      setWarning(data.warning || "");
      setLoading(false);
    } catch {
      setWarning("Impossible de charger les paramètres.");
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setWarning("");

    try {
      const token = localStorage.getItem("vemo_admin_session") || "";

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vemo-admin-session": token,
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setWarning(data?.message || "Enregistrement impossible.");
        setSaving(false);
        return;
      }

      setMessage(isFr ? "Paramètres enregistrés avec succès." : "Settings saved successfully.");
      setSaving(false);
    } catch {
      setWarning(isFr ? "Enregistrement impossible." : "Unable to save settings.");
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell lang={lang}>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
            Admin
          </div>

          <h2 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.06em] text-[#2B2F36]">
            {isFr ? "Paramètres" : "Settings"}
          </h2>

          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
            {isFr
              ? "Configurez les informations société, les packs, les paiements par virement et les règles de l’espace client."
              : "Configure company information, packages, bank transfer details and client portal rules."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={load}
            className="h-12 rounded-[8px] border border-[#E8E2DC] bg-white px-6 text-sm font-black text-[#123A63]"
          >
            {isFr ? "Recharger" : "Reload"}
          </button>

          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className="h-12 rounded-[8px] bg-[#F15A24] px-6 text-sm font-black text-white shadow-[0_14px_28px_rgba(241,90,36,0.20)] disabled:bg-slate-300"
          >
            {saving ? (isFr ? "Enregistrement..." : "Saving...") : (isFr ? "Enregistrer" : "Save")}
          </button>
        </div>
      </div>

      {warning ? (
        <div className="mt-8 rounded-[12px] border border-orange-200 bg-[#FFF7F1] px-5 py-4 text-sm font-bold leading-7 text-[#123A63]">
          {warning}
        </div>
      ) : null}

      {message ? (
        <div className="mt-8 rounded-[12px] border border-orange-200 bg-white px-5 py-4 text-sm font-bold leading-7 text-[#123A63]">
          {message}
        </div>
      ) : null}

      {loading ? (
        <section className="mt-8 rounded-[16px] border border-[#E8E2DC] bg-white p-8 text-sm font-black text-[#123A63] shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
          {isFr ? "Chargement des paramètres..." : "Loading settings..."}
        </section>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <Panel
            title={isFr ? "Société" : "Company"}
            subtitle={isFr ? "Informations affichées sur le site et les emails." : "Information shown on the website and emails."}
          >
            <Field label="Marque">
              <Input value={settings.company.brandName} onChange={(v) => update("company", "brandName", v)} />
            </Field>

            <Field label={isFr ? "Nom légal" : "Legal name"}>
              <Input value={settings.company.legalName} onChange={(v) => update("company", "legalName", v)} />
            </Field>

            <Field label="Email">
              <Input value={settings.company.email} onChange={(v) => update("company", "email", v)} />
            </Field>

            <Field label="WhatsApp">
              <Input value={settings.company.whatsapp} onChange={(v) => update("company", "whatsapp", v)} />
            </Field>

            <Field label="Support FR">
              <Input value={settings.company.supportTextFr} onChange={(v) => update("company", "supportTextFr", v)} />
            </Field>

            <Field label="Support EN">
              <Input value={settings.company.supportTextEn} onChange={(v) => update("company", "supportTextEn", v)} />
            </Field>
          </Panel>

          <Panel
            title={isFr ? "Packs et tarifs" : "Packages and prices"}
            subtitle={isFr ? "Tarifs affichés dans la page Pricing et le wizard." : "Prices shown on Pricing and wizard pages."}
          >
            <Field label={isFr ? "Devise" : "Currency"}>
              <select
                value={settings.pricing.currency}
                onChange={(e) => update("pricing", "currency", e.target.value)}
                className="h-12 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold text-[#2B2F36] outline-none focus:border-[#F15A24]"
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="NM Starter">
                <NumberInput value={settings.pricing.newMexicoStarter} onChange={(v) => update("pricing", "newMexicoStarter", v)} />
              </Field>
              <Field label="NM Standard">
                <NumberInput value={settings.pricing.newMexicoStandard} onChange={(v) => update("pricing", "newMexicoStandard", v)} />
              </Field>
              <Field label="NM Advanced">
                <NumberInput value={settings.pricing.newMexicoAdvanced} onChange={(v) => update("pricing", "newMexicoAdvanced", v)} />
              </Field>
              <Field label="WY Starter">
                <NumberInput value={settings.pricing.wyomingStarter} onChange={(v) => update("pricing", "wyomingStarter", v)} />
              </Field>
              <Field label="WY Standard">
                <NumberInput value={settings.pricing.wyomingStandard} onChange={(v) => update("pricing", "wyomingStandard", v)} />
              </Field>
              <Field label="WY Advanced">
                <NumberInput value={settings.pricing.wyomingAdvanced} onChange={(v) => update("pricing", "wyomingAdvanced", v)} />
              </Field>
            </div>
          </Panel>

          <Panel
            title={isFr ? "Virement bancaire" : "Bank transfer"}
            subtitle={isFr ? "Coordonnées à communiquer au client pour les paiements par virement." : "Bank details shared with clients for bank transfer payments."}
          >
            <Field label={isFr ? "Banque" : "Bank"}>
              <Input value={settings.bank.bankName} onChange={(v) => update("bank", "bankName", v)} />
            </Field>

            <Field label={isFr ? "Titulaire" : "Account name"}>
              <Input value={settings.bank.accountName} onChange={(v) => update("bank", "accountName", v)} />
            </Field>

            <Field label="IBAN / Account number">
              <Input value={settings.bank.iban} onChange={(v) => update("bank", "iban", v)} />
            </Field>

            <Field label="SWIFT / BIC">
              <Input value={settings.bank.swift} onChange={(v) => update("bank", "swift", v)} />
            </Field>

            <Field label="Instructions FR">
              <Textarea value={settings.bank.instructionsFr} onChange={(v) => update("bank", "instructionsFr", v)} />
            </Field>

            <Field label="Instructions EN">
              <Textarea value={settings.bank.instructionsEn} onChange={(v) => update("bank", "instructionsEn", v)} />
            </Field>
          </Panel>

          <Panel
            title={isFr ? "Espace client" : "Client portal"}
            subtitle={isFr ? "Règles générales de l’espace client." : "General client portal rules."}
          >
            <Field label={isFr ? "Email notification admin" : "Admin notification email"}>
              <Input value={settings.portal.adminNotificationEmail} onChange={(v) => update("portal", "adminNotificationEmail", v)} />
            </Field>

            <Toggle
              label={isFr ? "Vérification email obligatoire" : "Require email verification"}
              value={settings.portal.requireEmailVerification}
              onChange={(v) => update("portal", "requireEmailVerification", v)}
            />

            <Toggle
              label={isFr ? "Autoriser les messages client" : "Allow client messages"}
              value={settings.portal.allowClientMessages}
              onChange={(v) => update("portal", "allowClientMessages", v)}
            />

            <Toggle
              label={isFr ? "Autoriser le téléchargement documents" : "Allow document downloads"}
              value={settings.portal.allowDocumentDownload}
              onChange={(v) => update("portal", "allowDocumentDownload", v)}
            />
          </Panel>
        </div>
      )}
    </AdminShell>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[16px] border border-[#E8E2DC] bg-white p-7 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
        Module
      </div>

      <h3 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#2B2F36]">
        {title}
      </h3>

      <p className="mt-3 text-sm font-semibold leading-7 text-[#2B2F36]/65">
        {subtitle}
      </p>

      <div className="mt-6 space-y-4">
        {children}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#123A63]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold text-[#2B2F36] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-orange-100"
    />
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <input
      type="number"
      value={Number(value || 0)}
      onChange={(e) => onChange(Number(e.target.value || 0))}
      className="h-12 w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 text-sm font-bold text-[#2B2F36] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-orange-100"
    />
  );
}

function Textarea({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[110px] w-full rounded-[10px] border border-[#E8E2DC] bg-white px-4 py-3 text-sm font-bold leading-7 text-[#2B2F36] outline-none focus:border-[#F15A24] focus:ring-4 focus:ring-orange-100"
    />
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-[12px] border border-[#E8E2DC] bg-[#FFF7F1] px-5 py-4 text-left text-sm font-black text-[#2B2F36]"
    >
      <span>{label}</span>
      <span
        className={[
          "relative h-7 w-12 rounded-full transition",
          value ? "bg-[#F15A24]" : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white transition",
            value ? "left-6" : "left-1",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
