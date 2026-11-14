"use client";

import type { FaqResponse } from "@/features/settings/faq/data/faq.types";
import {
  FAQ_DELETE_PERMISSION,
  FAQ_UPDATE_PERMISSION,
  getFaqValidityStatus,
} from "@/features/settings/faq/data/faq.utils";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const validityStatusMap = {
  active: "active",
  scheduled: "pending",
  expired: "archived",
} as const;

const validityLabelMap = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
} as const;

export const faqColumns = (
  handlers: TableActionHandlers<FaqResponse>,
): ColumnDef<FaqResponse>[] => [
  {
    id: "number",
    meta: { title: "No." },
    header: () => <div className="font-medium">No.</div>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <div>{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "question",
    meta: { title: "Question" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div
        className="max-w-[320px] truncate font-medium"
        title={row.original.questionEn ?? undefined}
      >
        {row.getValue(column.id)}
      </div>
    ),
  },
  {
    accessorKey: "target",
    meta: { title: "Target" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    id: "validity",
    meta: { title: "Validity" },
    header: () => <div className="font-medium">Validity</div>,
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return (
        <div className="text-sm">
          {startDate || "-"}
          {" \u2192 "}
          {endDate || "No end date"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "status",
    meta: { title: "Status" },
    header: () => <div className="font-medium">Status</div>,
    cell: ({ row }) => {
      const status = getFaqValidityStatus(
        row.original.startDate,
        row.original.endDate,
      );
      return (
        <StatusBadge
          status={validityStatusMap[status]}
          label={validityLabelMap[status]}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "sortOrder",
    meta: { title: "Sort Order" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "modifiedOn",
    meta: { title: "Modified On" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="text-sm">{row.getValue(column.id) || "-"}</div>
    ),
  },
  {
    accessorKey: "modifiedBy",
    meta: { title: "Modified By" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="text-sm">{row.getValue(column.id) || "-"}</div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <ActionButton
          variant="edit"
          onClick={() => handlers.onEdit?.(row.original)}
          size="sm"
          permission={FAQ_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          onClick={() => handlers.onDelete?.(row.original)}
          size="sm"
          permission={FAQ_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
