import { cashflowGroupSchema } from "@/features/master-data/cashflow-group/data/cashflow-group.schema";
import { describe, expect, it } from "vitest";

const valid = {
  code: "CFG-01",
  name: "Operating Group",
  cashflowGroupId: "parent-1",
  cashflowType: "RECIPIENT_TARGET" as const,
  exception: false,
  description: "",
};

describe("cashflowGroupSchema FSSC-CFG", () => {
  it("FSSC-CFG-012: schema invalid while mandatory fields empty (Save stays disabled)", () => {
    expect(
      cashflowGroupSchema.safeParse({
        code: "",
        name: "",
        cashflowGroupId: "",
        cashflowType: "NOT_A_TYPE",
        exception: false,
        description: "",
      }).success,
    ).toBe(false);
  });

  it("FSSC-CFG-017: accepts Add with mandatory fields valid", () => {
    expect(cashflowGroupSchema.safeParse(valid).success).toBe(true);
  });

  it("FSSC-CFG-018: rejects Add without Code", () => {
    expect(cashflowGroupSchema.safeParse({ ...valid, code: "" }).success).toBe(
      false,
    );
  });

  it("FSSC-CFG-019: rejects Add without Name", () => {
    expect(cashflowGroupSchema.safeParse({ ...valid, name: "" }).success).toBe(
      false,
    );
  });

  it("FSSC-CFG-020: rejects Add without Cashflow Type", () => {
    expect(
      cashflowGroupSchema.safeParse({
        ...valid,
        cashflowType: "NOT_A_TYPE",
      }).success,
    ).toBe(false);
  });

  it("FSSC-CFG-021: description optional / empty allowed", () => {
    expect(
      cashflowGroupSchema.safeParse({ ...valid, description: "" }).success,
    ).toBe(true);
  });

  it("FSSC-CFG-022: rejects description over 500 characters", () => {
    expect(
      cashflowGroupSchema.safeParse({
        ...valid,
        description: "x".repeat(501),
      }).success,
    ).toBe(false);
  });
});
