import Link from "next/link";

export default async function FrenchEinPaymentPage({
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
        <Link href="/fr/order-ein" className="text-sm font-black text-[#F15A24]">← Retour commande EIN</Link>

        <div className="mt-10 rounded-[32px] border border-[#E6EDF5] bg-white p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">Paiement EIN</p>
          <h1 className="mt-4 text-[42px] font-black tracking-[-0.06em] md:text-[56px]">
            Choisissez votre mode de paiement
          </h1>
          <p className="mt-4 text-base font-bold leading-7 text-slate-500">
            Service EIN seul pour {companyName || "votre société"} — montant à payer : <span className="text-[#F15A24]">29 USD</span>.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#E6EDF5] bg-white p-6">
              <h2 className="text-2xl font-black text-[#123A63]">Paiement Stripe</h2>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                Paiement par carte bancaire. À connecter ensuite à ton lien Stripe réel.
              </p>
              <Link href={`/fr/ein-account?email=${encodeURIComponent(email)}&companyName=${encodeURIComponent(companyName)}&payment=stripe`} className="mt-6 inline-flex rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white">
                Payer par Stripe
              </Link>
            </div>

            <div className="rounded-[24px] border border-[#E6EDF5] bg-white p-6">
              <h2 className="text-2xl font-black text-[#123A63]">Paiement par virement</h2>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
                Le client pourra préparer le virement puis créer son compte pour envoyer le justificatif.
              </p>
              <Link href={`/fr/ein-account?email=${encodeURIComponent(email)}&companyName=${encodeURIComponent(companyName)}&payment=bank`} className="mt-6 inline-flex rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63]">
                Continuer par virement
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
