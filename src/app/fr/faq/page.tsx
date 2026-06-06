import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

const faqs = [
  {
    q: "Puis-je créer une LLC américaine si je ne suis pas résident US ?",
    a: "Oui. Un non-résident peut créer une LLC américaine. Les exigences dépendent de l’État choisi, de l’activité et du profil du fondateur.",
  },
  {
    q: "Quel État choisir entre New Mexico et Wyoming ?",
    a: "New Mexico est souvent choisi pour sa simplicité et ses coûts réduits. Wyoming est souvent choisi pour son image, sa confidentialité et sa structure plus robuste.",
  },
  {
    q: "L’EIN est-il inclus ?",
    a: "L’EIN est inclus selon le pack choisi. Les délais peuvent varier selon l’IRS et le mode de traitement.",
  },
  {
    q: "Les frais de dépôt de l’État sont-ils inclus ?",
    a: "Oui. Les frais de dépôt de l’État sont inclus dans les packs affichés.",
  },
  {
    q: "Est-ce que le Registered Agent est inclus ?",
    a: "Oui. Le Registered Agent est inclus la première année. Le renouvellement dépend de l’État choisi.",
  },
  {
    q: "Puis-je ouvrir Stripe, Mercury, Wise ou Payoneer après la création ?",
    a: "VEMO prépare et organise votre dossier pour faciliter les démarches, mais l’acceptation finale dépend de chaque plateforme.",
  },
];

export default function FaqFrPage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              FAQ
            </p>

            <h1 className="mt-4 text-[44px] font-black tracking-[-0.06em] text-[#111827] md:text-[64px]">
              Questions fréquentes
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Les réponses essentielles avant de créer votre LLC américaine avec Vemo Technology.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {faqs.map((item, index) => (
              <article
                key={item.q}
                className="rounded-[28px] border border-[#DDE7F2] bg-white p-7 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#F15A24] text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-xl font-black tracking-[-0.03em] text-[#111827]">
                      {item.q}
                    </h2>
                    <p className="mt-4 text-sm font-bold leading-7 text-slate-600">
                      {item.a}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[32px] border border-[#DDE7F2] bg-[#F8FAFC] p-8 text-center">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#111827]">
              Vous avez une autre question ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-600">
              Contactez VEMO avant de démarrer votre dossier pour choisir la bonne formule.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/fr/contact"
                className="rounded-[14px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
              >
                Contacter VEMO →
              </Link>
            </div>
          </div>
        </section>

        <VemoPublicFooter locale="fr" />
      </main>
    </>
  );
}
