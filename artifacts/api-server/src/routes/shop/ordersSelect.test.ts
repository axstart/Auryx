import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isMissingOrdersCouponColumnError,
  withCouponColumnDefaults,
} from "./ordersSelectCompat.ts";

const LIVE_DASHBOARD_ERROR = new Error(
  'Failed query: select "id", "customer_name", "email", "phone", "shipping_address", "items", "total_cents", "original_total_cents", "discount_cents", "status", "tracking_number", "stripe_payment_intent_id", "payment_method_id", "paynode_payment_id", "coupon_code", "coupon_id", "requires_consultation", "consultation_requested", "consultation_form_submitted", "research_field", "terms_accepted", "created_at", "updated_at" from "orders" order by created_at DESC limit $1',
);

describe("isMissingOrdersCouponColumnError", () => {
  it("matches the live Drizzle Failed query that 500s the admin dashboard", () => {
    assert.equal(isMissingOrdersCouponColumnError(LIVE_DASHBOARD_ERROR), true);
  });

  it("detects a wrapped 42703 cause", () => {
    const err = {
      message: LIVE_DASHBOARD_ERROR.message,
      cause: {
        code: "42703",
        message: 'column "original_total_cents" of relation "orders" does not exist',
      },
    };
    assert.equal(isMissingOrdersCouponColumnError(err), true);
  });

  it("does not treat an unrelated failed query as a coupon-column gap", () => {
    assert.equal(
      isMissingOrdersCouponColumnError(
        new Error('Failed query: select "slug" from "inventory_items"'),
      ),
      false,
    );
    assert.equal(isMissingOrdersCouponColumnError(new Error("connection refused")), false);
  });
});

describe("withCouponColumnDefaults", () => {
  it("fills coupon fields so admin clients keep a stable shape", () => {
    const row = withCouponColumnDefaults({
      id: 1,
      customerName: "Ali",
      email: "ali@example.com",
      phone: null,
      shippingAddress: { street: "1 Main", city: "NY", state: "NY", zip: "10001", country: "US" },
      items: [],
      totalCents: 9900,
      status: "pending",
      trackingNumber: null,
      stripePaymentIntentId: null,
      paymentMethodId: null,
      paynodePaymentId: null,
      requiresConsultation: false,
      consultationRequested: false,
      consultationFormSubmitted: false,
      researchField: null,
      termsAccepted: true,
      createdAt: new Date("2026-09-26T00:00:00Z"),
      updatedAt: new Date("2026-09-26T00:00:00Z"),
    });
    assert.equal(row.originalTotalCents, null);
    assert.equal(row.discountCents, 0);
    assert.equal(row.couponCode, null);
    assert.equal(row.couponId, null);
    assert.equal(row.totalCents, 9900);
  });
});
