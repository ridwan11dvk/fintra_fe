import { ActionButton } from "@railfinance/core/components/actions";
import { Badge } from "@railfinance/core/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { M2mClient } from "../data/m2m-client.types";
import { M2M_CLIENT_READ_PERMISSION } from "../data/m2m-client.utils";

interface M2mClientColumnsConfig {
  onView: (client: M2mClient) => void;
}

export function createM2mClientColumns({
  onView,
}: Readonly<M2mClientColumnsConfig>): ColumnDef<M2mClient>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm">
          {row.original.description || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "ACTIVE" ? "default" : "destructive"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Expiry",
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt;
        if (!expiresAt)
          return (
            <span className="text-sm text-muted-foreground">Unlimited</span>
          );
        return (
          <span className="text-sm">
            {format(new Date(expiresAt), "dd MMM yyyy HH:mm")}
          </span>
        );
      },
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const count = row.original.permissions?.length ?? 0;
        return (
          <span className="text-sm">
            {count} permission{count === 1 ? "" : "s"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ActionButton
            variant="show"
            size="sm"
            onClick={() => onView(row.original)}
            tooltip="View client"
            permission={M2M_CLIENT_READ_PERMISSION}
          />
        </div>
      ),
    },
  ];
}
