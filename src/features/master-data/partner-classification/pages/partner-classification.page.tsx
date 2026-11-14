import {
  PARTNER_CLASSIFICATION_CREATE_PERMISSION,
  PARTNER_CLASSIFICATION_LIST_PAGE_TITLE,
  PARTNER_CLASSIFICATION_LIST_PERMISSION,
  PARTNER_CLASSIFICATION_URL,
  PartnerClassificationFormModal,
  partnerClassificationColumns,
  partnerClassificationQueryKeys,
  partnerClassificationService,
  useDeletePartnerClassificationMutation,
  type PartnerClassificationResponse,
} from "@/features/master-data/partner-classification";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function PartnerClassificationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPartnerClassification, setSelectedPartnerClassification] =
    useState<PartnerClassificationResponse | undefined>();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [partnerClassificationToDelete, setPartnerClassificationToDelete] =
    useState<PartnerClassificationResponse | undefined>();

  const queryClient = useQueryClient();

  const deletePartnerClassificationMutation =
    useDeletePartnerClassificationMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: partnerClassificationQueryKeys.lists(),
        });
        setIsDeleteConfirmOpen(false);
        setPartnerClassificationToDelete(undefined);
      },
    });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedPartnerClassification(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: PartnerClassificationResponse) => {
    setFormMode("edit");
    setSelectedPartnerClassification(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: PartnerClassificationResponse) => {
    setPartnerClassificationToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partnerClassificationToDelete) {
      deletePartnerClassificationMutation.mutate(
        partnerClassificationToDelete.id,
      );
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: partnerClassificationQueryKeys.lists(),
    });
  };

  const columns = partnerClassificationColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={PARTNER_CLASSIFICATION_LIST_PAGE_TITLE}
      permission={PARTNER_CLASSIFICATION_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: PARTNER_CLASSIFICATION_LIST_PAGE_TITLE,
          url: PARTNER_CLASSIFICATION_URL,
        },
      ]}
    >
      <PageHeader
        title={PARTNER_CLASSIFICATION_LIST_PAGE_TITLE}
        description="Manage partner classification master data including classification IDs, names, and descriptions"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={PARTNER_CLASSIFICATION_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<PartnerClassificationResponse>
        title="All Partner Classifications"
        columns={columns}
        queryFn={partnerClassificationService.listPartnerClassifications}
        queryKey={partnerClassificationQueryKeys.lists()}
        toolbar={{
          enableColumnToggle: true,
        }}
        search={{
          key: "search",
          placeholder: "Search by ID or name",
        }}
      />

      <PartnerClassificationFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedPartnerClassification}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Partner Classification"
        description={`Are you sure you want to delete "${partnerClassificationToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deletePartnerClassificationMutation.isPending}
      />
    </Page>
  );
}

export default PartnerClassificationPage;
