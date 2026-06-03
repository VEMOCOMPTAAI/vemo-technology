import Link from "next/link";

export default async function EnglishEinAccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = String(params.email || "");
  const companyName = String(params.companyName || "");

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">EIN client account</p>
          <h1 className="mt-4 text-[42px] font-black tracking-[-0.06em] md:text-[56px]">
            Create your client account
          </h1>
          <p className="mt-4 text-base font-bold leading-7 text-slate-500">
            Your EIN file for {companyName || "your company"} will be tracked in the VEMO client portal.
          </p>

          <form className="mt-8 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Email</span>
              <input defaultValue={email} className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Password</span>
              <input type="password" className="rounded-[16px] border border-[#E6EDF5] bg-white px-4 py-4 text-sm font-bold outline-none focus:border-[#F15A24]" />
            </label>

            <div className="rounded-[22px] border border-[#E6EDF5] bg-white p-5">
              <p className="text-sm font-black text-[#123A63]">Verification</p>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
                After account creation, the client can access the portal, track EIN status and upload any required document or payment proof.
              </p>
            </div>

            <Link href={`/en/client-portal?email=${encodeURIComponent(email)}`} className="rounded-[18px] bg-[#F15A24] px-6 py-4 text-center text-sm font-black text-white">
              Create account and access client portal
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
