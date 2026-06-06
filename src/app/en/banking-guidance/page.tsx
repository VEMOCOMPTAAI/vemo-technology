import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import Link from "next/link";

const tools = [
  ["Stripe", "Prepare the information required to open or configure Stripe."],
  ["PayPal", "Guidance to prepare your business account."],
  ["Mercury", "Document guidance for a US business bank account."],
  ["Wise", "Preparation and organization of business information."],
  ["Payoneer", "Guidance depending on your activity and country."],
  ["Shopify", "Launch support for e-commerce with your LLC."],
];

export default function EnglishBankingGuidancePage() {
  return (
    <>
      <VemoPublicHeader locale="en" />
      <main className="min-h-screen bg-white text-[#111827]">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Link href="/en" className="text-sm font-black text-[#F15A24]">← Back home</Link>

        <p className="mt-10 text-center text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
          Banking & payments
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-center text-[46px] font-black leading-[1] tracking-[-0.075em] md:text-[68px]">
          Guidance for banking and payment tools
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-bold leading-8 text-slate-500">
          VEMO helps you prepare the information and documents needed for Stripe, PayPal, Mercury, Wise, Payoneer and Shopify.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map(([title, text]) => (
            <div key={title} className="rounded-[24px] border border-[#E6EDF5] bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#E6EDF5] text-[#F15A24]">
                ◦
              </span>
              <h2 className="mt-6 text-2xl font-black tracking-[-0.04em] text-[#123A63]">{title}</h2>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
    </>
  );
}
