"use client";

import type { BankResponse } from "@/features/master-data";
import {
  BANK_DELETE_PERMISSION,
  BANK_UPDATE_PERMISSION,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

export const bankColumns = (
  handlers: TableActionHandlers<BankResponse>,
): ColumnDef<BankResponse>[] => [
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
    accessorKey: "name",
    meta: { title: "Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "code",
    meta: { title: "Code" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "color",
    meta: { title: "Color" },
    header: () => <div>Color</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border border-gray-300"
          style={{
            backgroundColor: row.original.color || "#gray",
          }}
        />
        <span className="text-xs text-gray-600">
          {row.original.color || "-"}
        </span>
      </div>
    ),
    enableSorting: false,
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
          permission={BANK_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={BANK_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
