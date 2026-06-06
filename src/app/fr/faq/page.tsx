import VemoPublicHeader from "@/components/site/VemoPublicHeader";

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
    a: "Oui, les frais de dépôt de l’État sont inclus dans les packs affichés.",
  },
  {
    q: "Est-ce que le Registered Agent est inclus ?",
    a: "Oui, le Registered Agent est inclus la première année. Le renouvellement dépend de l’État choisi.",
  },
];

export default function FaqFrPage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              FAQ
            </p>

            <h1 className="mt-3 text-[44px] font-black tracking-[-0.05em] text-[#111827] md:text-[56px]">
              Questions fréquentes
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Les réponses essentielles avant de créer votre LLC américaine avec Vemo Technology.
            </p>
          </div>

          <div className="mt-12 space-y-5">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-[26px] border border-[#DDE7F2] bg-white p-8 shadow-sm"
              >
                <h2 className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
                  {item.q}
                </h2>
                <p className="mt-5 text-base font-bold leading-8 text-slate-600">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
