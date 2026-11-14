import type { PartnerRole } from "@/features/master-data";
import {
  PARTNER_ROLE_CREATE_PERMISSION,
  PARTNER_ROLE_DELETE_PERMISSION,
  PARTNER_ROLE_UPDATE_PERMISSION,
  partnerQueryKeys,
  PartnerRoleFormModal,
  partnerService,
  useDeletePartnerRoleMutation
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import { DataTable } from "@railfinance/core/components/data-table";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface RoleColumnsConfig {
  onEdit: (role: PartnerRole) => void;
  onDelete: (role: PartnerRole) => void;
}

function getStatusBadgeStatus(status?: string | null) {
  if (status === "ACTIVE") return "active" as const;
  if (status === "INACTIVE") return "inactive" as const;
  if (status === "BLACKLISTED") return "error" as const;
  return "info" as const;
}

function createRoleColumns({
  onEdit,
  onDelete,
}: Readonly<RoleColumnsConfig>): ColumnDef<PartnerRole>[] {
  return [
    {
      accessorKey: "type",
      header: "Role Type",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "companyCode",
      header: "Company Code",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = (info.getValue() as string | null) || null;
        if (!status) return "-";
        return (
          <StatusBadge status={getStatusBadgeStatus(status)} label={status} />
        );
      },
    },
    {
      accessorKey: "blacklistReason",
      header: "Blacklist Reason",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "blacklistDocument",
      header: "Blacklist Document",
      cell: (info) => info.getValue() || "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              variant="edit"
              onClick={() => onEdit(role)}
              permission={PARTNER_ROLE_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="delete"
              onClick={() => onDelete(role)}
              permission={PARTNER_ROLE_DELETE_PERMISSION}
            />
          </div>
        );
      },
    },
  ];
}

interface PartnerRolesProps {
  partnerId: number;
  open?: boolean;
}

export function PartnerRoles({ partnerId, open }: Readonly<PartnerRolesProps>) {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerRole | null;
  }>({ open: false, mode: "create", data: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: PartnerRole | null;
  }>({ open: false, data: null });

  const deleteRoleMutation = useDeletePartnerRoleMutation({
    onSuccess: () => {
      setDeleteModal({ open: false, data: null });
    },
  });

  const handleOpenEditModal = (role: PartnerRole) => {
    setFormModal({ open: true, mode: "edit", data: role });
  };

  const handleOpenDeleteModal = (role: PartnerRole) => {
    setDeleteModal({ open: true, data: role });
  };

  const handleToggleDeleteModal = (value: boolean) => {
    setDeleteModal((prev) => ({ ...prev, open: value }));
  };

  const handleConfirmDelete = () => {
    if (deleteModal.data?.id) {
      deleteRoleMutation.mutate({
        partnerId,
        roleId: deleteModal.data.id,
      });
    }
  };

  const columns = createRoleColumns({
    onEdit: handleOpenEditModal,
    onDelete: handleOpenDeleteModal,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Partner Roles</CardTitle>
          <CardDescription>
            Manage role assignments (vendor, mitra, customer) for this partner
            per company code
          </CardDescription>
          <CardAction>
            <ActionButton
              variant="add"
              showLabel
              onClick={() =>
                setFormModal({ open: true, mode: "create", data: null })
              }
              label="Add Role"
              permission={PARTNER_ROLE_CREATE_PERMISSION}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable<PartnerRole>
            columns={columns}
            queryKey={partnerQueryKeys.roles(partnerId)}
            queryFn={partnerService.listPartnerRoles.bind(null, partnerId)}
            enabled={partnerId > 0 && open}
          />
        </CardContent>
      </Card>

      <PartnerRoleFormModal
        open={formModal.open}
        onOpenChange={() =>
          setFormModal({ open: false, mode: "create", data: null })
        }
        mode={formModal.mode}
        partnerId={partnerId}
        defaultValues={formModal.data || undefined}
      />

      {/* Role Delete Confirmation */}
      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={handleToggleDeleteModal}
        title="Delete Partner Role"
        description={`Are you sure you want to delete the ${deleteModal.data?.type ?? ""} role? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmVariant="destructive"
        isLoading={deleteRoleMutation.isPending}
      />
    </>
  );
}
