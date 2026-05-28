import { LegalPageShell } from "@/components/LegalPageShell";

export default function FrenchPrivacyPage() {
  return (
    <LegalPageShell
      lang="fr"
      eyebrow="Confidentialité"
      title="Politique de confidentialité"
      subtitle="Cette page explique comment Vemo Technology collecte et utilise les informations du client."
      sections={[
        {
          title: "Données collectées",
          body: [
            "Nous collectons les informations nécessaires à la création du dossier : identité, email, téléphone, pays, informations de société, activité et préférences de services.",
          ],
        },
        {
          title: "Utilisation",
          body: [
            "Les données sont utilisées pour préparer le dossier, suivre le paiement, gérer l’espace admin et communiquer avec le client.",
          ],
        },
        {
          title: "Paiement",
          body: [
            "Les paiements sont traités par Stripe. Vemo Technology ne stocke pas les numéros de carte bancaire.",
          ],
        },
        {
          title: "Sécurité",
          body: [
            "Les accès admin sont protégés par mot de passe. Les clés sensibles doivent rester dans les variables d’environnement et ne jamais être exposées publiquement.",
          ],
        },
      ]}
    />
  );
}


