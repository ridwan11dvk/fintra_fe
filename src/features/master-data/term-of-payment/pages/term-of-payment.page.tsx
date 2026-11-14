import {
  TERM_OF_PAYMENT_CREATE_PERMISSION,
  TERM_OF_PAYMENT_LIST_PAGE_TITLE,
  TERM_OF_PAYMENT_LIST_PERMISSION,
  TERM_OF_PAYMENT_URL,
  TermOfPaymentFormModal,
  termOfPaymentColumns,
  termOfPaymentQueryKeys,
  termOfPaymentService,
  useDeleteTermOfPaymentMutation,
  type TermOfPaymentResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function TermOfPaymentPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTermOfPayment, setSelectedTermOfPayment] = useState<
    TermOfPaymentResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [termOfPaymentToDelete, setTermOfPaymentToDelete] = useState<
    TermOfPaymentResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteTermOfPaymentMutation = useDeleteTermOfPaymentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: termOfPaymentQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setTermOfPaymentToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedTermOfPayment(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: TermOfPaymentResponse) => {
    setFormMode("edit");
    setSelectedTermOfPayment(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: TermOfPaymentResponse) => {
    setTermOfPaymentToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (termOfPaymentToDelete) {
      deleteTermOfPaymentMutation.mutate(termOfPaymentToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: termOfPaymentQueryKeys.lists(),
    });
  };

  const columns = termOfPaymentColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={TERM_OF_PAYMENT_LIST_PAGE_TITLE}
      permission={TERM_OF_PAYMENT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: TERM_OF_PAYMENT_LIST_PAGE_TITLE,
          url: TERM_OF_PAYMENT_URL,
        },
      ]}
    >
      <PageHeader
        title={TERM_OF_PAYMENT_LIST_PAGE_TITLE}
        description="Manage payment terms including payment conditions, due date calculations, and payment percentages"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={TERM_OF_PAYMENT_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<TermOfPaymentResponse>
        title="All Payment Terms"
        columns={columns}
        queryFn={termOfPaymentService.listTermOfPayments}
        queryKey={termOfPaymentQueryKeys.lists()}
        search={{
          key: "code",
          placeholder: "Search by code or name",
        }}
      />

      <TermOfPaymentFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedTermOfPayment}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Payment Term"
        description={`Are you sure you want to delete payment term "${termOfPaymentToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={deleteTermOfPaymentMutation.isPending}
        confirmVariant="destructive"
      />
    </Page>
  );
}

export default TermOfPaymentPage;
