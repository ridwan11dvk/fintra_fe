"use client";

import {
  CASHFLOW_CATEGORY_READ_PERMISSION,
  CASHFLOW_CATEGORY_UPDATE_PERMISSION,
  type CashflowCategoryResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

export const cashflowCategoryColumns = (
  handlers: TableActionHandlers<CashflowCategoryResponse>,
): ColumnDef<CashflowCategoryResponse>[] => [
    {
      accessorKey: "code",
      meta: { title: "Code" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ column, row }) => (
        <div className="max-w-xs truncate font-medium">{row.getValue(column.id)}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      meta: { title: "Name" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ column, row }) => (
        <div className="max-w-xs truncate font-medium">{row.getValue(column.id)}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "description",
      meta: { title: "Description" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ column, row }) => (
        <div className="max-w-xs truncate font-medium">{row.getValue(column.id) || "-"}</div>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      meta: { title: "Action" },
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <ActionButton
            variant="show"
            size="sm"
            onClick={() => handlers?.onShow?.(row.original)}
            permission={CASHFLOW_CATEGORY_READ_PERMISSION}
          />
          {/* <ActionButton
          variant={row.original.status === "ACTIVE" ? "deactivate" : "activate"}
          size="sm"
          onClick={() =>
            row.original.status === "ACTIVE"
              ? handlers?.onDeactivate?.(row.original)
              : handlers?.onActivate?.(row.original)
          }
          permission={CASHFLOW_CATEGORY_UPDATE_PERMISSION}
        /> */}
          <ActionButton
            variant="edit"
            size="sm"
            onClick={() => handlers?.onEdit?.(row.original)}
            permission={CASHFLOW_CATEGORY_UPDATE_PERMISSION}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
