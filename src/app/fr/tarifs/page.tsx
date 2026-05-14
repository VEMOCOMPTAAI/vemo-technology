import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const packages = [
  {
    name: "Starter",
    price: "$199",
    description: "Pour démarrer simplement votre dossier LLC.",
    features: ["Questionnaire LLC", "Préparation dossier", "Suivi admin"],
  },
  {
    name: "Standard",
    price: "$349",
    description: "La formule recommandée pour la plupart des non-résidents.",
    features: ["Tout Starter", "Accompagnement EIN", "Operating Agreement", "Suivi renforcé"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$599",
    description: "Pour un accompagnement plus complet et structuré.",
    features: ["Tout Standard", "Préparation Stripe / PayPal", "Checklist bancaire", "Priorité support"],
  },
];

export default function FrenchPricingPage() {
  return (
    <main className="min-h-screen text-[#111a33]">
      <SiteHeader lang="fr" active="pricing" />

      <section className="vemo-container py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="vemo-badge">Tarifs</div>

          <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
            Choisissez la formule adaptée à votre projet LLC.
          </h1>

          <p className="mt-6 text-lg font-semibold leading-8 text-slate-600">
            Les frais officiels de l’État et certains frais tiers peuvent être ajoutés selon le dossier.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {packages.map((item) => (
            <div
              key={item.name}
              className={[
                "rounded-[2rem] p-7 shadow-sm",
                item.highlighted
                  ? "bg-[#111a33] text-white"
                  : "bg-white text-[#111a33]",
              ].join(" ")}
            >
              <p className="text-2xl font-black">{item.name}</p>
              <p className={["mt-3 text-5xl font-black", item.highlighted ? "text-white" : "text-[#c51f32]"].join(" ")}>
                {item.price}
              </p>
              <p className={["mt-4 text-sm font-semibold leading-7", item.highlighted ? "text-slate-300" : "text-slate-600"].join(" ")}>
                {item.description}
              </p>

              <div className="mt-7 space-y-3">
                {item.features.map((feature) => (
                  <p key={feature} className="text-sm font-black">
                    ✓ {feature}
                  </p>
                ))}
              </div>

              <a
                href="/fr/commencer"
                className={[
                  "mt-8 flex rounded-2xl px-5 py-4 text-center font-black",
                  item.highlighted
                    ? "bg-[#c51f32] text-white"
                    : "bg-[#111a33] text-white",
                ].join(" ")}
              >
                Commencer
              </a>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter lang="fr" />
    </main>
  );
}
