import VemoPublicHeader from "@/components/site/VemoPublicHeader";
import { LegalPageShell } from "@/components/LegalPageShell";

export default function EnglishContactPage() {
  return (
    <LegalPageShell
      lang="en"
      eyebrow="Contact"
      title="Contact Vemo Technology"
      subtitle="Questions about LLC formation, payment, your order or your support process?"
      sections={[
        {
          title: "Email",
          body: [
            "Contact: contact@vemo-technology.com",
            "Replace this Email with your official address before public launch.",
          ],
        },
        {
          title: "Client support",
          body: [
            "Requests are handled by priority: payment, active case, LLC formation, then general inquiries.",
          ],
        },
        {
          title: "Before contacting us",
          body: [
            "Prepare your full name, order Email, desired LLC name and country of residence.",
          ],
        },
      ]}
    />
  );
}



