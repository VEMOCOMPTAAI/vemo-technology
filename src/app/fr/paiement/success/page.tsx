import VemoPublicShell from "@/components/public/VemoPublicShell";

export default function Page({
  searchParams,
}: {
  searchParams: { session_id?: string; email?: string; redirect?: string; lang?: string };
}) {
  const sessionId = searchParams.session_id || "";
  const email = searchParams.email || "";
  const redirect = searchParams.redirect || "/fr/client";
  const verifyHref = `/api/llc/verify?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}&lang=fr&payment=success`;

  return (
    <VemoPublicShell lang="fr">
      <main className="vemo-payment-success">
        <section>
          <span>PAIEMENT VALIDÉ</span>
          <h1>Votre paiement a été accepté</h1>
          <p>
            Vous pouvez télécharger votre reçu Stripe, puis confirmer votre adresse email
            pour accéder à votre espace client.
          </p>

          <div className="vemo-payment-success-actions">
            {sessionId && (
              <a href={`/api/llc/receipt?session_id=${encodeURIComponent(sessionId)}`} target="_blank" rel="noreferrer">
                Télécharger le reçu
              </a>
            )}
            <a href={verifyHref} className="primary">
              Confirmer mon email et accéder à mon espace
            </a>
          </div>
        </section>
      </main>
    </VemoPublicShell>
  );
}
