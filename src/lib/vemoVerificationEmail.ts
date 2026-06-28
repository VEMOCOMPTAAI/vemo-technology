export async function sendVemoVerificationEmail({
  email,
  verifyUrl,
  lang,
}: {
  email: string;
  verifyUrl: string;
  lang: "fr" | "en";
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "VEMO Technology <onboarding@resend.dev>";

  if (!apiKey || !email) {
    return { sent: false };
  }

  const subject =
    lang === "fr"
      ? "Confirmez votre compte VEMO Technology"
      : "Confirm your VEMO Technology account";

  const html =
    lang === "fr"
      ? `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#101828">
          <h2 style="color:#123A63">Confirmez votre compte VEMO Technology</h2>
          <p>Votre dossier LLC a bien été enregistré.</p>
          <p>Pour accéder à votre espace client, confirmez votre adresse email.</p>
          <p style="margin-top:28px">
            <a href="${verifyUrl}" style="background:#F15A24;color:white;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:bold">
              Confirmer mon email
            </a>
          </p>
        </div>
      `
      : `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#101828">
          <h2 style="color:#123A63">Confirm your VEMO Technology account</h2>
          <p>Your LLC file has been saved.</p>
          <p>To access your client portal, confirm your email address.</p>
          <p style="margin-top:28px">
            <a href="${verifyUrl}" style="background:#F15A24;color:white;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:bold">
              Confirm my email
            </a>
          </p>
        </div>
      `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: email, subject, html }),
  });

  return { sent: res.ok };
}
