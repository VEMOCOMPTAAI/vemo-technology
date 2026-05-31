import { Suspense } from "react";
import ClientPortalContent from "../../fr/espace-client/ClientPortalContent";

export const dynamic = "force-dynamic";

function LoadingClientPortal() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-12 text-[#111827]">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#E6EDF5] bg-white p-8">
        <p className="text-sm font-black text-[#F15A24]">Loading client portal...</p>
      </div>
    </main>
  );
}

export default function EnClientPortalPage() {
  return (
    <Suspense fallback={<LoadingClientPortal />}>
      <ClientPortalContent />
    </Suspense>
  );
}
