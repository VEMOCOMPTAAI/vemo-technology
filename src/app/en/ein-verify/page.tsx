import Link from "next/link";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] || "" : input || "";
}

export default async function EnglishEinVerifyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = valueOf(params.email);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/en" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F15A24] text-sm font-black text-white">
              V
            </span>
            <span>
              <span className="block text-lg font-black text-[#123A63]">
                VEMO<span className="text-[#F15A24]">TECH</span>
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                Client account verification
              </span>
            </span>
          </Link>

          <Link
            href="/en/connexion"
            className="rounded-[14px] border border-[#E6EDF5] bg-white px-4 py-3 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F15A24] text-2xl font-black text-white">
            ✓
          </div>

          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            Verification required
          </p>

          <h1 className="mx-auto mt-4 max-w-2xl text-[38px] font-black leading-tight tracking-[-0.06em] md:text-[56px]">
            Verify your email before accessing the client portal
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-8 text-slate-500">
            Your account has been prepared for:
            <span className="mx-1 font-black text-[#123A63]">{email || "your email"}</span>.
            For security reasons, access to the client portal is allowed only after email confirmation.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[20px] border border-[#E6EDF5] bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Step 01</p>
              <p className="mt-2 text-sm font-black text-[#123A63]">Check your inbox</p>
            </div>

            <div className="rounded-[20px] border border-[#E6EDF5] bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Step 02</p>
              <p className="mt-2 text-sm font-black text-[#123A63]">Click the received link</p>
            </div>

            <div className="rounded-[20px] border border-[#E6EDF5] bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Step 03</p>
              <p className="mt-2 text-sm font-black text-[#123A63]">Access client portal</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]"
            >
              Resend verification email
            </button>

            <Link
              href="/en/connexion"
              className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-8 rounded-[22px] border border-[#E6EDF5] bg-white p-5 text-left">
            <p className="text-sm font-black text-[#123A63]">
              Access blocked until confirmation
            </p>
            <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
              This is a security step. In production, the “Resend verification email”
              button will be connected to the authentication system to send a real confirmation link.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
