"use client";

import { ActionButton } from "@railfinance/core/components/actions";
import { ColumnHeader } from "@railfinance/core";
import type { ColumnDef } from "@tanstack/react-table";
import type { StageCatalogItem } from "../data/dispute-workflow.types";
import {
  DISPUTE_WORKFLOW_READ_PERMISSION,
  DISPUTE_WORKFLOW_UPDATE_PERMISSION,
} from "../data/dispute-workflow.utils";

export interface DisputeWorkflowColumnHandlers {
  onView?: (item: StageCatalogItem) => void;
  onShow?: (item: StageCatalogItem) => void;
  onToggle?: (item: StageCatalogItem) => void;
  onActivate?: (item: StageCatalogItem) => void;
  onDeactivate?: (item: StageCatalogItem) => void;
  onEdit?: (item: StageCatalogItem) => void;
}

export const disputeWorkflowColumns = (
  handlers: DisputeWorkflowColumnHandlers,
): ColumnDef<StageCatalogItem>[] => [
  {
    accessorKey: "stageProcessCategoryName",
    meta: { title: "Stage Process Category" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {row.original.stageProcessCategoryName}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "stageProcessName",
    meta: { title: "Stage Process Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {row.original.stageProcessName}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <ActionButton
          variant="show"
          size="sm"
          onClick={() => (handlers.onView ?? handlers.onShow)?.(row.original)}
          permission={DISPUTE_WORKFLOW_READ_PERMISSION}
        />
        <ActionButton
          variant="edit"
          size="sm"
          onClick={() => handlers.onEdit?.(row.original)}
          permission={DISPUTE_WORKFLOW_UPDATE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
