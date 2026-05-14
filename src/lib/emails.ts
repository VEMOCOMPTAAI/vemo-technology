import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "Vemo Technology <onboarding@resend.dev>";
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

type PaidOrderEmailInput = {
  orderId: string;
  customerEmail: string;
  customerName: string;
  companyName: string;
  amount: number;
  currency: string;
  paymentIntentId: string;
  clientAccessToken?: string;
};

export async function sendPaidOrderEmails(input: PaidOrderEmailInput) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing. Emails skipped.");
    return;
  }

  const amountText = `${input.amount} ${input.currency || "USD"}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.vemo-technology.com";
  const clientLink = input.clientAccessToken
    ? `${siteUrl}/fr/espace-client?token=${input.clientAccessToken}`
    : `${siteUrl}/fr/espace-client`;

  if (input.customerEmail) {
    await resend.emails.send({
      from: emailFrom,
      to: input.customerEmail,
      subject: "Your US LLC request has been received - Vemo Technology",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f6f7fb; padding:32px;">
          <div style="max-width:640px; margin:auto; background:white; border-radius:24px; padding:32px;">
            <h1 style="color:#111a33; margin:0 0 16px;">Payment confirmed</h1>
            <p style="color:#475569; font-size:16px; line-height:1.7;">
              Hello ${input.customerName || ""},
            </p>
            <p style="color:#475569; font-size:16px; line-height:1.7;">
              Thank you for your payment. Your US LLC formation request has been received by Vemo Technology.
            </p>

            <div style="background:#f8fafc; border-radius:18px; padding:20px; margin:24px 0;">
              <p><strong>Company:</strong> ${input.companyName}</p>
              <p><strong>Amount:</strong> ${amountText}</p>
              <p><strong>Payment ID:</strong> ${input.paymentIntentId}</p>
            </div>

            <p style="color:#475569; font-size:16px; line-height:1.7;">
              Our team will review your information and follow up with the next steps.
            </p>

            <p style="margin:28px 0;">
              <a href="${clientLink}" style="display:inline-block; background:#c51f32; color:white; padding:14px 22px; border-radius:14px; text-decoration:none; font-weight:bold;">
                Espace client / Client space
              </a>
            </p>

            <p style="color:#64748b; font-size:13px; line-height:1.7;">
              Private tracking link: ${clientLink}
            </p>

            <p style="color:#111a33; font-weight:bold;">
              Vemo Technology
            </p>
          </div>
        </div>
      `,
    });
  }

  if (adminEmail) {
    await resend.emails.send({
      from: emailFrom,
      to: adminEmail,
      subject: `New paid LLC order - ${input.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f6f7fb; padding:32px;">
          <div style="max-width:680px; margin:auto; background:white; border-radius:24px; padding:32px;">
            <h1 style="color:#111a33; margin:0 0 16px;">New paid LLC order</h1>

            <div style="background:#f8fafc; border-radius:18px; padding:20px; margin:24px 0;">
              <p><strong>Order ID:</strong> ${input.orderId}</p>
              <p><strong>Company:</strong> ${input.companyName}</p>
              <p><strong>Customer:</strong> ${input.customerName}</p>
              <p><strong>Email:</strong> ${input.customerEmail}</p>
              <p><strong>Amount:</strong> ${amountText}</p>
              <p><strong>PaymentIntent:</strong> ${input.paymentIntentId}</p>
            </div>

            <p style="color:#475569; font-size:16px; line-height:1.7;">
              Open the admin dashboard to process the order.
            </p>
          </div>
        </div>
      `,
    });
  }
}
