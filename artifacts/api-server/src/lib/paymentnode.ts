import { logger } from "./logger.js";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CardDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    city: string;
    country: string;
    line1: string;
    line2?: string;
    postal_code: string;
    province: string;
  };
  /** Raw PAN — never logged */
  number: string;
  /** MM/YY */
  expiry_date: string;
  /** Never logged */
  cvd: string;
  /** e.g. "VISA", "MASTERCARD" */
  type: string;
  last4digits: string;
}

export interface ChargeParams {
  amount: number;
  order_id: string;
  payment_method_id: string;
  currency_code: string;
  metadata?: Record<string, unknown>;
}

export interface RefundParams {
  amount: number;
  order_id: string;
  payment_method_id: string;
  currency_code: string;
  metadata?: Record<string, unknown>;
}

export interface TokenizeResult {
  payment_method_id: string;
}

export interface ChargeResult {
  _id: string;
  status: string;
  [key: string]: unknown;
}

export interface RefundResult {
  _id: string;
  refunded: boolean;
  [key: string]: unknown;
}

// ── Internal helpers ───────────────────────────────────────────────────────

interface PNConfig {
  basicAuth: string;
  vaultHost: string;
  apiHost: string;
}

function getConfig(): PNConfig {
  const merchantId = process.env.PAYMENTNODE_MERCHANT_ID;
  const merchantSecret = process.env.PAYMENTNODE_MERCHANT_SECRET;
  const vaultHost = process.env.PAYMENTNODE_VAULT_HOST;
  const apiHost = process.env.PAYMENTNODE_API_HOST;

  if (!merchantId || !merchantSecret || !vaultHost || !apiHost) {
    throw new Error(
      "PaymentNode configuration incomplete — ensure PAYMENTNODE_MERCHANT_ID, " +
      "PAYMENTNODE_MERCHANT_SECRET, PAYMENTNODE_VAULT_HOST, and PAYMENTNODE_API_HOST are set."
    );
  }

  const basicAuth = Buffer.from(`${merchantId}:${merchantSecret}`).toString("base64");
  return { basicAuth, vaultHost, apiHost };
}

class PaymentNodeError extends Error {
  status: number;
  responseBody: unknown;

  constructor(message: string, status: number, responseBody: unknown) {
    super(message);
    this.name = "PaymentNodeError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

async function pnPost(url: string, basicAuth: string, body: unknown): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(`PaymentNode network error: ${(err as Error).message}`);
  }

  if (!res.ok) {
    let detail: unknown;
    try { detail = await res.json(); } catch { detail = await res.text(); }
    throw new PaymentNodeError(
      `PaymentNode ${res.status} ${res.statusText}`,
      res.status,
      detail,
    );
  }

  return res.json();
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Tokenize a payment method via the PaymentNode vault.
 * Returns a payment_method_id safe to store and reuse for charges.
 * Raw card number and CVD are NEVER logged.
 */
export async function tokenizePaymentMethod(
  cardDetails: CardDetails,
): Promise<TokenizeResult> {
  const { basicAuth, vaultHost } = getConfig();

  logger.info({ email: cardDetails.email, last4: cardDetails.last4digits },
    "paymentnode: tokenizing payment method");

  const body = {
    channel_id: "CREDIT_CARD",
    credit_card_info: {
      name: cardDetails.name,
      email: cardDetails.email,
      phone: cardDetails.phone,
      address: cardDetails.address,
      number: cardDetails.number,
      expiry_date: cardDetails.expiry_date,
      cvd: cardDetails.cvd,
      type: cardDetails.type,
      last4digits: cardDetails.last4digits,
    },
  };

  const result = await pnPost(
    `${vaultHost}/payments/integration-api/payment-methods`,
    basicAuth,
    body,
  ) as { id: string };

  logger.info({ payment_method_id: result.id }, "paymentnode: tokenization successful");
  return { payment_method_id: result.id };
}

/**
 * Charge a previously tokenized payment method.
 * Throws PaymentNodeError if status !== "success" so the caller can abort fulfillment.
 */
export async function chargePayment(params: ChargeParams): Promise<ChargeResult> {
  const { basicAuth, apiHost } = getConfig();

  logger.info(
    { order_id: params.order_id, amount: params.amount, currency: params.currency_code },
    "paymentnode: initiating charge",
  );

  const result = await pnPost(
    `${apiHost}/payments/integration-api/payments`,
    basicAuth,
    params,
  ) as ChargeResult;

  if (result.status !== "success") {
    logger.warn({ order_id: params.order_id, status: result.status },
      "paymentnode: charge did not return success — aborting fulfillment");
    throw new PaymentNodeError(
      `PaymentNode charge failed with status: ${result.status}`,
      402,
      result,
    );
  }

  logger.info({ order_id: params.order_id, payment_id: result._id },
    "paymentnode: charge successful");
  return result;
}

/**
 * Refund a previously successful charge.
 */
export async function refundPayment(
  paymentId: string,
  params: RefundParams,
): Promise<RefundResult> {
  const { basicAuth, apiHost } = getConfig();

  logger.info({ payment_id: paymentId, order_id: params.order_id, amount: params.amount },
    "paymentnode: initiating refund");

  const result = await pnPost(
    `${apiHost}/payments/integration-api/payments/${paymentId}/refund`,
    basicAuth,
    params,
  ) as RefundResult;

  logger.info({ payment_id: paymentId, refunded: result.refunded },
    "paymentnode: refund complete");
  return { _id: result._id, refunded: result.refunded };
}
