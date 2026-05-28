import { LegalPageShell } from "@/components/LegalPageShell";

export default function FrenchContactPage() {
  return (
    <LegalPageShell
      lang="fr"
      eyebrow="Contact"
      title="Contactez Vemo Technology"
      subtitle="Une question sur la création de LLC, le paiement, votre dossier ou votre accompagnement ?"
      sections={[
        {
          title: "Email",
          body: [
            "Contact : contact@vemo-technology.com",
            "Remplace cette adresse par l’adresse officielle avant le lancement public.",
          ],
        },
        {
          title: "Support client",
          body: [
            "Les demandes sont traitées selon leur priorité : paiement, dossier en cours, création LLC, puis demandes générales.",
          ],
        },
        {
          title: "Avant de nous contacter",
          body: [
            "Préparez votre nom complet, votre email de commande, le nom souhaité de votre LLC et le pays de résidence.",
          ],
        },
      ]}
    />
  );
}


