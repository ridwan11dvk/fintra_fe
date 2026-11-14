/* eslint-disable react-hooks/set-state-in-effect */
import {
  M2M_CLIENT_UPDATE_PERMISSION,
  M2M_CLIENT_URL,
  m2mClientQueryKeys,
  m2mClientService,
  roleQueryKeys,
  roleService,
  useM2mClient,
  useRegenerateM2mToken,
  useUpdateM2mPermissions,
} from "@/features/settings";
import type { PermissionResponse } from "@railfinance/core/masterdata";
import { ActionButton } from "@railfinance/core/components/actions";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { DataTable } from "@railfinance/core/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@railfinance/core/ui/dialog";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { M2mClientAuditResponse } from "../data/m2m-client.types";

function createAuditColumns(): ColumnDef<M2mClientAuditResponse>[] {
  return [
    {
      accessorKey: "actionType",
      header: "Action",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.actionType === "DELETE" ? "destructive" : "default"
          }
        >
          {row.original.actionType}
        </Badge>
      ),
    },
    {
      accessorKey: "summary",
      header: "Summary",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-sm">
          {row.original.summary || "-"}
        </div>
      ),
    },
    {
      accessorKey: "userName",
      header: "User",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.userName || "-"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), "dd MMM yyyy HH:mm")}
        </span>
      ),
    },
  ];
}

function createPermissionColumns(): ColumnDef<PermissionResponse>[] {
  return [
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
      accessorKey: "description",
      header: "Permission",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.description || "-"}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Code",
      cell: ({ row }) => <div className="text-sm">{row.original.name}</div>,
    },
  ];
}

export function ShowM2mClientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = Number(id);
  const { data: clientData, isLoading } = useM2mClient(clientId);
  const updatePermissionsMutation = useUpdateM2mPermissions();
  const regenerateMutation = useRegenerateM2mToken();
  const [selectedPermissions, setSelectedPermissions] = useState<
    PermissionResponse[]
  >([]);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [copied, setCopied] = useState(false);

  const client = clientData?.data;

  useEffect(() => {
    if (client?.permissions) {
      setSelectedPermissions(client.permissions);
    }
  }, [client?.permissions]);

  const handleSavePermissions = () => {
    const permissionIds = selectedPermissions.map((p) => p.id);
    updatePermissionsMutation.mutate({
      id: clientId,
      permissions: { permissionIds },
    });
  };

  const handleRegenerateToken = () => {
    regenerateMutation.mutate(clientId, {
      onSuccess: (response) => {
        if (response.data) {
          setNewToken(response.data.token);
          setShowRegenerateModal(true);
        }
      },
    });
  };

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const permissionColumns = createPermissionColumns();
  const auditColumns = createAuditColumns();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center p-8">
        Client not found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>API Client: {client.name}</CardTitle>
          <div className="flex gap-2">
            <ActionButton
              variant="edit"
              buttonVariant="success-outline"
              showLabel
              label="Edit"
              onClick={() => navigate(`${M2M_CLIENT_URL}/${clientId}/edit`)}
              permission={M2M_CLIENT_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="generate"
              showLabel
              onClick={handleRegenerateToken}
              label="Regenerate Token"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{client.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge
                variant={client.status === "ACTIVE" ? "default" : "destructive"}
              >
                {client.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="text-sm">{client.description || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Expires
              </p>
              <p className="text-sm">
                {client.expiresAt
                  ? format(new Date(client.expiresAt), "dd MMM yyyy HH:mm")
                  : "Unlimited"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created
              </p>
              <p className="text-sm">
                {format(new Date(client.createdAt), "dd MMM yyyy HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Updated
              </p>
              <p className="text-sm">
                {format(new Date(client.updatedAt), "dd MMM yyyy HH:mm")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Permissions</CardTitle>
          <ActionButton
            variant="save"
            label="Save Permissions"
            showLabel
            onClick={handleSavePermissions}
            disabled={updatePermissionsMutation.isPending}
            permission={M2M_CLIENT_UPDATE_PERMISSION}
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={permissionColumns}
            queryFn={roleService.getPermissions}
            queryKey={[...roleQueryKeys.allPermissions]}
            enabled={true}
            search={{
              key: "search",
              placeholder: "Search permissions...",
            }}
            toolbar={{ enableColumnToggle: false }}
            selectedItems={selectedPermissions}
            onItemSelect={setSelectedPermissions}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={auditColumns}
            queryFn={(params) => m2mClientService.getAuditLog(clientId, params)}
            queryKey={[...m2mClientQueryKeys.audit(clientId)]}
            enabled={!!clientId}
            toolbar={{ enableColumnToggle: false }}
          />
        </CardContent>
      </Card>

      <Dialog open={showRegenerateModal} onOpenChange={setShowRegenerateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Token Regenerated</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please copy and save the new token below. It will not be shown
              again.
            </p>
            <div className="flex items-center gap-2 rounded-md border p-3 bg-muted">
              <code className="flex-1 text-sm break-all font-mono">
                {newToken}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyToken}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowRegenerateModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
