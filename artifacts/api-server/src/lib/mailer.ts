import nodemailer from "nodemailer";
import { Resend } from "resend";

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

function createZohoTransporter() {
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

function getFromAddress(): string | null {
  // Prefer explicit Resend from; fall back to Zoho mailbox / brand default.
  return (
    process.env.RESEND_FROM ||
    (process.env.ZOHO_EMAIL ? `Auryx <${process.env.ZOHO_EMAIL}>` : null) ||
    "Auryx <onboarding@resend.dev>"
  );
}

function useResend(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function verifyMailer(): Promise<void> {
  if (useResend()) {
    console.info("[mailer] Resend configured (RESEND_API_KEY present)");
    const from = getFromAddress();
    console.info(`[mailer] From address: ${from}`);
    if (from?.includes("@resend.dev")) {
      console.warn(
        "[mailer] Using onboarding@resend.dev — verify auryxlife.com in Resend to send to real customers",
      );
    }
    return;
  }

  const to = process.env.ADMIN_EMAIL;
  const from = process.env.ZOHO_EMAIL;
  const pass = process.env.ZOHO_PASSWORD;
  if (!to || !from || !pass) {
    console.warn(
      "[mailer] Skipping verify — set RESEND_API_KEY (preferred) or ZOHO_EMAIL/ZOHO_PASSWORD + ADMIN_EMAIL",
    );
    return;
  }
  try {
    await createZohoTransporter().verify();
    console.info("[mailer] Zoho SMTP connection verified successfully");
  } catch (err) {
    console.error("[mailer] Zoho SMTP connection FAILED:", err);
  }
}

export async function sendMail(opts: {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const to = opts.to ?? adminEmail;
  const from = getFromAddress();

  if (!to || !from) {
    console.warn("[mailer] sendMail skipped — missing to/from");
    return;
  }

  if (isTestEmail(to)) {
    console.info(`[mailer] skipped email to test address: ${to}`);
    return;
  }

  if (useResend()) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: opts.subject,
      text: opts.text,
      ...(opts.html ? { html: opts.html } : {}),
      ...(process.env.RESEND_REPLY_TO
        ? { replyTo: process.env.RESEND_REPLY_TO }
        : process.env.ZOHO_EMAIL
          ? { replyTo: process.env.ZOHO_EMAIL }
          : {}),
    });

    if (error) {
      console.error("[mailer] Resend send failed:", error);
      throw new Error(typeof error === "object" && error && "message" in error
        ? String((error as { message: string }).message)
        : "Resend send failed");
    }

    console.info(`[mailer] Resend sent id=${data?.id ?? "unknown"} to=${to}`);
    return;
  }

  if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
    console.warn("[mailer] sendMail skipped — no RESEND_API_KEY and Zoho not configured");
    return;
  }

  await createZohoTransporter().sendMail({
    from: `Auryx <${process.env.ZOHO_EMAIL}>`,
    to,
    subject: opts.subject,
    text: opts.text,
    ...(opts.html ? { html: opts.html } : {}),
  });
}
