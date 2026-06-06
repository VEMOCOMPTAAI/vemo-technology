"use client";

import { useState } from "react";
import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

const faqs = [
  {
    q: "Can I form a US LLC if I am not a US resident?",
    a: "Yes. A non-resident can form a US LLC. Requirements depend on the selected state, business activity and founder profile.",
  },
  {
    q: "Which state should I choose between New Mexico and Wyoming?",
    a: "New Mexico is often selected for simplicity and lower costs. Wyoming is often selected for branding, privacy and a stronger structure.",
  },
  {
    q: "Is the EIN included?",
    a: "The EIN is included depending on the selected package. Timelines may vary depending on the IRS and processing method.",
  },
  {
    q: "Are state filing fees included?",
    a: "Yes. State filing fees are included in the displayed packages.",
  },
  {
    q: "Is the Registered Agent included?",
    a: "Yes. The Registered Agent is included for the first year. Renewal depends on the selected state.",
  },
  {
    q: "Can I open Stripe, Mercury, Wise or Payoneer after formation?",
    a: "VEMO prepares and organizes your file to support your applications, but final approval depends on each platform.",
  },
];

export default function FaqEnPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <VemoPublicHeader locale="en" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              FAQ
            </p>

            <h1 className="mt-4 text-[44px] font-black tracking-[-0.06em] text-[#111827] md:text-[64px]">
              Frequently Asked Questions
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Key answers before setting up your US LLC with Vemo Technology.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <article
                  key={item.q}
                  className="overflow-hidden rounded-[26px] border border-[#DDE7F2] bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-7 py-6 text-left"
                  >
                    <span className="text-xl font-black tracking-[-0.03em] text-[#111827]">
                      {item.q}
                    </span>

                    <span
                      className={
                        isOpen
                          ? "flex h-10 w-10 shrink-0 rotate-45 items-center justify-center rounded-full bg-[#F15A24] text-2xl font-black text-white transition"
                          : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE7F2] bg-white text-2xl font-black text-[#F15A24] transition"
                      }
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#E6EDF5] bg-[#F8FAFC] px-7 py-6">
                      <p className="text-base font-bold leading-8 text-slate-600">
                        {item.a}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-12 rounded-[32px] border border-[#DDE7F2] bg-[#F8FAFC] p-8 text-center">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#111827]">
              Have another question?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-600">
              Contact VEMO before starting your order to choose the right package.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/en/contact"
                className="rounded-[14px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Contact VEMO →
              </Link>
              <a
                href="https://wa.me/212708069471"
                target="_blank"
                rel="noreferrer"
                className="rounded-[14px] border border-[#DDE7F2] bg-white px-6 py-4 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        <VemoPublicFooter locale="en" />
      </main>
    </>
  );
}
