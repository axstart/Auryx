import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

export async function sendMail(opts: {
  subject: string;
  text: string;
}): Promise<void> {
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.ZOHO_EMAIL;

  if (!to || !from || !process.env.ZOHO_PASSWORD) return;

  await transporter.sendMail({
    from: `Auryx <${from}>`,
    to,
    subject: opts.subject,
    text: opts.text,
  });
}
