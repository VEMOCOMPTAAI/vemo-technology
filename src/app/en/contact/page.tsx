import VemoPublicHeader from "@/components/site/VemoPublicHeader";

export default function ContactEnPage() {
  return (
    <>
      <VemoPublicHeader locale="en" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              Contact
            </p>

            <h1 className="mt-3 text-[44px] font-black tracking-[-0.05em] text-[#111827] md:text-[56px]">
              Contact Vemo Technology
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Questions about LLC formation, payment, your order or your support process?
            </p>
          </div>

          <div className="mt-12 grid gap-5">
            <div className="rounded-[26px] border border-[#DDE7F2] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
                Email
              </h2>
              <p className="mt-5 text-base font-bold leading-8 text-slate-600">
                Contact: <span className="text-[#123A63]">contact@vemo-technology.com</span>
              </p>
              <p className="mt-4 text-base font-bold leading-8 text-slate-600">
                Replace this email with your official address before public launch.
              </p>
            </div>

            <div className="rounded-[26px] border border-[#DDE7F2] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
                Client support
              </h2>
              <p className="mt-5 text-base font-bold leading-8 text-slate-600">
                Requests are handled by priority: payment, active case, LLC formation,
                then general inquiries.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
