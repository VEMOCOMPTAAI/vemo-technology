import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

type Lang = "fr" | "en";

type Section = {
  title: string;
  body: string[];
};

export function LegalPageShell({
  lang,
  active,
  eyebrow,
  title,
  subtitle,
  sections,
}: {
  lang: Lang;
  active?: "home" | "pricing" | "faq" | "contact" | "start";
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: Section[];
}) {
  return (
    <main className="min-h-screen text-slate-950">
      <SiteHeader lang={lang} active={active || "home"} />

      <section className="py-14 md:py-20">
        <div className="vemo-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="vemo-badge mx-auto">{eyebrow}</p>

            <h1 className="mt-6 text-4xl font-black leading-[1] tracking-[-0.05em] text-[#0f172a] md:text-6xl">
              {title}
            </h1>

            <p className="mt-6 text-base font-semibold leading-8 text-slate-600">
              {subtitle}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl space-y-5">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-[1.65rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60"
              >
                <h2 className="text-2xl font-black tracking-[-0.035em] text-[#0f172a]">
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm font-semibold leading-7 text-slate-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}

