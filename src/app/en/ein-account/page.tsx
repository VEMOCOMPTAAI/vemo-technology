import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import EinAccountForm from "@/components/ein/EinAccountForm";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] || "" : input || "";
}

export default async function EnglishEinAccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = valueOf(params.email);
  const companyName = valueOf(params.companyName);

  return (
    <>
      <VemoPublicHeader locale="en" />
      <main className="vemo-public-zero-reflets min-h-screen bg-white text-[#111827]">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            EIN client account
          </p>

          <h1 className="mt-4 text-[42px] font-black tracking-[-0.06em] md:text-[56px]">
            Create your client account
          </h1>

          <p className="mt-4 text-base font-bold leading-7 text-slate-500">
            Your EIN file for {companyName || "your company"} will be tracked in the VEMO client portal.
          </p>

          <EinAccountForm locale="en" email={email} />
        </div>
      </section>
    </main>
    </>
  );
}
