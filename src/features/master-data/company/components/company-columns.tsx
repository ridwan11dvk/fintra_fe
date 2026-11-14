"use client";

import type { CompanyResponse } from "@/features/master-data";
import {
  COMPANY_DELETE_PERMISSION,
  COMPANY_READ_PERMISSION,
  COMPANY_UPDATE_PERMISSION,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

export const companyColumns = (
  handlers: TableActionHandlers<CompanyResponse> & {
    onView?: (data: CompanyResponse) => void;
    onEdit?: (data: CompanyResponse) => void;
    onDelete?: (data: CompanyResponse) => void;
  },
): ColumnDef<CompanyResponse>[] => [
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
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "alias",
    meta: { title: "Alias" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="text-sm">{row.getValue(column.id) || "-"}</div>
    ),
  },
  {
    accessorKey: "businessType",
    meta: { title: "Business Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="truncate text-sm max-w-sm">
        {row.getValue(column.id) || "-"}
      </div>
    ),
  },

  {
    accessorKey: "address",
    meta: { title: "Address" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="truncate text-sm max-w-md">
        {row.getValue(column.id) || "-"}
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
      <div className="flex items-center justify-center gap-2">
        <ActionButton
          variant="show"
          size="sm"
          onClick={() => handlers.onView?.(row.original)}
          permission={COMPANY_READ_PERMISSION}
        />
        <ActionButton
          variant="edit"
          size="sm"
          onClick={() => handlers.onEdit?.(row.original)}
          permission={COMPANY_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers.onDelete?.(row.original)}
          permission={COMPANY_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
