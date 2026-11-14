"use client";

import type { LookupValueResponse } from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  LOOKUP_VALUE_DELETE_PERMISSION,
  LOOKUP_VALUE_UPDATE_PERMISSION,
} from "../data/lookup-value.utils";

export const categoryColumns = (
  handlers: TableActionHandlers<LookupValueResponse>,
): ColumnDef<LookupValueResponse>[] => [
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
    accessorKey: "typeName",
    meta: { title: "Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.typeName || row.original.typeCode || "-"}
      </div>
    ),
    enableSorting: false,
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
    accessorKey: "nameEn",
    meta: { title: "Name (EN)" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div>{row.original.nameEn?.trim() || row.original.name}</div>
    ),
  },
  {
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => <div>{row.original.description || "-"}</div>,
  },
  {
    accessorKey: "descriptionEn",
    meta: { title: "Description (EN)" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div>
        {row.original.descriptionEn?.trim() || row.original.description || "-"}
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
          permission={LOOKUP_VALUE_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={LOOKUP_VALUE_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
