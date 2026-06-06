"use client";

import Link from "next/link";
import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import VemoPublicFooter from "@/components/site/VemoPublicFooter";

const supportItems = [
  {
    title: "Paiement ou justificatif",
    text: "Envoyez votre preuve de paiement ou demandez une vérification de transaction.",
  },
  {
    title: "Dossier LLC en cours",
    text: "Suivi du statut, documents manquants, informations à corriger ou étapes restantes.",
  },
  {
    title: "EIN et Banking",
    text: "Questions sur l’EIN, Stripe, Mercury, Wise, Payoneer ou la préparation bancaire.",
  },
];

export default function ContactFrPage() {
  return (
    <>
      <VemoPublicHeader locale="fr" />

      <main className="min-h-screen bg-white text-[#111827]">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#F15A24]">
              Contact
            </p>

            <h1 className="mt-4 text-[44px] font-black tracking-[-0.06em] text-[#111827] md:text-[64px]">
              Contactez Vemo Technology
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-slate-600">
              Une question sur votre LLC, votre paiement, votre EIN ou votre dossier ?
              Contactez-nous directement ou envoyez votre demande via le formulaire.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[34px] border border-[#DDE7F2] bg-white p-7 shadow-sm">
              <div className="flex items-start justify-between gap-5 border-b border-[#E6EDF5] pb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                    Formulaire
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#123A63]">
                    Envoyer une demande
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#F15A24] text-xl font-black text-white">
                  ✉
                </div>
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
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Nom complet
                    </span>
                    <input
                      required
                      className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-4 text-sm font-bold outline-none transition focus:border-[#F15A24]"
                      placeholder="Votre nom"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-4 text-sm font-bold outline-none transition focus:border-[#F15A24]"
                      placeholder="vous@email.com"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Téléphone / WhatsApp
                    </span>
                    <input
                      className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-4 text-sm font-bold outline-none transition focus:border-[#F15A24]"
                      placeholder="+212..."
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Sujet
                    </span>
                    <select className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-4 text-sm font-bold outline-none transition focus:border-[#F15A24]">
                      <option>Création LLC</option>
                      <option>Paiement / justificatif</option>
                      <option>EIN</option>
                      <option>Banking guidance</option>
                      <option>Support dossier</option>
                    </select>
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Message
                  </span>
                  <textarea
                    required
                    rows={6}
                    className="resize-none rounded-[18px] border border-[#DDE7F2] bg-white px-4 py-4 text-sm font-bold leading-7 outline-none transition focus:border-[#F15A24]"
                    placeholder="Décrivez votre demande..."
                  />
                </label>

                <div className="mt-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-[15px] bg-[#F15A24] px-7 py-4 text-sm font-black text-white transition hover:bg-[#DB4F1C]"
                  >
                    Envoyer la demande →
                  </button>

                  <a
                    href="https://wa.me/212708069471"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[15px] border border-[#DDE7F2] bg-white px-7 py-4 text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]"
                  >
                    WhatsApp direct
                  </a>
                </div>
              </form>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[34px] border border-[#DDE7F2] bg-[#F8FAFC] p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                  Contact rapide
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#111827]">
                  WhatsApp & Email
                </h2>

                <div className="mt-6 grid gap-3">
                  <a
                    href="https://wa.me/212708069471"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-[20px] border border-[#DDE7F2] bg-white p-5 transition hover:border-[#F15A24]"
                  >
                    <span>
                      <span className="block text-sm font-black text-[#111827]">WhatsApp</span>
                      <span className="mt-1 block text-sm font-bold text-slate-500">+212 708 069 471</span>
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F15A24] text-xl text-white">
                      ☏
                    </span>
                  </a>

                  <div className="rounded-[20px] border border-[#DDE7F2] bg-white p-5">
                    <p className="text-sm font-black text-[#111827]">Email</p>
                    <p className="mt-1 text-sm font-bold text-slate-500">contact@vemo-technology.com</p>
                  </div>
                </div>
              </div>

              {supportItems.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[26px] border border-[#DDE7F2] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#F15A24] text-sm font-black text-white">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-black tracking-[-0.03em] text-[#111827]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/fr/tarifs"
                className="rounded-[18px] border border-[#DDE7F2] bg-white px-6 py-5 text-center text-sm font-black text-[#123A63] transition hover:border-[#F15A24] hover:text-[#F15A24]"
              >
                Voir les packs LLC →
              </Link>
            </div>
          </div>
        </section>

        <VemoPublicFooter locale="fr" />
      </main>
    </>
  );
}
