import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { isMarketingSmsEnabled, journeySmsBody } from "./marketingSms.ts";

const KEYS = [
  "MARKETING_SMS_ENABLED",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_FROM_NUMBER",
] as const;

const saved: Record<string, string | undefined> = {};

describe("marketing SMS gate", () => {
  beforeEach(() => {
    for (const key of KEYS) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  });

  it("does not send when the flag is unset (prod-safe default)", () => {
    process.env.TWILIO_ACCOUNT_SID = "ACxxxx";
    process.env.TWILIO_AUTH_TOKEN = "token";
    process.env.TWILIO_FROM_NUMBER = "+15551234";
    assert.equal(isMarketingSmsEnabled(), false);
  });

  it("does not send when Twilio env is missing even if the flag is on", () => {
    process.env.MARKETING_SMS_ENABLED = "true";
    assert.equal(isMarketingSmsEnabled(), false);
  });

  it("enables only when flag + Twilio are both set", () => {
    process.env.MARKETING_SMS_ENABLED = "true";
    process.env.TWILIO_ACCOUNT_SID = "ACxxxx";
    process.env.TWILIO_AUTH_TOKEN = "token";
    process.env.TWILIO_FROM_NUMBER = "+15551234";
    assert.equal(isMarketingSmsEnabled(), true);
  });

  it("has SMS copy for each email journey and includes STOP", () => {
    for (const journey of ["welcome", "cart_abandon", "post_purchase", "win_back"]) {
      const body = journeySmsBody(journey);
      assert.ok(body, journey);
      assert.match(body!, /STOP/);
    }
    assert.equal(journeySmsBody("unknown"), null);
  });
});
