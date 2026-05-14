import { LegalPageShell } from "@/components/LegalPageShell";

export default function FrenchTermsPage() {
  return (
    <LegalPageShell
      lang="fr"
      eyebrow="Conditions"
      title="Conditions d’utilisation"
      subtitle="Ces conditions encadrent l’utilisation de la plateforme Vemo Technology."
      sections={[
        {
          title: "Nature du service",
          body: [
            "Vemo Technology fournit une plateforme d’accompagnement administratif et documentaire pour la création de LLC américaine par des non-résidents.",
            "Le service ne constitue pas un conseil juridique, fiscal ou comptable personnalisé.",
          ],
        },
        {
          title: "Responsabilité du client",
          body: [
            "Le client doit fournir des informations exactes, complètes et à jour.",
            "Toute erreur dans les informations fournies peut retarder ou empêcher le traitement du dossier.",
          ],
        },
        {
          title: "Paiement",
          body: [
            "Les paiements sont traités via Stripe. Les informations de carte bancaire ne sont pas stockées par Vemo Technology.",
            "Les frais officiels et frais tiers peuvent varier selon l’État, les organismes et les services choisis.",
          ],
        },
        {
          title: "Limitation",
          body: [
            "Vemo Technology ne garantit pas l’acceptation d’un compte bancaire, d’un compte Stripe, PayPal ou d’un service tiers.",
          ],
        },
      ]}
    />
  );
}
