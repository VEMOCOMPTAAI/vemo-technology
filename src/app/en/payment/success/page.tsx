import { Suspense } from "react";
import VemoPublicShell from "@/components/public/VemoPublicShell";
import VemoPaymentSuccessClient from "@/components/start/VemoPaymentSuccessClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <VemoPublicShell lang="en">
      <Suspense fallback={null}>
        <VemoPaymentSuccessClient lang="en" />
      </Suspense>
    </VemoPublicShell>
  );
}
