/**
 * Posting Asset Legacy - Transaction Detail Columns
 * Columns for the detail table showing individual records per transaction
 */

import {
  type PostingAssetLegacyDetail,
  POSTING_ASSET_LEGACY_DELETE_PERMISSION,
  POSTING_ASSET_LEGACY_UPDATE_PERMISSION,
} from "@/features/monitoring";
import { ActionButton } from "@railfinance/core/components/actions";
import { CreditDebitBadge, SapStatusBadge } from "@railfinance/core/components/badges";
import { formatCurrency, formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";

interface PostingAssetLegacyDetailColumnsHandlers {
  onEdit?: (record: PostingAssetLegacyDetail) => void;
  onDelete?: (record: PostingAssetLegacyDetail) => void;
}

const cell = (val: string | number | null | undefined) => (
  <div className="text-sm">{val == null || val === "" ? "-" : val}</div>
);

export function postingAssetLegacyDetailColumns(
  handlers?: PostingAssetLegacyDetailColumnsHandlers,
): ColumnDef<PostingAssetLegacyDetail>[] {
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
        const isPosted = record.pos_status === 1 && record.status0 === "S";
        return (
          <div className="flex items-center gap-1">
            <ActionButton
              variant="edit"
              permission={POSTING_ASSET_LEGACY_UPDATE_PERMISSION}
              disabled={isPosted}
              onClick={() => handlers?.onEdit?.(record)}
            />
            <ActionButton
              variant="delete"
              permission={POSTING_ASSET_LEGACY_DELETE_PERMISSION}
              disabled={isPosted}
              onClick={() => handlers?.onDelete?.(record)}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "TCODE",
      header: "TCode",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("TCODE")}</div>
      ),
    },
    {
      accessorKey: "DOC_TYPE",
      header: "Doc Type",
      cell: ({ row }) => cell(row.getValue("DOC_TYPE")),
    },
    {
      accessorKey: "DOC_DATE",
      header: "Doc Date",
      cell: ({ row }) => cell(formatDate(row.getValue("DOC_DATE"))),
    },
    {
      accessorKey: "POSTING_DATE",
      header: "Posting Date",
      cell: ({ row }) => cell(formatDate(row.getValue("POSTING_DATE"))),
    },
    {
      accessorKey: "NO_DOK",
      header: "Doc Number",
      cell: ({ row }) => cell(row.getValue("NO_DOK")),
    },
    {
      accessorKey: "REFERENCE",
      header: "Reference",
      cell: ({ row }) => cell(row.getValue("REFERENCE")),
    },
    {
      accessorKey: "REVERSAL",
      header: "Reversal",
      cell: ({ row }) => cell(row.getValue("REVERSAL")),
    },
    {
      accessorKey: "ACCOUNT",
      header: "Account No.",
      cell: ({ row }) => cell(row.getValue("ACCOUNT")),
    },
    {
      accessorKey: "ALTERNATIVE_ACC",
      header: "Alt. Account",
      cell: ({ row }) => cell(row.getValue("ALTERNATIVE_ACC")),
    },
    {
      accessorKey: "DEBIT_KREDIT",
      header: () => <div className="text-center">D/C</div>,
      cell: ({ row }) => {
        const flag = row.original.DEBIT_KREDIT;
        return (
          <div className="flex justify-center">
            <CreditDebitBadge flag={flag === "D" ? "S" : "H"} />
          </div>
        );
      },
    },
    {
      accessorKey: "AMOUNT",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = row.original.AMOUNT;
        return (
          <div className="text-right font-mono font-medium">
            {amount == null || amount === ""
              ? "-"
              : formatCurrency(Number.parseFloat(amount))}
          </div>
        );
      },
    },
    {
      accessorKey: "BA",
      header: "Business Area",
      cell: ({ row }) => cell(row.getValue("BA")),
    },
    {
      accessorKey: "SEGMEN",
      header: "Segment",
      cell: ({ row }) => cell(row.getValue("SEGMEN")),
    },
    {
      accessorKey: "CC",
      header: "CC",
      cell: ({ row }) => cell(row.getValue("CC")),
    },
    {
      accessorKey: "PC",
      header: "PC",
      cell: ({ row }) => cell(row.getValue("PC")),
    },
    {
      accessorKey: "ASSIGNMENT",
      header: "Assignment",
      cell: ({ row }) => cell(row.getValue("ASSIGNMENT")),
    },
    {
      accessorKey: "FA",
      header: "FA",
      cell: ({ row }) => cell(row.getValue("FA")),
    },
    {
      accessorKey: "VENDOR",
      header: "Vendor",
      cell: ({ row }) => cell(row.getValue("VENDOR")),
    },
    {
      accessorKey: "CUSTOMER",
      header: "Customer",
      cell: ({ row }) => cell(row.getValue("CUSTOMER")),
    },
    {
      accessorKey: "virtual_acc",
      header: "Virtual Account",
      cell: ({ row }) => cell(row.getValue("virtual_acc")),
    },
    {
      accessorKey: "PPH",
      header: "PPh",
      cell: ({ row }) => cell(row.getValue("PPH")),
    },
    {
      accessorKey: "Fiscal_year",
      header: "Fiscal Year",
      cell: ({ row }) => cell(row.getValue("Fiscal_year")),
    },
    {
      accessorKey: "indeks",
      header: "Index",
      cell: ({ row }) => cell(row.getValue("indeks")),
    },
    {
      accessorKey: "totalidx",
      header: "Total Index",
      cell: ({ row }) => cell(row.getValue("totalidx")),
    },
    {
      accessorKey: "FILE_NAME",
      header: "File Name",
      cell: ({ row }) => cell(row.getValue("FILE_NAME")),
    },
    {
      accessorKey: "pos_tgl",
      header: "Posting Time",
      cell: ({ row }) =>
        cell(formatDate(row.getValue("pos_tgl"), "DD/MM/YYYY", true)),
    },
    {
      accessorKey: "status0",
      header: () => <div className="text-center">SAP Status</div>,
      cell: ({ row }) => {
        const status = row.original.status0;
        return (
          <div className="flex justify-center">
            {status ? (
              <SapStatusBadge status={status as "S" | "C" | "E"} />
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "NO_DOKSAP",
      header: "SAP Doc No.",
      cell: ({ row }) => cell(row.getValue("NO_DOKSAP")),
    },
    {
      accessorKey: "entry_date",
      header: "Entry Date",
      cell: ({ row }) => cell(formatDate(row.getValue("entry_date"))),
    },
  ];
}
