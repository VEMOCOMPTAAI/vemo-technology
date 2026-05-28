import { Suspense } from "react";
import ClientActivationPage from "@/components/ClientActivationPage";

export default function FrenchActivationPage() {
  return (
    <Suspense fallback={null}>
      <ClientActivationPage lang="fr" />
    </Suspense>
  );
}