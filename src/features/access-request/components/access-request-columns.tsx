/**
 * Access Request Feature - DataTable Columns
 * Column definitions for access request list table
 */

import type {
  AccessRequestResponse,
  AccessRequestStatus,
} from "@/features/access-request";
import { ACCESS_REQUEST_APPROVE_PERMISSION } from "@/features/access-request";
import { ActionButton } from "@railfinance/core/components/actions";
import { Badge } from "@railfinance/core/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

interface AccessRequestColumnsProps {
  onView?: (request: AccessRequestResponse) => void;
}

const getStatusBadgeVariant = (
  status: AccessRequestStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "PENDING":
      return "default";
    case "APPROVED":
      return "secondary";
    case "REJECTED":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusLabel = (status: AccessRequestStatus): string => {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    default:
      return status;
  }
};

export const accessRequestColumns = (
  props: AccessRequestColumnsProps,
): ColumnDef<AccessRequestResponse>[] => [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
  //   size: 60,
  // },
  {
    accessorKey: "userType",
    header: "User Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.userType}
      </Badge>
    ),
  },
  {
    accessorKey: "userName",
    header: "Name",
    cell: ({ row }) => <span>{row.original.userName}</span>,
  },
  {
    accessorKey: "userNipp",
    header: "NIPP",
    cell: ({ row }) => <span>{row.original.userNipp}</span>,
  },
  {
    accessorKey: "moduleNames",
    header: "Requested Modules",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.moduleNames
          .split(",")
          .filter(Boolean)
          .map((module: string) => (
            <Badge key={module.trim()} variant="outline" className="text-xs">
              {module.trim()}
            </Badge>
          ))}
      </div>
    ),
  },
  {
    accessorKey: "requestedAt",
    header: "Requested At",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.requestedAt).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusBadgeVariant(row.original.status)}>
        {getStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <ActionButton
          variant="show"
          size="sm"
          onClick={() => props?.onView?.(row.original)}
          permission={ACCESS_REQUEST_APPROVE_PERMISSION}
        />
      </div>
    ),
    size: 50,
  },
];
