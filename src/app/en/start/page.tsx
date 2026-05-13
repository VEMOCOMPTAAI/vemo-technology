import LLCFormationWizard from "@/components/LLCFormationWizard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function EnglishStartPage() {
  return (
    <main className="min-h-screen text-[#111a33]">
      <SiteHeader lang="en" active="start" />
      <LLCFormationWizard lang="en" />
      <SiteFooter lang="en" />
    </main>
  );
}
