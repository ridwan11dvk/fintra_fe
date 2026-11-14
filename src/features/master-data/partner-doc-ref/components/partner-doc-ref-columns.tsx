"use client";

import type { PartnerDocRefResponse } from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PARTNER_DOC_REF_DELETE_PERMISSION,
  PARTNER_DOC_REF_UPDATE_PERMISSION,
} from "../data/partner-doc-ref.utils";

export const partnerDocRefColumns = (
  handlers: TableActionHandlers<PartnerDocRefResponse>,
): ColumnDef<PartnerDocRefResponse>[] => [
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
    accessorKey: "documentName",
    meta: { title: "Document Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "countryName",
    meta: { title: "Country" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
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
    accessorKey: "partnerCategoryName",
    meta: { title: "Partner Category" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "partnerLegalityName",
    meta: { title: "Partner Legality" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => <div>{row.original.partnerLegalityName || "-"}</div>,
  },
  {
    accessorKey: "partnerRoleName",
    meta: { title: "Partner Role" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => <div>{row.original.partnerRoleName || "-"}</div>,
  },
  {
    accessorKey: "partnerTypeName",
    meta: { title: "Partner Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "partnerSubTypeName",
    meta: { title: "Partner Sub-Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "isActive",
    meta: { title: "Status" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <StatusBadge status={row.original.isActive ? "active" : "inactive"} />
        </div>
      );
    },
  },
  {
    accessorKey: "createdOn",
    meta: { title: "Created At" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {row.original.createdOn ? formatDate(row.original.createdOn) : "-"}
      </div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center font-medium">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <ActionButton
          label="Edit"
          variant="edit"
          onClick={() => handlers?.onEdit?.(row.original)}
          size="sm"
          permission={PARTNER_DOC_REF_UPDATE_PERMISSION}
        />
        <ActionButton
          label="Delete"
          variant="delete"
          onClick={() => handlers?.onDelete?.(row.original)}
          size="sm"
          permission={PARTNER_DOC_REF_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
