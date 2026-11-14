import {
  formatDestinationLabel,
  rejectReasonColumns,
} from "@/features/master-data/dispute-workflow/components/reject-reason-columns";
import { describe, expect, it } from "vitest";

describe("rejectReasonColumns", () => {
  it("formatDestinationLabel formats enum strings to readable labels", () => {
    expect(formatDestinationLabel("DISPUTE_RESOLUTION")).toBe(
      "Dispute Resolution",
    );
    expect(formatDestinationLabel("NON_DISPUTE")).toBe("Non Dispute");
    expect(formatDestinationLabel("BACK_TO_SUBMITTER")).toBe(
      "Back to submitter",
    );
    expect(formatDestinationLabel("ANOTHER_STAGE")).toBe("Another stage");
    expect(formatDestinationLabel(undefined)).toBe("-");
    expect(formatDestinationLabel("Custom Destination")).toBe(
      "Custom Destination",
    );
  });

  it("exports table columns definitions correctly", () => {
    expect(rejectReasonColumns).toHaveLength(4);
    const keys = rejectReasonColumns.map((c) => (c as { accessorKey?: string }).accessorKey);
    expect(keys).toContain("rejectReasonCategoryName");
    expect(keys).toContain("rejectDestination");
    expect(keys).toContain("afterCaseCloseDestination");
    expect(keys).toContain("description");

    rejectReasonColumns.forEach((column) => {
      expect(column.enableSorting).toBe(false);
    });
  });
});
