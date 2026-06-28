import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VemoPublicShell from "@/components/public/VemoPublicShell";

export default async function Page() {
  const cookieStore = await cookies();
  const verified = cookieStore.get("vemo_client_verified")?.value === "1";

  if (!verified) {
    redirect("/fr/client");
  }

  return (
    <VemoPublicShell lang="fr">
      <main className="vemo-real-client-portal">
        <section>
          <div className="vemo-client-top">
            <div>
              <span>ESPACE CLIENT</span>
              <h1>Votre dossier LLC</h1>
              <p>Suivez votre statut, vos documents, vos services et vos messages.</p>
            </div>
            <strong>Compte confirmé</strong>
          </div>

          <div className="vemo-client-tabs">
            <article>
              <small>01</small>
              <h3>Statut</h3>
              <p>Dossier en attente de vérification.</p>
            </article>
            <article>
              <small>02</small>
              <h3>Mes fichiers</h3>
              <p>Documents disponibles après traitement.</p>
            </article>
            <article>
              <small>03</small>
              <h3>Mes services</h3>
              <p>Services LLC et options sélectionnées.</p>
            </article>
            <article>
              <small>04</small>
              <h3>Messages</h3>
              <p>Échanges avec VEMO Technology.</p>
            </article>
          </div>
        </section>
      </main>
    </VemoPublicShell>
  );
}
