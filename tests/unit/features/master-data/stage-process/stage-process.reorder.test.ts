import { describe, expect, it } from "vitest";
import { reorderStages } from "@/features/master-data/stage-process/data/stage-process.reorder";

const rows = [
  { id: "a", roleGroup: "Finance", sequence: 1, slaDays: 1.5 },
  { id: "b", roleGroup: "Finance", sequence: 2, slaDays: 2 },
  { id: "c", roleGroup: "Treasury", sequence: 3, slaDays: 3 },
];

describe("Stage Process reorder", () => {
  it("moves within category and renumbers without changing process data", () => {
    const moved = reorderStages(rows, "b", "a");
    expect(moved.map((row) => row.id)).toEqual(["b", "a", "c"]);
    expect(moved.map((row) => row.sequence)).toEqual([1, 2, 3]);
    expect(moved.find((row) => row.id === "a")).toEqual({ ...rows[0], sequence: 2 });
    expect(rows.map((row) => row.id)).toEqual(["a", "b", "c"]);
  });

  it.each([["a", "c"], ["c", "b"], ["missing", "b"], ["a", "a"]])("rejects invalid movement %s -> %s", (from, to) => {
    expect(reorderStages(rows, from, to)).toBe(rows);
  });
});
