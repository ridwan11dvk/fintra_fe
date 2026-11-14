"use client";

import type { CurrencyRateResponse } from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CURRENCY_RATE_DELETE_PERMISSION,
  CURRENCY_RATE_UPDATE_PERMISSION,
} from "../data/currency-rate.utils";

export const currencyRateColumns = (
  handlers: TableActionHandlers<CurrencyRateResponse>,
): ColumnDef<CurrencyRateResponse>[] => [
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
    accessorKey: "currencyCode",
    meta: { title: "Currency" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const code = row.original.currencyCode;
      return <div className="font-semibold uppercase">{code}</div>;
    },
  },
  {
    accessorKey: "rateType",
    meta: { title: "Rate Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-semibold">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "rate",
    meta: { title: "Rate" },
    header: ({ column }) => <ColumnHeader column={column} align="right" />,
    cell: ({ row }) => {
      const rate = row.original.rate;
      return (
        <div className="text-right font-mono">
          {rate == null
            ? "-"
            : rate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    meta: { title: "Start Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const date = row.original.startDate;
      return <div>{date ? formatDate(new Date(date), "MM/DD/YYYY") : "-"}</div>;
    },
  },
  {
    accessorKey: "endDate",
    meta: { title: "End Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const date = row.original.endDate;
      return (
        <div>{date ? formatDate(new Date(date), "MM/DD/YYYY") : "Ongoing"}</div>
      );
    },
  },
  {
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="max-w-xs truncate">{row.getValue(column.id) || "-"}</div>
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
          permission={CURRENCY_RATE_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={CURRENCY_RATE_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
