"use client";

import type { TaxableItemResponse } from "@/features/master-data";
import {
  TAXABLE_ITEM_DELETE_PERMISSION,
  TAXABLE_ITEM_UPDATE_PERMISSION,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { Badge } from "@railfinance/core/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

const typeColors: Record<string, string> = {
  GOODS: "bg-blue-100 text-blue-800",
  SERVICE: "bg-green-100 text-green-800",
};

export const taxableItemColumns = (
  handlers: TableActionHandlers<TaxableItemResponse>,
): ColumnDef<TaxableItemResponse>[] => [
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
    accessorKey: "altCode",
    meta: { title: "Alt Code" },
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
    accessorKey: "type",
    meta: { title: "Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div>
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${typeColors[type ?? ""] || "bg-gray-100 text-gray-800"}`}
          >
            {type}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "level",
    meta: { title: "Level" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ column, row }) => (
      <div className="text-center">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "parent",
    meta: { title: "Parent" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="text-center">{row.original?.parent?.name || "-"}</div>
    ),
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.module && (
          <Badge variant="outline">{row.original?.module?.name}</Badge>
        )}
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
          permission={TAXABLE_ITEM_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={TAXABLE_ITEM_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
