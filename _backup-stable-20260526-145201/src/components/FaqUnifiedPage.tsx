"use client";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

type Lang = "fr" | "en";

const content = {
  fr: {
    badge: "FAQ",
    title: "Questions fréquentes",
    subtitle:
      "Les réponses essentielles pour comprendre la création de LLC US avec Vemo Technology.",
    items: [
      ["Est-ce adapté aux non-résidents ?", "Oui. Le service est pensé pour les entrepreneurs non-résidents qui veulent créer et structurer une LLC US à distance."],
      ["Le paiement est-il sécurisé ?", "Oui. Les paiements sont traités via Stripe ou par virement selon la méthode sélectionnée."],
      ["Puis-je suivre mon dossier ?", "Oui. Après validation, vous créez votre accès client sécurisé pour suivre vos documents et messages."],
      ["Le montant final peut-il varier ?", "Les frais inclus sont affichés dans le résumé. Le montant peut varier uniquement en cas d’options ou services tiers supplémentaires."],
    ],
  },
  en: {
    badge: "FAQ",
    title: "Frequently asked questions",
    subtitle:
      "Essential answers to understand US LLC formation with Vemo Technology.",
    items: [
      ["Is this suitable for non-residents?", "Yes. The service is designed for non-resident founders who want to create and structure a US LLC remotely."],
      ["Is payment secure?", "Yes. Payments are processed through Stripe or bank transfer depending on the selected method."],
      ["Can I track my case?", "Yes. After validation, you create your secure client access to track documents and messages."],
      ["Can the final amount change?", "Included fees are shown in the summary. The amount may only vary with optional services or third-party costs."],
    ],
  },
};

export default function FaqUnifiedPage({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#2B2F36]">
      <SiteHeader lang={lang} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,#eadfd6_1px,transparent_1px),linear-gradient(to_bottom,#eadfd6_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative mx-auto max-w-5xl px-6 py-20">
          <div className="text-center">
            <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
              {t.badge}
            </div>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
              {t.title}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-[#2B2F36]/70">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-12 space-y-5">
            {t.items.map(([q, a]) => (
              <article key={q} className="rounded-[10px] border border-[#E8E2DC] bg-white p-7 shadow-[0_18px_40px_rgba(43,47,54,0.06)]">
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#123A63]">
                  {q}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#2B2F36]/70">
                  {a}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
