import {
  TAX_RATE_CREATE_PERMISSION,
  TAX_RATE_LIST_PAGE_TITLE,
  TAX_RATE_LIST_PERMISSION,
  TAX_RATE_URL,
  TaxRateFormModal,
  taxRateColumns,
  taxRateQueryKeys,
  taxRateService,
  useDeleteTaxRateMutation,
  type TaxRateResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { DataTable } from "@railfinance/core/components/data-table";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function TaxRatePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTaxRate, setSelectedTaxRate] = useState<
    TaxRateResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taxRateToDelete, setTaxRateToDelete] = useState<
    TaxRateResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteTaxRateMutation = useDeleteTaxRateMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taxRateQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setTaxRateToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedTaxRate(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: TaxRateResponse) => {
    setFormMode("edit");
    setSelectedTaxRate(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: TaxRateResponse) => {
    setTaxRateToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taxRateToDelete) {
      deleteTaxRateMutation.mutate(taxRateToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: taxRateQueryKeys.lists(),
    });
  };

  const columns = taxRateColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={TAX_RATE_LIST_PAGE_TITLE}
      permission={TAX_RATE_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: TAX_RATE_LIST_PAGE_TITLE,
          url: TAX_RATE_URL,
        },
      ]}
    >
      <PageHeader
        title={TAX_RATE_LIST_PAGE_TITLE}
        description="Manage tax rates with their calculation parameters and effective dates for tax accounting"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={TAX_RATE_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<TaxRateResponse>
        title="All Tax Rates"
        columns={columns}
        search={{
          key: "search",
          placeholder: "Search tax rates...",
        }}
        filterType="dialog"
        filters={[
          {
            key: "taxType",
            label: "Tax Type",
            type: "select",
            options: [
              { value: "PPN", label: "PPN" },
              { value: "PPh", label: "PPh" },
            ],
            clearable: true,
          },
          {
            key: "isUsedInRkip",
            label: "Used in RKIP",
            type: "select",
            options: [
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ],
            clearable: true,
          },
        ]}
        queryKey={taxRateQueryKeys.lists()}
        queryFn={taxRateService.listTaxRates}
      />

      {/* Form Modal */}
      <TaxRateFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedTaxRate}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Tax Rate"
        description={`Are you sure you want to delete the tax rate "${taxRateToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={deleteTaxRateMutation.isPending}
      />
    </Page>
  );
}
