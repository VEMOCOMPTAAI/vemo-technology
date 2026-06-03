import Link from "next/link";

export default async function EnglishEinPaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = String(params.email || "");
  const companyName = String(params.companyName || "");

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <header className="border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/en" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">V</span>
            <span>
              <span className="block text-lg font-black text-[#123A63]">VEMO<span className="text-[#F15A24]">TECH</span></span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">US LLC for non-residents</span>
            </span>
          </Link>

          <Link href="/en/order-ein" className="rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-black text-[#123A63]">
            ← Back
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-10 gap-2">
          {["Order", "Contact", "Company", "Owner", "Review", "Payment"].map((item, index) => (
            <div key={item} className={index === 5 ? "rounded-[14px] border border-[#F15A24] bg-white p-3 text-[#F15A24]" : "rounded-[14px] border border-[#E6EDF5] bg-white p-3 text-[#123A63]"}>
              <p className="text-[9px] font-black">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-[11px] font-black">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.7fr]">
          <div className="rounded-[28px] border border-[#E6EDF5] bg-white p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#F15A24]">Payment step</p>
                <h1 className="mt-3 text-[38px] font-black tracking-[-0.06em]">Secure payment</h1>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                  Finalize your EIN service by choosing your payment method.
                </p>
              </div>
              <div className="rounded-[18px] border border-[#E6EDF5] bg-white px-5 py-4 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total</p>
                <p className="text-3xl font-black text-[#F15A24]">$29</p>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-[#E6EDF5] bg-white p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#F15A24]">Card payment</p>
              <h2 className="mt-3 text-2xl font-black text-[#123A63]">Card payment via Stripe</h2>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                Enter card payment details on the secure Stripe page. The real Stripe link will be connected later.
              </p>
              <div className="mt-5 rounded-[18px] border border-[#E6EDF5] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Card</p>
                <div className="mt-3 rounded-[14px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-4 text-sm font-bold text-slate-400">
                  Card number — MM / YY — CVC
                </div>
              </div>
              <Link href={`/en/ein-account?email=${encodeURIComponent(email)}&companyName=${encodeURIComponent(companyName)}&payment=stripe`} className="mt-6 flex justify-center rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white">
                Pay $29
              </Link>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#E6EDF5] bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#F15A24]">Bank transfer</p>
                  <h2 className="mt-3 text-2xl font-black text-[#123A63]">Send payment proof</h2>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                    The client prepares the bank transfer, creates an account and uploads proof from the client portal.
                  </p>
                </div>
                <span className="rounded-[14px] bg-[#F15A24] px-4 py-3 text-sm font-black text-white">WhatsApp</span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-[14px] border border-[#E6EDF5] bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Step 01</p>
                  <p className="mt-2 text-sm font-black text-[#123A63]">Contact VEMO</p>
                </div>
                <div className="rounded-[14px] border border-[#E6EDF5] bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Step 02</p>
                  <p className="mt-2 text-sm font-black text-[#123A63]">Upload proof</p>
                </div>
                <div className="rounded-[14px] border border-[#E6EDF5] bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Step 03</p>
                  <p className="mt-2 text-sm font-black text-[#123A63]">Admin review</p>
                </div>
              </div>

              <Link href={`/en/ein-account?email=${encodeURIComponent(email)}&companyName=${encodeURIComponent(companyName)}&payment=bank`} className="mt-6 flex justify-center rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white">
                Continue with bank transfer →
              </Link>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#E6EDF5] bg-white p-7">
            <h2 className="text-3xl font-black tracking-[-0.06em]">Summary</h2>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Your EIN service</p>
            <div className="mt-5 h-2 rounded-full bg-[#F15A24]" />
            <div className="mt-6 space-y-4 text-sm font-bold text-[#123A63]">
              <div className="flex justify-between gap-4"><span>Company</span><span>{companyName || "-"}</span></div>
              <div className="flex justify-between gap-4"><span>Service</span><span>EIN only</span></div>
              <div className="flex justify-between gap-4"><span>Amount</span><span>$29</span></div>
            </div>
            <div className="mt-8 rounded-[20px] border border-[#F15A24] bg-white p-5">
              <div className="flex justify-between text-xl font-black">
                <span>Estimated total</span>
                <span className="text-[#F15A24]">$29</span>
              </div>
            </div>
            <p className="mt-5 text-xs font-bold leading-6 text-slate-500">
              The EIN file will be available in the client portal after account creation and payment review.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
