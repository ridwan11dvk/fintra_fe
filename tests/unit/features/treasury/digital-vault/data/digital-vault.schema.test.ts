import {
  stationSummaryListFilterSchema,
  closureDetailFilterSchema,
} from "@/features/treasury";
import { describe, expect, it } from "vitest";

describe("stationSummaryListFilterSchema", () => {
  it("should accept valid filter data", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(true);
  });

  it("should accept filter data with optional fields", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      search: "Station",
      startDate: "2025-06-01",
      endDate: "2025-06-30",
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(true);
  });

  it("should accept search without optional date fields", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      search: "Station A",
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(true);
  });

  it("should reject month less than 1", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 0,
      year: 2025,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject month greater than 12", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 13,
      year: 2025,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject year less than 2000", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 1999,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject year greater than 2100", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2101,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject search exceeding 255 characters", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      search: "A".repeat(256),
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid startDate format", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      startDate: "01-06-2025",
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid endDate format", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      endDate: "06/15/2025",
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative page", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      page: -1,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject size less than 1", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      page: 0,
      size: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should reject size greater than 100", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: 6,
      year: 2025,
      page: 0,
      size: 101,
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing required fields", () => {
    const result = stationSummaryListFilterSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should reject month as string", () => {
    const result = stationSummaryListFilterSchema.safeParse({
      month: "6",
      year: 2025,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });
});

describe("closureDetailFilterSchema", () => {
  it("should accept valid filter data", () => {
    const result = closureDetailFilterSchema.safeParse({
      month: 6,
      year: 2025,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(true);
  });

  it("should accept filter with optional search", () => {
    const result = closureDetailFilterSchema.safeParse({
      month: 6,
      year: 2025,
      search: "CL-001",
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(true);
  });

  it("should reject month less than 1", () => {
    const result = closureDetailFilterSchema.safeParse({
      month: 0,
      year: 2025,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject month greater than 12", () => {
    const result = closureDetailFilterSchema.safeParse({
      month: 13,
      year: 2025,
      page: 0,
      size: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing required fields", () => {
    const result = closureDetailFilterSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
