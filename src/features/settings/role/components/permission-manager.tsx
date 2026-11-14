import type { Permission } from "@/features/settings";
import {
  ROLE_UPDATE_PERMISSION,
  roleQueryKeys,
  roleService,
  useAssignPermissions,
} from "@/features/settings";
import type { RoleDetailResponse } from "@railfinance/core/masterdata";
import { ActionButton } from "@railfinance/core/components/actions";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { DataTable } from "@railfinance/core/components/data-table";
import { Modal } from "@railfinance/core/components/modal";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

function createPermissionColumns(): ColumnDef<Permission>[] {
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
  ];
}

interface PermissionManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleDetailResponse;
}
export function PermissionManager({
  open = false,
  onOpenChange,
  role,
}: Readonly<PermissionManagerProps>) {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    role?.permissions || [],
  );
  const assignPermissionsMutation = useAssignPermissions();

  const handleSavePermissions = () => {
    const permissionIds = selectedPermissions.map((p) => p.id);
    assignPermissionsMutation.mutate(
      {
        id: role.id,
        permissions: { permissionIds },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const permissionColumns = createPermissionColumns();

  return (
    <Modal open={open} onOpenChange={onOpenChange} fullContent={true}>
      <DataTable
        title="Permissions"
        columns={permissionColumns}
        queryFn={roleService.getPermissions}
        queryKey={roleQueryKeys.allPermissions}
        enabled={open}
        actions={
          <>
            <ActionButton
              variant="save"
              label="Save Changes"
              showLabel
              onClick={handleSavePermissions}
              disabled={assignPermissionsMutation.isPending}
              permission={ROLE_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="cancel"
              label="Close"
              showLabel={false}
              onClick={() => onOpenChange(false)}
              disabled={assignPermissionsMutation.isPending}
            />
          </>
        }
        search={{
          key: "search",
          placeholder: "Search permissions...",
        }}
        toolbar={{
          enableColumnToggle: false,
        }}
        selectedItems={selectedPermissions}
        onItemSelect={setSelectedPermissions}
      />
    </Modal>
  );
}

export default PermissionManager;
