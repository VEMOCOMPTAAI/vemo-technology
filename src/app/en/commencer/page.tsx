import { Suspense } from "react";
import LLCStartWizard from "@/components/LLCStartWizard";

export default function EnglishStartPage() {
  return (<>
    <Suspense fallback={null}>
      <LLCStartWizard lang="en" />
    </Suspense>
  </>);
}