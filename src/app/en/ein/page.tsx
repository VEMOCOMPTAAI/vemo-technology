import Link from "next/link";

export default function EnglishEinPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Link href="/en" className="text-sm font-black text-[#F15A24]">← Back home</Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">Standalone EIN service</p>
            <h1 className="mt-5 text-[48px] font-black leading-[0.98] tracking-[-0.075em] md:text-[72px]">
              EIN application for your US company
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-500">
              VEMO helps you prepare and follow your EIN application for banking, Stripe, PayPal, Mercury, Wise or Payoneer.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/en/start?service=ein" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white">
                Order for 29 USD
              </Link>
              <Link href="/en/contact" className="rounded-[16px] border border-[#E6EDF5] px-6 py-4 text-sm font-black text-[#123A63]">
                Ask a question
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E6EDF5] bg-white p-6">
            <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Price</p>
              <p className="mt-3 text-[54px] font-black tracking-[-0.08em] text-[#123A63]">29 USD</p>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-500">Standalone EIN service, outside the full LLC formation package.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
