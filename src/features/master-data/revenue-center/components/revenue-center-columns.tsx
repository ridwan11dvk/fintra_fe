"use client";

import {
  REVENUE_CENTER_READ_PERMISSION,
  REVENUE_CENTER_UPDATE_PERMISSION,
  type RevenueCenterResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

export const revenueCenterColumns = (
  handlers: TableActionHandlers<RevenueCenterResponse>,
): ColumnDef<RevenueCenterResponse>[] => [
  {
    accessorKey: "code",
    meta: { title: "Revenue Center ID" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium font-mono">{row.getValue(column.id)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    meta: { title: "Revenue Center Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium">{row.getValue(column.id)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "parentRevenueCenter",
    meta: { title: "Parent Revenue Center" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id) ?? "-"}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "businessUnitId",
    meta: { title: "Business Unit ID" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
    enableSorting: false,
  },
  {
    id: "action",
    meta: { title: "Action" },
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <ActionButton
          variant="show"
          size="sm"
          onClick={() => handlers?.onShow?.(row.original)}
          permission={REVENUE_CENTER_READ_PERMISSION}
        />
        <ActionButton
          variant={row.original.isActive ? "deactivate" : "activate"}
          size="sm"
          onClick={() =>
            row.original.isActive
              ? handlers?.onDeactivate?.(row.original)
              : handlers?.onActivate?.(row.original)
          }
          permission={REVENUE_CENTER_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="edit"
          size="sm"
          onClick={() => handlers?.onEdit?.(row.original)}
          permission={REVENUE_CENTER_UPDATE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
