"use client";

import type { CompanyTaxResponse } from "@/features/master-data";
import {
  COMPANY_TAX_DELETE_PERMISSION,
  COMPANY_TAX_UPDATE_PERMISSION,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";

export const companyTaxColumns = (
  handlers: TableActionHandlers<CompanyTaxResponse>,
): ColumnDef<CompanyTaxResponse>[] => [
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
  //   {
  //     id: "taxRateCode",
  //     meta: { title: "Tax Rate Code" },
  //     header: ({ column }) => <ColumnHeader column={column} />,
  //     cell: ({ row }) => (
  //       <div className="font-mono">{row.original.taxRate?.code || "-"}</div>
  //     ),
  //   },
  {
    id: "taxRateName",
    meta: { title: "Tax Rate" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => <div>{row.original.taxRate?.name || "-"}</div>,
  },
  {
    accessorKey: "glAccount",
    meta: { title: "GL Account" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono">{row.getValue(column.id) || "-"}</div>
    ),
  },
  {
    accessorKey: "startDate",
    meta: { title: "Start Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => {
      const value = row.getValue<string>(column.id);
      return <div>{value ? formatDate(value) : "-"}</div>;
    },
  },
  {
    accessorKey: "endDate",
    meta: { title: "End Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => {
      const value = row.getValue<string | null>(column.id);
      return <div>{value ? formatDate(value) : "-"}</div>;
    },
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
          permission={COMPANY_TAX_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={COMPANY_TAX_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
