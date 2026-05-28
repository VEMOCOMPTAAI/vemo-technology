import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom =
  process.env.EMAIL_FROM || "Vemo Technology <onboarding@resend.dev>";

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
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export async function sendPaidOrderEmails(
  input: PaidOrderEmailInput
) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing");
    return;
  }

  const formattedAmount = formatAmount(
    input.amount,
    input.currency
  );

  try {
    await resend.emails.send({
      from: emailFrom,
      to: input.customerEmail,
      subject: "Payment received - Vemo Technology",
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h1>Payment confirmed</h1>

          <p>Hello ${input.customerName || "Client"},</p>

          <p>
            Your payment has been successfully received for your US LLC order.
          </p>

          <ul>
            <li><strong>Order ID:</strong> ${input.orderId}</li>
            <li><strong>Company:</strong> ${input.companyName}</li>
            <li><strong>Amount:</strong> ${formattedAmount}</li>
          </ul>

          <p>
            Our team will now begin processing your case.
          </p>

          <p>
            Vemo Technology
          </p>
        </div>
      `,
    });

    if (adminEmail) {
      await resend.emails.send({
        from: emailFrom,
        to: adminEmail,
        subject: "New paid LLC order",
        html: `
          <div style="font-family:Arial;padding:20px;">
            <h1>New paid order</h1>

            <ul>
              <li><strong>Client:</strong> ${input.customerName}</li>
              <li><strong>Email:</strong> ${input.customerEmail}</li>
              <li><strong>Company:</strong> ${input.companyName}</li>
              <li><strong>Amount:</strong> ${formattedAmount}</li>
              <li><strong>Payment Intent:</strong> ${input.paymentIntentId}</li>
            </ul>
          </div>
        `,
      });
    }

    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Resend email error:", error);
  }
}


