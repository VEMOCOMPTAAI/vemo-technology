import Link from "next/link";

const benefits = [
  "Standalone EIN service for 29 USD",
  "Preparation of the required information",
  "Support for non-resident entrepreneurs",
  "Useful for Stripe, Mercury, Wise, Payoneer and PayPal",
  "Clear tracking from your client portal",
  "Compatible with an already formed LLC",
];

const steps = [
  ["01", "Information review", "We review the required information before preparing the EIN request."],
  ["02", "File preparation", "We organize the required elements depending on your company situation."],
  ["03", "Request tracking", "You track progress and messages from your VEMO client portal."],
  ["04", "EIN delivery", "The EIN is shared once received and archived in your client space."],
];

function Check() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E6EDF5] bg-white text-xs font-black text-[#F15A24]">
      ✓
    </span>
  );
}

export default function EnglishEinPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/en" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">V</span>
            <span>
              <span className="block text-lg font-black tracking-[-0.04em] text-[#123A63]">
                VEMO <span className="text-[#F15A24]">TECH</span>
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                US LLC for non-residents
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-black text-[#123A63] lg:flex">
            <Link href="/en" className="hover:text-[#F15A24]">Home</Link>
            <Link href="/en/start" className="hover:text-[#F15A24]">Business Setup</Link>
            <Link href="/en/pricing" className="hover:text-[#F15A24]">Pricing</Link>
            <Link href="/en/ein" className="text-[#F15A24]">EIN</Link>
            <Link href="/en/banking-guidance" className="hover:text-[#F15A24]">Banking</Link>
            <Link href="/en/contact" className="hover:text-[#F15A24]">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/fr/ein" className="hidden border-l border-[#E6EDF5] pl-5 text-sm font-black text-[#123A63] hover:text-[#F15A24] sm:inline-flex">
              FR
            </Link>
            <Link href="/en/start?service=ein" className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white hover:bg-[#DB4F1C]">
              Apply for EIN
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[12px] border border-[#E6EDF5] bg-white px-4 py-2 text-sm font-black text-[#123A63]">
            <span className="text-[#F15A24]">29 USD</span>
            <span>standalone EIN service</span>
          </div>

          <h1 className="mt-8 max-w-3xl text-[42px] font-black leading-[1.05] tracking-[-0.055em] text-[#111827] md:text-[60px]">
            Apply for your <span className="text-[#F15A24]">EIN</span>
            <br />
            for your US company
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-500">
            VEMO helps you prepare and track your EIN application, useful for banking,
            Stripe, Mercury, PayPal, Wise or Payoneer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/en/start?service=ein" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]">
              Order EIN 29 USD
            </Link>
            <Link href="/en/contact" className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]">
              Ask a question
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E6EDF5] pb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F15A24]">
                Dedicated service
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#111827]">
                EIN only
              </h2>
            </div>
            <span className="rounded-full bg-[#F15A24] px-3 py-1 text-xs font-black text-white">
              29 USD
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-[18px] border border-[#E6EDF5] bg-white p-4">
                <Check />
                <span className="text-sm font-bold text-[#123A63]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E6EDF5] bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
              Process
            </p>
            <h2 className="text-[36px] font-black tracking-[-0.06em] md:text-[52px]">
              How does the EIN application work?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-7 text-slate-500">
              A simple and clear process tracked from your VEMO client space.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {steps.map(([number, title, text]) => (
              <div key={number} className="rounded-[24px] border border-[#E6EDF5] bg-white p-6">
                <p className="text-[34px] font-black tracking-[-0.06em] text-[#F15A24]">{number}.</p>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#111827]">{title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[28px] border border-[#E6EDF5] bg-white p-8 text-center md:p-12">
          <h2 className="text-[34px] font-black tracking-[-0.06em] md:text-[52px]">
            Need only an EIN?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-slate-500">
            Order the standalone EIN service or choose a full LLC package including EIN application.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/en/start?service=ein" className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">
              Order EIN
            </Link>
            <Link href="/en/pricing" className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">
              View LLC packages
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#0F3558] bg-[#123A63] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          <div>
            <p className="text-2xl font-black tracking-[-0.05em] text-white">
              VEMO<span className="text-[#F15A24]">TECH</span>
            </p>
            <p className="mt-5 max-w-xs text-sm font-bold leading-7 text-white/75">
              Professional support to form, structure and track your US LLC remotely.
            </p>
          </div>
          <div>
            <p className="text-sm font-black text-white">Navigation</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/en" className="block hover:text-white">Home</Link>
              <Link href="/en/pricing" className="block hover:text-white">Pricing</Link>
              <Link href="/en/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-white">Services</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/en/start" className="block hover:text-white">LLC Formation</Link>
              <Link href="/en/ein" className="block hover:text-white">EIN</Link>
              <Link href="/en/banking-guidance" className="block hover:text-white">Banking Guidance</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-white">Legal</p>
            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
              <Link href="/en/terms" className="block hover:text-white">Terms</Link>
              <Link href="/en/privacy" className="block hover:text-white">Privacy</Link>
              <Link href="/en/refund-policy" className="block hover:text-white">Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs font-black text-white/60">
          © 2026 Vemo Technology. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
