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

const TEST_DOMAINS = new Set([
  "example.com",
  "test.com",
  "fake.com",
  "mock.com",
  "mailinator.com",
  "localhost",
]);

function isTestEmail(email: string): boolean {
  const domain = email.split("@").pop()?.toLowerCase() ?? "";
  if (TEST_DOMAINS.has(domain)) return true;
  if (domain.endsWith(".test") || domain.endsWith(".local")) return true;
  return false;
}

export async function sendMail(opts: {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = process.env.ZOHO_EMAIL;
  const to = opts.to ?? adminEmail;

  if (!to || !from || !process.env.ZOHO_PASSWORD) {
    console.warn("[mailer] sendMail skipped — missing env vars");
    return;
  }

  if (isTestEmail(to)) {
    console.info(`[mailer] skipped email to test address: ${to}`);
    return;
  }

  await createTransporter().sendMail({
    from: `Auryx <${from}>`,
    to,
    subject: opts.subject,
    text: opts.text,
    ...(opts.html ? { html: opts.html } : {}),
  });
}
