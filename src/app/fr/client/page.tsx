import VemoPublicShell from "@/components/public/VemoPublicShell";

export default function Page() {
  return (
    <VemoPublicShell lang="fr">
      <main className="vemo-client-entry">
        <section>
          <span>ESPACE CLIENT</span>
          <h1>Bienvenue dans votre espace client</h1>
          <p>
            Votre compte est confirmé. Votre dossier LLC est en cours de préparation.
            Les documents, messages et statuts seront disponibles ici.
          </p>

          <div className="vemo-client-grid">
            <article>
              <strong>Statut dossier</strong>
              <p>En attente de vérification / traitement</p>
            </article>
            <article>
              <strong>Documents</strong>
              <p>Vos fichiers seront ajoutés après validation.</p>
            </article>
            <article>
              <strong>Messages</strong>
              <p>Vous pourrez suivre les échanges avec VEMO.</p>
            </article>
          </div>
        </section>
      </main>
    </VemoPublicShell>
  );
}
