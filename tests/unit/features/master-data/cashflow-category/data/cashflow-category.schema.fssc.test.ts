import { cashflowCategorySchema } from "@/features/master-data/cashflow-category/data/cashflow-category.schema";
import { describe, expect, it } from "vitest";

describe("cashflowCategorySchema FSSC-CFC", () => {
  it("FSSC-CFC-014: accepts valid Cashflow Category Name", () => {
    expect(
      cashflowCategorySchema.safeParse({
        name: "OPEX",
        description: "Operating",
      }).success,
    ).toBe(true);
  });

  it("FSSC-CFC-015: accepts Add without Description", () => {
    expect(
      cashflowCategorySchema.safeParse({ name: "CAPEX", description: "" })
        .success,
    ).toBe(true);
  });

  it("FSSC-CFC-017: rejects Add without Name", () => {
    expect(
      cashflowCategorySchema.safeParse({ name: "", description: "x" }).success,
    ).toBe(false);
  });

  it("FSSC-CFC-026: accepts updated Name and Description", () => {
    expect(
      cashflowCategorySchema.safeParse({
        name: "Updated",
        description: "New desc",
      }).success,
    ).toBe(true);
  });

  it("FSSC-CFC-028: rejects Edit when Name is emptied", () => {
    expect(
      cashflowCategorySchema.safeParse({ name: "  ", description: "x" }).success,
    ).toBe(false);
  });

  it("FSSC-CFC-030: accepts emptying Description on Edit", () => {
    expect(
      cashflowCategorySchema.safeParse({ name: "OPEX", description: "" })
        .success,
    ).toBe(true);
  });
});
