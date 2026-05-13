import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const services = [
  "Choix de l’État",
  "Préparation LLC",
  "Registered Agent",
  "Operating Agreement",
  "Accompagnement EIN",
  "Suivi client",
];

const steps = [
  {
    number: "01",
    title: "Questionnaire",
    text: "Vous remplissez les informations essentielles pour démarrer votre dossier.",
  },
  {
    number: "02",
    title: "Préparation",
    text: "Nous organisons votre dossier LLC et les documents nécessaires.",
  },
  {
    number: "03",
    title: "Suivi",
    text: "Vous suivez l’avancement depuis un espace clair et structuré.",
  },
];

export default function FrenchHomePage() {
  return (
    <main className="min-h-screen text-[#111a33]">
      <SiteHeader lang="fr" active="home" />

      <section className="vemo-container grid gap-10 py-14 lg:grid-cols-[0.95fr_0.85fr] lg:items-center lg:py-20">
        <div>
          <div className="vemo-badge">Création LLC américaine</div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight md:text-5xl lg:text-6xl">
            Lancez votre LLC US avec une plateforme claire et bilingue.
          </h1>

          <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-600 md:text-lg">
            Vemo Technology accompagne les entrepreneurs non-résidents dans la création
            de leur LLC américaine, la préparation des documents, l’EIN et le suivi administratif.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="/fr/commencer" className="vemo-button-primary">
              Commencer mon dossier
            </a>

            <a href="/fr/tarifs" className="vemo-button-secondary">
              Voir les formules
            </a>
          </div>

          <div className="mt-9 grid max-w-xl grid-cols-3 gap-4">
            <div className="vemo-card rounded-3xl p-5">
              <p className="text-3xl font-black">2</p>
              <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-500">
                Langues
              </p>
            </div>

            <div className="vemo-card rounded-3xl p-5">
              <p className="text-3xl font-black">3</p>
              <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-500">
                Formules
              </p>
            </div>

            <div className="vemo-card rounded-3xl p-5">
              <p className="text-3xl font-black">100%</p>
              <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-500">
                En ligne
              </p>
            </div>
          </div>
        </div>

        <div className="vemo-card rounded-[2rem] p-6">
          <div className="rounded-[1.5rem] bg-[#111a33] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-200">
              Dashboard Preview
            </p>
            <h2 className="mt-4 text-2xl font-black leading-tight">
              Votre dossier LLC organisé étape par étape.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              Statut, documents, informations de société, paiements et suivi admin.
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            {services.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="font-black">{item}</p>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-[#c51f32]">
                  Inclus
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vemo-container pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="vemo-card rounded-[2rem] p-7">
              <p className="text-sm font-black text-[#c51f32]">{step.number}</p>
              <h3 className="mt-4 text-2xl font-black">{step.title}</h3>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter lang="fr" />
    </main>
  );
}
