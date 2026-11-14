import {
  PARTNER_UPDATE_PERMISSION,
  PartnerVirtualAccountFormModal,
  partnerQueryKeys,
  partnerService,
  useDeletePartnerVirtualAccountMutation,
} from "@/features/master-data";
import type { PartnerVirtualAccount } from "@/features/master-data/partner/data/partner.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { StatusBadge } from "@railfinance/core/components/badges";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface VirtualAccountColumnsConfig {
  onEdit: (account: PartnerVirtualAccount) => void;
  onDelete: (account: PartnerVirtualAccount) => void;
}

function createVirtualAccountColumns({
  onEdit,
  onDelete,
}: Readonly<VirtualAccountColumnsConfig>): ColumnDef<PartnerVirtualAccount>[] {
  return [
    {
      accessorKey: "number",
      header: "Virtual Account Number",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "holder",
      header: "Account Holder",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "bankCode",
      header: "Bank",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: (info) => {
        const active = Boolean(info.getValue());
        return <StatusBadge status={active ? "active" : "inactive"} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              variant="edit"
              onClick={() => onEdit(account)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="delete"
              onClick={() => onDelete(account)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </div>
        );
      },
    },
  ];
}

interface PartnerVirtualAccountsProps {
  partnerId: number;
  open?: boolean;
}

export function PartnerVirtualAccounts({
  partnerId,
  open,
}: Readonly<PartnerVirtualAccountsProps>) {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerVirtualAccount | null;
  }>({ open: false, mode: "create", data: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: PartnerVirtualAccount | null;
  }>({ open: false, data: null });

  const deleteAccountMutation = useDeletePartnerVirtualAccountMutation({
    onSuccess: () => {
      setDeleteModal({ open: false, data: null });
    },
  });

  const handleOpenDeleteModal = (account: PartnerVirtualAccount) => {
    setDeleteModal({ open: true, data: account });
  };

  const handleToggleDeleteModal = (value: boolean) => {
    setDeleteModal((prev) => ({ ...prev, open: value }));
  };

  const handleConfirmDelete = () => {
    if (deleteModal.data?.id) {
      deleteAccountMutation.mutate({
        partnerId,
        virtualAccountId: deleteModal.data.id,
      });
    }
  };

  const handleCloseFormModal = () => {
    setFormModal({ open: false, mode: "create", data: null });
  };

  const handleOpenCreateFormModal = () => {
    setFormModal({ open: true, mode: "create", data: null });
  };

  const handleOpenEditFormModal = (account: PartnerVirtualAccount) => {
    setFormModal({ open: true, mode: "edit", data: account });
  };

  const onFormModalSuccess = () => {};

  const columns = createVirtualAccountColumns({
    onEdit: handleOpenEditFormModal,
    onDelete: handleOpenDeleteModal,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Virtual Accounts</CardTitle>
          <CardDescription>
            Manage virtual accounts for this partner
          </CardDescription>
          <CardAction>
            <ActionButton
              variant="add"
              showLabel
              onClick={() => handleOpenCreateFormModal()}
              disabled={false}
              label="Add Virtual Account"
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable<PartnerVirtualAccount>
            columns={columns}
            queryKey={partnerQueryKeys.virtualAccounts(partnerId)}
            queryFn={partnerService.listPartnerVirtualAccounts.bind(
              null,
              partnerId,
            )}
            enabled={partnerId > 0 && open}
          />
        </CardContent>
      </Card>

      <PartnerVirtualAccountFormModal
        open={formModal.open}
        onOpenChange={handleCloseFormModal}
        mode={formModal.mode}
        partnerId={partnerId}
        defaultValues={formModal.data || undefined}
        onSuccess={onFormModalSuccess}
      />

      {/* Virtual Account Delete Confirmation */}
      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={handleToggleDeleteModal}
        title="Delete Virtual Account"
        description="Are you sure you want to delete this virtual account? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmVariant="destructive"
        isLoading={deleteAccountMutation.isPending}
      />
    </>
  );
}
