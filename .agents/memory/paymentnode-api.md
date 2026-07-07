---
name: PaymentNode API — confirmed facts
description: Exact endpoint contract, auth format, and response shapes for the PaymentNode white-label gateway used in Auryx
---

# PaymentNode API — Confirmed Facts

**Why:** Private/white-label gateway with no public docs. Everything here was verified live against the sandbox.

## Credentials
- `PAYMENTNODE_MERCHANT_ID` — UUID (not email). Dashboard label: "Client ID"
- `PAYMENTNODE_MERCHANT_SECRET` — starts with `sk_`, ~107 chars
- Auth: HTTP Basic, base64(`merchant_id:merchant_secret`)

## Hosts
- Vault: `https://vault.sandbox.paymentnode.io`
- API: `https://api.sandbox.paymentnode.io`

## Tokenize
- `POST {vault}/payments/integration-api/payment-methods`
- Returns `{ id: string }` (use as `payment_method_id`)

## Charge
- `POST {api}/payments/integration-api/payments`
- Body: `{ amount, order_id, payment_method_id, currency_code, metadata? }`
- Returns `{ id, status, refundable, refunded, payment_method_id, order_id, amount, currency_code, created_at, ... }`
- Payment ID field is `id` (not `_id`)
- Success check: `status === "success"`

## Refund
- `POST {api}/payments/integration-api/payments/{payment_id}/refund`
- Body: `{ amount }` ONLY — `order_id`, `payment_method_id`, `currency_code`, `metadata` must NOT be present (422 if included)
- Returns `{ id, refunded }`

## How to apply
- Production module: `artifacts/api-server/src/lib/paymentnode.ts`
- `refundPayment(paymentId, amount)` — second arg is number, not a params object
