"use client";

import { useState } from "react";
import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

const faqs = [
  ["Can I form a US LLC if I am not a US resident?", "Yes. A non-resident can form a US LLC. Requirements depend on the selected state, business activity and founder profile."],
  ["Which state should I choose between New Mexico and Wyoming?", "New Mexico is often selected for simplicity and lower costs. Wyoming is often selected for branding, privacy and a stronger structure."],
  ["Are state filing fees included?", "Yes. State filing fees are included in the displayed packages."],
  ["Is the Registered Agent included?", "Yes. The Registered Agent is included for the first year. Renewal depends on the selected state."],
  ["Is the EIN included?", "The EIN is included depending on the selected package. Timelines may vary depending on the IRS and processing method."],
  ["Can I request EIN only?", "Yes. EIN-only processing can be handled if your LLC already exists and the required information is available."],
  ["Can I open Stripe, Mercury, Wise or Payoneer after formation?", "VEMO prepares and organizes your file to support your applications, but final approval depends on each platform."],
  ["Does VEMO guarantee bank approval?", "No. VEMO helps prepare your file, but each bank or platform keeps its own final decision process."],
  ["Which documents will I receive?", "Depending on your package, you receive LLC formation documents, Operating Agreement, Registered Agent information, EIN if included and useful tracking documents."],
  ["How can I track my order?", "After payment and activation, you access your client portal to track status, documents, messages and remaining steps."],
  ["Is bank transfer payment available?", "Yes. Bank transfer payment can be supported with proof upload before validation."],
  ["Can I change information after submission?", "Some information can be corrected before filing. After official filing, changes depend on the state and may generate extra fees."]
];

export default function FaqEnPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <VemoPublicHeader locale="en" />
      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">FAQ</p>
            <h1 className="mt-4 text-[44px] font-black tracking-[-0.06em] md:text-[64px]">Frequently Asked Questions</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">Key answers before setting up and tracking your US LLC with Vemo Technology.</p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map(([q, a], index) => {
              const isOpen = openIndex === index;
              return (
                <article key={q} className="overflow-hidden rounded-[24px] border border-[#DDE7F2] bg-white shadow-sm">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 px-7 py-6 text-left">
                    <span className="text-lg font-black tracking-[-0.03em] md:text-xl">{q}</span>
                    <span className={(isOpen ? "rotate-45 bg-[#F15A24] text-white" : "border border-[#DDE7F2] bg-white text-[#F15A24]") + " flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl font-black transition"}>+</span>
                  </button>
                  {isOpen && <div className="border-t border-[#E6EDF5] bg-[#F8FAFC] px-7 py-6"><p className="text-base font-bold leading-8 text-slate-600">{a}</p></div>}
                </article>
              );
            })}
          </div>

          <div className="mt-12 rounded-[32px] border border-[#DDE7F2] bg-[#F8FAFC] p-8 text-center">
            <h2 className="text-3xl font-black tracking-[-0.04em]">Have another question?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-600">Contact VEMO before starting your order to choose the right package.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/en/contact" className="rounded-[14px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">Contact VEMO →</Link>
              <Link href="/en/pricing" className="rounded-[14px] border border-[#DDE7F2] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">View pricing</Link>
            </div>
          </div>
        </section>
        <VemoPublicFooter locale="en" />
      </main>
    </>
  );
}
