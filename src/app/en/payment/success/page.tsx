import VemoPublicShell from "@/components/public/VemoPublicShell";

export default function Page({
  searchParams,
}: {
  searchParams: { session_id?: string; email?: string; redirect?: string; lang?: string };
}) {
  const sessionId = searchParams.session_id || "";
  const email = searchParams.email || "";
  const redirect = searchParams.redirect || "/en/client";
  const verifyHref = `/api/llc/verify?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}&lang=en&payment=success`;

  return (
    <VemoPublicShell lang="en">
      <main className="vemo-payment-success">
        <section>
          <span>PAYMENT CONFIRMED</span>
          <h1>Your payment was accepted</h1>
          <p>
            You can download your Stripe receipt, then confirm your email address
            to access your client portal.
          </p>

          <div className="vemo-payment-success-actions">
            {sessionId && (
              <a href={`/api/llc/receipt?session_id=${encodeURIComponent(sessionId)}`} target="_blank" rel="noreferrer">
                Download receipt
              </a>
            )}
            <a href={verifyHref} className="primary">
              Confirm email and access my portal
            </a>
          </div>
        </section>
      </main>
    </VemoPublicShell>
  );
}
