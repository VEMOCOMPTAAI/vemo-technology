import { Suspense } from "react";
import ClientActivationPage from "@/components/ClientActivationPage";

export default function EnglishActivationPage() {
  return (
    <Suspense fallback={null}>
      <ClientActivationPage lang="en" />
    </Suspense>
  );
}