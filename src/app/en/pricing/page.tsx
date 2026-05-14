import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const packages = [
  {
    name: "Starter",
    price: "$199",
    description: "For starting your LLC case simply.",
    features: ["LLC questionnaire", "Case preparation", "Admin tracking"],
  },
  {
    name: "Standard",
    price: "$349",
    description: "Recommended for most non-resident founders.",
    features: ["Everything in Starter", "EIN guidance", "Operating Agreement", "Enhanced tracking"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$599",
    description: "For more complete and structured support.",
    features: ["Everything in Standard", "Stripe / PayPal preparation", "Banking checklist", "Priority support"],
  },
];

export default function EnglishPricingPage() {
  return (
    <main className="min-h-screen text-[#111a33]">
      <SiteHeader lang="en" active="pricing" />

      <section className="vemo-container py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="vemo-badge">Pricing</div>

          <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
            Choose the right package for your LLC project.
          </h1>

          <p className="mt-6 text-lg font-semibold leading-8 text-slate-600">
            Official state fees and some third-party fees may be added depending on the case.
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
                href="/en/start"
                className={[
                  "mt-8 flex rounded-2xl px-5 py-4 text-center font-black",
                  item.highlighted
                    ? "bg-[#c51f32] text-white"
                    : "bg-[#111a33] text-white",
                ].join(" ")}
              >
                Start
              </a>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter lang="en" />
    </main>
  );
}
