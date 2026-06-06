import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PaymentSuccessPage() {
  return (
    <main className="vemo-white-page min-h-screen bg-white px-6 py-20 text-[#202838]">
      <section className="mx-auto max-w-3xl rounded-[18px] border border-[#E8E2DC] bg-white p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF3] text-3xl">✓</div>
        <h1 className="mt-6 text-4xl font-black tracking-[-0.04em]">Paiement confirmé</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Votre paiement a été confirmé. Vous pouvez suivre votre dossier depuis l’espace client.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/fr/espace-client" className="rounded-xl bg-[#F15A24] px-6 py-4 text-sm font-black text-white">Espace client</Link>
          <Link href="/fr" className="rounded-xl border border-[#E8E2DC] bg-white px-6 py-4 text-sm font-black text-[#123A63]">Accueil</Link>
        </div>
      </section>
    </main>
  );
}
