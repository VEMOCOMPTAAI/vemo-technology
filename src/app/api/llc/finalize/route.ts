import { NextResponse } from "next/server";

async function sendVerificationEmail(email: string, verifyUrl: string, lang: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "VEMO Technology <onboarding@resend.dev>";

  if (!apiKey || !email) return { sent: false };

  const subject = lang === "fr" ? "Confirmez votre compte VEMO Technology" : "Confirm your VEMO Technology account";
  const html =
    lang === "fr"
      ? `<p>Bonjour,</p><p>Votre dossier VEMO est enregistré. Confirmez votre compte pour accéder à votre espace client.</p><p><a href="${verifyUrl}">Confirmer mon compte</a></p>`
      : `<p>Hello,</p><p>Your VEMO file is saved. Confirm your account to access your client portal.</p><p><a href="${verifyUrl}">Confirm my account</a></p>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: email, subject, html }),
  });

  return { sent: true };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "https://www.vemo-technology.com";

    const lang = body.lang === "fr" ? "fr" : "en";
    const email = body?.form?.email || "";
    const portalPath = lang === "fr" ? "/fr/client" : "/en/client";

    const verifyUrl = `${origin}/api/llc/verify?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(portalPath)}&lang=${lang}&payment=transfer`;

    await sendVerificationEmail(email, verifyUrl, lang);

    return NextResponse.json({
      ok: true,
      verifyUrl,
      message: lang === "fr" ? "Dossier enregistré." : "File saved.",
    });
  } catch {
    return NextResponse.json({ error: "Erreur finalisation dossier." }, { status: 500 });
  }
}
