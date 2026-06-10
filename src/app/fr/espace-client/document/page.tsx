type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getOne(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function FrClientDocumentPreviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const title = getOne(params.title) || "Document";
  const file = getOne(params.file) || title;
  const url = getOne(params.url);
  const email = getOne(params.email);

  const safeUrl = url.startsWith("/client-documents/") ? url : "#";
  const backUrl = `/fr/espace-client?email=${encodeURIComponent(email)}&tab=documents`;

  return (
    <main className="min-h-screen bg-[#F3F7FB] text-[#111827]">
      <header className="border-b border-[#E6EDF5] bg-white">
        <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between px-6">
          <div>
            <div className="text-[24px] font-black tracking-[-0.04em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[9px] font-black uppercase tracking-[0.38em] text-[#64748B]">
              US LLC FOR NON-RESIDENTS
            </div>
          </div>

          <a
            href={backUrl}
            className="rounded-[14px] border border-[#DDE7F2] bg-white px-5 py-3 text-sm font-black text-[#123A63]"
          >
            Retour documents
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <a href={backUrl} className="text-sm font-black text-[#123A63]">
          ← Retour aux documents
        </a>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#F15A24]">
              Aperçu document
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#111827]">
              {title}
            </h1>
            <p className="mt-2 text-sm font-bold text-[#64748B]">{file}</p>
          </div>

          <a
            href={safeUrl}
            download
            className="rounded-[14px] bg-[#F15A24] px-6 py-4 text-sm font-black text-white"
          >
            Télécharger
          </a>
        </div>

        <div className="mt-8 rounded-[30px] border border-[#DDE7F2] bg-white p-5">
          <div className="mb-4 flex items-center justify-center gap-3 rounded-[18px] border border-[#E6EDF5] bg-[#F8FAFC] px-4 py-3 text-sm font-black text-[#123A63]">
            <span>Aperçu sécurisé</span>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#DDE7F2] bg-[#F8FAFC]">
            {safeUrl !== "#" ? (
              <iframe src={safeUrl} title={title} className="h-[720px] w-full bg-white" />
            ) : (
              <div className="p-10 text-center text-sm font-black text-[#64748B]">
                Document indisponible.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
