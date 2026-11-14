import {
  PermissionManager,
  ROLE_UPDATE_PERMISSION,
  useRemovePermissions,
  type Permission,
} from "@/features/settings";
import type { RoleDetailResponse } from "@railfinance/core/masterdata";
import { ActionButton } from "@railfinance/core/components/actions";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { OfflineDataTable } from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Fragment, useState } from "react";

interface PermissionColumnsConfig {
  onDeletePermission: (permission: Permission) => void;
  isPending: boolean;
}

function createPermissionColumns({
  onDeletePermission,
  isPending,
}: Readonly<PermissionColumnsConfig>): ColumnDef<Permission>[] {
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
      cell: ({ row }) => <div className="text-sm ">{row.original.name}</div>,
    },
    {
      id: "actions",
      meta: { title: "Actions" },
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <ActionButton
            variant="delete"
            size="sm"
            onClick={() => onDeletePermission(row.original)}
            disabled={isPending}
            permission={ROLE_UPDATE_PERMISSION}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function RolePermissionTable({
  role,
}: Readonly<{
  role: RoleDetailResponse;
}>) {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    [],
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false);
  const [pendingDeletePermission, setPendingDeletePermission] =
    useState<Permission | null>(null);
  const removePermissionsMutation = useRemovePermissions();

  const permissions = role?.permissions || [];

  const handleDeletePermissions = () => {
    if (selectedPermissions.length === 0) return;
    setConfirmBulkDeleteOpen(true);
  };

  const handleConfirmDeletePermissions = () => {
    if (selectedPermissions.length === 0) return;

    const permissionIds = selectedPermissions.map((p) => p.id);
    removePermissionsMutation.mutate(
      {
        id: role.id,
        permissions: { permissionIds },
      },
      {
        onSuccess: () => {
          setSelectedPermissions([]);
          setConfirmBulkDeleteOpen(false);
        },
      },
    );
  };

  const handleDeletePermission = (permission: Permission) => {
    setPendingDeletePermission(permission);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeletePermission = () => {
    if (!pendingDeletePermission) return;

    removePermissionsMutation.mutate(
      {
        id: role.id,
        permissions: { permissionIds: [pendingDeletePermission.id] },
      },
      {
        onSuccess: () => {
          setConfirmDeleteOpen(false);
          setPendingDeletePermission(null);
        },
      },
    );
  };

  const permissionColumns = createPermissionColumns({
    onDeletePermission: handleDeletePermission,
    isPending: removePermissionsMutation.isPending,
  });

  return (
    <Fragment>
      <OfflineDataTable
        title="Permissions"
        toolbar={{
          enableColumnToggle: false,
        }}
        actions={
          <>
            <ActionButton
              variant="generate"
              buttonVariant="default"
              label="Change Permission"
              showLabel
              onClick={() => setEditModalOpen(true)}
              permission={ROLE_UPDATE_PERMISSION}
            />
            {selectedPermissions.length > 0 && (
              <ActionButton
                variant="delete"
                label={`Remove (${selectedPermissions.length})`}
                tooltip={`Remove ${selectedPermissions.length} selected permission`}
                showLabel
                onClick={handleDeletePermissions}
                disabled={removePermissionsMutation.isPending}
                permission={ROLE_UPDATE_PERMISSION}
              />
            )}
          </>
        }
        badge={{
          enabled: true,
          variant: "secondary",
          label: permissions?.length + " permissions",
        }}
        columns={permissionColumns}
        data={permissions || []}
        pageSize={10}
        search={{
          key: "search",
          placeholder: "Search permissions...",
        }}
        enablePagination={true}
        selectedItems={selectedPermissions}
        onItemSelect={setSelectedPermissions}
      />
      <PermissionManager
        role={role}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
      <ConfirmationModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete Permission"
        description={`Are you sure you want to remove "${pendingDeletePermission?.description}" from this role? This action cannot be undone.`}
        onConfirm={handleConfirmDeletePermission}
        isLoading={removePermissionsMutation.isPending}
        confirmText="Delete"
        confirmVariant="destructive"
      />
      <ConfirmationModal
        open={confirmBulkDeleteOpen}
        onOpenChange={setConfirmBulkDeleteOpen}
        title="Delete Permissions"
        description={`Are you sure you want to remove ${selectedPermissions.length} selected permission(s) from this role? This action cannot be undone.`}
        onConfirm={handleConfirmDeletePermissions}
        isLoading={removePermissionsMutation.isPending}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </Fragment>
  );
}

export default RolePermissionTable;
