import {
  SEND_STATUS_COLORS,
  SEND_STATUS_LABELS,
  type DepositResponse,
} from "@/features/treasury";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@railfinance/core/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export interface DepositTableActionHandlers {
  onDetail: (data: DepositResponse) => void;
  onEdit: (data: DepositResponse) => void;
  onToggleSendStatus: (data: DepositResponse) => void;
}

export const depositColumns = (
  handlers: DepositTableActionHandlers,
): ColumnDef<DepositResponse>[] => [
  {
    accessorKey: "agentCode",
    header: "Agent Code",
    cell: ({ row }) => row.original.agentCode || "-",
  },
  {
    accessorKey: "virtualAccount",
    header: "Virtual Account",
    cell: ({ row }) => row.original.virtualAccount || "-",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name || "-",
  },
  {
    accessorKey: "referenceNumber",
    header: "Reference No.",
    cell: ({ row }) => row.original.referenceNumber || "-",
  },
  {
    accessorKey: "depositDate",
    header: "Deposit Date",
    cell: ({ row }) => {
      const date = row.original.depositDate;
      return date ? formatDate(date, "DD/MM/YYYY") : "-";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return amount ? formatCurrency(amount) : "-";
    },
  },
  {
    accessorKey: "openingBalance",
    header: "Opening Balance",
    cell: ({ row }) => {
      const balance = row.original.openingBalance;
      return balance ? formatCurrency(balance) : "-";
    },
  },
  {
    accessorKey: "closingBalance",
    header: "Closing Balance",
    cell: ({ row }) => {
      const balance = row.original.closingBalance;
      return balance ? formatCurrency(balance) : "-";
    },
  },
  {
    accessorKey: "bankCode",
    header: "Bank",
    cell: ({ row }) => row.original.bankCode || "-",
  },
  {
    accessorKey: "sendStatus",
    header: "Send Status",
    cell: ({ row }) => {
      const status = row.original.sendStatus;
      const label = SEND_STATUS_LABELS[status];
      const colors = SEND_STATUS_COLORS[status];
      return <Badge className={colors}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const deposit = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handlers.onDetail(deposit)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlers.onEdit(deposit)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlers.onToggleSendStatus(deposit)}
            >
              {deposit.sendStatus === 0 ? "Mark as Sent" : "Mark as Not Sent"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
