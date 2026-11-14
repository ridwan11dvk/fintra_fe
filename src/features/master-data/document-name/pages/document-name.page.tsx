import {
  DOCUMENT_NAME_CREATE_PERMISSION,
  DOCUMENT_NAME_LIST_PAGE_TITLE,
  DOCUMENT_NAME_LIST_PERMISSION,
  DOCUMENT_NAME_URL,
  DocumentNameFormModal,
  documentNameColumns,
  documentNameQueryKeys,
  documentNameService,
  useDeleteDocumentNameMutation,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { type DocumentNameResponse } from "../data/document-name.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function DocumentNamePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDocumentName, setSelectedDocumentName] = useState<
    DocumentNameResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [documentNameToDelete, setDocumentNameToDelete] = useState<
    DocumentNameResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteMutation = useDeleteDocumentNameMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentNameQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setDocumentNameToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedDocumentName(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: DocumentNameResponse) => {
    setFormMode("edit");
    setSelectedDocumentName(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: DocumentNameResponse) => {
    setDocumentNameToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentNameToDelete) {
      deleteMutation.mutate(documentNameToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: documentNameQueryKeys.lists(),
    });
  };

  const columns = documentNameColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={DOCUMENT_NAME_LIST_PAGE_TITLE}
      permission={DOCUMENT_NAME_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: DOCUMENT_NAME_LIST_PAGE_TITLE, url: DOCUMENT_NAME_URL },
      ]}
    >
      <PageHeader
        title="Document Name"
        description="Manage document name master data for classifying documents"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={DOCUMENT_NAME_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<DocumentNameResponse>
        title="All Document Names"
        columns={columns}
        queryFn={documentNameService.listDocumentNames}
        queryKey={documentNameQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by name or description",
        }}
      />

      <DocumentNameFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedDocumentName}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Document Name"
        description={`Are you sure you want to delete "${documentNameToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </Page>
  );
}

export default DocumentNamePage;
