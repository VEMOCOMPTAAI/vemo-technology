const plans = [
  {
    name: "Starter",
    price: "$199",
    description: "Pour commencer simplement votre projet LLC.",
    features: [
      "Analyse de votre situation",
      "Choix de l’État recommandé",
      "Préparation du dossier LLC",
      "Guide des prochaines étapes",
      "Support par email"
    ],
  },
  {
    name: "Standard",
    price: "$349",
    description: "La formule recommandée pour les non-résidents.",
    features: [
      "Tout dans Starter",
      "Operating Agreement",
      "Accompagnement EIN",
      "Checklist bancaire",
      "Espace client de suivi"
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$599",
    description: "Pour un accompagnement plus complet.",
    features: [
      "Tout dans Standard",
      "Support prioritaire",
      "Préparation documents Stripe/PayPal",
      "Aide organisation administrative",
      "Suivi renforcé du dossier"
    ],
  },
];

export default function FrenchPricingPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#111a33]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/fr" className="text-2xl font-black tracking-tight">
            Vemo Technology
          </a>

          <nav className="flex items-center gap-5 text-sm font-bold">
            <a href="/fr" className="text-slate-600 hover:text-[#c51f32]">Accueil</a>
            <a href="/fr/tarifs" className="text-[#c51f32]">Tarifs</a>
            <a href="/en/pricing" className="text-slate-600 hover:text-[#c51f32]">EN</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#c51f32]">
            Tarifs
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Choisissez la formule adaptée à votre LLC américaine.
          </h1>

          <p className="mt-6 text-lg font-medium leading-8 text-slate-600">
            Nos formules sont conçues pour les entrepreneurs non-résidents qui veulent
            créer une LLC aux États-Unis avec un parcours simple, clair et suivi.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={[
                "rounded-[2rem] border bg-white p-8 shadow-sm",
                plan.highlighted
                  ? "border-[#c51f32] shadow-xl ring-4 ring-red-100"
                  : "border-slate-200"
              ].join(" ")}
            >
              {plan.highlighted && (
                <div className="mb-5 inline-flex rounded-full bg-[#c51f32] px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                  Recommandé
                </div>
              )}

              <h2 className="text-2xl font-black">{plan.name}</h2>

              <div className="mt-4 flex items-end gap-2">
                <p className="text-5xl font-black">{plan.price}</p>
                <p className="pb-2 text-sm font-bold text-slate-500">
                  hors frais officiels
                </p>
              </div>

              <p className="mt-5 min-h-14 text-base font-medium leading-7 text-slate-600">
                {plan.description}
              </p>

              <a
                href="/fr/commencer"
                className={[
                  "mt-7 block rounded-2xl px-6 py-4 text-center text-base font-black",
                  plan.highlighted
                    ? "bg-[#c51f32] text-white hover:bg-[#a81929]"
                    : "border border-slate-300 bg-white text-[#111a33] hover:border-[#c51f32]"
                ].join(" ")}
              >
                Choisir cette formule
              </a>

              <div className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex gap-3">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-black text-[#c51f32]">
                      ✓
                    </span>
                    <p className="font-semibold text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] bg-[#111a33] p-8 text-white">
          <h2 className="text-2xl font-black">Note importante</h2>
          <p className="mt-3 max-w-4xl text-sm font-medium leading-7 text-slate-300">
            Les frais officiels de l’État, les frais du Registered Agent, les frais bancaires
            ou les frais de services tiers ne sont pas inclus sauf mention contraire. Vemo Technology
            fournit un accompagnement administratif et documentaire, mais ne remplace pas un avocat
            ou un conseiller fiscal.
          </p>
        </div>
      </section>
    </main>
  );
}
