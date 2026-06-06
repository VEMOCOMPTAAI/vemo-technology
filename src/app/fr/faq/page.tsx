"use client";

import { useState } from "react";
import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

const faqs = [
  ["Puis-je créer une LLC sans être résident US ?", "Oui. Un non-résident peut créer une LLC américaine selon l’État choisi et son activité."],
  ["New Mexico ou Wyoming ?", "New Mexico est simple et économique. Wyoming offre une image plus structurée."],
  ["Les frais de dépôt sont-ils inclus ?", "Oui, ils sont inclus dans les packs affichés."],
  ["Le Registered Agent est-il inclus ?", "Oui, la première année est incluse. Le renouvellement dépend de l’État."],
  ["L’EIN est-il inclus ?", "Oui selon le pack choisi. Les délais dépendent de l’IRS."],
  ["Puis-je demander seulement un EIN ?", "Oui, si votre LLC existe déjà et que les informations nécessaires sont disponibles."],
  ["Stripe, Mercury, Wise ou Payoneer sont-ils garantis ?", "Non. VEMO prépare votre dossier, mais chaque plateforme décide seule."],
  ["Quels documents vais-je recevoir ?", "Documents LLC, Operating Agreement, Registered Agent, EIN si inclus, et documents de suivi."],
  ["Comment suivre mon dossier ?", "Depuis votre espace client : statut, documents, messages et étapes restantes."],
  ["Le virement est-il possible ?", "Oui, avec justificatif à téléverser avant validation."],
  ["Puis-je modifier mes informations ?", "Oui avant dépôt. Après dépôt, cela dépend de l’État et peut générer des frais."],
];

export default function FaqFrPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <VemoPublicHeader locale="fr" />
      <main className="vemo-public-zero-reflets min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">FAQ</p>
            <h1 className="mt-3 text-[38px] font-black tracking-[-0.06em] md:text-[52px]">Questions fréquentes</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-slate-600">Réponses rapides avant de démarrer votre LLC.</p>
          </div>

          <div className="mt-9 space-y-3">
            {faqs.map(([q, a], index) => {
              const isOpen = openIndex === index;
              return (
                <article key={q} className="overflow-hidden rounded-[20px] border border-[#DDE7F2] bg-white">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="text-base font-black tracking-[-0.02em] md:text-lg">{q}</span>
                    <span className={(isOpen ? "rotate-45 bg-[#F15A24] text-white" : "border border-[#DDE7F2] bg-white text-[#F15A24]") + " flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl font-black transition"}>+</span>
                  </button>
                  {isOpen && <div className="border-t border-[#E6EDF5] bg-[#F8FAFC] px-6 py-5"><p className="text-sm font-bold leading-7 text-slate-600">{a}</p></div>}
                </article>
              );
            })}
          </div>

          <div className="mt-9 rounded-[28px] border border-[#DDE7F2] bg-[#F8FAFC] p-7 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em]">Autre question ?</h2>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/fr/contact" className="rounded-[14px] bg-[#F15A24] px-6 py-3.5 text-sm font-black text-white hover:bg-[#DB4F1C]">Contact</Link>
              <Link href="/fr/tarifs" className="rounded-[14px] border border-[#DDE7F2] bg-white px-6 py-3.5 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">Tarifs</Link>
            </div>
          </div>
        </section>
        <VemoPublicFooter locale="fr" />
      </main>
    </>
  );
}
