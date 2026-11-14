import { workCatalogSchema } from "@/features/master-data/work-catalog/data/work-catalog.schema";
import { describe, expect, it } from "vitest";

const validTax = { taxId: "1", coefficient: "11/100", ratePercent: "11" };

const validInput = {
  workType: "Pengangkutan",
  subCategoryId: "1",
  groupCategoryId: "1",
  mainCategoryId: "1",
  cashflowCategoryId: "1",
  procurementSchemaId: "1",
  description: "Jasa angkut barang",
  businessEntityTaxes: [validTax],
  individualTaxes: [{ taxId: "2", coefficient: "2", ratePercent: "2" }],
};

describe("workCatalogSchema", () => {
  it("accepts a complete form payload and trims text", () => {
    const result = workCatalogSchema.safeParse({
      ...validInput,
      workType: "  Pengangkutan  ",
      description: "  Jasa angkut barang  ",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.workType).toBe("Pengangkutan");
    expect(result.data.description).toBe("Jasa angkut barang");
  });

  it("accepts an empty description when only one tax subject is filled", () => {
    const result = workCatalogSchema.safeParse({
      ...validInput,
      workType: "Bongkar",
      description: "",
      businessEntityTaxes: [validTax],
      individualTaxes: [{ taxId: "", coefficient: "", ratePercent: "" }],
    });

    expect(result.success).toBe(true);
  });

  it("accepts an empty main category", () => {
    const result = workCatalogSchema.safeParse({
      ...validInput,
      mainCategoryId: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a blank work type", () => {
    const result = workCatalogSchema.safeParse({
      ...validInput,
      workType: "   ",
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe("Work name is required");
  });

  it("rejects a work type longer than 120 characters", () => {
    const result = workCatalogSchema.safeParse({
      ...validInput,
      workType: "a".repeat(121),
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe(
      "Work name must not exceed 120 characters",
    );
  });

  it("rejects a description longer than 500 characters", () => {
    const result = workCatalogSchema.safeParse({
      ...validInput,
      description: "a".repeat(501),
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe(
      "Description must not exceed 500 characters",
    );
  });

  it("rejects the form when neither tax subject has a selected tax", () => {
    const result = workCatalogSchema.safeParse({
      ...validInput,
      businessEntityTaxes: [{ taxId: "", coefficient: "", ratePercent: "" }],
      individualTaxes: [],
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe("Applicable tax is required");
  });
});
