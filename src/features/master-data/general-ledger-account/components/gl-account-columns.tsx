"use client";

import type { GeneralLedgerAccountResponse } from "@/features/master-data/general-ledger-account/data/gl-account.types";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import {
  GL_ACCOUNT_DELETE_PERMISSION,
  GL_ACCOUNT_UPDATE_PERMISSION,
} from "../data/gl-account.utils";

export const glAccountColumns = (
  handlers: TableActionHandlers<GeneralLedgerAccountResponse>,
): ColumnDef<GeneralLedgerAccountResponse>[] => [
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
    accessorKey: "companyCode",
    meta: { title: "Company Code" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "baCode",
    meta: { title: "Business Area Code" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono">{row.original.baCode || "-"}</div>
    ),
  },
  {
    accessorKey: "account",
    meta: { title: "Account" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "name",
    meta: { title: "Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name || "-"}</div>
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
    accessorKey: "commitmentItem",
    meta: { title: "Commitment Item" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.commitmentItem || "-"}
      </div>
    ),
  },
  {
    accessorKey: "operationalCostComponent",
    meta: { title: "Operational Cost Component" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.operationalCostComponent || "-"}
      </div>
    ),
  },
  {
    accessorKey: "imoCostComponent",
    meta: { title: "IMO Cost Component" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.imoCostComponent || "-"}
      </div>
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
          permission={GL_ACCOUNT_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={GL_ACCOUNT_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
