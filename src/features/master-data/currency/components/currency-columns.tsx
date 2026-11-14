"use client";

import type { CurrencyResponse } from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { Badge } from "@railfinance/core/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CURRENCY_DELETE_PERMISSION,
  CURRENCY_UPDATE_PERMISSION,
} from "../data/currency.utils";

export const currencyColumns = (
  handlers: TableActionHandlers<CurrencyResponse>,
): ColumnDef<CurrencyResponse>[] => [
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
      <div className="font-mono font-medium">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "name",
    meta: { title: "Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id) || "-"}</div>,
  },
  {
    accessorKey: "symbol",
    meta: { title: "Symbol" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ column, row }) => (
      <div className="text-center font-bold">
        {row.getValue(column.id) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "country",
    meta: { title: "Country" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const country = row.original.country;
      return <div>{country?.name}</div>;
    },
  },
  {
    accessorKey: "isPrimary",
    meta: { title: "Primary" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant={row.original.isPrimary ? "info-outline" : "warning-outline"}
        >
          {row.original.isPrimary ? "Primary" : "Secondary"}
        </Badge>
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
          permission={CURRENCY_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={CURRENCY_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
