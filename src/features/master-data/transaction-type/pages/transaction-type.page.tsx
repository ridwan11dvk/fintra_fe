import {
  TRANSACTION_TYPE_CREATE_PERMISSION,
  TRANSACTION_TYPE_LIST_PAGE_TITLE,
  TRANSACTION_TYPE_LIST_PERMISSION,
  TRANSACTION_TYPE_URL,
  TransactionTypeFormModal,
  transactionTypeColumns,
  transactionTypeQueryKeys,
  transactionTypeService,
  useDeleteTransactionTypeMutation,
  type TransactionTypeResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function TransactionTypePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    TransactionTypeResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [transactionTypeToDelete, setTransactionTypeToDelete] = useState<
    TransactionTypeResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteTransactionTypeMutation = useDeleteTransactionTypeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionTypeQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setTransactionTypeToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedTransactionType(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: TransactionTypeResponse) => {
    setFormMode("edit");
    setSelectedTransactionType(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: TransactionTypeResponse) => {
    setTransactionTypeToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionTypeToDelete) {
      deleteTransactionTypeMutation.mutate(transactionTypeToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: transactionTypeQueryKeys.lists(),
    });
  };

  const columns = transactionTypeColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={TRANSACTION_TYPE_LIST_PAGE_TITLE}
      permission={TRANSACTION_TYPE_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: TRANSACTION_TYPE_LIST_PAGE_TITLE,
          url: TRANSACTION_TYPE_URL,
        },
      ]}
    >
      <PageHeader
        title={TRANSACTION_TYPE_LIST_PAGE_TITLE}
        description="Manage transaction types including SAP document mapping, GL accounts, and VAT configuration"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={TRANSACTION_TYPE_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<TransactionTypeResponse>
        title="All Transaction Types"
        columns={columns}
        queryFn={transactionTypeService.listTransactionTypes}
        queryKey={transactionTypeQueryKeys.lists()}
        search={{
          key: "search",
          placeholder:
            "Search by name, code, company code, SAP tcode, or document type",
        }}
      />

      <TransactionTypeFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedTransactionType}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Transaction Type"
        description={`Are you sure you want to delete "${transactionTypeToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteTransactionTypeMutation.isPending}
      />
    </Page>
  );
}

export default TransactionTypePage;
