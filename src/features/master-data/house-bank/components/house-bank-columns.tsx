"use client";

import type { HouseBankResponse } from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  HOUSE_BANK_DELETE_PERMISSION,
  HOUSE_BANK_UPDATE_PERMISSION,
} from "../data/house-bank.utils";

export const houseBankColumns = (
  handlers: TableActionHandlers<HouseBankResponse>,
): ColumnDef<HouseBankResponse>[] => [
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
    accessorKey: "bankCode",
    meta: { title: "Bank" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <span className="font-medium">{row.getValue(column.id)}</span>
    ),
  },
  {
    accessorKey: "accountId",
    meta: { title: "Account ID" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "accountName",
    meta: { title: "Account Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "companyCode",
    meta: { title: "Company Code" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "currencyCode",
    meta: { title: "Currency" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "accountNumber",
    meta: { title: "Account Number" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "erpCode",
    meta: { title: "ERP Code" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const erpCode = row.original.erpCode;
      return <div className="font-mono text-sm">{erpCode || "-"}</div>;
    },
  },
  {
    accessorKey: "isActive",
    meta: { title: "Status" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return <StatusBadge status={isActive ? "active" : "inactive"} />;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <ActionButton
          variant="edit"
          onClick={() => handlers.onEdit?.(row.original)}
          size="sm"
          permission={HOUSE_BANK_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          onClick={() => handlers.onDelete?.(row.original)}
          size="sm"
          permission={HOUSE_BANK_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
