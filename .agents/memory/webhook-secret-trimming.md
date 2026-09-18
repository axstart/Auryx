---
name: Webhook signing secret trimming
description: HMAC signature verification silently fails if the secret has trailing whitespace from a paste.
---

When a webhook signing secret is provided by the user (e.g. pasted from a provider dashboard into Render environment variables), it can carry an invisible trailing space or newline. Comparing `secret.length` against `secret.trim().length` when debugging a signature mismatch will reveal this immediately.

**Why:** Spent a long debugging session brute-forcing dozens of HMAC payload/encoding/key permutations against real PaymentNode webhook deliveries before discovering the actual root cause was a single trailing whitespace character in the secret value (49 chars raw vs 48 trimmed) — the verification scheme was correct the whole time.

**How to apply:** Always `.trim()` any secret used as an HMAC key (or any exact-match credential) before use, defensively, regardless of source. When a signature/credential comparison mysteriously fails despite a seemingly correct implementation, check `secret.length` vs `secret.trim().length` before assuming the crypto scheme itself is wrong.
