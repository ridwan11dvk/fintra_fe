import {
  LOOKUP_VALUE_CREATE_PERMISSION,
  LOOKUP_VALUE_LIST_PAGE_TITLE,
  LOOKUP_VALUE_LIST_PERMISSION,
  LOOKUP_VALUE_URL,
  CategoryFormModal,
  categoryColumns,
  lookupValueQueryKeys,
  lookupValueService,
  useDeleteCategoryMutation,
  type LookupValueResponse,
} from "@/features/master-data";
import type { OptionItem } from "@railfinance/core/types";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useGetLookupValueTypeOptions } from "@railfinance/core/masterdata";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CategoryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<
    LookupValueResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<
    LookupValueResponse | undefined
  >();

  const queryClient = useQueryClient();

  const { data: categoryTypesData } = useGetLookupValueTypeOptions();

  const deleteMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lookupValueQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setCategoryToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedCategory(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: LookupValueResponse) => {
    setFormMode("edit");
    setSelectedCategory(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: LookupValueResponse) => {
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
      queryKey: lookupValueQueryKeys.lists(),
    });
  };

  const columns = categoryColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  const typeFilterOptions =
    categoryTypesData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
    })) || [];

  return (
    <Page
      type="base"
      title={LOOKUP_VALUE_LIST_PAGE_TITLE}
      permission={LOOKUP_VALUE_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: LOOKUP_VALUE_LIST_PAGE_TITLE, url: LOOKUP_VALUE_URL },
      ]}
    >
      <PageHeader
        title="Lookup Value"
        description="Manage category master data for classifying partners, assets and transactions"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={LOOKUP_VALUE_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<LookupValueResponse>
        title="All Categories"
        columns={columns}
        queryFn={lookupValueService.listCategories}
        queryKey={lookupValueQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by name or description",
        }}
        filters={[
          {
            key: "typeCode",
            label: "Lookup Value Type",
            type: "select",
            options: typeFilterOptions,
            clearable: true,
          },
          {
            key: "isActive",
            label: "Status",
            type: "select",
            options: [
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ],
            clearable: true,
          },
        ]}
      />

      <CategoryFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedCategory}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Lookup Value"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </Page>
  );
}

export default CategoryPage;
