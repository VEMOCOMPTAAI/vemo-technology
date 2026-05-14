import { LegalPageShell } from "@/components/LegalPageShell";

export default function EnglishRefundPage() {
  return (
    <LegalPageShell
      lang="en"
      eyebrow="Refund"
      title="Refund Policy"
      subtitle="This policy explains refund rules for Vemo Technology services."
      sections={[
        {
          title: "Before processing starts",
          body: [
            "A refund request may be reviewed if the case has not yet been processed and no official or third-party fee has been incurred.",
          ],
        },
        {
          title: "After processing starts",
          body: [
            "Once administrative processing has started, service fees may become partially or fully non-refundable.",
          ],
        },
        {
          title: "Official and third-party fees",
          body: [
            "Fees paid to government agencies, registered agents, third-party providers or external platforms are generally not refundable by Vemo Technology.",
          ],
        },
        {
          title: "Request",
          body: [
            "Any request should include full name, email used, LLC name and reason for the request.",
          ],
        },
      ]}
    />
  );
}
