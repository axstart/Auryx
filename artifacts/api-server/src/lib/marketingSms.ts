const SITE = "https://www.auryxlife.com";

/**
 * Marketing SMS is off unless explicitly enabled.
 * Uses the existing Twilio account (Aria chat). Never invents a vendor.
 * Usage is billed to the client's Twilio account.
 */
export function isMarketingSmsEnabled(): boolean {
  return (
    process.env.MARKETING_SMS_ENABLED === "true" &&
    Boolean(process.env.TWILIO_ACCOUNT_SID) &&
    Boolean(process.env.TWILIO_AUTH_TOKEN) &&
    Boolean(process.env.TWILIO_FROM_NUMBER)
  );
}

export function journeySmsBody(journey: string): string | null {
  const stop = "Reply STOP to opt out.";
  if (journey === "welcome") {
    return `Welcome to Auryx. Explore physician-guided protocols: ${SITE}/shop ${stop}`;
  }
  if (journey === "cart_abandon") {
    return `Your Auryx cart is waiting: ${SITE}/checkout ${stop}`;
  }
  if (journey === "post_purchase") {
    return `Thanks for your Auryx order. Questions? ${SITE}/contact ${stop}`;
  }
  if (journey === "win_back") {
    return `It's been a while. Continue at ${SITE}/shop ${stop}`;
  }
  return null;
}
