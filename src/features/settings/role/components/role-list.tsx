import {
  ROLE_DELETE_PERMISSION,
  ROLE_READ_PERMISSION,
  ROLE_UPDATE_PERMISSION,
  roleQueryKeys,
  roleService,
  useDeleteRole,
  type Role,
} from "@/features/settings";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { MultipleBadge } from "@railfinance/core/components/multiple-badge";
import { StatusBadge } from "@railfinance/core/components/badges";
import { type RoleBusinessArea, type RoleResponse } from "@railfinance/core/masterdata";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
interface RoleListProps {
  onEdit: (role: RoleResponse) => void;
  onManagePermissions: (role: RoleResponse) => void;
}

interface RoleColumnsConfig {
  onEdit: (role: RoleResponse) => void;
  onManagePermissions: (role: RoleResponse) => void;
  onDelete: (role: RoleResponse) => void;
}

function createRoleColumns({
  onEdit,
  onManagePermissions,
  onDelete,
}: Readonly<RoleColumnsConfig>): ColumnDef<RoleResponse>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.original?.company?.name ?? row.original?.companyCode ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "businessAreas",
      header: "BA Assigment",
      cell: ({ row }) => (
        <MultipleBadge<RoleBusinessArea> data={row?.original?.businessAreas} />
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <div className="text-sm text-muted-foreground">
          {getValue<string>() || "-"}
        </div>
      ),
    },

    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          <StatusBadge status={row.original.isActive ? "active" : "inactive"} />
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ActionButton
            variant="edit"
            size="sm"
            onClick={() => onEdit(row.original)}
            tooltip="Edit role"
            permission={ROLE_UPDATE_PERMISSION}
          />
          <ActionButton
            variant="show"
            size="sm"
            onClick={() => onManagePermissions(row.original)}
            tooltip="Manage permissions"
            permission={ROLE_READ_PERMISSION}
          />
          <ActionButton
            variant="delete"
            size="sm"
            onClick={() => onDelete(row.original)}
            tooltip="Delete role"
            permission={ROLE_DELETE_PERMISSION}
          />
        </div>
      ),
    },
  ];
}

export function RoleList({
  onEdit,
  onManagePermissions,
}: Readonly<RoleListProps>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleResponse | null>(null);

  const deleteRoleMutation = useDeleteRole();

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setRoleToDelete(null);
        },
      });
    }
  };

  const columns = createRoleColumns({
    onEdit,
    onManagePermissions,
    onDelete: handleDelete,
  });

  return (
    <>
      <DataTable
        title="Roles"
        columns={columns}
        queryFn={(params) =>
          roleService.getRoles({ ...params, withBusinessArea: true })
        }
        queryKey={roleQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by name",
        }}
        pageSize={10}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${roleToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteRoleMutation.isPending}
      />
    </>
  );
}
