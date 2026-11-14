import { Button } from "@railfinance/core";
import { DataTable } from "@railfinance/core/components/data-table";
import { MultipleBadge } from "@railfinance/core/components/multiple-badge";
import {
  roleService,
  useGetActiveCompanies,
  type RoleBusinessArea,
  type RoleResponse,
} from "@railfinance/core/masterdata";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

function createRoleSelectionColumns(): ColumnDef<RoleResponse>[] {
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
      accessorKey: "name",
      header: "Role Name",
    },
    {
      accessorKey: "code",
      header: "Role Code",
    },
    {
      accessorKey: "businessAreas",
      header: "BA Assigment",
      cell: ({ row }) => (
        <MultipleBadge<RoleBusinessArea> data={row?.original?.businessAreas} />
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <div>
          {row.original?.company?.name ?? row.original?.companyCode ?? "-"}
        </div>
      ),
    },
  ];
}

interface ChooseRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: RoleResponse[];
  onChoose: (roles: RoleResponse[]) => void;
}

export function ChooseRolesDialog({
  open,
  onOpenChange,
  roles,
  onChoose,
}: Readonly<ChooseRolesDialogProps>) {
  const [selectedRoles, setSelectedRoles] = useState<RoleResponse[]>(roles);
  const [prevOpen, setPrevOpen] = useState(open);
  const { data: companiesData } = useGetActiveCompanies();

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSelectedRoles(roles);
    }
  }

  const handleChoose = (roles: RoleResponse[]) => {
    onChoose(roles);
    onOpenChange(false);
  };
  const roleColumns = createRoleSelectionColumns();

  return (
    <DataTable
      title="Choose Roles"
      description={
        selectedRoles?.length > 0
          ? `${selectedRoles.length} role(s) selected`
          : "Choose one or multiple roles"
      }
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <div className="flex justify-end">
          <Button onClick={() => handleChoose(selectedRoles)}>Choose</Button>
        </div>
      }
      columns={roleColumns}
      selectedItems={selectedRoles}
      onItemSelect={setSelectedRoles}
      queryKey={["role"]}
      queryFn={(params) =>
        roleService.paginateActiveRoles({ ...params, withBusinessArea: true })
      }
      search={{
        key: "search",
        placeholder: "Search by role name or code",
      }}
      filters={[
        {
          key: "companyCode",
          label: "Company",
          placeholder: "Filter by company",
          type: "select-search",
          options:
            companiesData?.data && companiesData?.data?.length > 0
              ? companiesData?.data?.map((item) => ({
                  value: item.code,
                  label: item.name,
                  description: "",
                }))
              : [],
        },
      ]}
      pageSize={20}
    />
  );
}
