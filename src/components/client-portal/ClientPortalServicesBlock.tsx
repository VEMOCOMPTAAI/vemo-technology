export default function ClientPortalServicesBlock({ lang }: { lang: "fr" | "en" }) {
  const isFr = lang === "fr";

  const services = isFr
    ? [
        ["Création LLC", "Documents de création, suivi et structuration du dossier."],
        ["EIN", "Demande EIN et suivi jusqu’à réception."],
        ["Banking", "Préparation Stripe, Mercury, Wise ou Payoneer selon votre profil."],
        ["Registered Agent", "Service inclus la première année selon le pack choisi."],
      ]
    : [
        ["LLC Formation", "Formation documents, file tracking and company setup."],
        ["EIN", "EIN application and follow-up until reception."],
        ["Banking", "Stripe, Mercury, Wise or Payoneer preparation depending on your profile."],
        ["Registered Agent", "Included for the first year depending on the selected package."],
      ];

  const timeline = isFr
    ? [
        ["01", "Dossier reçu", "Votre demande est enregistrée."],
        ["02", "Paiement", "Paiement en vérification."],
        ["03", "Traitement", "Préparation et suivi administratif."],
        ["04", "Documents", "Documents disponibles dans votre espace."],
      ]
    : [
        ["01", "File received", "Your request has been recorded."],
        ["02", "Payment", "Payment is under review."],
        ["03", "Processing", "Administrative preparation and follow-up."],
        ["04", "Documents", "Documents available in your portal."],
      ];

  return (
    <section id="services" className="mx-auto mt-6 max-w-7xl rounded-[28px] bg-white p-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#8AA0BC]">
            {isFr ? "SERVICES" : "SERVICES"}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#111827]">
            {isFr ? "Mes services" : "My services"}
          </h2>
        </div>

        <span className="rounded-full bg-[#F15A24] px-4 py-2 text-xs font-black text-white">
          {isFr ? "Inclus dans votre dossier" : "Included in your file"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {services.map(([title, text]) => (
          <div key={title} className="rounded-[22px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-[#F15A24]">
              ✓
            </div>
            <h3 className="text-base font-black text-[#123A63]">{title}</h3>
            <p className="mt-3 text-sm font-bold leading-6 text-[#526173]">{text}</p>
          </div>
        ))}
      </div>

      <div id="status" className="mt-8 rounded-[24px] border border-[#DDE7F2] bg-white p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#8AA0BC]">
          {isFr ? "TIMELINE" : "TIMELINE"}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {timeline.map(([num, title, text]) => (
            <div key={num} className="rounded-[20px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F15A24] text-xs font-black text-white">
                {num}
              </div>
              <h3 className="text-sm font-black text-[#123A63]">{title}</h3>
              <p className="mt-2 text-xs font-bold leading-5 text-[#64748B]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
