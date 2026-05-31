import { Suspense } from "react";
import AdminClientContent from "./AdminClientContent";

export const dynamic = "force-dynamic";

function LoadingAdminClient() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-12 text-[#111827]">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#E6EDF5] bg-white p-8">
        <p className="text-sm font-black text-[#F15A24]">Chargement de la fiche client...</p>
      </div>
    </main>
  );
}

export default function AdminClientPage() {
  return (
    <Suspense fallback={<LoadingAdminClient />}>
      <AdminClientContent />
    </Suspense>
  );
}
