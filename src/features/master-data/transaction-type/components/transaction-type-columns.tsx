"use client";

import type { TransactionTypeResponse } from "@/features/master-data";
import {
  TRANSACTION_TYPE_DELETE_PERMISSION,
  TRANSACTION_TYPE_UPDATE_PERMISSION,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { Badge } from "@railfinance/core/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

export const transactionTypeColumns = (
  handlers: TableActionHandlers<TransactionTypeResponse>,
): ColumnDef<TransactionTypeResponse>[] => [
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
      <div className="font-mono">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "tcode",
    meta: { title: "SAP TCode" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id) || "-"}</div>
    ),
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
    accessorKey: "type",
    meta: { title: "Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const type = row.original.type;
      const typeColors: Record<string, string> = {
        revenue: "bg-green-100 text-green-800",
        prepaid: "bg-blue-100 text-blue-800",
        freight: "bg-orange-100 text-orange-800",
      };

      return (
        <div>
          {type ? (
            <Badge variant="outline" className={typeColors[type] || ""}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.module && (
          <Badge variant="outline">{row.original.module.name}</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isVatUsed",
    meta: { title: "VAT Used" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant={row.original.isVatUsed ? "default" : "secondary"}>
          {row.original.isVatUsed ? "Yes" : "No"}
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
          permission={TRANSACTION_TYPE_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={TRANSACTION_TYPE_DELETE_PERMISSION}
        />
      </div>
    ),
  },
];
