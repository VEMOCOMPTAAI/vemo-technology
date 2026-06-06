"use client";

import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";
import VemoCountryPhoneField from "@/components/site/VemoCountryPhoneField";

export default function ContactFrPage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />
      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">Contact</p>
            <h1 className="mt-4 text-[44px] font-black tracking-[-0.06em] md:text-[64px]">Contactez Vemo Technology</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Envoyez votre demande. Notre équipe vous répondra selon la priorité de votre dossier.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl rounded-[34px] border border-[#DDE7F2] bg-white p-7 shadow-sm">
            <div className="border-b border-[#E6EDF5] pb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Formulaire sécurisé</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#123A63]">Envoyer une demande</h2>
            </div>

            <form
              className="mt-7 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message préparé. Connectez ce formulaire à votre email/API au lancement.");
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Nom complet</span>
                  <input required className="h-14 rounded-[16px] border border-[#DDE7F2] px-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="Votre nom" />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Email</span>
                  <input required type="email" className="h-14 rounded-[16px] border border-[#DDE7F2] px-4 text-sm font-bold outline-none focus:border-[#F15A24]" placeholder="vous@email.com" />
                </label>
              </div>

              <VemoCountryPhoneField locale="fr" />

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Sujet</span>
                <select className="h-14 rounded-[16px] border border-[#DDE7F2] px-4 text-sm font-bold outline-none focus:border-[#F15A24]">
                  <option>Création LLC</option>
                  <option>Paiement / justificatif</option>
                  <option>EIN</option>
                  <option>Banking guidance</option>
                  <option>Support dossier</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Message</span>
                <textarea required rows={6} className="resize-none rounded-[18px] border border-[#DDE7F2] px-4 py-4 text-sm font-bold leading-7 outline-none focus:border-[#F15A24]" placeholder="Décrivez votre demande..." />
              </label>

              <div className="mt-2 flex flex-wrap gap-3">
                <button type="submit" className="rounded-[15px] bg-[#F15A24] px-7 py-4 text-sm font-black text-white hover:bg-[#DB4F1C]">Envoyer la demande →</button>
                <a href="https://wa.me/212708069471" target="_blank" rel="noreferrer" className="rounded-[15px] border border-[#DDE7F2] bg-white px-7 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">WhatsApp</a>
                <Link href="/fr/tarifs" className="rounded-[15px] border border-[#DDE7F2] bg-white px-7 py-4 text-sm font-black text-[#123A63] hover:border-[#F15A24] hover:text-[#F15A24]">Voir les tarifs</Link>
              </div>
            </form>
          </div>
        </section>
        <VemoPublicFooter locale="fr" />
      </main>
    </>
  );
}
