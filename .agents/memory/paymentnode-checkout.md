---
name: PaymentNode client-side checkout
description: How Auryx checkout tokenizes cards directly against PaymentNode's vault, bypassing our backend, and how the charge/webhook flow is wired.
---

Auryx replaced Stripe on the main checkout page with PaymentNode (client-side tokenization, API 1B) per an explicit compliance decision — raw card data must never pass through our own backend.

Flow:
1. Frontend fetches a public key from our backend (`GET /api/checkout/paymentnode-public-key`, backed by `PAYMENTNODE_PUBLIC_KEY` secret).
2. Frontend POSTs card + billing details directly from the browser to `https://vault.sandbox.paymentnode.io/payments/integration-api/payment-methods/tokenize` using that public key as a Bearer token. This request never touches our servers.
3. The response `_id` becomes `payment_method_id`, sent to our existing `/api/checkout/charge` endpoint along with order/customer/shipping data. The backend resolves prices itself and never trusts client-supplied amounts.
4. PaymentNode sends an async webhook (`POST /api/webhooks/paymentnode`) with headers `x-signature`, `x-timestamp`, `x-webhook-event` (e.g. `PAYMENT_TRANSACTION_SUCCEEDED`). Signature verification is not yet implemented — the route is in "discovery mode," logging raw headers/body to `payment_events` for later signature-scheme confirmation.

**Why:** Stripe was rejected for this project on compliance grounds; PaymentNode was chosen instead, with a hard requirement that card data flow browser→vault directly (no backend proxying of card data).

**How to apply:** Any future payment-related work on Auryx checkout should keep this browser→vault→charge shape. Do not route tokenization through our own API. The old Stripe frontend code and `/api/checkout/tokenize` endpoint are retired from the active flow but intentionally left in the codebase (unused) — do not wire them back up without reconfirming with the team.
