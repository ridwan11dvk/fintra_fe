import {
  ROLE_POSITION_DELETE_PERMISSION,
  ROLE_POSITION_READ_PERMISSION,
  ROLE_POSITION_UPDATE_PERMISSION,
  rolePositionService,
  useDeleteAllPositionsFromRole,
  type JobPositionSimple,
  type RoleGroupedResponse,
} from "@/features/settings/role-position";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { MultipleBadge } from "@railfinance/core/components/multiple-badge";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface RolePositionGroupedListProps {
  onEdit: (item: RoleGroupedResponse) => void;
  onView: (item: RoleGroupedResponse) => void;
}

interface RolePositionGroupedColumnsConfig {
  onEdit: (item: RoleGroupedResponse) => void;
  onView: (item: RoleGroupedResponse) => void;
  onDelete: (item: RoleGroupedResponse) => void;
}

function createRolePositionGroupedColumns({
  onEdit,
  onView,
  onDelete,
}: Readonly<RolePositionGroupedColumnsConfig>): ColumnDef<RoleGroupedResponse>[] {
  return [
    {
      accessorKey: "roleCode",
      header: "Role Code",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: "roleName",
      header: "Role Name",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: "jobPositions",
      header: "Job Positions",
      cell: ({ row }) => (
        <MultipleBadge<JobPositionSimple> data={row?.original?.jobPositions} />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <ActionButton
            variant="show"
            size="sm"
            onClick={() => onView(row.original)}
            tooltip="View role positions"
            permission={ROLE_POSITION_READ_PERMISSION}
          />
          <ActionButton
            variant="edit"
            size="sm"
            onClick={() => onEdit(row.original)}
            tooltip="Edit role positions"
            permission={ROLE_POSITION_UPDATE_PERMISSION}
          />
          <ActionButton
            variant="delete"
            size="sm"
            onClick={() => onDelete(row.original)}
            tooltip="Delete role positions"
            permission={ROLE_POSITION_DELETE_PERMISSION}
          />
        </div>
      ),
    },
  ];
}

export function RolePositionGroupedList({
  onEdit,
  onView,
}: Readonly<RolePositionGroupedListProps>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RoleGroupedResponse | null>(
    null,
  );

  const deleteMutation = useDeleteAllPositionsFromRole();

  const handleDelete = (item: RoleGroupedResponse) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.roleId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  const columns = createRolePositionGroupedColumns({
    onEdit,
    onView,
    onDelete: handleDelete,
  });

  return (
    <>
      <DataTable
        title="All role positions (by role)"
        columns={columns}
        queryFn={rolePositionService.getRolePositionsGroupedByRole}
        queryKey={["positionRoles", "roleGroupedList"]}
        search={{
          key: "search",
          placeholder: "By Role Code & Role Name",
        }}
        pageSize={10}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Role Positions"
        description={`Are you sure you want to delete all position assignments for role "${itemToDelete?.roleCode} - ${itemToDelete?.roleName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
