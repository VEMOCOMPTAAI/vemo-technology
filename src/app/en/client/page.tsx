import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VemoPublicShell from "@/components/public/VemoPublicShell";

export default async function Page() {
  const cookieStore = await cookies();
  const verified = cookieStore.get("vemo_client_verified")?.value === "1";

  if (verified) {
    redirect("/en/client/portal");
  }

  return (
    <VemoPublicShell lang="en">
      <main className="vemo-confirm-email-page">
        <section>
          <span>EMAIL CONFIRMATION</span>
          <h1>Confirm your email address</h1>
          <p>
            We have sent you a confirmation email.
            Click the link received to activate your account and access your client portal.
          </p>
          <div className="vemo-confirm-email-note">
            Your client portal will open automatically after confirmation.
          </div>
        </section>
      </main>
    </VemoPublicShell>
  );
}
