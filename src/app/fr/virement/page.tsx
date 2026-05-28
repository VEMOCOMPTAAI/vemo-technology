import { PaymentHero, VemoCard, VemoInput, VemoPaymentShell, VemoTextarea } from "@/components/VemoPaymentShell";

export default function BankTransferPage() {
  return (
    <VemoPaymentShell lang="fr">
      <PaymentHero
        eyebrow="Virement bancaire"
        title="Uploader votre justificatif de virement"
        text="Le client envoie la preuve de paiement avant de continuer vers la création / vérification du compte client."
      />

      <main className="px-6 pb-20">
        <VemoCard className="mx-auto grid max-w-6xl gap-8 p-8 lg:grid-cols-[.9fr_1.1fr]">
          <aside>
            <div className="rounded-[18px] border border-[#FFD2C2] bg-white p-6">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-[#F15A24]">Coordonnées bancaires</div>
              <h2 className="mt-4 text-2xl font-black text-[#123A63]">Vemo Technology LLC</h2>

              <div className="mt-6 space-y-4 text-sm font-bold text-slate-700">
                <div className="rounded-[14px] bg-white p-4">
                  Banque / Plateforme : <span className="text-[#202838]">À compléter</span>
                </div>
                <div className="rounded-[14px] bg-white p-4">
                  Titulaire : <span className="text-[#202838]">Vemo Technology LLC</span>
                </div>
                <div className="rounded-[14px] bg-white p-4">
                  Référence obligatoire : <span className="text-[#F15A24]">Email + Pack</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[18px] border border-[#E8E2DC] bg-white p-6">
              <h3 className="text-xl font-black text-[#202838]">Processus</h3>
              <ol className="mt-4 space-y-3 text-sm font-bold text-slate-600">
                <li>1. Le client effectue le virement.</li>
                <li>2. Il upload le justificatif ici.</li>
                <li>3. L’admin vérifie le paiement.</li>
                <li>4. Le client crée / vérifie son compte.</li>
                <li>5. Il accède à son espace client.</li>
              </ol>
            </div>
          </aside>

          <form
            method="post"
            action="/api/payments/bank-transfer"
            encType="multipart/form-data"
            className="rounded-[20px] bg-white p-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <VemoInput name="client_name" required placeholder="Nom complet" />
              <VemoInput name="client_email" required type="email" placeholder="Email de commande" />
              <VemoInput name="package_name" defaultValue="New Mexico Standard" placeholder="Pack choisi" />
              <VemoInput name="amount" defaultValue="179" placeholder="Montant USD" />
              <VemoInput name="reference" required placeholder="Référence du virement" />
              <VemoInput name="phone" placeholder="Téléphone / WhatsApp" />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-[#123A63]">
                  Justificatif de virement
                </label>
                <input
                  name="proof_file"
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="block w-full rounded-[14px] border border-dashed border-[#F15A24]/45 bg-white p-4 text-sm font-bold text-slate-600 file:mr-4 file:rounded-[10px] file:border-0 file:bg-[#F15A24] file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <VemoTextarea name="notes" placeholder="Message ou précision sur le paiement..." />
              </div>

              <input type="hidden" name="lang" value="fr" />

              <button className="md:col-span-2 min-h-[54px] rounded-[14px] bg-[#F15A24] text-sm font-black text-white shadow-[0_16px_34px_rgba(241,90,36,.22)]">
                Envoyer le justificatif et continuer →
              </button>
            </div>
          </form>
        </VemoCard>
      </main>
    </VemoPaymentShell>
  );
}
