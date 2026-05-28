
"use client";

import { AdminShell } from "@/components/admin/AdminShell";

type Lang = "fr" | "en";

export default function AdminSectionPage({
  lang,
  title,
  subtitle,
}: {
  lang: Lang;
  title: string;
  subtitle: string;
}) {
  return (
    <AdminShell lang={lang}>
      <div>
        <div className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123A63] shadow-sm ring-1 ring-[#E8E2DC]">
          Admin
        </div>

        <h2 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.06em] text-[#2B2F36]">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
          {subtitle}
        </p>
      </div>

      <section className="mt-8 rounded-[16px] border border-[#E8E2DC] bg-white p-8 shadow-[0_24px_70px_rgba(43,47,54,0.08)]">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
          Module prêt
        </div>
        <h3 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#2B2F36]">
          Données à connecter
        </h3>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#2B2F36]/68">
          L’interface est prête. La prochaine étape consiste à connecter cette section aux tables Supabase et aux API admin sécurisées.
        </p>
      </section>
    </AdminShell>
  );
}
