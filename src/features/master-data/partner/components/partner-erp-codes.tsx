import type { PartnerErpCode } from "@/features/master-data";
import {
  PARTNER_UPDATE_PERMISSION,
  PartnerErpCodeFormModal,
  partnerQueryKeys,
  partnerService,
  useDeletePartnerErpCodeMutation,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface ErpCodeColumnsConfig {
  onEdit: (erpCode: PartnerErpCode) => void;
  onDelete: (erpCode: PartnerErpCode) => void;
}

function createErpCodeColumns({
  onEdit,
  onDelete,
}: Readonly<ErpCodeColumnsConfig>): ColumnDef<PartnerErpCode>[] {
  return [
    {
      accessorKey: "erpCode",
      header: "ERP Code",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.erpCode}</div>
      ),
    },
    {
      accessorKey: "companyCode",
      header: "Company Code",
      cell: ({ row }) => row.original.companyCode ?? "-",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) =>
        row.original.startDate
          ? formatDate(new Date(row.original.startDate), "DD/MM/YYYY")
          : "-",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) =>
        row.original.endDate
          ? formatDate(new Date(row.original.endDate), "DD/MM/YYYY")
          : "—",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const erpCode = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              variant="edit"
              onClick={() => onEdit(erpCode)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="delete"
              onClick={() => onDelete(erpCode)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </div>
        );
      },
    },
  ];
}

interface PartnerErpCodesProps {
  partnerId: number;
  open?: boolean;
}

export function PartnerErpCodes({
  partnerId,
  open,
}: Readonly<PartnerErpCodesProps>) {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerErpCode | null;
  }>({ open: false, mode: "create", data: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: PartnerErpCode | null;
  }>({ open: false, data: null });

  const deleteErpCodeMutation = useDeletePartnerErpCodeMutation({
    onSuccess: () => {
      setDeleteModal({ open: false, data: null });
    },
  });

  const handleOpenDeleteModal = (erpCode: PartnerErpCode) => {
    setDeleteModal({ open: true, data: erpCode });
  };

  const handleToggleDeleteModal = (value: boolean) => {
    setDeleteModal((prev) => ({ ...prev, open: value }));
  };

  const handleConfirmDelete = () => {
    if (deleteModal.data?.id) {
      deleteErpCodeMutation.mutate({
        partnerId,
        erpCodeId: deleteModal.data.id,
      });
    }
  };

  const handleCloseFormModal = () => {
    setFormModal({ open: false, mode: "create", data: null });
  };

  const handleOpenCreateFormModal = () => {
    setFormModal({ open: true, mode: "create", data: null });
  };

  const handleOpenEditFormModal = (erpCode: PartnerErpCode) => {
    setFormModal({ open: true, mode: "edit", data: erpCode });
  };

  const onFormModalSuccess = () => {};

  const columns = createErpCodeColumns({
    onEdit: handleOpenEditFormModal,
    onDelete: handleOpenDeleteModal,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>ERP Codes</CardTitle>
          <CardDescription>Manage partner ERP code mappings</CardDescription>
          <CardAction>
            <ActionButton
              variant="add"
              showLabel
              onClick={handleOpenCreateFormModal}
              label="Add ERP Code"
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable<PartnerErpCode>
            columns={columns}
            queryKey={partnerQueryKeys.erpCodes(partnerId)}
            queryFn={partnerService.listPartnerErpCodes.bind(null, partnerId)}
            enabled={partnerId > 0 && open}
          />
        </CardContent>
      </Card>

      <PartnerErpCodeFormModal
        open={formModal.open}
        onOpenChange={handleCloseFormModal}
        mode={formModal.mode}
        partnerId={partnerId}
        defaultValues={formModal.data || undefined}
        onSuccess={onFormModalSuccess}
      />

      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={handleToggleDeleteModal}
        title="Delete ERP Code"
        description={`Are you sure you want to delete the ERP code "${deleteModal.data?.erpCode}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmVariant="destructive"
        isLoading={deleteErpCodeMutation.isPending}
      />
    </>
  );
}

export default PartnerErpCodes;
