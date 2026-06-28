import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VemoPublicShell from "@/components/public/VemoPublicShell";

export default async function Page() {
  const cookieStore = await cookies();
  const verified = cookieStore.get("vemo_client_verified")?.value === "1";

  if (!verified) {
    redirect("/en/client");
  }

  return (
    <VemoPublicShell lang="en">
      <main className="vemo-real-client-portal">
        <section>
          <div className="vemo-client-top">
            <div>
              <span>CLIENT PORTAL</span>
              <h1>Your LLC file</h1>
              <p>Track your status, documents, services and messages.</p>
            </div>
            <strong>Account confirmed</strong>
          </div>

          <div className="vemo-client-tabs">
            <article>
              <small>01</small>
              <h3>Status</h3>
              <p>File pending verification.</p>
            </article>
            <article>
              <small>02</small>
              <h3>My files</h3>
              <p>Documents available after processing.</p>
            </article>
            <article>
              <small>03</small>
              <h3>My services</h3>
              <p>LLC services and selected options.</p>
            </article>
            <article>
              <small>04</small>
              <h3>Messages</h3>
              <p>Messages with VEMO Technology.</p>
            </article>
          </div>
        </section>
      </main>
    </VemoPublicShell>
  );
}
