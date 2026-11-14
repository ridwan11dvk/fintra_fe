"use client";

import type { PartnerTypeResponse } from "@/features/master-data/partner-type/data/partner-type.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { Badge } from "@railfinance/core/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PARTNER_TYPE_DELETE_PERMISSION,
  PARTNER_TYPE_UPDATE_PERMISSION,
} from "../data/partner-type.utils";

export const partnerTypeColumns = (
  handlers: TableActionHandlers<PartnerTypeResponse>,
): ColumnDef<PartnerTypeResponse>[] => [
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
    cell: ({ column, row }) => (
      <div className="font-mono">{row.getValue(column.id) || "-"}</div>
    ),
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
    accessorKey: "partnerLegality",
    meta: { title: "Legality" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="text-sm">{row.original.partnerLegality?.name}</div>
    ),
  },
  {
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground truncate max-w-xs">
        {row.original.description || "-"}
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
    accessorKey: "integratedToErp",
    meta: { title: "Synced to ERP" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant={row.original.integratedToErp ? "default" : "secondary"}>
          {row.original.integratedToErp ? "Yes" : "No"}
        </Badge>
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
          permission={PARTNER_TYPE_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          onClick={() => handlers?.onDelete?.(row.original)}
          tooltip="Delete"
          permission={PARTNER_TYPE_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
