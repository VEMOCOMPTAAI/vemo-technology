"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

type Locale = "fr" | "en";

const packs = [
  ["New Mexico Starter", 119, "Essential filing to get your NM LLC started."],
  ["New Mexico Standard", 179, "Our most popular package for new businesses."],
  ["New Mexico Advanced", 199, "Complete setup with ongoing support."],
  ["Wyoming Starter", 189, "Affordable formation in business-friendly Wyoming."],
  ["Wyoming Standard", 239, "Privacy-focused setup with essential tools."],
  ["Wyoming Advanced", 299, "Full-service support to grow with confidence."],
];

export default function PricingUnifiedPage({ locale }: { locale: Locale }) {
  const isFr = locale === "fr";

  return (
    <div className="min-h-screen bg-[#fff7f1] text-[#2b2f36]">
      <SiteHeader lang={locale} />

      <main className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#F15A24] shadow-sm">
              {isFr ? "Tarifs" : "Packages"}
            </div>

            <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em]">
              {isFr ? "Choisissez le bon accompagnement pour votre LLC." : "Choose the right support package for your LLC."}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-7 text-[#2b2f36]/72">
              {isFr
                ? "Des formules simples, claires et adaptées aux entrepreneurs non-résidents."
                : "Transparent, fixed-price packages for non-resident founders."}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packs.map(([name, price, desc], index) => {
              const recommended = index === 1 || index === 4;
              const params = new URLSearchParams({
                package_name: String(name),
                amount: String(price),
                state: String(name).includes("Wyoming") ? "Wyoming" : "New Mexico",
              });

              return (
                <div
                  key={name}
                  className={[
                    "relative rounded-[8px] border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(43,47,54,0.08)]",
                    recommended ? "border-[#F15A24]" : "border-[#eee7df]",
                  ].join(" ")}
                >
                  {recommended && (
                    <div className="absolute -top-3 right-6 rounded bg-[#F15A24] px-4 py-1 text-xs font-bold text-white">
                      {isFr ? "Recommandé" : "Recommended"}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#123A63]">{name}</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-[#2b2f36]/70">{desc}</p>
                    </div>
                    <div className="text-3xl font-semibold text-[#123A63]">${price}</div>
                  </div>

                  <div className="my-6 h-px bg-[#eee7df]" />

                  <ul className="space-y-3 text-sm font-medium text-[#2b2f36]/78">
                    <li>✓ LLC Formation</li>
                    <li>✓ Registered Agent</li>
                    <li>✓ EIN Guidance</li>
                    <li>✓ Digital Documents</li>
                    <li>✓ Client Support</li>
                  </ul>

                  <Link
                    href={`/${locale}/commencer?${params.toString()}`}
                    className={[
                      "mt-7 flex h-12 items-center justify-center rounded-[4px] border text-sm font-bold transition",
                      recommended
                        ? "border-[#F15A24] bg-[#F15A24] text-white hover:bg-[#d84d1f]"
                        : "border-[#123A63] bg-white text-[#123A63] hover:bg-[#f7fbff]",
                    ].join(" ")}
                  >
                    {isFr ? "Commencer" : "Start"}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <SiteFooter lang={locale} />
    </div>
  );
}