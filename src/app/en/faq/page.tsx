import VemoPublicHeader from "@/components/site/VemoPublicHeader";

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
    a: "Yes, state filing fees are included in the displayed packages.",
  },
  {
    q: "Is the Registered Agent included?",
    a: "Yes, the Registered Agent is included for the first year. Renewal depends on the selected state.",
  },
];

export default function FaqEnPage() {
  return (
    <>
      <VemoPublicHeader locale="en" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              FAQ
            </p>

            <h1 className="mt-3 text-[44px] font-black tracking-[-0.05em] text-[#111827] md:text-[56px]">
              Frequently Asked Questions
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Key answers before setting up your US LLC with Vemo Technology.
            </p>
          </div>

          <div className="mt-12 space-y-5">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-[26px] border border-[#DDE7F2] bg-white p-8 shadow-sm"
              >
                <h2 className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
                  {item.q}
                </h2>
                <p className="mt-5 text-base font-bold leading-8 text-slate-600">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
