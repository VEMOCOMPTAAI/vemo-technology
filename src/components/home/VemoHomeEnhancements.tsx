"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const rotatingServices = [
  "Création LLC New Mexico",
  "Création LLC Wyoming",
  "Demande EIN seule",
  "Assistance Stripe & Mercury",
  "Banking Guidance",
  "Registered Agent Renewal",
  "LLC + EIN + Payment Setup",
];

const zones = [
  {
    title: "New Mexico",
    image: "/vemo-home/new-mexico.svg",
    tags: ["LLC Formation", "Low Cost", "Simple"],
    href: "/fr/commencer?state=New%20Mexico",
    bullets: [
      "À partir de 129 USD",
      "Option simple et économique",
      "Registered Agent offert la première année",
      "Renouvellement RA : 35 USD/an",
      "Adapté aux entrepreneurs non-résidents",
      "Idéal pour démarrer rapidement",
    ],
  },
  {
    title: "Wyoming",
    image: "/vemo-home/wyoming.svg",
    tags: ["LLC Formation", "Privacy", "Corporate"],
    href: "/fr/commencer?state=Wyoming",
    bullets: [
      "À partir de 179 USD",
      "Image corporate plus forte",
      "État apprécié pour la confidentialité",
      "Registered Agent offert la première année",
      "Renouvellement RA : 25 USD/an",
      "Adapté aux projets premium",
    ],
  },
  {
    title: "Banking & Payments",
    image: "/vemo-home/banking.svg",
    tags: ["Stripe", "Mercury", "Wise"],
    href: "/fr/banking-guidance",
    bullets: [
      "Assistance Stripe",
      "Assistance Mercury",
      "Orientation Wise et Payoneer",
      "Préparation documentaire",
      "Support pour outils de paiement",
      "Adapté aux activités digitales",
    ],
  },
];

const videos = [
  {
    title: "Créer une LLC US à distance",
    text: "Un parcours clair pour commander, payer, déposer les informations et suivre votre dossier.",
    video: "/vemo-home/vemo-llc-intro.mp4",
  },
  {
    title: "Suivi client centralisé",
    text: "Documents, statuts et messages dans un seul espace client.",
    video: "/vemo-home/vemo-client-portal.mp4",
  },
  {
    title: "EIN & Banking Guidance",
    text: "Accompagnement pour EIN, Stripe, Mercury, Wise, Payoneer et solutions de paiement.",
    video: "/vemo-home/vemo-banking.mp4",
  },
];

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#19C37D] text-[#19C37D]">
      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
        <path
          d="M5 10.5L8.2 13.5L15 6.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function StaticVideoCard({
  title,
  text,
  video,
  large = false,
}: {
  title: string;
  text: string;
  video: string;
  large?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#E6EDF5] bg-white">
      <div className={large ? "relative aspect-[16/9]" : "relative aspect-[16/10]"}>
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
        >
          <source src={video} type="video/mp4" />
        </video>

        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 via-black/10 to-transparent p-6">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white">
              VEMO
            </span>
            <h3 className="mt-3 text-2xl font-black tracking-[-0.05em] text-white">
              {title}
            </h3>
            <p className="mt-2 max-w-xl text-sm font-bold leading-7 text-white/85">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FallbackVideoCard({
  title,
  text,
  large = false,
}: {
  title: string;
  text: string;
  large?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#E6EDF5] bg-white">
      <div
        className={[
          "relative flex items-end bg-white p-6",
          large ? "aspect-[16/9]" : "aspect-[16/10]",
        ].join(" ")}
      >
        <div className="absolute inset-6 rounded-[24px] border border-[#E6EDF5] bg-white" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-[#E6EDF5] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#F15A24]">
            VEMO
          </span>
          <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-[#123A63]">
            {title}
          </h3>
          <p className="mt-2 max-w-xl text-sm font-bold leading-7 text-slate-500">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function VemoHomeEnhancements() {
  const [serviceIndex, setServiceIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setServiceIndex((current) => (current + 1) % rotatingServices.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            VEMO en action
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl text-[36px] font-black leading-tight tracking-[-0.065em] text-[#111827] md:text-[52px]">
            Des contenus visuels pour expliquer votre parcours LLC
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-7 text-slate-500">
            Des blocs vidéos peuvent présenter le processus VEMO : création LLC, espace client, EIN et assistance bancaire.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <FallbackVideoCard title={videos[0].title} text={videos[0].text} large />
          <div className="grid gap-6">
            <FallbackVideoCard title={videos[1].title} text={videos[1].text} />
            <FallbackVideoCard title={videos[2].title} text={videos[2].text} />
          </div>
        </div>
      </section>

      <section className="border-y border-[#E6EDF5] bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            Calculateur VEMO
          </p>

          <h2 className="mx-auto mt-4 max-w-5xl text-[34px] font-black leading-tight tracking-[-0.065em] text-[#111827] md:text-[56px]">
            Calculez le coût de{" "}
            <span className="text-[#F15A24] transition-all duration-300">
              {rotatingServices[serviceIndex]}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base font-bold leading-7 text-slate-500">
            Indiquez vos informations pour obtenir un coût clair selon votre État, votre formule et les services nécessaires à votre lancement.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/fr/commencer"
              className="rounded-[16px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]"
            >
              Obtenir mon coût
            </Link>
            <Link
              href="/fr/ein"
              className="rounded-[16px] border border-[#E6EDF5] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]"
            >
              Demande EIN 29 USD
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F15A24]">
            États & services
          </p>
          <h2 className="mx-auto mt-4 max-w-5xl text-[36px] font-black leading-tight tracking-[-0.065em] text-[#111827] md:text-[52px]">
            Choisissez le bon État et les bons services avec VEMO
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-7 text-slate-500">
            Survolez une carte pour voir les avantages de chaque option.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {zones.map((zone) => (
            <Link
              key={zone.title}
              href={zone.href}
              className="group relative overflow-hidden rounded-[28px] border border-[#E6EDF5] bg-white"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={zone.image}
                  alt={zone.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />

                <div className="absolute inset-x-4 bottom-4 rounded-[22px] border border-[#E6EDF5] bg-white p-4 transition-all duration-300 group-hover:translate-y-4 group-hover:opacity-0">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-8 w-1 rounded-full bg-[#F15A24]" />
                    <h3 className="text-2xl font-black tracking-[-0.05em] text-[#111827]">
                      {zone.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {zone.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-[10px] border border-[#E6EDF5] bg-white px-3 py-2 text-xs font-black text-[#123A63]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-x-4 top-4 rounded-[22px] border border-[#E6EDF5] bg-white p-5 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-8 w-1 rounded-full bg-[#F15A24]" />
                    <h3 className="text-2xl font-black tracking-[-0.05em] text-[#111827]">
                      {zone.title}
                    </h3>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {zone.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-[10px] border border-[#E6EDF5] bg-white px-3 py-2 text-xs font-black text-[#123A63]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-3">
                    {zone.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-sm font-bold leading-6 text-[#123A63]">
                        <CheckIcon />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
