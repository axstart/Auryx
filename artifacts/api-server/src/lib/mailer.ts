import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });
}

export async function verifyMailer(): Promise<void> {
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.ZOHO_EMAIL;
  const pass = process.env.ZOHO_PASSWORD;
  if (!to || !from || !pass) {
    console.warn("[mailer] Skipping SMTP verify — ZOHO_EMAIL, ZOHO_PASSWORD, or ADMIN_EMAIL not set");
    return;
  }
  try {
    await createTransporter().verify();
    console.info("[mailer] SMTP connection verified successfully");
  } catch (err) {
    console.error("[mailer] SMTP connection FAILED:", err);
  }
}

export async function sendMail(opts: {
  to?: string;
  subject: string;
  text: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = process.env.ZOHO_EMAIL;
  const to = opts.to ?? adminEmail;

  if (!to || !from || !process.env.ZOHO_PASSWORD) {
    console.warn("[mailer] sendMail skipped — missing env vars");
    return;
  }

  await createTransporter().sendMail({
    from: `Auryx <${from}>`,
    to,
    subject: opts.subject,
    text: opts.text,
  });
}
