"use client";

import type { CountryResponse } from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  COUNTRY_DELETE_PERMISSION,
  COUNTRY_UPDATE_PERMISSION,
} from "../data/country.utils";

export const countryColumns = (
  handlers: TableActionHandlers<CountryResponse>,
): ColumnDef<CountryResponse>[] => [
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
    accessorKey: "iso2Code",
    meta: { title: "ISO 2" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ column, row }) => (
      <div className="text-center font-mono">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "iso3Code",
    meta: { title: "ISO 3" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ column, row }) => (
      <div className="text-center font-mono">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "dialCode",
    meta: { title: "Dial Code" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono">{row.getValue(column.id) || "-"}</div>
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
          permission={COUNTRY_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={COUNTRY_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
