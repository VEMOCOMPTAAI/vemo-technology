import ClientPortalTopMenu from "@/components/client-portal/ClientPortalTopMenu";
import ClientPortalMenu from "@/components/client-portal/ClientPortalMenu";
import ClientEmailMemory from "@/components/client-portal/ClientEmailMemory";
import { Suspense } from "react";
import ClientPortalContent from "./ClientPortalContent";

export const dynamic = "force-dynamic";

function LoadingClientPortal() {
  return (
    <><ClientEmailMemory redirectWhenMissing targetPath="/fr/espace-client" /><main className="min-h-screen bg-[#F5F7FA] px-6 py-12 text-[#111827]">
      <ClientPortalTopMenu lang="fr" />


      <ClientPortalMenu lang="fr" />

      <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#E6EDF5] bg-white p-8">
        <p className="text-sm font-black text-[#F15A24]">Chargement de l’espace client...</p>
      </div>
    </main></>
  );
}

export default function ClientPortalPage() {
  return (
    <Suspense fallback={<LoadingClientPortal />}>
      <ClientPortalContent />
    </Suspense>
  );
}
