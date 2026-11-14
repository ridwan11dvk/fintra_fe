import {
  TRANSACTION_CATEGORY_CREATE_PERMISSION,
  TRANSACTION_CATEGORY_LIST_PAGE_TITLE,
  TRANSACTION_CATEGORY_LIST_PERMISSION,
  TRANSACTION_CATEGORY_URL,
  TransactionCategoryFormModal,
  transactionCategoryColumns,
  transactionCategoryQueryKeys,
  transactionCategoryService,
  useDeleteTransactionCategoryMutation,
  type TransactionCategoryResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
export function TransactionCategoryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<
    TransactionCategoryResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setcategoryToDelete] = useState<
    TransactionCategoryResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteTransactionCategoryMutation =
    useDeleteTransactionCategoryMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: transactionCategoryQueryKeys.lists(),
        });
        setIsDeleteConfirmOpen(false);
        setcategoryToDelete(undefined);
      },
    });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedCategory(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: TransactionCategoryResponse) => {
    setFormMode("edit");
    setSelectedCategory(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: TransactionCategoryResponse) => {
    setcategoryToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteTransactionCategoryMutation.mutate(categoryToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: transactionCategoryQueryKeys.lists(),
    });
  };

  const columns = transactionCategoryColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={TRANSACTION_CATEGORY_LIST_PAGE_TITLE}
      permission={TRANSACTION_CATEGORY_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: TRANSACTION_CATEGORY_LIST_PAGE_TITLE,
          url: TRANSACTION_CATEGORY_URL,
        },
      ]}
    >
      <PageHeader
        title={TRANSACTION_CATEGORY_LIST_PAGE_TITLE}
        description="Manage transaction category master data for classifying and organizing financial transactions"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={TRANSACTION_CATEGORY_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<TransactionCategoryResponse>
        title="All Transaction Categories"
        columns={columns}
        queryFn={transactionCategoryService.listTransactionCategories}
        queryKey={transactionCategoryQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by transaction category name or description",
        }}
      />

      <TransactionCategoryFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedCategory}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Transaction Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteTransactionCategoryMutation.isPending}
      />
    </Page>
  );
}

export default TransactionCategoryPage;
