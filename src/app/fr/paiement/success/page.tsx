import VemoPublicShell from "@/components/public/VemoPublicShell";
import VemoPaymentSuccessClient from "@/components/start/VemoPaymentSuccessClient";

export default function Page() {
  return (
    <VemoPublicShell lang="fr">
      <VemoPaymentSuccessClient lang="fr" />
    </VemoPublicShell>
  );
}
