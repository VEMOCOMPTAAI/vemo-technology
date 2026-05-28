import Link from "next/link";
import type { ReactNode } from "react";

type Lang = "fr" | "en";

export function VemoPaymentShell({
  lang = "fr",
  children,
}: {
  lang?: Lang;
  children: ReactNode;
}) {
  const home = lang === "fr" ? "/fr" : "/en";
  const start = lang === "fr" ? "/fr/commencer" : "/en/commencer";
  const contact = lang === "fr" ? "/fr/contact" : "/en/contact";

  return (
    <div className="vemo-white-page min-h-screen bg-white text-[#202838]">
      <header className="sticky top-0 z-40 border-b border-[#E8E2DC] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
          <Link href={home} className="leading-none">
            <div className="text-2xl font-black tracking-[-0.05em]">
              <span className="text-[#123A63]">VEMO</span>
              <span className="text-[#F15A24]">TECH</span>
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#2B2F36]/65">
              US LLC POUR NON-RÉSIDENTS
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-black text-[#202838] md:flex">
            <Link href={home}>Accueil</Link>
            <Link href={start}>Business Setup</Link>
            <Link href={contact}>Contact</Link>
          </nav>

          <Link
            href={start}
            className="rounded-[10px] bg-[#F15A24] px-6 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(241,90,36,.22)]"
          >
            Cost Calculator
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}

export function PaymentHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 py-16">
      <div className="absolute inset-0 opacity-[0.55]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex rounded-full border border-[#FFD2C2] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F15A24]">
          {eyebrow}
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[1.05] tracking-[-0.06em] text-[#202838]">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
          {text}
        </p>
      </div>
    </section>
  );
}

export function VemoCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[22px] border border-[#E8E2DC] bg-white shadow-[0_22px_60px_rgba(18,58,99,.08)] ${className}`}>
      {children}
    </div>
  );
}

export function VemoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-13 min-h-[52px] w-full rounded-[14px] border border-[#E8E2DC] bg-white px-4 text-sm font-semibold text-[#202838] outline-none transition focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 ${props.className || ""}`}
    />
  );
}

export function VemoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-[110px] w-full rounded-[14px] border border-[#E8E2DC] bg-white px-4 py-3 text-sm font-semibold text-[#202838] outline-none transition focus:border-[#F15A24] focus:ring-4 focus:ring-[#F15A24]/10 ${props.className || ""}`}
    />
  );
}
