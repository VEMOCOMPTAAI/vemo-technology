import { LegalPageShell } from "@/components/LegalPageShell";

export default function FrenchFAQPage() {
  return (
    <LegalPageShell
      lang="fr"
      eyebrow="FAQ"
      title="Questions fréquentes"
      subtitle="Les réponses essentielles avant de créer votre LLC américaine avec Vemo Technology."
      sections={[
        {
          title: "Est-ce que je peux créer une LLC américaine si je ne réside pas aux États-Unis ?",
          body: [
            "Oui, un non-résident peut créer une LLC américaine. Les informations nécessaires dépendent de l’État choisi, de l’activité et du profil du fondateur.",
          ],
        },
        {
          title: "Quel État choisir pour ma LLC ?",
          body: [
            "New Mexico est souvent apprécié pour sa simplicité et ses coûts faibles. Wyoming, Delaware et Florida peuvent être pertinents selon l’objectif, l’image, la confidentialité et la stratégie.",
          ],
        },
        {
          title: "Est-ce que l’EIN est obligatoire ?",
          body: [
            "L’EIN est généralement nécessaire pour ouvrir un compte bancaire professionnel, configurer certains moyens de paiement et organiser l’activité.",
          ],
        },
        {
          title: "Est-ce que Vemo Technology remplace un avocat ou un CPA ?",
          body: [
            "Non. Vemo Technology fournit un accompagnement administratif et documentaire. Pour les conseils juridiques, fiscaux ou comptables personnalisés, il faut consulter un professionnel qualifié.",
          ],
        },
      ]}
    />
  );
}
