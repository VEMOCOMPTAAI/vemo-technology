import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import { LegalPageShell } from "@/components/LegalPageShell";

export default function EnglishFAQPage() {
  return (
    <LegalPageShell
      lang="en"
      eyebrow="FAQ"
      title="Frequently Asked Questions"
      subtitle="Key answers before setting up your US LLC with Vemo Technology."
      sections={[
        {
          title: "Can I form a US LLC if I am not a US resident?",
          body: [
            "Yes. A non-resident can form a US LLC. Requirements depend on the selected state, business activity and founder profile.",
          ],
        },
        {
          title: "Which state should I choose?",
          body: [
            "New Mexico is often chosen for simplicity and low costs. Wyoming, Delaware and Florida may also be relevant depending on branding, privacy and strategy.",
          ],
        },
        {
          title: "Do I need an EIN?",
          body: [
            "An EIN is generally needed for business banking, payment processors and administrative organization.",
          ],
        },
        {
          title: "Does Vemo Technology replace an attorney or CPA?",
          body: [
            "No. Vemo Technology provides administrative and document support. For personalized legal, tax or accounting advice, consult a qualified professional.",
          ],
        },
      ]}
    />
  );
}



