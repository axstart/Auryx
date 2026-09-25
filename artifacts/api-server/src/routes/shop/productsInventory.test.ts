import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_INVENTORY_REGULATORY_STATUS,
  isMissingRegulatoryStatusQueryError,
  isUndefinedColumnError,
  regulatoryStatusBySlugFromRows,
  summarizePublicProducts,
} from "./productsInventory.ts";
import { PRODUCTS } from "./products.ts";

describe("isUndefinedColumnError", () => {
  it("detects Postgres 42703 on the error itself", () => {
    assert.equal(isUndefinedColumnError({ code: "42703", message: "boom" }), true);
  });

  it("detects 42703 on a Drizzle-wrapped cause", () => {
    const err = {
      message: 'Failed query: select "slug", "regulatory_status" from "inventory_items"',
      cause: { code: "42703", message: 'column "regulatory_status" of relation "inventory_items" does not exist' },
    };
    assert.equal(isUndefinedColumnError(err), true);
    assert.equal(isMissingRegulatoryStatusQueryError(err), true);
  });

  it("does not treat a generic DB failure as a missing column", () => {
    assert.equal(isUndefinedColumnError(new Error("connection refused")), false);
    assert.equal(isUndefinedColumnError({ code: "57P01", message: "admin shutdown" }), false);
  });
});

describe("isMissingRegulatoryStatusQueryError", () => {
  it("matches the live Drizzle Failed query for regulatory_status", () => {
    const err = new Error(
      'Failed query: select "slug", "regulatory_status" from "inventory_items" where "inventory_items"."slug" is not null',
    );
    assert.equal(isMissingRegulatoryStatusQueryError(err), true);
    assert.equal(isUndefinedColumnError(err), false);
  });
});

describe("regulatoryStatusBySlugFromRows", () => {
  it("maps slugs and defaults a missing status", () => {
    const map = regulatoryStatusBySlugFromRows([
      { slug: "bpc-157", regulatoryStatus: "prescription" },
      { slug: "tb-500" },
      { slug: null, regulatoryStatus: "ignored" },
    ]);
    assert.equal(map.get("bpc-157"), "prescription");
    assert.equal(map.get("tb-500"), DEFAULT_INVENTORY_REGULATORY_STATUS);
    assert.equal(map.has("ignored"), false);
  });
});

describe("summarizePublicProducts", () => {
  it("serves the catalog when inventory overlay is empty (schema-mismatch fallback)", () => {
    const summaries = summarizePublicProducts(PRODUCTS, new Map());
    assert.ok(summaries.length > 0);
    assert.equal(
      summaries.some((s) => s.slug === "test-charge"),
      false,
    );
    assert.ok(summaries.some((s) => s.slug === "bpc-157"));
    assert.ok(summaries.every((s) => s.regulatory_status === DEFAULT_INVENTORY_REGULATORY_STATUS));
  });

  it("overlays inventory regulatory_status when the column is present", () => {
    const summaries = summarizePublicProducts(
      PRODUCTS,
      new Map([["bpc-157", "Research Use Only"]]),
    );
    const bpc = summaries.find((s) => s.slug === "bpc-157");
    const other = summaries.find((s) => s.slug !== "bpc-157");
    assert.equal(bpc?.regulatory_status, "Research Use Only");
    assert.equal(other?.regulatory_status, DEFAULT_INVENTORY_REGULATORY_STATUS);
  });
});
