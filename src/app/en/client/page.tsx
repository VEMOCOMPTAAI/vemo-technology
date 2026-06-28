import VemoPublicShell from "@/components/public/VemoPublicShell";

export default function Page() {
  return (
    <VemoPublicShell lang="en">
      <main className="vemo-client-entry">
        <section>
          <span>CLIENT PORTAL</span>
          <h1>Welcome to your client portal</h1>
          <p>
            Your account is confirmed. Your LLC file is now pending preparation.
            Documents, messages and status updates will be available here.
          </p>

          <div className="vemo-client-grid">
            <article>
              <strong>File status</strong>
              <p>Pending verification / processing</p>
            </article>
            <article>
              <strong>Documents</strong>
              <p>Your files will be added after validation.</p>
            </article>
            <article>
              <strong>Messages</strong>
              <p>You will be able to track VEMO messages here.</p>
            </article>
          </div>
        </section>
      </main>
    </VemoPublicShell>
  );
}
