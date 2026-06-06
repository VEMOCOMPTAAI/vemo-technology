"use client";

import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";
import VemoCountryPhoneField from "@/components/site/VemoCountryPhoneField";

export default function ContactEnPage() {
  return (
    <>
      <VemoPublicHeader locale="en" />
      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">Contact</p>
            <h1 className="mt-4 text-[44px] font-black tracking-[-0.06em] md:text-[64px]">Contact Vemo Technology</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Send your request. Our team will respond based on your case priority.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl rounded-[34px] border border-[#DDE7F2] bg-white p-7 shadow-sm">
            <div className="border-b border-[#E6EDF5] pb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Secure form</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#123A63]">Send a request</h2>
            </div>

            <form
              className="mt-7 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message prepared. Connect this form to your email/API before launch.");
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Full name</span>
                  <input required className="h-14 rounded-[16px] border border-[#DDE7F2] px-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Your name" />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Email</span>
                  <input required type="email" className="h-14 rounded-[16px] border border-[#DDE7F2] px-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="you@email.com" />
                </label>
              </div>

              <VemoCountryPhoneField locale="en" />

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Subject</span>
                <select className="h-14 rounded-[16px] border border-[#DDE7F2] px-4 text-sm font-bold outline-none focus:border-[#F15A24]">
                  <option>LLC formation</option>
                  <option>Payment / receipt</option>
                  <option>EIN</option>
                  <option>Banking guidance</option>
                  <option>Order support</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Message</span>
                <textarea required rows={6} className="resize-none rounded-[18px] border border-[#DDE7F2] px-4 py-4 text-sm font-bold leading-7 outline-none focus:border-[#F15A24]" placeholder="Describe your request..." />
              </label>

              <div className="mt-2 flex flex-wrap gap-3">
                <button type="submit" className="rounded-[15px] bg-[#F15A24] px-7 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">Send request →</button>
                <a href="https://wa.me/212708069471" target="_blank" rel="noreferrer" className="rounded-[15px] border border-[#DDE7F2] bg-white px-7 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">WhatsApp</a>
                <Link href="/en/pricing" className="rounded-[15px] border border-[#DDE7F2] bg-white px-7 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">View pricing</Link>
              </div>
            </form>
          </div>
        </section>
        <VemoPublicFooter locale="en" />
      </main>
    </>
  );
}
