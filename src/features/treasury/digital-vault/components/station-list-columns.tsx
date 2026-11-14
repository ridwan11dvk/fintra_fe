/**
 * Station Summary List Table Columns
 * Defines columns for the DataTable component
 */

import type { VaultStationSummary } from "@/features/treasury";
import { Button } from "@railfinance/core/ui/button";
import { formatCurrency } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";

interface StationSummaryColumnsHandlers {
  onView?: (station: VaultStationSummary) => void;
}

export function stationSummaryColumns(
  handlers?: StationSummaryColumnsHandlers,
): ColumnDef<VaultStationSummary>[] {
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
      accessorKey: "stationName",
      header: "Station Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("stationName")}</div>
      ),
    },
    {
      accessorKey: "companyCode",
      header: () => <div className="text-center">Company</div>,
      cell: ({ row }) => (
        <div className="text-sm text-center">{row.getValue("companyCode")}</div>
      ),
    },
    {
      accessorKey: "closureCount",
      header: () => <div className="text-right">Total Closures</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("closureCount")}</div>
      ),
    },
    {
      accessorKey: "totalClosureAmount",
      header: () => <div className="text-right">Total Closure Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.totalClosureAmount)}
        </div>
      ),
    },
    {
      accessorKey: "totalCreditAmount",
      header: () => <div className="text-right">Total Credit Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.totalCreditAmount)}
        </div>
      ),
    },
    {
      accessorKey: "totalDepositAmount",
      header: () => <div className="text-right">Total Deposit Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.totalDepositAmount)}
        </div>
      ),
    },
    {
      accessorKey: "totalCompleteAmount",
      header: () => <div className="text-right">Total Complete Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.totalCompleteAmount)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlers?.onView?.(row.original)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
