"use client";

import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { type RejectCategoryResponse } from "@railfinance/core/masterdata";
import type { ColumnDef } from "@tanstack/react-table";
import {
  REJECT_CATEGORY_DELETE_PERMISSION,
  REJECT_CATEGORY_UPDATE_PERMISSION,
} from "../data/reject-category.utils";

export const rejectCategoryColumns = (
  handlers: TableActionHandlers<RejectCategoryResponse>,
): ColumnDef<RejectCategoryResponse>[] => [
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
    cell: ({ row }) => <div>{row.original.code || "-"}</div>,
  },
  {
    accessorKey: "name",
    meta: { title: "Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => <div>{row.original.description || "-"}</div>,
  },
  {
    id: "module",
    meta: { title: "Module" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => <div>{row.original.module?.name || "-"}</div>,
    enableSorting: false,
  },
  {
    id: "feature",
    meta: { title: "Feature" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => <div>{row.original.feature?.name || "-"}</div>,
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
          permission={REJECT_CATEGORY_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={REJECT_CATEGORY_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
