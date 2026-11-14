import { describe, expect, it } from "vitest";
import { stageProcessListSchema, stageProcessFormSchema } from "@/features/master-data/stage-process/data/stage-process.schema";

function record(index: number, overrides: Record<string, unknown> = {}) {
  return {
    id: `stage-${index}`, sequence: index + 1, roleGroup: "Finance",
    processName: `Process ${index}`, processType: "Approval", slaDays: 1, version: 0,
    ...overrides,
  };
}

describe("Stage Process configuration validation", () => {
  it("accepts decimal SLA without imposing a fixed stage count", () => {
    const result = stageProcessListSchema.safeParse([record(0, { slaDays: 1.5 })]);
    expect(result.success).toBe(true);
  });

  it("accepts more than eighteen stages and sequences", () => {
    expect(stageProcessListSchema.safeParse(Array.from({ length: 21 }, (_, i) => record(i))).success).toBe(true);
  });

  it("accepts the same name in different groups", () => {
    expect(stageProcessListSchema.safeParse([
      record(0, { processName: "Verification" }),
      record(1, { processName: "Verification", roleGroup: "Treasury" }),
    ]).success).toBe(true);
  });

  it("rejects a duplicate name within the same category", () => {
    const items = Array.from({ length: 18 }, (_, i) => record(i));
    items[1].processName = items[0].processName;
    expect(stageProcessListSchema.safeParse(items).success).toBe(false);
  });

  it.each([0.5, 0, -1, Number.NaN, Number.POSITIVE_INFINITY])("rejects invalid SLA %s", (slaDays) => {
    expect(stageProcessListSchema.safeParse([record(0, { slaDays })]).success).toBe(false);
  });

  it("accepts an empty catalog without inventing stages", () => {
    expect(stageProcessListSchema.safeParse([]).success).toBe(true);
  });

  it("parses Indonesian decimal input without truncating and distinguishes empty input", () => {
    const parsed = stageProcessFormSchema.parse({ items: [record(0, { slaDays: "1,5" })] });
    expect(parsed.items[0].slaDays).toBe(1.5);
    const empty = stageProcessFormSchema.safeParse({ items: [record(0, { slaDays: "" })] });
    expect(empty.success).toBe(false);
    if (!empty.success) expect(empty.error.issues[0].message).toBe("SLA wajib diisi");
  });
});
