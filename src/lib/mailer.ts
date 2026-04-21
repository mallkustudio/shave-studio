import { Resend } from "resend";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[mailer] No RESEND_API_KEY — email stub:", payload);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@shave-studio.com",
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}
