"use client";

import {
  UOM_DELETE_PERMISSION,
  UOM_UPDATE_PERMISSION,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { type UomResponse } from "@railfinance/core/masterdata";
import type { ColumnDef } from "@tanstack/react-table";

export const uomColumns = (
  handlers: TableActionHandlers<UomResponse>,
): ColumnDef<UomResponse>[] => [
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
    accessorKey: "code",
    meta: { title: "Code" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "unit",
    meta: { title: "Unit" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "unitEn",
    meta: { title: "Unit (EN)" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div>{row.original.unitEn?.trim() || row.original.unit}</div>
    ),
  },
  {
    accessorKey: "unitAlias",
    meta: { title: "Alias" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "isActive",
    meta: { title: "Status" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <StatusBadge status={row.original.isActive ? "active" : "inactive"} />
      </div>
    ),
    enableSorting: false,
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
          permission={UOM_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={UOM_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
