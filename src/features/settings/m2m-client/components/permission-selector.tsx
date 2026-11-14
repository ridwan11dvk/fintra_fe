import { roleQueryKeys, roleService } from "@/features/settings";
import type { PermissionResponse } from "@railfinance/core/masterdata";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { DataTable } from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

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

interface PermissionSelectorProps {
  selectedPermissions: PermissionResponse[];
  onSelectionChange: (permissions: PermissionResponse[]) => void;
  enabled?: boolean;
}

export default function PermissionSelector({
  selectedPermissions,
  onSelectionChange,
  enabled = true,
}: Readonly<PermissionSelectorProps>) {
  const permissionColumns = createPermissionColumns();

  return (
    <DataTable
      title="Permissions"
      columns={permissionColumns}
      queryFn={roleService.getPermissions}
      queryKey={roleQueryKeys.allPermissions}
      enabled={enabled}
      search={{
        key: "search",
        placeholder: "Search permissions...",
      }}
      toolbar={{
        enableColumnToggle: false,
      }}
      selectedItems={selectedPermissions}
      onItemSelect={onSelectionChange}
    />
  );
}
