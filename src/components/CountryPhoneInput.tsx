"use client";

import countriesRaw from "world-countries";
import {
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

type CountryPhoneInputProps = {
  label: string;
  value: string;
  country: string;
  onChange: (phone: string, countryCode: string) => void;
  lang?: "fr" | "en";
};

type PhoneCountry = {
  name: string;
  code: string;
  flag: string;
  dial: string;
};

function countryCodeToFlag(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

const countries: PhoneCountry[] = countriesRaw
  .filter((country) => country.cca2 !== "EH")
  .map((country) => {
    let dial = "";

    try {
      dial = `+${getCountryCallingCode(country.cca2 as any)}`;
    } catch {
      dial = country.idd?.root || "";
    }

    return {
      name: country.name.common,
      code: country.cca2,
      flag: country.flag || countryCodeToFlag(country.cca2),
      dial,
    };
  })
  .filter((country) => country.dial)
  .sort((a, b) => {
    const priority = ["MA", "FR", "US", "CA", "GB", "ES", "IT", "DE", "AE", "SA"];
    const aIndex = priority.indexOf(a.code);
    const bIndex = priority.indexOf(b.code);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.name.localeCompare(b.name);
  });

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function findCountry(value: string) {
  return (
    countries.find((country) => country.code === value || country.name === value) ||
    countries.find((country) => country.code === "MA") ||
    countries[0]
  );
}

function detectCountryFromPhone(phone: string) {
  const clean = normalizePhone(phone);

  if (!clean.startsWith("+")) return null;

  return (
    countries
      .slice()
      .sort((a, b) => b.dial.length - a.dial.length)
      .find((country) => clean.startsWith(country.dial)) || null
  );
}

export default function CountryPhoneInput({
  label,
  value,
  country,
  onChange,
  lang = "fr",
}: CountryPhoneInputProps) {
  const selected = findCountry(country || "MA");
  const phoneValue = value || selected.dial;

  const parsed = parsePhoneNumberFromString(phoneValue);
  const valid =
    phoneValue.length <= selected.dial.length + 1
      ? true
      : isValidPhoneNumber(phoneValue);

  function updateCountry(nextCode: string) {
    const nextCountry = findCountry(nextCode);
    const current = normalizePhone(phoneValue);

    let national = current;

    if (current.startsWith(selected.dial)) {
      national = current.slice(selected.dial.length);
    }

    national = national.replace(/^0+/, "");

    onChange(`${nextCountry.dial}${national}`, nextCountry.code);
  }

  function updatePhone(nextValue: string) {
    let clean = normalizePhone(nextValue);

    if (!clean.startsWith("+")) {
      clean = `${selected.dial}${clean.replace(/^0+/, "")}`;
    }

    const detected = detectCountryFromPhone(clean);

    if (detected) {
      onChange(clean, detected.code);
      return;
    }

    onChange(clean, selected.code);
  }

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>

      <div className="grid gap-3 md:grid-cols-[240px_1fr]">
        <div className="relative">
          <select
            value={selected.code}
            onChange={(event) => updateCountry(event.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-10 text-sm font-black outline-none transition focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10"
          >
            {countries.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.name} {item.dial}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
            ▼
          </span>
        </div>

        <input
          type="tel"
          value={phoneValue}
          onChange={(event) => updatePhone(event.target.value)}
          placeholder={`${selected.dial} 600000000`}
          className={[
            "w-full rounded-2xl border bg-white px-4 py-4 text-sm font-black outline-none transition focus:ring-4",
            valid
              ? "border-slate-200 focus:border-[#F15A24] focus:ring-[#F15A24]/10"
              : "border-red-300 focus:border-red-500 focus:ring-red-100",
          ].join(" ")}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-black">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
          {selected.flag} {selected.name}
        </span>

        <span className="rounded-full bg-white px-3 py-1 text-[#F15A24]">
          {selected.dial}
        </span>

        {phoneValue.length > selected.dial.length + 1 && (
          <span
            className={[
              "rounded-full px-3 py-1",
              valid ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
            ].join(" ")}
          >
            {valid
              ? lang === "fr"
                ? "Numéro valide"
                : "Valid number"
              : lang === "fr"
                ? "Numéro invalide"
                : "Invalid number"}
          </span>
        )}

        {parsed?.country && (
          <span className="rounded-full bg-slate-50 px-3 py-1 text-slate-500">
            {lang === "fr" ? "Détecté" : "Detected"} : {parsed.country}
          </span>
        )}
      </div>
    </label>
  );
}