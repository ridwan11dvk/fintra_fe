import { kbliSchema } from "@/features/master-data/kbli/data/kbli.schema";
import { describe, expect, it } from "vitest";

const valid = {
  code: "01111",
  category: "A",
  businessFieldName: "Growing of cereals",
  status: "ACTIVE" as const,
};

describe("kbliSchema FSSC-KBLI", () => {
  it("FSSC-KBLI-012: accepts valid KBLI create payload", () => {
    expect(kbliSchema.safeParse(valid).success).toBe(true);
  });

  it("FSSC-KBLI-014: rejects Add without Category/Golongan", () => {
    expect(kbliSchema.safeParse({ ...valid, category: "" }).success).toBe(false);
  });

  it("FSSC-KBLI-028: rejects Edit when KBLI Code is emptied", () => {
    expect(kbliSchema.safeParse({ ...valid, code: "" }).success).toBe(false);
  });

  it("FSSC-KBLI-029: rejects Edit when Category/Golongan is emptied", () => {
    expect(kbliSchema.safeParse({ ...valid, category: "  " }).success).toBe(
      false,
    );
  });

  it("FSSC-KBLI-030: rejects Edit when Business Field Name is emptied", () => {
    expect(
      kbliSchema.safeParse({ ...valid, businessFieldName: "" }).success,
    ).toBe(false);
  });

  it("FSSC-KBLI-032: accepts Category/Golongan change", () => {
    expect(
      kbliSchema.safeParse({ ...valid, category: "B" }).success,
    ).toBe(true);
  });

  it("FSSC-KBLI-015: accepts updated Business Field Name", () => {
    expect(
      kbliSchema.safeParse({
        ...valid,
        businessFieldName: "Updated field name",
      }).success,
    ).toBe(true);
  });

  it("FSSC-KBLI-016: trims KBLI Code before accepting", () => {
    const result = kbliSchema.safeParse({ ...valid, code: " 01111 " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.code).toBe("01111");
  });
});
