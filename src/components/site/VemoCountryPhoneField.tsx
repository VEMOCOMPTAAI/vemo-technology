"use client";

import { useMemo, useState } from "react";

type Locale = "fr" | "en";

const countries = [
  { flag: "🇲🇦", fr: "Maroc", en: "Morocco", dial: "+212", min: 9, max: 9 },
  { flag: "🇫🇷", fr: "France", en: "France", dial: "+33", min: 9, max: 9 },
  { flag: "🇺🇸", fr: "États-Unis", en: "United States", dial: "+1", min: 10, max: 10 },
  { flag: "🇨🇦", fr: "Canada", en: "Canada", dial: "+1", min: 10, max: 10 },
  { flag: "🇬🇧", fr: "Royaume-Uni", en: "United Kingdom", dial: "+44", min: 9, max: 10 },
  { flag: "🇪🇸", fr: "Espagne", en: "Spain", dial: "+34", min: 9, max: 9 },
  { flag: "🇮🇹", fr: "Italie", en: "Italy", dial: "+39", min: 9, max: 10 },
  { flag: "🇩🇪", fr: "Allemagne", en: "Germany", dial: "+49", min: 10, max: 11 },
  { flag: "🇧🇪", fr: "Belgique", en: "Belgium", dial: "+32", min: 8, max: 9 },
  { flag: "🇳🇱", fr: "Pays-Bas", en: "Netherlands", dial: "+31", min: 9, max: 9 },
  { flag: "🇵🇹", fr: "Portugal", en: "Portugal", dial: "+351", min: 9, max: 9 },
  { flag: "🇨🇭", fr: "Suisse", en: "Switzerland", dial: "+41", min: 9, max: 9 },
  { flag: "🇦🇪", fr: "Émirats arabes unis", en: "United Arab Emirates", dial: "+971", min: 8, max: 9 },
  { flag: "🇸🇦", fr: "Arabie saoudite", en: "Saudi Arabia", dial: "+966", min: 8, max: 9 },
  { flag: "🇶🇦", fr: "Qatar", en: "Qatar", dial: "+974", min: 8, max: 8 },
  { flag: "🇰🇼", fr: "Koweït", en: "Kuwait", dial: "+965", min: 8, max: 8 },
  { flag: "🇪🇬", fr: "Égypte", en: "Egypt", dial: "+20", min: 10, max: 10 },
  { flag: "🇩🇿", fr: "Algérie", en: "Algeria", dial: "+213", min: 9, max: 9 },
  { flag: "🇹🇳", fr: "Tunisie", en: "Tunisia", dial: "+216", min: 8, max: 8 },
  { flag: "🇸🇳", fr: "Sénégal", en: "Senegal", dial: "+221", min: 9, max: 9 },
  { flag: "🇨🇮", fr: "Côte d’Ivoire", en: "Côte d’Ivoire", dial: "+225", min: 8, max: 10 },
  { flag: "🇹🇷", fr: "Turquie", en: "Turkey", dial: "+90", min: 10, max: 10 },
  { flag: "🇮🇳", fr: "Inde", en: "India", dial: "+91", min: 10, max: 10 },
  { flag: "🇨🇳", fr: "Chine", en: "China", dial: "+86", min: 11, max: 11 },
  { flag: "🇯🇵", fr: "Japon", en: "Japan", dial: "+81", min: 10, max: 10 },
  { flag: "🇧🇷", fr: "Brésil", en: "Brazil", dial: "+55", min: 10, max: 11 },
  { flag: "🇲🇽", fr: "Mexique", en: "Mexico", dial: "+52", min: 10, max: 10 },
].sort((a, b) => a.fr.localeCompare(b.fr));

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export default function VemoCountryPhoneField({ locale }: { locale: Locale }) {
  const isFr = locale === "fr";
  const [country, setCountry] = useState(countries.find((c) => c.dial === "+212") || countries[0]);
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return countries;
    return countries.filter((c) => {
      const name = isFr ? c.fr : c.en;
      return name.toLowerCase().includes(s) || c.dial.includes(s);
    });
  }, [q, isFr]);

  function handlePhone(value: string) {
    const clean = value.trim();

    if (clean.startsWith("+")) {
      const found = countries
        .slice()
        .sort((a, b) => b.dial.length - a.dial.length)
        .find((c) => clean.startsWith(c.dial));

      if (found) {
        setCountry(found);
        setPhone(digits(clean.slice(found.dial.length)));
        return;
      }
    }

    setPhone(digits(value));
  }

  const valid = phone.length === 0 || (phone.length >= country.min && phone.length <= country.max);

  return (
    <div className="grid gap-3 md:grid-cols-[170px_1fr]">
      <div className="relative">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          {isFr ? "Indicatif" : "Code"}
        </span>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-full items-center justify-between rounded-[14px] border border-[#DDE7F2] bg-white px-3 text-sm font-black text-[#111827] outline-none hover:border-[#F15A24]"
        >
          <span className="flex items-center gap-2">
            <span>{country.flag}</span>
            <span>{country.dial}</span>
          </span>
          <span className="text-[#F15A24]">⌄</span>
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-[300px] overflow-hidden rounded-[18px] border border-[#DDE7F2] bg-white shadow-xl">
            <div className="border-b border-[#E6EDF5] p-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={isFr ? "Rechercher..." : "Search..."}
                className="h-10 w-full rounded-[12px] border border-[#DDE7F2] px-3 text-sm font-bold outline-none focus:border-[#F15A24]"
              />
            </div>

            <div className="max-h-60 overflow-auto p-2">
              {filtered.map((c) => (
                <button
                  key={c.dial + c.fr}
                  type="button"
                  onClick={() => {
                    setCountry(c);
                    setQ("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
                >
                  <span>{c.flag}</span>
                  <span className="w-14 font-black text-[#123A63]">{c.dial}</span>
                  <span className="truncate">{isFr ? c.fr : c.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <label className="grid gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          {isFr ? "Téléphone / WhatsApp" : "Phone / WhatsApp"}
        </span>

        <input
          required
          value={phone}
          onChange={(e) => handlePhone(e.target.value)}
          placeholder="0663000000"
          className={[
            "h-12 rounded-[14px] border bg-white px-4 text-sm font-bold outline-none focus:border-[#F15A24]",
            valid ? "border-[#DDE7F2]" : "border-red-300",
          ].join(" ")}
        />

        {!valid && (
          <span className="text-xs font-black text-red-500">
            {isFr ? "Numéro invalide." : "Invalid number."}
          </span>
        )}
      </label>
    </div>
  );
}
