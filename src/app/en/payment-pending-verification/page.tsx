import Link from "next/link";

export default function EnPaymentPendingVerificationPage({
  searchParams,
}: {
  searchParams?: { email?: string };
}) {
  const email = searchParams?.email || "";

  return (
    <main className="min-h-screen bg-[#F6F9FC] px-6 py-12 text-[#111827]">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[28px] border border-[#DDE7F2] bg-white p-8">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#F3D2C5] bg-[#FFF7F2] text-2xl">
            ⏳
          </div>

          <p className="mb-5 text-[12px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            Bank transfer payment
          </p>

          <h1 className="max-w-xl text-4xl font-black tracking-[-0.04em] text-[#111827]">
            Payment pending verification
          </h1>

          <p className="mt-6 max-w-xl text-base font-bold leading-8 text-[#526173]">
            Your bank transfer proof has been received. The Vemo Technology team
            will verify your payment before continuing your file.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Step 01", "Proof received"],
              ["Step 02", "Payment verification"],
              ["Step 03", "File follow-up"],
            ].map(([step, label]) => (
              <div key={step} className="rounded-[18px] border border-[#DDE7F2] bg-white p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                  {step}
                </p>
                <p className="mt-3 text-sm font-black text-[#123A63]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/en/contact"
              className="rounded-[14px] border border-[#DDE7F2] bg-white px-6 py-4 text-sm font-black text-[#111827]"
            >
              Contact
            </Link>

            <Link
              href="/en"
              className="rounded-[14px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white"
            >
              Back home
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#DDE7F2] bg-white p-8">
          <p className="mb-5 text-[12px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            Client space
          </p>

          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#111827]">
            Create your client access
          </h2>

          <p className="mt-5 text-base font-bold leading-8 text-[#526173]">
            Create your client space to track the payment, read VEMO messages and
            receive your documents.
          </p>

          <form className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Email
              </span>
              <input
                name="email"
                defaultValue={email}
                className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-4 text-sm font-black text-[#123A63] outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Password
              </span>
              <input
                name="password"
                type="password"
                className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-4 text-sm font-black text-[#123A63] outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Confirm password
              </span>
              <input
                name="confirmPassword"
                type="password"
                className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-4 text-sm font-black text-[#123A63] outline-none"
              />
            </label>

            <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-700">
              Confirmation email sent.
            </div>

            <button
              type="button"
              className="h-14 rounded-[16px] bg-[#F15A24] text-sm font-black text-white"
            >
              Create my client space →
            </button>

            <Link
              href="/en/login"
              className="flex h-14 items-center justify-center rounded-[16px] border border-[#DDE7F2] bg-white text-sm font-black text-[#111827]"
            >
              Sign in
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
