"use client";

import { useState } from "react";

type Locale = "fr" | "en";

const countries = [
  { flag: "🇲🇦", fr: "Maroc", en: "Morocco", dial: "+212", min: 9, max: 9 },
  { flag: "🇫🇷", fr: "France", en: "France", dial: "+33", min: 9, max: 9 },
  { flag: "🇺🇸", fr: "États-Unis", en: "United States", dial: "+1", min: 10, max: 10 },
  { flag: "🇨🇦", fr: "Canada", en: "Canada", dial: "+1", min: 10, max: 10 },
  { flag: "🇬🇧", fr: "Royaume-Uni", en: "United Kingdom", dial: "+44", min: 9, max: 10 },
  { flag: "🇦🇪", fr: "Émirats arabes unis", en: "United Arab Emirates", dial: "+971", min: 8, max: 9 },
  { flag: "🇸🇦", fr: "Arabie saoudite", en: "Saudi Arabia", dial: "+966", min: 8, max: 9 },
  { flag: "🇪🇸", fr: "Espagne", en: "Spain", dial: "+34", min: 9, max: 9 },
  { flag: "🇩🇿", fr: "Algérie", en: "Algeria", dial: "+213", min: 9, max: 9 },
  { flag: "🇹🇳", fr: "Tunisie", en: "Tunisia", dial: "+216", min: 8, max: 8 },
  { flag: "🇸🇳", fr: "Sénégal", en: "Senegal", dial: "+221", min: 9, max: 9 },
  { flag: "🇨🇮", fr: "Côte d’Ivoire", en: "Côte d’Ivoire", dial: "+225", min: 8, max: 10 },
];

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export default function VemoCountryPhoneField({ locale }: { locale: Locale }) {
  const isFr = locale === "fr";
  const [country, setCountry] = useState(countries[0]);
  const [phone, setPhone] = useState("");

  function handlePhone(value: string) {
    const clean = value.trim();

    if (clean.startsWith("+")) {
      const found = countries
        .slice()
        .sort((a, b) => b.dial.length - a.dial.length)
        .find((c) => clean.startsWith(c.dial));

      if (found) {
        setCountry(found);
        setPhone(onlyDigits(clean.slice(found.dial.length)));
        return;
      }
    }

    setPhone(onlyDigits(value));
  }

  const valid = phone.length === 0 || (phone.length >= country.min && phone.length <= country.max);

  return (
    <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          {isFr ? "Indicatif" : "Country code"}
        </span>
        <select
          value={country.dial + country.fr}
          onChange={(e) => {
            const selected = countries.find((c) => c.dial + c.fr === e.target.value);
            if (selected) setCountry(selected);
          }}
          className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-4 text-sm font-black outline-none focus:border-[#F15A24]"
        >
          {countries.map((c) => (
            <option key={c.dial + c.fr} value={c.dial + c.fr}>
              {c.flag} {c.dial} — {isFr ? c.fr : c.en}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          {isFr ? "Numéro" : "Number"}
        </span>
        <input
          required
          value={phone}
          onChange={(e) => handlePhone(e.target.value)}
          placeholder={isFr ? "Ex : 708069471 ou +212708069471" : "Ex: 708069471 or +212708069471"}
          className={(valid ? "border-[#DDE7F2]" : "border-red-300") + " h-14 rounded-[16px] border bg-white px-4 text-sm font-bold outline-none focus:border-[#F15A24]"}
        />
        {!valid && (
          <span className="text-xs font-black text-red-500">
            {isFr ? "Numéro invalide pour le pays sélectionné." : "Invalid number for selected country."}
          </span>
        )}
      </label>
    </div>
  );
}
