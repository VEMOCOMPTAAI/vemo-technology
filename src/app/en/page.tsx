import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const services = [
  "State selection",
  "LLC preparation",
  "Registered Agent",
  "Operating Agreement",
  "EIN guidance",
  "Client tracking",
];

const steps = [
  {
    number: "01",
    title: "Questionnaire",
    text: "You complete the essential information required to start your file.",
  },
  {
    number: "02",
    title: "Preparation",
    text: "We organize your LLC file and the required documents.",
  },
  {
    number: "03",
    title: "Tracking",
    text: "You track progress from a clear and structured client area.",
  },
];

export default function EnglishHomePage() {
  return (
    <main className="min-h-screen text-[#111a33]">
      <SiteHeader lang="en" active="home" />

      <section className="vemo-container grid gap-10 py-14 lg:grid-cols-[0.95fr_0.85fr] lg:items-center lg:py-20">
        <div>
          <div className="vemo-badge">US LLC Formation</div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight md:text-5xl lg:text-6xl">
            Launch your US LLC through a clear and bilingual platform.
          </h1>

          <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-600 md:text-lg">
            Vemo Technology helps non-resident entrepreneurs set up their US LLC,
            prepare documents, request an EIN and organize the administrative process.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="/en/start" className="vemo-button-primary">
              Start my request
            </a>

            <a href="/en/pricing" className="vemo-button-secondary">
              View packages
            </a>
          </div>

          <div className="mt-9 grid max-w-xl grid-cols-3 gap-4">
            <div className="vemo-card rounded-3xl p-5">
              <p className="text-3xl font-black">2</p>
              <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-500">
                Languages
              </p>
            </div>

            <div className="vemo-card rounded-3xl p-5">
              <p className="text-3xl font-black">3</p>
              <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-500">
                Packages
              </p>
            </div>

            <div className="vemo-card rounded-3xl p-5">
              <p className="text-3xl font-black">100%</p>
              <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-500">
                Online
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
              Your LLC file organized step by step.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              Status, documents, company details, payments and admin tracking.
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
                  Included
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

      <SiteFooter lang="en" />
    </main>
  );
}
