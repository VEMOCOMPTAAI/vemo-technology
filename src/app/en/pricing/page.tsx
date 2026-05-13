const plans = [
  {
    name: "Starter",
    price: "$199",
    description: "For entrepreneurs who want to start simply.",
    features: [
      "Situation review",
      "Recommended state guidance",
      "LLC formation file preparation",
      "Next steps guide",
      "Email support"
    ],
  },
  {
    name: "Standard",
    price: "$349",
    description: "The recommended package for non-residents.",
    features: [
      "Everything in Starter",
      "Operating Agreement",
      "EIN guidance",
      "Banking checklist",
      "Client dashboard tracking"
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$599",
    description: "For a more complete support experience.",
    features: [
      "Everything in Standard",
      "Priority support",
      "Stripe/PayPal document preparation",
      "Administrative organization help",
      "Enhanced case follow-up"
    ],
  },
];

export default function EnglishPricingPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#111a33]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/en" className="text-2xl font-black tracking-tight">
            Vemo Technology
          </a>

          <nav className="flex items-center gap-5 text-sm font-bold">
            <a href="/en" className="text-slate-600 hover:text-[#c51f32]">Home</a>
            <a href="/en/pricing" className="text-[#c51f32]">Pricing</a>
            <a href="/fr/tarifs" className="text-slate-600 hover:text-[#c51f32]">FR</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#c51f32]">
            Pricing
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Choose the right package for your US LLC.
          </h1>

          <p className="mt-6 text-lg font-medium leading-8 text-slate-600">
            Our packages are designed for non-resident entrepreneurs who want to set up
            a US LLC through a simple, clear and guided online process.
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
                  Recommended
                </div>
              )}

              <h2 className="text-2xl font-black">{plan.name}</h2>

              <div className="mt-4 flex items-end gap-2">
                <p className="text-5xl font-black">{plan.price}</p>
                <p className="pb-2 text-sm font-bold text-slate-500">
                  excluding official fees
                </p>
              </div>

              <p className="mt-5 min-h-14 text-base font-medium leading-7 text-slate-600">
                {plan.description}
              </p>

              <a
                href="/en/start"
                className={[
                  "mt-7 block rounded-2xl px-6 py-4 text-center text-base font-black",
                  plan.highlighted
                    ? "bg-[#c51f32] text-white hover:bg-[#a81929]"
                    : "border border-slate-300 bg-white text-[#111a33] hover:border-[#c51f32]"
                ].join(" ")}
              >
                Choose this package
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
          <h2 className="text-2xl font-black">Important note</h2>
          <p className="mt-3 max-w-4xl text-sm font-medium leading-7 text-slate-300">
            State filing fees, Registered Agent fees, banking fees or third-party service fees
            are not included unless clearly stated. Vemo Technology provides administrative and
            document support, but does not replace an attorney or a tax advisor.
          </p>
        </div>
      </section>
    </main>
  );
}
