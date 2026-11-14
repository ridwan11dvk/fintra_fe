import {
  ROLE_POSITION_DELETE_PERMISSION,
  ROLE_POSITION_READ_PERMISSION,
  ROLE_POSITION_UPDATE_PERMISSION,
  rolePositionQueryKeys,
  rolePositionService,
  useDeleteAllRolesFromPosition,
  type RolePositionGroupedResponse,
  type RoleSimple,
} from "@/features/settings/role-position";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { MultipleBadge } from "@railfinance/core/components/multiple-badge";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface RolePositionListProps {
  onEdit: (item: RolePositionGroupedResponse) => void;
  onView: (item: RolePositionGroupedResponse) => void;
}

interface RolePositionColumnsConfig {
  onEdit: (item: RolePositionGroupedResponse) => void;
  onView: (item: RolePositionGroupedResponse) => void;
  onDelete: (item: RolePositionGroupedResponse) => void;
}

function createRolePositionColumns({
  onEdit,
  onView,
  onDelete,
}: Readonly<RolePositionColumnsConfig>): ColumnDef<RolePositionGroupedResponse>[] {
  return [
    {
      accessorKey: "jobPositionCode",
      header: "Position Code",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: "jobPositionName",
      header: "Position Name",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: "roles",
      header: "Role",
      cell: ({ row }) => (
        <MultipleBadge<RoleSimple> data={row?.original?.roles} />
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
            tooltip="View position role"
            permission={ROLE_POSITION_READ_PERMISSION}
          />
          <ActionButton
            variant="edit"
            size="sm"
            onClick={() => onEdit(row.original)}
            tooltip="Edit position role"
            permission={ROLE_POSITION_UPDATE_PERMISSION}
          />
          <ActionButton
            variant="delete"
            size="sm"
            onClick={() => onDelete(row.original)}
            tooltip="Delete position role"
            permission={ROLE_POSITION_DELETE_PERMISSION}
          />
        </div>
      ),
    },
  ];
}

export function RolePositionList({
  onEdit,
  onView,
}: Readonly<RolePositionListProps>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<RolePositionGroupedResponse | null>(null);

  const deleteMutation = useDeleteAllRolesFromPosition();

  const handleDelete = (item: RolePositionGroupedResponse) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.jobPositionId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  const columns = createRolePositionColumns({
    onEdit,
    onView,
    onDelete: handleDelete,
  });

  return (
    <>
      <DataTable
        title="All role positions"
        columns={columns}
        queryFn={rolePositionService.getRolePositions}
        queryKey={rolePositionQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "By Position ID & Position Name",
        }}
        pageSize={10}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Role Position"
        description={`Are you sure you want to delete all role assignments for position "${itemToDelete?.jobPositionCode} - ${itemToDelete?.jobPositionName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
