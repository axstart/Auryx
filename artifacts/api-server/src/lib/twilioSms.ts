import { logger } from "./logger.js";

export function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  );
}

/** Send one SMS via the existing Twilio account. Returns false if skipped or Twilio errors. */
export async function sendTwilioSms(opts: { to: string; body: string }): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const to = opts.to.trim();

  if (!accountSid || !authToken || !fromNumber || !to) return false;

  const params = new URLSearchParams({
    To: to,
    From: fromNumber,
    Body: opts.body,
  });
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Twilio ${res.status}: ${text}`);
    }
    return true;
  } catch (err) {
    logger.warn({ err }, "Twilio SMS send failed");
    return false;
  }
}
