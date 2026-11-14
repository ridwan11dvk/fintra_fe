"use client";

import type { TermOfPaymentResponse } from "@/features/master-data";
import {
  TERM_OF_PAYMENT_DELETE_PERMISSION,
  TERM_OF_PAYMENT_UPDATE_PERMISSION,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { Badge } from "@railfinance/core/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

export const termOfPaymentColumns = (
  handlers: TableActionHandlers<TermOfPaymentResponse>,
): ColumnDef<TermOfPaymentResponse>[] => [
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
      <div className="font-medium font-mono">{row.getValue(column.id)}</div>
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
    accessorKey: "numberOfDays",
    meta: { title: "Days" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="text-center text-sm font-medium">
        {row.original.numberOfDays} days
      </div>
    ),
  },
  {
    accessorKey: "calculationType",
    meta: { title: "Calculation" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => {
      const value = row.getValue(column.id);
      return (
        <Badge variant="outline" className="text-xs">
          {value === "CALENDAR_DAYS" ? "Calendar Days" : "Working Days"}
        </Badge>
      );
    },
  },
  {
    id: "discount",
    meta: { title: "Discount" },
    header: () => <div className="text-center">Discount</div>,
    cell: ({ row }) => {
      const { discount, discountType } = row.original;
      if (!discount || discount === 0)
        return <div className="text-center text-sm text-gray-500">None</div>;
      const displayValue =
        discountType === "PERCENTAGE" ? `${discount}%` : `${discount}`;
      return (
        <div className="text-center text-sm font-medium">{displayValue}</div>
      );
    },
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
          permission={TERM_OF_PAYMENT_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={TERM_OF_PAYMENT_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
