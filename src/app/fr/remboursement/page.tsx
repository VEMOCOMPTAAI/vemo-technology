import { LegalPageShell } from "@/components/LegalPageShell";

export default function FrenchRefundPage() {
  return (
    <LegalPageShell
      lang="fr"
      eyebrow="Remboursement"
      title="Politique de remboursement"
      subtitle="Cette politique précise les règles de remboursement applicables aux services Vemo Technology."
      sections={[
        {
          title: "Avant le début du traitement",
          body: [
            "Une demande de remboursement peut être étudiée si le dossier n’a pas encore été traité et si aucun frais officiel ou tiers n’a été engagé.",
          ],
        },
        {
          title: "Après le début du traitement",
          body: [
            "Une fois le traitement administratif commencé, les frais de service peuvent devenir partiellement ou totalement non remboursables.",
          ],
        },
        {
          title: "Frais officiels et tiers",
          body: [
            "Les frais payés à des organismes publics, registered agents, prestataires tiers ou plateformes externes ne sont généralement pas remboursables par Vemo Technology.",
          ],
        },
        {
          title: "Demande",
          body: [
            "Toute demande doit inclure le nom complet, l’email utilisé, le nom de la LLC et la raison de la demande.",
          ],
        },
      ]}
    />
  );
}
