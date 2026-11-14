"use client";

import type { RegencyResponse } from "@/features/master-data/regency/data/regency.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  REGENCY_DELETE_PERMISSION,
  REGENCY_UPDATE_PERMISSION,
} from "../data/regency.utils";

export const regencyColumns = (
  handlers: TableActionHandlers<RegencyResponse>,
): ColumnDef<RegencyResponse>[] => [
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
      <div className="font-mono">{row.getValue(column.id) || "-"}</div>
    ),
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
    accessorKey: "province",
    meta: { title: "Province" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.province ? row.original.province.name : "-"}
      </div>
    ),
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
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center font-medium">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center gap-1">
        <ActionButton
          variant="edit"
          onClick={() => handlers?.onEdit?.(row.original)}
          tooltip="Edit"
          permission={REGENCY_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          onClick={() => handlers?.onDelete?.(row.original)}
          tooltip="Delete"
          permission={REGENCY_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
