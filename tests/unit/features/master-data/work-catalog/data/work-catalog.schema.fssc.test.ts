import { workCatalogSchema } from "@/features/master-data/work-catalog/data/work-catalog.schema";
import { describe, expect, it } from "vitest";

const valid = {
  workType: "Pengangkutan",
  subCategoryId: "sub-1",
  groupCategoryId: "grp-1",
  mainCategoryId: "main-1",
  cashflowCategoryId: "cf-1",
  procurementSchemaId: "ps-1",
  description: "Jasa angkut",
  businessEntityTaxes: [{ taxId: "tax-1", coefficient: "1", ratePercent: "2" }],
  individualTaxes: [{ taxId: "tax-2", coefficient: "1", ratePercent: "2" }],
};

describe("workCatalogSchema FSSC-WC", () => {
  it("FSSC-WC-012: accepts valid Work Catalog payload", () => {
    expect(workCatalogSchema.safeParse(valid).success).toBe(true);
  });

  it("FSSC-WC-013: description is optional (empty allowed)", () => {
    expect(
      workCatalogSchema.safeParse({ ...valid, description: "" }).success,
    ).toBe(true);
  });

  it("FSSC-WC-014: rejects Add without Work Type", () => {
    const result = workCatalogSchema.safeParse({ ...valid, workType: "" });
    expect(result.success).toBe(false);
  });

  it("FSSC-WC-017: rejects Save Add without Applicable Taxes", () => {
    const result = workCatalogSchema.safeParse({
      ...valid,
      businessEntityTaxes: [{ taxId: "", coefficient: "", ratePercent: "" }],
      individualTaxes: [{ taxId: "", coefficient: "", ratePercent: "" }],
    });
    expect(result.success).toBe(false);
  });

  it("FSSC-WC-021: rejects Save Add when Procurement Schema is empty", () => {
    expect(
      workCatalogSchema.safeParse({ ...valid, procurementSchemaId: "" }).success,
    ).toBe(false);
  });

  it("FSSC-WC-024: accepts Add when Main Category is provided", () => {
    expect(
      workCatalogSchema.safeParse({ ...valid, mainCategoryId: "main-9" }).success,
    ).toBe(true);
  });

  it("FSSC-WC-025: rejects Save Add when Sub-Category is empty", () => {
    expect(
      workCatalogSchema.safeParse({ ...valid, subCategoryId: "" }).success,
    ).toBe(false);
  });

  it("FSSC-WC-027: rejects Save Add when Group Category is empty", () => {
    expect(
      workCatalogSchema.safeParse({ ...valid, groupCategoryId: "" }).success,
    ).toBe(false);
  });

  it("FSSC-WC-029: rejects Save Add when Cashflow Category is empty", () => {
    expect(
      workCatalogSchema.safeParse({ ...valid, cashflowCategoryId: "" }).success,
    ).toBe(false);
  });

  it("FSSC-WC-051: rejects Edit when Work Type is emptied", () => {
    expect(
      workCatalogSchema.safeParse({ ...valid, workType: "   " }).success,
    ).toBe(false);
  });
});
