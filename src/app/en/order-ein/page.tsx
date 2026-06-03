import Link from "next/link";

const requiredInfo = [
  "US company name",
  "State of formation",
  "Responsible person's name",
  "Email address",
  "Country of residence",
  "Useful copy or information depending on your situation",
];

function Check() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E6EDF5] bg-white text-xs font-black text-[#F15A24]">
      ✓
    </span>
  );
}

export default function EnglishOrderEinPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/en" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">
              V
            </span>
            <span>
              <span className="block text-lg font-black tracking-[-0.04em] text-[#123A63]">
                VEMO <span className="text-[#F15A24]">TECH</span>
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                Dedicated EIN application
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/en/ein" className="rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">
              Back to EIN
            </Link>
            <Link href="/fr/order-ein" className="hidden border-l border-[#E6EDF5] pl-5 text-sm font-black text-[#123A63] hover:text-[#F15A24] sm:inline-flex">
              FR
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[12px] border border-[#E6EDF5] bg-white px-4 py-2 text-sm font-black text-[#123A63]">
            <span className="text-[#F15A24]">29 USD</span>
            <span>EIN order only</span>
          </div>

          <h1 className="mt-8 max-w-3xl text-[42px] font-black leading-[1.05] tracking-[-0.055em] text-[#111827] md:text-[60px]">
            Order your <span className="text-[#F15A24]">EIN</span>
            <br />
            without forming a new LLC
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-500">
            This flow is dedicated only to EIN application. It does not start the full LLC formation journey.
            It is suitable if your company is already formed or if you only want the EIN service.
          </p>

          <div className="mt-8 rounded-[28px] border border-[#E6EDF5] bg-white p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F15A24]">
              Required information
            </p>
            <div className="mt-5 grid gap-3">
              {requiredInfo.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check />
                  <span className="text-sm font-bold text-[#123A63]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-6">
          <div className="border-b border-[#E6EDF5] pb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F15A24]">
              EIN form
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#111827]">
              EIN Application — 29 USD
            </h2>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
              Fill in this information. Payment and tracking can then be finalized from your VEMO space.
            </p>
          </div>

          <form action="/en/thank-you?service=ein" className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Full name</span>
                <input required name="fullName" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Your name" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Email</span>
                <input required type="email" name="email" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="email@example.com" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">LLC name</span>
                <input required name="companyName" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Example LLC" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">State</span>
                <select required name="state" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]">
                  <option value="">Choose</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="Wyoming">Wyoming</option>
                  <option value="Other">Other state</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Country of residence</span>
                <input required name="country" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Example: Morocco" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Phone / WhatsApp</span>
                <input name="phone" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="+212..." />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Message or details</span>
              <textarea name="message" rows={4} className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Add any useful detail..." />
            </label>

            <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-[#123A63]">Standalone EIN service</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">Outside full LLC formation</p>
                </div>
                <p className="text-3xl font-black tracking-[-0.06em] text-[#F15A24]">29 USD</p>
              </div>
            </div>

            <button type="submit" className="rounded-[18px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">
              Continue EIN order
            </button>
          </form>
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
