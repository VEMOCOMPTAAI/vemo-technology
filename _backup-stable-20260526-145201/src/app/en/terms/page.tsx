import { LegalPageShell } from "@/components/LegalPageShell";

export default function EnglishTermsPage() {
  return (
    <LegalPageShell
      lang="en"
      eyebrow="Terms"
      title="Terms of Use"
      subtitle="These terms govern the use of the Vemo Technology platform."
      sections={[
        {
          title: "Service nature",
          body: [
            "Vemo Technology provides administrative and document support for US LLC formation by non-residents.",
            "The service does not constitute personalized legal, tax or accounting advice.",
          ],
        },
        {
          title: "Client responsibility",
          body: [
            "The client must provide accurate, complete and up-to-date information.",
            "Incorrect information may delay or prevent case processing.",
          ],
        },
        {
          title: "Payment",
          body: [
            "Payments are processed through Stripe. Card details are not stored by Vemo Technology.",
            "Official and third-party fees may vary depending on the state, agencies and selected Services.",
          ],
        },
        {
          title: "Limitation",
          body: [
            "Vemo Technology does not guarantee approval for bank accounts, Stripe, PayPal or any third-party service.",
          ],
        },
      ]}
    />
  );
}



