import {
  PARTNER_CATEGORY_CREATE_PERMISSION,
  PARTNER_CATEGORY_LIST_PAGE_TITLE,
  PARTNER_CATEGORY_LIST_PERMISSION,
  PARTNER_CATEGORY_URL,
  PartnerCategoryFormModal,
  partnerCategoryColumns,
  partnerCategoryQueryKeys,
  partnerCategoryService,
  useDeletePartnerCategoryMutation,
  type PartnerCategoryResponse,
} from "@/features/master-data/partner-category";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function PartnerCategoryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPartnerCategory, setSelectedPartnerCategory] = useState<
    PartnerCategoryResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [partnerCategoryToDelete, setPartnerCategoryToDelete] = useState<
    PartnerCategoryResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deletePartnerCategoryMutation = useDeletePartnerCategoryMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnerCategoryQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setPartnerCategoryToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedPartnerCategory(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: PartnerCategoryResponse) => {
    setFormMode("edit");
    setSelectedPartnerCategory(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: PartnerCategoryResponse) => {
    setPartnerCategoryToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partnerCategoryToDelete) {
      deletePartnerCategoryMutation.mutate(partnerCategoryToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: partnerCategoryQueryKeys.lists(),
    });
  };

  const columns = partnerCategoryColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={PARTNER_CATEGORY_LIST_PAGE_TITLE}
      permission={PARTNER_CATEGORY_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: PARTNER_CATEGORY_LIST_PAGE_TITLE,
          url: PARTNER_CATEGORY_URL,
        },
      ]}
    >
      <PageHeader
        title={PARTNER_CATEGORY_LIST_PAGE_TITLE}
        description="Manage partner category master data including category IDs, names, and descriptions"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={PARTNER_CATEGORY_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<PartnerCategoryResponse>
        title="All Partner Categories"
        columns={columns}
        queryFn={partnerCategoryService.listPartnerCategories}
        queryKey={partnerCategoryQueryKeys.lists()}
        toolbar={{
          enableColumnToggle: true,
        }}
        search={{
          key: "search",
          placeholder: "Search by ID or name",
        }}
      />

      <PartnerCategoryFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedPartnerCategory}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Partner Category"
        description={`Are you sure you want to delete "${partnerCategoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deletePartnerCategoryMutation.isPending}
      />
    </Page>
  );
}

export default PartnerCategoryPage;
