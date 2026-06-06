import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import EinAccountForm from "@/components/ein/EinAccountForm";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] || "" : input || "";
}

export default async function FrenchEinAccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = valueOf(params.email);
  const companyName = valueOf(params.companyName);

  return (
    <>
      <VemoPublicHeader locale="fr" />
      <main className="min-h-screen bg-white text-[#111827]">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            Compte client EIN
          </p>

          <h1 className="mt-4 text-[42px] font-black tracking-[-0.06em] md:text-[56px]">
            Créez votre compte client
          </h1>

          <p className="mt-4 text-base font-bold leading-7 text-slate-500">
            Votre dossier EIN pour {companyName || "votre société"} sera suivi dans l’espace client VEMO.
          </p>

          <EinAccountForm locale="fr" email={email} />
        </div>
      </section>
    </main>
    </>
  );
}
