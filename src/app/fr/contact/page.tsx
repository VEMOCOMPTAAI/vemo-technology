import VemoPublicHeader from "@/components/site/VemoPublicHeader";

export default function ContactFrPage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              Contact
            </p>

            <h1 className="mt-3 text-[44px] font-black tracking-[-0.05em] text-[#111827] md:text-[56px]">
              Contactez Vemo Technology
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Une question sur la création de LLC, le paiement, votre dossier ou votre accompagnement ?
            </p>
          </div>

          <div className="mt-12 grid gap-5">
            <div className="rounded-[26px] border border-[#DDE7F2] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
                Email
              </h2>
              <p className="mt-5 text-base font-bold leading-8 text-slate-600">
                Contact : <span className="text-[#123A63]">contact@vemo-technology.com</span>
              </p>
              <p className="mt-4 text-base font-bold leading-8 text-slate-600">
                Remplacez cette adresse par l’adresse officielle avant le lancement public.
              </p>
            </div>

            <div className="rounded-[26px] border border-[#DDE7F2] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
                Support client
              </h2>
              <p className="mt-5 text-base font-bold leading-8 text-slate-600">
                Les demandes sont traitées selon leur priorité : paiement, dossier en cours,
                création LLC, puis demandes générales.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
