/**
 * Closure Detail List Table Columns
 * Defines columns for the closure detail DataTable
 */

import type { VaultStationClosureDetail } from "@/features/treasury";
import {
  getBillingTypeVariant,
  VAULT_BILLING_TYPE_LABELS,
} from "@/features/treasury";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { formatCurrency, formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

interface ClosureDetailColumnsHandlers {
  onView?: (closure: VaultStationClosureDetail) => void;
}

export function closureDetailColumns(
  handlers?: ClosureDetailColumnsHandlers,
): ColumnDef<VaultStationClosureDetail>[] {
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
      accessorKey: "virtualAccountNumber",
      header: "Virtual Account",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("virtualAccountNumber")}
        </div>
      ),
    },
    {
      accessorKey: "companyCode",
      header: "Company",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("companyCode")}</div>
      ),
    },
    {
      accessorKey: "closureNumber",
      header: "Closure Number",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("closureNumber")}</div>
      ),
    },
    {
      accessorKey: "closureDate",
      header: "Closure Date",
      cell: ({ row }) => <div>{formatDate(row.original.closureDate)}</div>,
    },
    {
      accessorKey: "depositDate",
      header: "Latest Deposit Date",
      cell: ({ row }) => {
        const date = row.original.depositDate;
        return <div>{date ? formatDate(date) : "-"}</div>;
      },
    },
    {
      accessorKey: "closureAmount",
      header: "Closure Amount",
      cell: ({ row }) => (
        <div className="text-right">
          {formatCurrency(row.original.closureAmount)}
        </div>
      ),
    },
    {
      accessorKey: "totalDepositAmount",
      header: "Deposit Amount",
      cell: ({ row }) => (
        <div className="text-right">
          {formatCurrency(row.original.totalDepositAmount)}
        </div>
      ),
    },
    {
      accessorKey: "bankCode",
      header: "Bank",
      cell: ({ row }) => <div className="text-sm">{row.original.bankCode}</div>,
    },
    {
      accessorKey: "billingType",
      header: "Deposit Status",
      cell: ({ row }) => {
        const type = row.original.billingType;
        return (
          <div className="text-center">
            <Badge variant={getBillingTypeVariant(type)}>
              {VAULT_BILLING_TYPE_LABELS[type] || type}
            </Badge>
          </div>
        );
      },
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
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
