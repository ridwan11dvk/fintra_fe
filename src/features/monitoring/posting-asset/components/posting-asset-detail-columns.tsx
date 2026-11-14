/**
 * Posting Asset - Transaction Detail Columns
 * Columns for the detail table showing individual records per transaction
 */

import {
  type PostingAsset,
  POSTING_ASSET_DELETE_PERMISSION,
  POSTING_ASSET_UPDATE_PERMISSION,
} from "@/features/monitoring";
import { ActionButton } from "@railfinance/core/components/actions";
import { CreditDebitBadge, SapStatusBadge } from "@railfinance/core/components/badges";
import { formatCurrency, formatDate, getCurrencyLabel } from "@railfinance/core/lib";
import { REVERSAL_FLAG_LABELS } from "@railfinance/core/constants";

import type { ColumnDef } from "@tanstack/react-table";

interface PostingAssetDetailColumnsHandlers {
  onEdit?: (record: PostingAsset) => void;
  onDelete?: (record: PostingAsset) => void;
}

const cell = (val: string | number | null | undefined) => (
  <div className="text-sm">{val == null || val === "" ? "-" : val}</div>
);

export function postingAssetDetailColumns(
  handlers?: PostingAssetDetailColumnsHandlers,
): ColumnDef<PostingAsset>[] {
  return [
    {
      id: "no",
      header: "No.",
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.index + 1}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        const isPosted = record.postingStatus === 1 && record.sapStatus === "S";
        return (
          <div className="flex items-center gap-1">
            <ActionButton
              variant="edit"
              permission={POSTING_ASSET_UPDATE_PERMISSION}
              disabled={isPosted}
              onClick={() => handlers?.onEdit?.(record)}
            />
            <ActionButton
              variant="delete"
              permission={POSTING_ASSET_DELETE_PERMISSION}
              disabled={isPosted}
              onClick={() => handlers?.onDelete?.(record)}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "recordNumber",
      header: "Currency",
      cell: ({ row }) => cell(getCurrencyLabel(row.getValue("recordNumber"))),
    },
    {
      accessorKey: "transactionCode",
      header: "TCode",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.getValue("transactionCode")}
        </div>
      ),
    },
    {
      accessorKey: "documentType",
      header: "Doc Type",
      cell: ({ row }) => cell(row.getValue("documentType")),
    },
    {
      accessorKey: "documentDate",
      header: "Doc Date",
      cell: ({ row }) => cell(formatDate(row.getValue("documentDate"))),
    },
    {
      accessorKey: "postingDate",
      header: "Posting Date",
      cell: ({ row }) => cell(formatDate(row.getValue("postingDate"))),
    },
    {
      accessorKey: "documentNumber",
      header: "Doc Number",
      cell: ({ row }) => cell(row.getValue("documentNumber")),
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => cell(row.getValue("reference")),
    },
    {
      accessorKey: "reversalFlag",
      header: "Reversal",
      cell: ({ row }) =>
        cell(REVERSAL_FLAG_LABELS[row.original.reversalFlag] || "-"),
    },
    {
      accessorKey: "accountNumber",
      header: "Account No.",
      cell: ({ row }) => cell(row.getValue("accountNumber")),
    },
    {
      accessorKey: "alternativeAccount",
      header: "Alt. Account",
      cell: ({ row }) => cell(row.getValue("alternativeAccount")),
    },
    {
      accessorKey: "debitCreditFlag",
      header: () => <div className="text-center">D/C</div>,
      cell: ({ row }) => {
        const flag = row.original.debitCreditFlag;
        return (
          <div className="flex justify-center">
            <CreditDebitBadge flag={flag} />
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = row.original.amount;
        return (
          <div className="text-right font-mono font-medium">
            {amount == null ? "-" : formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      accessorKey: "businessArea",
      header: "Business Area",
      cell: ({ row }) => cell(row.getValue("businessArea")),
    },
    {
      accessorKey: "segment",
      header: "Segment",
      cell: ({ row }) => cell(row.getValue("segment")),
    },
    {
      accessorKey: "costCenter",
      header: "CC",
      cell: ({ row }) => cell(row.getValue("costCenter")),
    },
    {
      accessorKey: "profitCenter",
      header: "PC",
      cell: ({ row }) => cell(row.getValue("profitCenter")),
    },
    {
      accessorKey: "assignment",
      header: "Assignment",
      cell: ({ row }) => cell(row.getValue("assignment")),
    },
    {
      accessorKey: "fixedAssetNumber",
      header: "FA",
      cell: ({ row }) => cell(row.getValue("fixedAssetNumber")),
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => cell(row.getValue("vendor")),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => cell(row.getValue("customer")),
    },
    {
      accessorKey: "virtualAccount",
      header: "Virtual Account",
      cell: ({ row }) => cell(row.getValue("virtualAccount")),
    },
    {
      accessorKey: "withholdingTax",
      header: "PPh",
      cell: ({ row }) => cell(row.getValue("withholdingTax")),
    },
    {
      accessorKey: "fiscalYear",
      header: "Fiscal Year",
      cell: ({ row }) => cell(row.getValue("fiscalYear")),
    },
    {
      accessorKey: "recordIndex",
      header: "Rec. Index",
      cell: ({ row }) => cell(row.getValue("recordIndex")),
    },
    {
      accessorKey: "totalIndex",
      header: "Total Index",
      cell: ({ row }) => cell(row.getValue("totalIndex")),
    },
    {
      accessorKey: "fileName",
      header: "File Name",
      cell: ({ row }) => cell(row.getValue("fileName")),
    },
    {
      accessorKey: "postingTimestamp",
      header: "Posting Time",
      cell: ({ row }) =>
        cell(formatDate(row.getValue("postingTimestamp"), "DD/MM/YYYY", true)),
    },
    {
      accessorKey: "sapStatus",
      header: () => <div className="text-center">SAP Status</div>,
      cell: ({ row }) => {
        const status = row.original.sapStatus;
        return (
          <div className="flex justify-center">
            {status ? (
              <SapStatusBadge status={status} />
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "sapDocumentNumber",
      header: "SAP Doc No.",
      cell: ({ row }) => cell(row.getValue("sapDocumentNumber")),
    },
    {
      accessorKey: "createdAt",
      header: "Entry Date",
      cell: ({ row }) => cell(formatDate(row.getValue("createdAt"))),
    },
  ];
}
