import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import Link from "next/link";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] || "" : input || "";
}

export default async function FrenchEinVerifyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = valueOf(params.email);

  return (
    <>
      <VemoPublicHeader locale="fr" />
      <main className="min-h-screen bg-white text-[#111827]">
<section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[32px] border border-[#E6EDF5] bg-white p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F15A24] text-2xl font-black text-white">
            ✓
          </div>

          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            Vérification requise
          </p>

          <h1 className="mx-auto mt-4 max-w-2xl text-[38px] font-black leading-tight tracking-[-0.06em] md:text-[56px]">
            Vérifiez votre email avant d’accéder à l’espace client
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-8 text-slate-500">
            Nous avons préparé votre compte pour l’adresse :
            <span className="mx-1 font-black text-[#123A63]">{email || "votre email"}</span>.
            Pour des raisons de sécurité, l’accès à l’espace client sera autorisé uniquement après confirmation de votre email.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[20px] border border-[#E6EDF5] bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Étape 01</p>
              <p className="mt-2 text-sm font-black text-[#123A63]">Vérifier votre boîte mail</p>
            </div>

            <div className="rounded-[20px] border border-[#E6EDF5] bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Étape 02</p>
              <p className="mt-2 text-sm font-black text-[#123A63]">Cliquer sur le lien reçu</p>
            </div>

            <div className="rounded-[20px] border border-[#E6EDF5] bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Étape 03</p>
              <p className="mt-2 text-sm font-black text-[#123A63]">Accéder à l’espace client</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]"
            >
              Renvoyer l’email de vérification
            </button>

            <Link
              href="/fr/commencer"
              className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]"
            >
              Se connecter
            </Link>
          </div>

          <div className="mt-8 rounded-[22px] border border-[#E6EDF5] bg-white p-5 text-left">
            <p className="text-sm font-black text-[#123A63]">
              Accès bloqué jusqu’à confirmation
            </p>
            <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
              Cette page est une étape de sécurité. En production, le bouton “Renvoyer l’email”
              sera connecté au système d’authentification pour envoyer un vrai lien de confirmation.
            </p>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
