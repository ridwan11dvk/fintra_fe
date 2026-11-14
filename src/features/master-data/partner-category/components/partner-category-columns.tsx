"use client";

import type { PartnerCategoryResponse } from "@/features/master-data/partner-category/data/partner-category.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PARTNER_CATEGORY_DELETE_PERMISSION,
  PARTNER_CATEGORY_UPDATE_PERMISSION,
} from "../data/partner-category.utils";

export const partnerCategoryColumns = (
  handlers: TableActionHandlers<PartnerCategoryResponse>,
): ColumnDef<PartnerCategoryResponse>[] => [
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
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="text-sm">{row.getValue(column.id) || "-"}</div>
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
      <div className="flex justify-center gap-1">
        <ActionButton
          variant="edit"
          onClick={() => handlers?.onEdit?.(row.original)}
          tooltip="Edit"
          permission={PARTNER_CATEGORY_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          onClick={() => handlers?.onDelete?.(row.original)}
          tooltip="Delete"
          permission={PARTNER_CATEGORY_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
