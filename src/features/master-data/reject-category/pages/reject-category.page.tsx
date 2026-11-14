import {
  REJECT_CATEGORY_CREATE_PERMISSION,
  REJECT_CATEGORY_LIST_PAGE_TITLE,
  REJECT_CATEGORY_LIST_PERMISSION,
  REJECT_CATEGORY_URL,
  RejectCategoryFormModal,
  rejectCategoryColumns,
  rejectCategoryQueryKeys,
  rejectCategoryService,
  useDeleteRejectCategoryMutation,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { DataTable } from "@railfinance/core/components/data-table";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import {
  useGetModuleOptions,
  type RejectCategoryResponse,
} from "@railfinance/core/masterdata";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function RejectCategoryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<
    RejectCategoryResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<
    RejectCategoryResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteMutation = useDeleteRejectCategoryMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rejectCategoryQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setCategoryToDelete(undefined);
    },
  });

  const { data: moduleData } = useGetModuleOptions();

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedCategory(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: RejectCategoryResponse) => {
    setFormMode("edit");
    setSelectedCategory(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: RejectCategoryResponse) => {
    setCategoryToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: rejectCategoryQueryKeys.lists(),
    });
  };

  const columns = rejectCategoryColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={REJECT_CATEGORY_LIST_PAGE_TITLE}
      permission={REJECT_CATEGORY_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: REJECT_CATEGORY_LIST_PAGE_TITLE, url: REJECT_CATEGORY_URL },
      ]}
    >
      <PageHeader
        title="Reject Category"
        description="Manage reject category master data for classifying rejection reasons"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={REJECT_CATEGORY_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<RejectCategoryResponse>
        title="All Reject Categories"
        columns={columns}
        queryFn={rejectCategoryService.listRejectCategories}
        queryKey={rejectCategoryQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by name or description",
        }}
        filters={[
          {
            key: "moduleId",
            label: "Module",
            type: "select",
            options: moduleData?.data,
          },
        ]}
      />

      <RejectCategoryFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedCategory}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Reject Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </Page>
  );
}

export default RejectCategoryPage;
