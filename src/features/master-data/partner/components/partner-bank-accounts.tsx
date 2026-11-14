import {
  PARTNER_UPDATE_PERMISSION,
  PartnerBankAccountFormModal,
  partnerQueryKeys,
  partnerService,
  useDeletePartnerBankAccountMutation,
} from "@/features/master-data";
import type { PartnerBankAccount } from "@/features/master-data/partner/data/partner.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { StatusBadge } from "@railfinance/core/components/badges";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface BankAccountColumnsConfig {
  onEdit: (account: PartnerBankAccount) => void;
  onDelete: (account: PartnerBankAccount) => void;
}

function createBankAccountColumns({
  onEdit,
  onDelete,
}: Readonly<BankAccountColumnsConfig>): ColumnDef<PartnerBankAccount>[] {
  return [
    {
      accessorKey: "accountNumber",
      header: "Account Number",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "holderName",
      header: "Account Holder",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "bankCenter",
      header: "Bank",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "isDefaultPayment",
      header: "Default Payment",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
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

interface PartnerBankAccountsProps {
  partnerId: number;
  open?: boolean;
}

export function PartnerBankAccounts({
  partnerId,
  open,
}: Readonly<PartnerBankAccountsProps>) {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerBankAccount | null;
  }>({ open: false, mode: "create", data: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: PartnerBankAccount | null;
  }>({ open: false, data: null });

  const deleteAccountMutation = useDeletePartnerBankAccountMutation({
    onSuccess: () => {
      setDeleteModal({ open: false, data: null });
    },
  });

  const handleOpenDeleteModal = (account: PartnerBankAccount) => {
    setDeleteModal({ open: true, data: account });
  };

  const handleToggleDeleteModal = (value: boolean) => {
    setDeleteModal((prev) => ({ ...prev, open: value }));
  };

  const handleConfirmDelete = () => {
    if (deleteModal.data?.id) {
      deleteAccountMutation.mutate({
        partnerId,
        bankAccountId: deleteModal.data.id,
      });
    }
  };

  const handleCloseFormModal = () => {
    setFormModal({ open: false, mode: "create", data: null });
  };

  const handleOpenCreateFormModal = () => {
    setFormModal({ open: true, mode: "create", data: null });
  };

  const handleOpenEditFormModal = (account: PartnerBankAccount) => {
    setFormModal({ open: true, mode: "edit", data: account });
  };

  const onFormModalSuccess = () => {};

  const columns = createBankAccountColumns({
    onEdit: handleOpenEditFormModal,
    onDelete: handleOpenDeleteModal,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bank Accounts</CardTitle>
          <CardDescription>
            Manage bank accounts for this partner
          </CardDescription>
          <CardAction>
            <ActionButton
              variant="add"
              showLabel
              onClick={() => handleOpenCreateFormModal()}
              disabled={false}
              label="Add Bank Account"
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable<PartnerBankAccount>
            columns={columns}
            queryKey={partnerQueryKeys.bankAccounts(partnerId)}
            queryFn={partnerService.listPartnerBankAccounts.bind(
              null,
              partnerId,
            )}
            enabled={partnerId > 0 && open}
          />
        </CardContent>
      </Card>

      <PartnerBankAccountFormModal
        open={formModal.open}
        onOpenChange={handleCloseFormModal}
        mode={formModal.mode}
        partnerId={partnerId}
        defaultValues={formModal.data || undefined}
        onSuccess={onFormModalSuccess}
      />

      {/* Bank Account Delete Confirmation */}
      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={handleToggleDeleteModal}
        title="Delete Bank Account"
        description="Are you sure you want to delete this bank account? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmVariant="destructive"
        isLoading={deleteAccountMutation.isPending}
      />
    </>
  );
}
