"use client";

import { useState } from "react";
import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

const faqs = [
  ["Can I form a US LLC as a non-resident?", "Yes. A non-resident can form a US LLC depending on the state and activity."],
  ["New Mexico or Wyoming?", "New Mexico is simple and cost-effective. Wyoming has a stronger business image."],
  ["Are filing fees included?", "Yes, they are included in the displayed packages."],
  ["Is the Registered Agent included?", "Yes, the first year is included. Renewal depends on the state."],
  ["Is the EIN included?", "Yes, depending on the package. Timelines depend on the IRS."],
  ["Can I request EIN only?", "Yes, if your LLC already exists and the required information is available."],
  ["Are Stripe, Mercury, Wise or Payoneer guaranteed?", "No. VEMO prepares your file, but each platform makes its own decision."],
  ["Which documents will I receive?", "LLC documents, Operating Agreement, Registered Agent, EIN if included, and tracking documents."],
  ["How can I track my order?", "From your client portal: status, documents, messages and remaining steps."],
  ["Is bank transfer available?", "Yes, with proof upload before validation."],
  ["Can I edit my information?", "Yes before filing. After filing, it depends on the state and may generate fees."],
];

export default function FaqEnPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <VemoPublicHeader locale="en" />
      <main className="vemo-public-zero-reflets min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">FAQ</p>
            <h1 className="mt-3 text-[38px] font-black tracking-[-0.06em] md:text-[52px]">Frequently Asked Questions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-slate-600">Quick answers before starting your LLC.</p>
          </div>

          <div className="mt-9 space-y-3">
            {faqs.map(([q, a], index) => {
              const isOpen = openIndex === index;
              return (
                <article key={q} className="overflow-hidden rounded-[20px] border border-[#DDE7F2] bg-white">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="text-base font-black tracking-[-0.02em] md:text-lg">{q}</span>
                    <span className={(isOpen ? "rotate-45 bg-[#F15A24] text-white" : "border border-[#DDE7F2] bg-white text-[#F15A24]") + " flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl font-black transition"}>+</span>
                  </button>
                  {isOpen && <div className="border-t border-[#E6EDF5] bg-[#F8FAFC] px-6 py-5"><p className="text-sm font-bold leading-7 text-slate-600">{a}</p></div>}
                </article>
              );
            })}
          </div>

          <div className="mt-9 rounded-[28px] border border-[#DDE7F2] bg-[#F8FAFC] p-7 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em]">Another question?</h2>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/en/contact" className="rounded-[14px] bg-[#F15A24] px-6 py-3.5 text-sm font-black text-white hover:bg-[#DB4F1C]">Contact</Link>
              <Link href="/en/pricing" className="rounded-[14px] border border-[#DDE7F2] bg-white px-6 py-3.5 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">Pricing</Link>
            </div>
          </div>
        </section>
        <VemoPublicFooter locale="en" />
      </main>
    </>
  );
}
