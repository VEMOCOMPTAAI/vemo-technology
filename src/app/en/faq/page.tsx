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
  return (
    <>
      <VemoPublicHeader locale="en" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-6xl px-6 py-16">
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

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {faqs.map((item, index) => (
              <article
                key={item.q}
                className="rounded-[28px] border border-[#DDE7F2] bg-white p-7 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#F15A24] text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-xl font-black tracking-[-0.03em] text-[#111827]">
                      {item.q}
                    </h2>
                    <p className="mt-4 text-sm font-bold leading-7 text-slate-600">
                      {item.a}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[32px] border border-[#DDE7F2] bg-[#F8FAFC] p-8 text-center">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#111827]">
              Have another question?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-600">
              Contact VEMO before starting your order to choose the right package.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/en/contact"
                className="rounded-[14px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Contact VEMO →
              </Link>
            </div>
          </div>
        </section>

        <VemoPublicFooter locale="en" />
      </main>
    </>
  );
}
