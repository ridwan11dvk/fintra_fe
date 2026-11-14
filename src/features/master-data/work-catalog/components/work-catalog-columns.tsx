"use client";

import {
  WORK_CATALOG_READ_PERMISSION,
  WORK_CATALOG_UPDATE_PERMISSION,
  type WorkCatalogResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";


export const workCatalogColumns = (
  handlers: TableActionHandlers<WorkCatalogResponse>,
): ColumnDef<WorkCatalogResponse>[] => [
    {
      accessorKey: "workType",
      meta: { title: "Work Name" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ column, row }) => {
        return (
          <div className="max-w-xs truncate font-medium" title={row.getValue(column.id)}>
            {row.getValue(column.id)}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "subCategory",
      accessorFn: (row) => row.subCategory?.name ?? "",
      meta: { title: "Sub Work Category" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ row }) => {
        const value = row.original.subCategory?.name ?? "";
        return (
          <div className="max-w-xs truncate font-medium" title={value}>
            {value}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "groupCategory",
      accessorFn: (row) => row.groupCategory?.name ?? "",
      meta: { title: "Group Work Category" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ row }) => {
        const value = row.original.groupCategory?.name ?? "";
        return (
          <div className="max-w-xs truncate font-medium" title={value}>
            {value}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "mainCategory",
      accessorFn: (row) => row.mainCategory?.name ?? "",
      meta: { title: "Main Category / Payment Type" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ row }) => {
        const value = row.original.mainCategory?.name ?? "";
        return (
          <div className="max-w-xs truncate font-medium" title={value}>
            {value}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "cashflowCategory",
      accessorFn: (row) => row.cashflowCategory?.name ?? "",
      meta: { title: "Cashflow Category" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ row }) => {
        const value = row.original.cashflowCategory?.name ?? "";
        return (
          <div className="max-w-xs truncate font-medium" title={value}>
            {value}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "procurementSchema",
      accessorFn: (row) => row.procurementSchema?.name ?? "",
      meta: { title: "Procurement Schema" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: ({ row }) => {
        const value = row.original.procurementSchema?.name ?? "";
        return (
          <div className="max-w-xs truncate font-medium" title={value}>
            {value}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      meta: { title: "Actions" },
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <ActionButton
            variant="show"
            size="sm"
            onClick={() => handlers?.onShow?.(row.original)}
            permission={WORK_CATALOG_READ_PERMISSION}
          />
          {/* <ActionButton
          variant={row.original.isActive ? "deactivate" : "activate"}
          size="sm"
          onClick={() =>
            row.original.isActive
              ? handlers?.onDeactivate?.(row.original)
              : handlers?.onActivate?.(row.original)
          }
          permission={WORK_CATALOG_UPDATE_PERMISSION}
        /> */}
          <ActionButton
            variant="edit"
            size="sm"
            onClick={() => handlers?.onEdit?.(row.original)}
            permission={WORK_CATALOG_UPDATE_PERMISSION}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
