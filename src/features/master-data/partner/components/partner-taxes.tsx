import {
  PARTNER_UPDATE_PERMISSION,
  partnerQueryKeys,
  partnerService,
  PartnerTaxFormModal,
  useDeletePartnerTaxMutation,
} from "@/features/master-data";
import type { PartnerTaxRate } from "@/features/master-data/partner/data/partner.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { StatusBadge } from "@railfinance/core/components/badges";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface TaxColumnsConfig {
  onEdit: (tax: PartnerTaxRate) => void;
  onDelete: (tax: PartnerTaxRate) => void;
}

function createTaxColumns({
  onEdit,
  onDelete,
}: Readonly<TaxColumnsConfig>): ColumnDef<PartnerTaxRate>[] {
  return [
    {
      accessorKey: "taxRate",
      header: "Tax Rate",
      cell: (info) => {
        const taxRate = info.row.original.taxRate;
        return taxRate ? `${taxRate.name} (${taxRate.ratePercent}%)` : "-";
      },
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
        const tax = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              variant="edit"
              onClick={() => onEdit(tax)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="delete"
              onClick={() => onDelete(tax)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </div>
        );
      },
    },
  ];
}

interface PartnerTaxesProps {
  partnerId: number;
  open?: boolean;
}

export function PartnerTaxes({ partnerId, open }: Readonly<PartnerTaxesProps>) {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerTaxRate | null;
  }>({ open: false, mode: "create", data: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: PartnerTaxRate | null;
  }>({ open: false, data: null });

  const deleteTaxMutation = useDeletePartnerTaxMutation({
    onSuccess: () => {
      setDeleteModal({ open: false, data: null });
    },
  });

  const handleOpenDeleteModal = (tax: PartnerTaxRate) => {
    setDeleteModal({ open: true, data: tax });
  };

  const handleToggleDeleteModal = (value: boolean) => {
    setDeleteModal((prev) => ({ ...prev, open: value }));
  };

  const handleConfirmDelete = () => {
    if (deleteModal.data?.id) {
      deleteTaxMutation.mutate({
        partnerId,
        taxId: deleteModal.data.id,
      });
    }
  };

  const handleCloseFormModal = () => {
    setFormModal({ open: false, mode: "create", data: null });
  };

  const handleOpenCreateFormModal = () => {
    setFormModal({ open: true, mode: "create", data: null });
  };

  const handleOpenEditFormModal = (tax: PartnerTaxRate) => {
    setFormModal({ open: true, mode: "edit", data: tax });
  };

  const onFormModalSuccess = () => {};

  const columns = createTaxColumns({
    onEdit: handleOpenEditFormModal,
    onDelete: handleOpenDeleteModal,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Partner Taxes</CardTitle>
          <CardDescription>
            Manage tax rates associated with this partner
          </CardDescription>
          <CardAction>
            <ActionButton
              variant="add"
              showLabel
              onClick={handleOpenCreateFormModal}
              label="Add Tax"
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable<PartnerTaxRate>
            columns={columns}
            queryKey={partnerQueryKeys.taxes(partnerId)}
            queryFn={partnerService.listPartnerTaxes.bind(null, partnerId)}
            enabled={partnerId > 0 && open}
          />
        </CardContent>
      </Card>

      <PartnerTaxFormModal
        open={formModal.open}
        onOpenChange={handleCloseFormModal}
        mode={formModal.mode}
        partnerId={partnerId}
        defaultValues={formModal.data || undefined}
        onSuccess={onFormModalSuccess}
      />

      {/* Tax Delete Confirmation */}
      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={handleToggleDeleteModal}
        title="Delete Tax Association"
        description="Are you sure you want to delete this tax association? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmVariant="destructive"
        isLoading={deleteTaxMutation.isPending}
      />
    </>
  );
}
