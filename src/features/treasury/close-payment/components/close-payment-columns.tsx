"use client";

import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { formatCurrency, formatDate } from "@railfinance/core/lib";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { ClosePaymentResponse } from "../data/close-payment.types";
import {
  PAYMENT_STATUS_LABELS,
  POSTING_A8_STATUS,
  POSTING_A8_STATUS_LABELS,
} from "../data/close-payment.types";
import {
  CLOSE_PAYMENT_READ_PERMISSION,
  CLOSE_PAYMENT_UPDATE_PERMISSION,
} from "../data/close-payment.utils";

export interface ClosePaymentTableActionHandlers extends TableActionHandlers<ClosePaymentResponse> {
  onDetail?: (data: ClosePaymentResponse) => void;
  onReset?: (data: ClosePaymentResponse) => void;
}

export const closePaymentColumns = (
  handlers: ClosePaymentTableActionHandlers,
): ColumnDef<ClosePaymentResponse>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "custId",
    meta: { title: "Customer ID" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "name",
    meta: { title: "Customer Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="max-w-xs truncate text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "invoiceNumber",
    meta: { title: "Invoice No." },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "transId",
    meta: { title: "Transaction ID" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-xs">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "ppfNumber",
    meta: { title: "PPF No." },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "paymentDate",
    meta: { title: "Payment Date" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {formatDate(row.original.paymentDate)}
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    meta: { title: "Due Date" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {formatDate(row.original.dueDate)}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    meta: { title: "Amount" },
    header: ({ column }) => <ColumnHeader column={column} align="right" />,
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        {formatCurrency(row.original.amount, "IDR")}
      </div>
    ),
  },
  {
    accessorKey: "paymentAmount",
    meta: { title: "Payment Amount" },
    header: ({ column }) => <ColumnHeader column={column} align="right" />,
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        {formatCurrency(row.original.paymentAmount, "IDR")}
      </div>
    ),
  },
  {
    accessorKey: "bankCode",
    meta: { title: "Bank" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    meta: { title: "Payment Status" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <StatusBadge
          status={row.original.paymentStatus === 1 ? "active" : "inactive"}
          label={PAYMENT_STATUS_LABELS[row.original.paymentStatus]}
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "postingA8Status",
    meta: { title: "Posting Status" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => {
      const status = row.original.postingA8Status;
      const statusMap: Record<
        0 | 1 | 2 | 5,
        "active" | "inactive" | "warning" | "error"
      > = {
        0: "inactive",
        1: "warning",
        2: "active",
        5: "error",
      };
      return (
        <div className="flex justify-center">
          <StatusBadge
            status={statusMap[status] || "inactive"}
            label={POSTING_A8_STATUS_LABELS[status]}
          />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const isUnpaid = row.original.paymentStatus === 0;
      const canReset =
        row.original.postingA8Status === POSTING_A8_STATUS.PARTIAL ||
        row.original.postingA8Status === POSTING_A8_STATUS.FAILED;

      return (
        <div className="flex items-center justify-center gap-2">
          <ActionButton
            variant="generate"
            size="sm"
            permission={CLOSE_PAYMENT_UPDATE_PERMISSION}
            onClick={() => handlers?.onReset?.(row.original)}
            title="Reset"
            tooltip="Reset Posting Status"
            disabled={!canReset}
          />
          <ActionButton
            variant="show"
            size="sm"
            permission={CLOSE_PAYMENT_READ_PERMISSION}
            onClick={() => handlers?.onDetail?.(row.original)}
            title="View details"
          />
          <ActionButton
            variant="edit"
            size="sm"
            permission={CLOSE_PAYMENT_UPDATE_PERMISSION}
            onClick={() => handlers?.onEdit?.(row.original)}
            title="Edit (available for unpaid only)"
            disabled={!isUnpaid}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
