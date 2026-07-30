---
name: Influencer coupon accounting
description: Coupon orders retain original and discounted totals while commissions are recorded once after successful payment.
---

The order’s charged total is the discounted total used for PaymentNode approval charges and refunds; the original total and discount are retained separately for reporting. A coupon use must be unique per order and commission recording must happen after payment succeeds without turning a successful charge into a failed order.

**Why:** Deferred clinical approval, refunds, and retryable payment flows all need the actual charged amount, while influencer reporting needs the pre-discount amount and a retry-safe commission record.

**How to apply:** Preserve the three amount fields when changing checkout, approval, refunds, or commission calculations, and keep coupon-use insertion idempotent by order.