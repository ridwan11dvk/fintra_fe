import type { Partner, PartnerDocument } from "@/features/master-data";
import {
  PARTNER_UPDATE_PERMISSION,
  PartnerDocumentFormModal,
  partnerQueryKeys,
  partnerService,
  useDeletePartnerDocumentMutation,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ConfirmationModal, FilePreview } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { formatDate } from "@railfinance/core/lib";
import { StatusBadge } from "@railfinance/core/components/badges";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface DocumentColumnsConfig {
  onShow: (doc: PartnerDocument) => void;
  onEdit: (doc: PartnerDocument) => void;
  onDelete: (doc: PartnerDocument) => void;
}

function createDocumentColumns({
  onShow,
  onEdit,
  onDelete,
}: Readonly<DocumentColumnsConfig>): ColumnDef<PartnerDocument>[] {
  return [
    {
      accessorKey: "documentName",
      header: "Document Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "documentType",
      header: "Document Type",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "documentNumber",
      header: "Document Number",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "documentDate",
      header: "Document Date",
      cell: (info) => {
        return info.getValue() ? formatDate(info.getValue() as string) : "-";
      },
    },
    {
      accessorKey: "fileSize",
      header: "File Size",
      cell: (info) => {
        const fileSize = info.getValue() as number | undefined;
        if (fileSize) {
          const sizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
          return `${sizeInMB} MB`;
        }
        return "-";
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (info) => {
        const isActive = Boolean(info.getValue());
        return <StatusBadge status={isActive ? "active" : "inactive"} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const doc = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton variant="show" onClick={() => onShow(doc)} />
            <ActionButton
              variant="edit"
              onClick={() => onEdit(doc)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="delete"
              onClick={() => onDelete(doc)}
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </div>
        );
      },
    },
  ];
}

interface PartnerDocumentsProps {
  partner: Partner;
  open?: boolean;
}

export function PartnerDocuments({
  partner,
  open,
}: Readonly<PartnerDocumentsProps>) {
  const partnerId = partner.id;
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerDocument | null;
  }>({ open: false, mode: "create", data: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: PartnerDocument | null;
  }>({ open: false, data: null });

  const [previewFile, setPreviewFile] = useState<{
    open: boolean;
    filePath: string | null;
    title: string | null;
    description: string | null;
  }>({ open: false, filePath: null, title: null, description: null });

  // Delete mutations
  const deleteDocMutation = useDeletePartnerDocumentMutation({
    onSuccess: () => {
      setDeleteModal({ open: false, data: null });
    },
  });

  const handleOpenDeleteModal = (correspondent: PartnerDocument) => {
    setDeleteModal({ open: true, data: correspondent });
  };

  const handleToggleDeleteModal = (value: boolean) => {
    setDeleteModal((prev) => ({ ...prev, open: value }));
  };
  const handleConfirmDelete = () => {
    if (deleteModal.data?.id) {
      deleteDocMutation.mutate({
        partnerId,
        documentId: deleteModal.data.id,
      });
    }
  };
  const handleCloseFormModal = () => {
    setFormModal({ open: false, mode: "create", data: null });
  };

  const handleOpenCreateFormModal = () => {
    setFormModal({ open: true, mode: "create", data: null });
  };

  const handleOpenEditFormModal = (correspondent: PartnerDocument) => {
    setFormModal({ open: true, mode: "edit", data: correspondent });
  };

  const handleOpenPreview = (doc: PartnerDocument) => {
    setPreviewFile({
      open: true,
      filePath: doc.documentPath ?? null,
      title: doc.documentName,
      description: doc.description || "",
    });
  };

  const onFormModalSuccess = () => {};

  const columns = createDocumentColumns({
    onShow: handleOpenPreview,
    onEdit: handleOpenEditFormModal,
    onDelete: handleOpenDeleteModal,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Partner Documents</CardTitle>
          <CardDescription>
            Manage documents associated with this partner
          </CardDescription>
          <CardAction>
            <ActionButton
              variant="add"
              showLabel
              onClick={handleOpenCreateFormModal}
              label="Add Document"
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable<PartnerDocument>
            columns={columns}
            queryKey={partnerQueryKeys.documents(partnerId)}
            queryFn={partnerService.listPartnerDocuments.bind(null, partnerId)}
            enabled={partnerId > 0 && open}
          />
        </CardContent>
      </Card>

      <PartnerDocumentFormModal
        open={formModal.open}
        onOpenChange={handleCloseFormModal}
        mode={formModal.mode}
        partner={partner}
        defaultValues={formModal.data || undefined}
        onSuccess={onFormModalSuccess}
      />

      {/* Document Delete Confirmation */}
      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={handleToggleDeleteModal}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmVariant="destructive"
        isLoading={deleteDocMutation.isPending}
      />

      {/* File Preview */}

      <FilePreview
        open={previewFile.open}
        onOpenChange={(open) =>
          setPreviewFile((prev) => ({ ...prev, open: open }))
        }
        filePath={previewFile.filePath ?? ""}
        title={previewFile.title ?? ""}
        description={previewFile.description ?? ""}
      />
    </>
  );
}
