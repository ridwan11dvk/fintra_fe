/**
 * Posting Asset - Group List Table Columns
 */

import {
  type PostingAssetGroup,
  POSTING_ASSET_READ_PERMISSION,
} from "@/features/monitoring";
import { ActionButton } from "@railfinance/core/components/actions";
import { formatDate } from "@railfinance/core/lib";
import { REVERSAL_FLAG_LABELS } from "@railfinance/core/constants";
import { SapStatusBadge } from "@railfinance/core/components/badges";
import type { ColumnDef } from "@tanstack/react-table";

interface PostingAssetGroupColumnsHandlers {
  onView?: (group: PostingAssetGroup) => void;
}

export function postingAssetGroupColumns(
  handlers?: PostingAssetGroupColumnsHandlers,
): ColumnDef<PostingAssetGroup>[] {
  return [
    {
      id: "no",
      header: "No.",
      cell: ({ row, table }) => {
        const meta = table.options.meta as
          | { currentPage: number; pageSize: number }
          | undefined;
        const offset = (meta?.currentPage ?? 0) * (meta?.pageSize ?? 10);
        return (
          <div className="text-muted-foreground">{offset + row.index + 1}</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center align-middle">
          <ActionButton
            variant="show"
            permission={POSTING_ASSET_READ_PERMISSION}
            onClick={() => handlers?.onView?.(row.original)}
          />
        </div>
      ),
    },
    {
      accessorKey: "sapStatus",
      header: () => <div className="text-center">Status</div>,
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
      accessorKey: "reversalFlag",
      header: () => <div className="text-center">Reversal</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {REVERSAL_FLAG_LABELS[row.original.reversalFlag] ?? ""}
        </div>
      ),
    },
    {
      accessorKey: "documentNumber",
      header: "Document Number",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("documentNumber")}</div>
      ),
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("reference") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "documentDate",
      header: "Document Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDate(row.getValue("documentDate"))}
        </div>
      ),
    },
    {
      accessorKey: "virtualAccount",
      header: "Virtual Account",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("virtualAccount") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "sapDocumentNumber",
      header: "SAP No. Doc.",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue("sapDocumentNumber") ?? "-"}
        </div>
      ),
    },
  ];
}
