import LLCFormationWizard from "@/components/LLCFormationWizard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function FrenchStartPage() {
  return (
    <main className="min-h-screen text-[#111a33]">
      <SiteHeader lang="fr" active="start" />
      <LLCFormationWizard lang="fr" />
      <SiteFooter lang="fr" />
    </main>
  );
}
