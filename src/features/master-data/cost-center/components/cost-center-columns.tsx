"use client";

import {
  COST_CENTER_DELETE_PERMISSION,
  COST_CENTER_UPDATE_PERMISSION,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { formatDate } from "@railfinance/core/lib";
import { type CostCenterResponse } from "@railfinance/core/masterdata";
import type { ColumnDef } from "@tanstack/react-table";

export const costCenterColumns = (
  handlers: TableActionHandlers<CostCenterResponse>,
): ColumnDef<CostCenterResponse>[] => [
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
    accessorKey: "costCenterCode",
    meta: { title: "Code" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium font-mono">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "costCenterName",
    meta: { title: "Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "companyCode",
    meta: { title: "Company" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "businessAreaCode",
    meta: { title: "BA" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.businessAreaCode || "—"}
      </div>
    ),
  },
  {
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="truncate text-sm">{row.original.description || "-"}</div>
    ),
  },
  {
    accessorKey: "categoryName",
    meta: { title: "Category" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-medium">{row.original.categoryName ?? "—"}</div>
    ),
  },
  {
    accessorKey: "startDate",
    meta: { title: "Start Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono">
        {row.original.startDate
          ? formatDate(new Date(row.original.startDate), "DD/MM/YYYY")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    meta: { title: "End Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono">
        {row.original.endDate
          ? formatDate(new Date(row.original.endDate), "DD/MM/YYYY")
          : "—"}
      </div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <ActionButton
          variant="edit"
          size="sm"
          onClick={() => handlers?.onEdit?.(row.original)}
          permission={COST_CENTER_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={COST_CENTER_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
