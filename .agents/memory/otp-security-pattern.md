---
name: OTP security pattern
description: Standard defenses for OTP/code-verification flows in this app — rate limiting, attempt lockout, salting.
---

For any email/SMS OTP verification flow, apply all of these layers (a single wrong-code check with no limiter is a remote brute-force hole — the OTP space is only 10^6 and hashing is fast):

1. **Per-record attempt counter with hard lockout.** Track wrong attempts on the OTP record itself (not just rate limiting). Once it hits the max, permanently invalidate that code — require a fresh code request. This bounds exposure per code regardless of how attempts are spread across time/IPs.
2. **Persistent (DB-backed) rate limiting**, not in-memory `Map`s. In-memory limiters reset on every restart and don't work across multiple instances. Use an atomic upsert (`INSERT ... ON CONFLICT ... DO UPDATE` with a window-reset `CASE`) so it's race-safe under concurrent requests.
3. **Rate limit both the request and verify endpoints**, keyed by email AND by IP independently. Per-record lockout alone doesn't stop an attacker who just requests fresh codes for many emails, or hammers one email from many IPs.
4. **Per-record random salt** mixed into the hash. Defense in depth against precomputed tables — not a substitute for 1-3.

**Why:** discovered via a real testing pass on the Auryx checkout email-verification flow, which had zero rate limiting on `/verify-otp` and only an in-memory limiter on `/request-otp`.

**How to apply:** when adding or auditing any OTP/magic-code flow, check for all four layers above.
