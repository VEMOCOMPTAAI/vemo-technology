import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VemoPublicShell from "@/components/public/VemoPublicShell";

export default async function Page() {
  const cookieStore = await cookies();
  const verified = cookieStore.get("vemo_client_verified")?.value === "1";

  if (verified) {
    redirect("/fr/client/espace");
  }

  return (
    <VemoPublicShell lang="fr">
      <main className="vemo-confirm-email-page">
        <section>
          <span>CONFIRMATION EMAIL</span>
          <h1>Confirmez votre adresse email</h1>
          <p>
            Nous venons de vous envoyer un email de confirmation.
            Cliquez sur le lien reçu pour activer votre compte et accéder à votre espace client.
          </p>
          <div className="vemo-confirm-email-note">
            Votre espace client sera ouvert automatiquement après confirmation.
          </div>
        </section>
      </main>
    </VemoPublicShell>
  );
}
