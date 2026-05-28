import { LegalPageShell } from "@/components/LegalPageShell";

export default function EnglishPrivacyPage() {
  return (
    <LegalPageShell
      lang="en"
      eyebrow="Privacy"
      title="Privacy Policy"
      subtitle="This page explains how Vemo Technology collects and uses client information."
      sections={[
        {
          title: "Collected data",
          body: [
            "We collect information required to prepare the case: identity, Email, phone, country, company details, business activity and service preferences.",
          ],
        },
        {
          title: "Use of data",
          body: [
            "Data is used to prepare the case, track payment, manage the admin dashboard and communicate with the client.",
          ],
        },
        {
          title: "Payment",
          body: [
            "Payments are processed by Stripe. Vemo Technology does not store card numbers.",
          ],
        },
        {
          title: "Security",
          body: [
            "Admin access is password-protected. Sensitive keys must remain in environment variables and must never be publicly exposed.",
          ],
        },
      ]}
    />
  );
}



