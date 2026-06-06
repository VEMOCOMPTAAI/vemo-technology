"use client";

import { useState } from "react";
import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

const faqs = [
  ["Puis-je créer une LLC américaine si je ne suis pas résident US ?", "Oui. Un non-résident peut créer une LLC américaine. Les exigences dépendent de l’État choisi, de l’activité et du profil du fondateur."],
  ["Quel État choisir entre New Mexico et Wyoming ?", "New Mexico est souvent choisi pour sa simplicité et ses coûts réduits. Wyoming est souvent choisi pour son image, sa confidentialité et sa structure plus robuste."],
  ["Les frais de dépôt de l’État sont-ils inclus ?", "Oui. Les frais de dépôt de l’État sont inclus dans les packs affichés."],
  ["Le Registered Agent est-il inclus ?", "Oui. Le Registered Agent est inclus la première année. Le renouvellement dépend de l’État choisi."],
  ["L’EIN est-il inclus ?", "L’EIN est inclus selon le pack choisi. Les délais peuvent varier selon l’IRS et le mode de traitement."],
  ["Puis-je demander uniquement un EIN ?", "Oui. Une demande EIN seule peut être traitée si votre LLC existe déjà et si les informations nécessaires sont disponibles."],
  ["Puis-je ouvrir Stripe, Mercury, Wise ou Payoneer après la création ?", "VEMO prépare et organise votre dossier pour faciliter les démarches, mais l’acceptation finale dépend de chaque plateforme."],
  ["VEMO garantit-il l’acceptation bancaire ?", "Non. VEMO vous accompagne dans la préparation du dossier, mais chaque banque ou plateforme garde sa propre décision finale."],
  ["Quels documents vais-je recevoir ?", "Selon le pack, vous recevez les documents de création LLC, Operating Agreement, informations Registered Agent, EIN si inclus et documents utiles au suivi."],
  ["Comment suivre mon dossier ?", "Après paiement et activation, vous accédez à votre espace client pour suivre le statut, les documents, messages et étapes restantes."],
  ["Le paiement par virement est-il possible ?", "Oui. Le paiement par virement peut être accompagné d’un justificatif à téléverser avant validation."],
  ["Puis-je modifier les informations après envoi ?", "Certaines informations peuvent être corrigées avant dépôt. Après dépôt officiel, les modifications dépendent de l’État et peuvent générer des frais."]
];

export default function FaqFrPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <VemoPublicHeader locale="fr" />
      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">FAQ</p>
            <h1 className="mt-4 text-[44px] font-black tracking-[-0.06em] md:text-[64px]">Questions fréquentes</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">Les réponses essentielles avant de créer et suivre votre LLC américaine avec Vemo Technology.</p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map(([q, a], index) => {
              const isOpen = openIndex === index;
              return (
                <article key={q} className="overflow-hidden rounded-[24px] border border-[#DDE7F2] bg-white shadow-sm">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 px-7 py-6 text-left">
                    <span className="text-lg font-black tracking-[-0.03em] md:text-xl">{q}</span>
                    <span className={(isOpen ? "rotate-45 bg-[#F15A24] text-white" : "border border-[#DDE7F2] bg-white text-[#F15A24]") + " flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl font-black transition"}>+</span>
                  </button>
                  {isOpen && <div className="border-t border-[#E6EDF5] bg-[#F8FAFC] px-7 py-6"><p className="text-base font-bold leading-8 text-slate-600">{a}</p></div>}
                </article>
              );
            })}
          </div>

          <div className="mt-12 rounded-[32px] border border-[#DDE7F2] bg-[#F8FAFC] p-8 text-center">
            <h2 className="text-3xl font-black tracking-[-0.04em]">Vous avez une autre question ?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-600">Contactez VEMO avant de démarrer votre dossier pour choisir la bonne formule.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/fr/contact" className="rounded-[14px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">Contacter VEMO →</Link>
              <Link href="/fr/tarifs" className="rounded-[14px] border border-[#DDE7F2] bg-white px-6 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">Voir les tarifs</Link>
            </div>
          </div>
        </section>
        <VemoPublicFooter locale="fr" />
      </main>
    </>
  );
}
