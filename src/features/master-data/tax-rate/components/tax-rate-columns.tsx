"use client";

import type { TaxRateResponse } from "@/features/master-data";
import { Tooltip, TooltipContent, TooltipTrigger } from "@railfinance/core";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import {
  TAX_RATE_DELETE_PERMISSION,
  TAX_RATE_UPDATE_PERMISSION,
} from "../data/tax-rate.utils";

export const taxRateColumns = (
  handlers: TableActionHandlers<TaxRateResponse>,
): ColumnDef<TaxRateResponse>[] => [
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
      <div className="font-mono font-medium">{row.getValue(column.id)}</div>
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
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => {
      const description = row.getValue<string>(column.id) || "-";
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[200px] truncate cursor-default">
              {description}
            </div>
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "taxType",
    meta: { title: "Tax Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "ratePercent",
    meta: { title: "Rate %" },
    header: ({ column }) => <ColumnHeader column={column} align="right" />,
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {(row.original.ratePercent ?? 0).toFixed(2)}%
      </div>
    ),
  },

  {
    id: "coefficient",
    meta: { title: "Coefficient" },
    header: ({ column }) => <ColumnHeader column={column} align="right" />,
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {(row.original.coefficientNumerator ?? 0) +
          "/" +
          (row.original.coefficientDenominator ?? 0)}
      </div>
    ),
    enableSorting: false,
  },

  {
    accessorKey: "isUsedInRkip",
    meta: { title: "Used in RKIP" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.isUsedInRkip ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    ),
    enableSorting: false,
  },

  {
    accessorKey: "postingType",
    meta: { title: "Posting Type" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id) ?? "-"}</div>,
  },
  {
    accessorKey: "isPostingRequired",
    meta: { title: "Posting Required" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.isPostingRequired ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "startDate",
    meta: { title: "Start Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono">
        {row.original.startDate
          ? formatDate(new Date(row.original.startDate), "DD/MM/YYYY")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    meta: { title: "End Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-mono">
        {row.original.endDate
          ? formatDate(new Date(row.original.endDate), "DD/MM/YYYY")
          : "—"}
      </div>
    ),
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
          permission={TAX_RATE_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={TAX_RATE_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
