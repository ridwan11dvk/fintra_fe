/**
 * Posting Auto Legacy - Group List Table Columns
 */

import {
  type PostingAutoLegacyGroup,
  POSTING_AUTO_LEGACY_READ_PERMISSION,
} from "@/features/monitoring";
import { ActionButton } from "@railfinance/core/components/actions";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { formatDate } from "@railfinance/core/lib";
import { SapStatusBadge } from "@railfinance/core/components/badges";
import type { ColumnDef } from "@tanstack/react-table";

interface PostingAutoLegacyGroupColumnsHandlers {
  onView?: (group: PostingAutoLegacyGroup) => void;
  onRegenerate?: (group: PostingAutoLegacyGroup) => void;
  onSendToSap?: (group: PostingAutoLegacyGroup) => void;
}

export function postingAutoLegacyGroupColumns(
  handlers?: PostingAutoLegacyGroupColumnsHandlers,
): ColumnDef<PostingAutoLegacyGroup>[] {
  return [
    {
      id: "select",
      header: ({ table }) => {
        const rows = table.getRowModel().rows;
        const selectableRows = rows.filter((r) => r.original.status0 !== "S");
        const allSelectableSelected =
          selectableRows.length > 0 &&
          selectableRows.every((r) => r.getIsSelected());
        const someSelectableSelected = selectableRows.some((r) =>
          r.getIsSelected(),
        );
        const allSuccess = rows.length > 0 && selectableRows.length === 0;

        let checkedState: boolean | "indeterminate" = false;
        if (allSelectableSelected) {
          checkedState = true;
        } else if (someSelectableSelected) {
          checkedState = "indeterminate";
        }

        return (
          <Checkbox
            checked={checkedState}
            disabled={allSuccess}
            onCheckedChange={(value) => {
              selectableRows.forEach((r) => r.toggleSelected(!!value));
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const isPosted = row.original.status0 === "S";
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            disabled={isPosted}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
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
      cell: ({ row }) => {
        const isPosted = row.original.status0 === "S";
        return (
          <div className="flex items-center gap-1">
            <ActionButton
              variant="show"
              permission={POSTING_AUTO_LEGACY_READ_PERMISSION}
              onClick={() => handlers?.onView?.(row.original)}
            />
            <ActionButton
              variant="generate"
              disabled={isPosted}
              onClick={() => handlers?.onRegenerate?.(row.original)}
            />
            <ActionButton
              variant="sent"
              disabled={isPosted}
              onClick={() => handlers?.onSendToSap?.(row.original)}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "status0",
      header: () => <div className="text-center">Status</div>,
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
      accessorKey: "REVERSAL",
      header: () => <div className="text-center">Reversal</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("REVERSAL")}</div>
      ),
    },
    {
      accessorKey: "NO_DOK",
      header: "Document Number",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("NO_DOK")}</div>
      ),
    },
    {
      accessorKey: "REFERENCE",
      header: "Reference",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("REFERENCE") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "DOC_DATE",
      header: "Document Date",
      cell: ({ row }) => (
        <div className="text-sm">{formatDate(row.getValue("DOC_DATE"))}</div>
      ),
    },
    {
      accessorKey: "POSTING_DATE",
      header: "Posting Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDate(row.getValue("POSTING_DATE"))}
        </div>
      ),
    },
    {
      accessorKey: "virtual_acc",
      header: "Virtual Account",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("virtual_acc") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "NO_DOKSAP",
      header: "SAP No. Doc.",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("NO_DOKSAP") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "Fiscal_year",
      header: "Fiscal Year",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("Fiscal_year") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "entry_date",
      header: "Entry Date",
      cell: ({ row }) => (
        <div className="text-sm">{formatDate(row.getValue("entry_date"))}</div>
      ),
    },
  ];
}
