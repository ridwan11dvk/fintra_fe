"use client";

import { ColumnHeader } from "@railfinance/core";
import type { ColumnDef } from "@tanstack/react-table";
import type { DisputeRejectReasonItem } from "../data/dispute-workflow.types";

export const formatDestinationLabel = (val?: string): string => {
  if (!val) return "-";
  const normalized = val.toUpperCase().replaceAll(/\s+/g, "_");
  if (normalized === "DISPUTE_RESOLUTION") return "Dispute Resolution";
  if (normalized === "NON_DISPUTE") return "Non Dispute";
  if (normalized === "BACK_TO_SUBMITTER") return "Back to submitter";
  if (normalized === "ANOTHER_STAGE") return "Another stage";
  return val;
};

export const rejectReasonColumns: ColumnDef<DisputeRejectReasonItem>[] = [
  {
    accessorKey: "rejectReasonCategoryName",
    meta: { title: "Reject Reason Category" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.original.rejectReasonCategoryName || "-"}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "rejectDestination",
    meta: { title: "Reject Destination" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {formatDestinationLabel(row.original.rejectDestination)}
        </span>
        {row.original.nonDisputeRole && (
          <span className="text-xs text-muted-foreground">
            {row.original.nonDisputeRole}
          </span>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "afterCaseCloseDestination",
    meta: { title: "After Case Close Destination" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {formatDestinationLabel(row.original.afterCaseCloseDestination)}
        </span>
        {row.original.stageProcess && (
          <span className="text-xs text-muted-foreground">
            {row.original.stageProcess}
          </span>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {row.original.description || "-"}
      </span>
    ),
    enableSorting: false,
  },
];
