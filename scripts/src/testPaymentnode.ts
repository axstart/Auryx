export {};

/**
 * PaymentNode integration smoke test.
 * Tests tokenize → charge → refund using the standard test card.
 *
 * Run: pnpm --filter @workspace/scripts run test:paymentnode
 */

// ── Config ─────────────────────────────────────────────────────────────────

const MERCHANT_ID     = process.env.PAYMENTNODE_MERCHANT_ID;
const MERCHANT_SECRET = process.env.PAYMENTNODE_MERCHANT_SECRET;
const VAULT_HOST      = process.env.PAYMENTNODE_VAULT_HOST ?? "https://vault.sandbox.paymentnode.io";
const API_HOST        = process.env.PAYMENTNODE_API_HOST  ?? "https://api.sandbox.paymentnode.io";

if (!MERCHANT_ID || !MERCHANT_SECRET) {
  console.error("ERROR: PAYMENTNODE_MERCHANT_ID and PAYMENTNODE_MERCHANT_SECRET must be set.");
  process.exit(1);
}

const BASIC_AUTH = Buffer.from(`${MERCHANT_ID}:${MERCHANT_SECRET}`).toString("base64");

// ── Helpers ────────────────────────────────────────────────────────────────

async function post(url: string, body: unknown): Promise<unknown> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${BASIC_AUTH}`,
    },
    body: JSON.stringify(body),
  });

  let data: unknown;
  try { data = await res.json(); } catch { data = await res.text(); }

  if (!res.ok) {
    throw Object.assign(
      new Error(`HTTP ${res.status} ${res.statusText}`),
      { status: res.status, responseBody: data },
    );
  }
  return data;
}

function sep(label: string) {
  console.log(`\n${"─".repeat(50)}`);
  console.log(`  ${label}`);
  console.log("─".repeat(50));
}

// ── Test card ──────────────────────────────────────────────────────────────

const TEST_ORDER_ID = `TEST-${Date.now()}`;

// ── Step 1: Tokenize ───────────────────────────────────────────────────────

sep("STEP 1 — Tokenize payment method");

let paymentMethodId: string;

try {
  const tokenResult = await post(
    `${VAULT_HOST}/payments/integration-api/payment-methods`,
    {
      channel_id: "CREDIT_CARD",
      credit_card_info: {
        name: "Test Cardholder",
        email: "test@auryx.dev",
        phone: "3055550100",
        address: {
          city: "Miami",
          country: "US",
          line1: "123 Test Street",
          line2: "",
          postal_code: "33101",
          province: "FL",
        },
        number: "4242424242424242",
        expiry_date: "12/29",
        cvd: "123",
        type: "VISA",
        last4digits: "4242",
      },
    },
  ) as { id: string };

  paymentMethodId = tokenResult.id;
  console.log("✓ Tokenized successfully");
  console.log("  payment_method_id:", paymentMethodId);
} catch (err: unknown) {
  const e = err as Error & { status?: number; responseBody?: unknown };
  console.error("✗ Tokenization failed:", e.message);
  if (e.responseBody) console.error("  Response body:", JSON.stringify(e.responseBody, null, 2));
  process.exit(1);
}

// ── Step 2: Charge ─────────────────────────────────────────────────────────

sep("STEP 2 — Charge $1.00");

let chargeId: string;

try {
  const chargeResult = await post(
    `${API_HOST}/payments/integration-api/payments`,
    {
      amount: 100,
      order_id: TEST_ORDER_ID,
      payment_method_id: paymentMethodId,
      currency_code: "USD",
      metadata: { test: true, source: "smoke-test" },
    },
  ) as { _id: string; status: string };

  if (chargeResult.status !== "success") {
    console.error("✗ Charge returned non-success status:", chargeResult.status);
    console.error("  Full response:", JSON.stringify(chargeResult, null, 2));
    process.exit(1);
  }

  chargeId = chargeResult._id;
  console.log("✓ Charge successful");
  console.log("  payment_id:", chargeId);
  console.log("  status:", chargeResult.status);
} catch (err: unknown) {
  const e = err as Error & { status?: number; responseBody?: unknown };
  console.error("✗ Charge failed:", e.message);
  if (e.responseBody) console.error("  Response body:", JSON.stringify(e.responseBody, null, 2));
  process.exit(1);
}

// ── Step 3: Refund ─────────────────────────────────────────────────────────

sep("STEP 3 — Refund $1.00");

try {
  const refundResult = await post(
    `${API_HOST}/payments/integration-api/payments/${chargeId}/refund`,
    {
      amount: 100,
      order_id: TEST_ORDER_ID,
      payment_method_id: paymentMethodId,
      currency_code: "USD",
      metadata: { test: true, reason: "smoke-test-refund" },
    },
  ) as { _id: string; refunded: boolean };

  console.log("✓ Refund complete");
  console.log("  _id:", refundResult._id);
  console.log("  refunded:", refundResult.refunded);
} catch (err: unknown) {
  const e = err as Error & { status?: number; responseBody?: unknown };
  console.error("✗ Refund failed:", e.message);
  if (e.responseBody) console.error("  Response body:", JSON.stringify(e.responseBody, null, 2));
  process.exit(1);
}

sep("ALL STEPS PASSED ✓");
console.log("  Credentials are valid and PaymentNode sandbox is reachable.\n");
