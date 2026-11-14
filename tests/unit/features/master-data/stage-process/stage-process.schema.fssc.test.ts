import {
  stageProcessFormSchema,
  stageProcessListSchema,
} from "@/features/master-data/stage-process/data/stage-process.schema";
import { stageProcessTypes } from "@/features/master-data/stage-process/data/stage-process.types";
import { describe, expect, it } from "vitest";

function record(index: number, overrides: Record<string, unknown> = {}) {
  return {
    id: `stage-${index}`,
    sequence: index + 1,
    roleGroup: "Finance",
    processName: `Process ${index}`,
    processType: "Approval",
    slaDays: 1,
    version: 0,
    ...overrides,
  };
}

describe("stageProcess schema FSSC-PSLA", () => {
  it("FSSC-PSLA-006: accepts an 18-stage ordered catalog", () => {
    const items = Array.from({ length: 18 }, (_, i) => record(i));
    expect(stageProcessListSchema.safeParse(items).success).toBe(true);
    expect(items.map((row) => row.sequence)).toEqual(
      Array.from({ length: 18 }, (_, i) => i + 1),
    );
  });

  it("FSSC-PSLA-007: keeps Role Group on each stage", () => {
    const items = [
      record(0, { roleGroup: "Business Unit" }),
      record(1, { roleGroup: "Finance" }),
    ];
    const parsed = stageProcessListSchema.parse(items);
    expect(parsed.map((row) => row.roleGroup)).toEqual([
      "Business Unit",
      "Finance",
    ]);
  });

  it("FSSC-PSLA-008: requires Process Name, Process Type, and SLA", () => {
    const parsed = stageProcessListSchema.parse([record(0)]);
    expect(parsed[0]).toMatchObject({
      processName: "Process 0",
      processType: "Approval",
      slaDays: 1,
    });
  });

  it("FSSC-PSLA-012: accepts an updated positive SLA value", () => {
    expect(
      stageProcessListSchema.safeParse([record(0, { slaDays: 5 })]).success,
    ).toBe(true);
  });

  it("FSSC-PSLA-013: accepts an updated Process Name", () => {
    expect(
      stageProcessListSchema.safeParse([
        record(0, { processName: "Invoice Verification" }),
      ]).success,
    ).toBe(true);
  });

  it("FSSC-PSLA-014: accepts an updated Process Type", () => {
    expect(
      stageProcessListSchema.safeParse([
        record(0, { processType: "Verification" }),
      ]).success,
    ).toBe(true);
  });

  it("FSSC-PSLA-015: rejects Save when Process Name is empty", () => {
    expect(
      stageProcessListSchema.safeParse([record(0, { processName: "" })]).success,
    ).toBe(false);
  });

  it("FSSC-PSLA-016: rejects Save when Process Type is empty", () => {
    expect(
      stageProcessListSchema.safeParse([record(0, { processType: "" })]).success,
    ).toBe(false);
  });

  it("FSSC-PSLA-017: rejects Save when SLA is empty", () => {
    const empty = stageProcessFormSchema.safeParse({
      items: [record(0, { slaDays: "" })],
    });
    expect(empty.success).toBe(false);
  });

  it("FSSC-PSLA-019: Process Type only accepts allowed values", () => {
    for (const processType of stageProcessTypes) {
      expect(
        stageProcessListSchema.safeParse([record(0, { processType })]).success,
      ).toBe(true);
    }
    expect(
      stageProcessListSchema.safeParse([
        record(0, { processType: "NotAType" }),
      ]).success,
    ).toBe(false);
  });

  it("FSSC-PSLA-020: rejects SLA of 0", () => {
    expect(
      stageProcessListSchema.safeParse([record(0, { slaDays: 0 })]).success,
    ).toBe(false);
  });

  it("FSSC-PSLA-021: rejects negative SLA", () => {
    expect(
      stageProcessListSchema.safeParse([record(0, { slaDays: -3 })]).success,
    ).toBe(false);
  });

  it("FSSC-PSLA-022: rejects non-numeric SLA input", () => {
    expect(
      stageProcessFormSchema.safeParse({
        items: [record(0, { slaDays: "abc" })],
      }).success,
    ).toBe(false);
  });

  it("FSSC-PSLA-023: accepts SLA of 1", () => {
    expect(
      stageProcessListSchema.safeParse([record(0, { slaDays: 1 })]).success,
    ).toBe(true);
  });

  it("FSSC-PSLA-024: accepts SLA greater than 1", () => {
    expect(
      stageProcessListSchema.safeParse([record(0, { slaDays: 14 })]).success,
    ).toBe(true);
  });
});
