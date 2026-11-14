import {
  PARTNER_UPDATE_PERMISSION,
  PartnerContactFormModal,
  partnerQueryKeys,
  partnerService,
  useDeletePartnerContactMutation,
} from "@/features/master-data";
import type { PartnerContact } from "@/features/master-data/partner/data/partner.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface ContactColumnsConfig {
  onEdit: (contact: PartnerContact) => void;
  onDelete: (contact: PartnerContact) => void;
}

function createContactColumns({
  onEdit,
  onDelete,
}: Readonly<ContactColumnsConfig>): ColumnDef<PartnerContact>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue() || "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              variant="edit"
              onClick={() => onEdit(contact)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="delete"
              onClick={() => onDelete(contact)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </div>
        );
      },
    },
  ];
}

interface PartnerContactsProps {
  partnerId: number;
  open?: boolean;
}

export function PartnerContacts({
  partnerId,
  open,
}: Readonly<PartnerContactsProps>) {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerContact | null;
  }>({ open: false, mode: "create", data: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: PartnerContact | null;
  }>({ open: false, data: null });

  const deleteContactMutation = useDeletePartnerContactMutation({
    onSuccess: () => {
      setDeleteModal({ open: false, data: null });
    },
  });

  const handleOpenDeleteModal = (contact: PartnerContact) => {
    setDeleteModal({ open: true, data: contact });
  };

  const handleToggleDeleteModal = (value: boolean) => {
    setDeleteModal((prev) => ({ ...prev, open: value }));
  };

  const handleConfirmDelete = () => {
    if (deleteModal.data?.id) {
      deleteContactMutation.mutate({
        partnerId,
        contactId: deleteModal.data.id,
      });
    }
  };

  const handleCloseFormModal = () => {
    setFormModal({ open: false, mode: "create", data: null });
  };

  const handleOpenCreateFormModal = () => {
    setFormModal({ open: true, mode: "create", data: null });
  };

  const handleOpenEditFormModal = (contact: PartnerContact) => {
    setFormModal({ open: true, mode: "edit", data: contact });
  };

  const onFormModalSuccess = () => {};

  const columns = createContactColumns({
    onEdit: handleOpenEditFormModal,
    onDelete: handleOpenDeleteModal,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Partner Contacts</CardTitle>
          <CardDescription>
            Manage contact persons for this partner
          </CardDescription>
          <CardAction>
            <ActionButton
              variant="add"
              showLabel
              onClick={() => handleOpenCreateFormModal()}
              disabled={false}
              label="Add Contact"
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable<PartnerContact>
            columns={columns}
            queryKey={partnerQueryKeys.contacts(partnerId)}
            queryFn={partnerService.listPartnerContacts.bind(null, partnerId)}
            enabled={partnerId > 0 && open}
          />
        </CardContent>
      </Card>

      <PartnerContactFormModal
        open={formModal.open}
        onOpenChange={handleCloseFormModal}
        mode={formModal.mode}
        partnerId={partnerId}
        defaultValues={formModal.data || undefined}
        onSuccess={onFormModalSuccess}
      />

      {/* Contact Delete Confirmation */}
      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={handleToggleDeleteModal}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmVariant="destructive"
        isLoading={deleteContactMutation.isPending}
      />
    </>
  );
}
