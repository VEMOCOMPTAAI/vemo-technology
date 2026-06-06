import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

const contactCards = [
  {
    title: "Paiement ou justificatif",
    text: "Envoyez votre preuve de paiement ou demandez une vérification de votre transaction.",
  },
  {
    title: "Dossier LLC en cours",
    text: "Suivi du statut, documents manquants, informations à corriger ou étapes restantes.",
  },
  {
    title: "EIN et accompagnement bancaire",
    text: "Questions sur l’EIN, Stripe, Mercury, Wise, Payoneer ou la préparation bancaire.",
  },
];

export default function ContactFrPage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              Contact
            </p>

            <h1 className="mt-4 text-[44px] font-black tracking-[-0.06em] text-[#111827] md:text-[64px]">
              Contactez Vemo Technology
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Une question sur la création de LLC, le paiement, votre dossier ou votre accompagnement ?
              Notre support vous oriente selon la priorité de votre demande.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-[#DDE7F2] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-[#E6EDF5] pb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                    Email officiel
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#123A63]">
                    Support client
                  </h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#F15A24] text-xl font-black text-white">
                  @
                </div>
              </div>

              <div className="mt-7 rounded-[22px] border border-[#DDE7F2] bg-[#F8FAFC] p-6">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-400">
                  Contact
                </p>
                <p className="mt-3 text-xl font-black text-[#111827]">
                  contact@vemo-technology.com
                </p>
                <p className="mt-4 text-sm font-bold leading-7 text-slate-600">
                  Remplacez cette adresse par l’adresse officielle avant le lancement public.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/fr/commencer"
                  className="rounded-[14px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
                >
                  Démarrer mon dossier →
                </Link>
                <Link
                  href="/fr/tarifs"
                  className="rounded-[14px] border border-[#DDE7F2] bg-white px-6 py-4 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]"
                >
                  Voir les tarifs
                </Link>
              </div>
            </div>

            <div className="grid gap-5">
              {contactCards.map((card, index) => (
                <div
                  key={card.title}
                  className="rounded-[26px] border border-[#DDE7F2] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#F15A24] text-sm font-black text-white">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-black tracking-[-0.03em] text-[#111827]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                        {card.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <VemoPublicFooter locale="fr" />
      </main>
    </>
  );
}
