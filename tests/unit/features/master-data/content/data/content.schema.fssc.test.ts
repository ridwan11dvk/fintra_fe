import { contentSchema } from "@/features/master-data/content/data/content.schema";
import { describe, expect, it } from "vitest";

describe("contentSchema FSSC-CNT", () => {
  it("FSSC-CNT-012: accepts Content with valid Section Name and body", () => {
    expect(
      contentSchema.safeParse({
        sectionName: "FAQ",
        content: "How to register as a vendor",
        status: "ACTIVE",
      }).success,
    ).toBe(true);
  });

  it("FSSC-CNT-013: rejects Add without a valid Section Name", () => {
    expect(
      contentSchema.safeParse({
        sectionName: "NOT_A_SECTION",
        content: "body",
        status: "ACTIVE",
      }).success,
    ).toBe(false);
  });

  it("FSSC-CNT-014: rejects Add without Content body", () => {
    expect(
      contentSchema.safeParse({
        sectionName: "FAQ",
        content: "   ",
        status: "ACTIVE",
      }).success,
    ).toBe(false);
  });

  it("FSSC-CNT-023: Save is invalid when Content is emptied on Edit", () => {
    expect(
      contentSchema.safeParse({
        sectionName: "FAQ",
        content: "",
        status: "ACTIVE",
      }).success,
    ).toBe(false);
  });

  it("FSSC-CNT-024: Save is invalid when Section Name is emptied on Edit", () => {
    expect(
      contentSchema.safeParse({
        sectionName: "",
        content: "body",
        status: "ACTIVE",
      }).success,
    ).toBe(false);
  });
});
