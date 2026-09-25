import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { escapeIlike, searchCoaRows, type CoaSearchRow } from "./coaSearch.ts";

const rows: CoaSearchRow[] = [
  {
    id: 1,
    accession: "2605140090",
    productSlug: "bpc-157",
    productName: "BPC-157",
    label: "10 mg",
    lab: "Freedom Diagnostics Testing",
    purity: "99.84%",
    pdfUrl: "/coa/bpc-157-10mg.pdf",
    lotNumber: "2605140090",
    published: true,
  },
  {
    id: 2,
    accession: "2606030532",
    productSlug: "tb-500",
    productName: "TB-500",
    label: "10 mg",
    lab: "Freedom Diagnostics Testing",
    purity: "99.79%",
    pdfUrl: "/coa/tb-500-10mg.pdf",
    lotNumber: "2606030532",
    published: true,
  },
];

describe("COA catalog search", () => {
  it("finds BPC-157 by product name fragment without requiring a lot row", () => {
    const results = searchCoaRows("BPC", rows);
    assert.equal(results.length, 1);
    assert.equal(results[0]?.productSlug, "bpc-157");
    assert.equal(results[0]?.accession, "2605140090");
  });

  it("finds a known accession exactly", () => {
    const results = searchCoaRows("2605140090", rows);
    assert.equal(results.length, 1);
    assert.equal(results[0]?.productSlug, "bpc-157");
  });

  it("returns an empty list on a lookup miss instead of throwing", () => {
    assert.deepEqual(searchCoaRows("ZZZNOLOT999", rows), []);
    assert.doesNotThrow(() => searchCoaRows("ZZZNOLOT999", []));
    assert.deepEqual(searchCoaRows("ZZZNOLOT999", []), []);
  });

  it("returns empty for a blank query", () => {
    assert.deepEqual(searchCoaRows("  ", rows), []);
  });

  it("escapes ILIKE wildcards in user input", () => {
    assert.equal(escapeIlike("100%_off"), "100\\%\\_off");
  });
});
