import { contentSchema } from "@/features/master-data/content/data/content.schema";
import { describe, expect, it } from "vitest";

describe("contentSchema", () => {
  it("accepts valid Content values", () => {
    const result = contentSchema.safeParse({
      sectionName: "Hero Banner",
      content: "Transparent payments",
      status: "ACTIVE",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty section and blank Content", () => {
    const result = contentSchema.safeParse({ sectionName: "", content: "   ", status: "ACTIVE" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "Section Name is required",
        "Content is required",
      ]);
    }
  });

  it("rejects invalid section/status values and Content over the limit", () => {
    const result = contentSchema.safeParse({
      sectionName: "Unknown",
      content: "x".repeat(5001),
      status: "PENDING",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual([
        "sectionName",
        "content",
        "status",
      ]);
    }
  });
});
