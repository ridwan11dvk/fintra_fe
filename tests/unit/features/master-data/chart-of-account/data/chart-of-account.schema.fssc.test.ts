import { chartOfAccountSchema } from "@/features/master-data/chart-of-account/data/chart-of-account.schema";
import { describe, expect, it } from "vitest";

const valid = {
  code: "1100",
  name: "Cash",
  level: 1,
  description: "Cash accounts",
};

describe("chartOfAccountSchema FSSC-COA", () => {
  it("FSSC-COA-014: accepts mandatory fields for Add", () => {
    expect(
      chartOfAccountSchema.safeParse({
        code: "1100",
        name: "Cash",
        level: 1,
      }).success,
    ).toBe(true);
  });

  it("FSSC-COA-015: accepts Add including Description", () => {
    expect(chartOfAccountSchema.safeParse(valid).success).toBe(true);
  });

  it("FSSC-COA-016: rejects Add without Chart of Account Name", () => {
    expect(
      chartOfAccountSchema.safeParse({ ...valid, name: "" }).success,
    ).toBe(false);
  });

  it("FSSC-COA-017: rejects Add without Chart of Account Code", () => {
    expect(
      chartOfAccountSchema.safeParse({ ...valid, code: "" }).success,
    ).toBe(false);
  });

  it("FSSC-COA-018: rejects Add without Level", () => {
    expect(
      chartOfAccountSchema.safeParse({
        code: "1100",
        name: "Cash",
        level: "",
      }).success,
    ).toBe(false);
  });

  it("FSSC-COA-022: accepts Level values from 1 through 9", () => {
    for (const level of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      expect(
        chartOfAccountSchema.safeParse({ ...valid, level }).success,
      ).toBe(true);
    }
  });

  it("FSSC-COA-023: accepts Level 1", () => {
    expect(chartOfAccountSchema.safeParse({ ...valid, level: 1 }).success).toBe(
      true,
    );
  });

  it("FSSC-COA-024: accepts Level 9", () => {
    expect(chartOfAccountSchema.safeParse({ ...valid, level: 9 }).success).toBe(
      true,
    );
  });

  it("FSSC-COA-033: rejects Edit when Name is emptied", () => {
    expect(
      chartOfAccountSchema.safeParse({ ...valid, name: "" }).success,
    ).toBe(false);
  });

  it("FSSC-COA-034: rejects Edit when Code is emptied", () => {
    expect(
      chartOfAccountSchema.safeParse({ ...valid, code: "" }).success,
    ).toBe(false);
  });

  it("FSSC-COA-035: rejects Edit when Level is emptied", () => {
    expect(
      chartOfAccountSchema.safeParse({ ...valid, level: undefined }).success,
    ).toBe(false);
  });
});
