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
  active?: "home" | "pricing" | "start";
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: Section[];
}) {
  return (
    <main className="min-h-screen text-[#111a33]">
      <SiteHeader lang={lang} active={active || "home"} />

      <section className="vemo-container py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="vemo-badge">{eyebrow}</div>

          <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
            {title}
          </h1>

          <p className="mt-6 text-lg font-semibold leading-8 text-slate-600">
            {subtitle}
          </p>

          <div className="mt-10 space-y-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="vemo-card rounded-[2rem] p-7 md:p-9"
              >
                <h2 className="text-2xl font-black">{section.title}</h2>

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
