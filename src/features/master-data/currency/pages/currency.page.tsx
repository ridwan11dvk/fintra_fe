import {
  CURRENCY_CREATE_PERMISSION,
  CURRENCY_LIST_PAGE_TITLE,
  CURRENCY_LIST_PERMISSION,
  CURRENCY_URL,
  CurrencyFormModal,
  currencyColumns,
  currencyQueryKeys,
  currencyService,
  useDeleteCurrencyMutation,
  type CurrencyResponse,
} from "@/features/master-data/currency";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CurrencyPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCurrency, setSelectedCurrency] = useState<
    CurrencyResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<
    CurrencyResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteCurrencyMutation = useDeleteCurrencyMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: currencyQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setCurrencyToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedCurrency(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: CurrencyResponse) => {
    setFormMode("edit");
    setSelectedCurrency(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: CurrencyResponse) => {
    setCurrencyToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (currencyToDelete) {
      deleteCurrencyMutation.mutate(currencyToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: currencyQueryKeys.lists(),
    });
  };

  const columns = currencyColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={CURRENCY_LIST_PAGE_TITLE}
      permission={CURRENCY_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: CURRENCY_LIST_PAGE_TITLE,
          url: CURRENCY_URL,
        },
      ]}
    >
      <PageHeader
        title="Currency"
        description="Manage currency master data including codes, symbols, and exchange rate settings"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={CURRENCY_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<CurrencyResponse>
        title="All Currencies"
        columns={columns}
        queryFn={currencyService.listCurrencies}
        queryKey={currencyQueryKeys.lists()}
        search={{
          key: "code",
          placeholder: "Search by currency code or name",
        }}
      />

      <CurrencyFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedCurrency}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Currency"
        description={`Are you sure you want to delete "${currencyToDelete?.code} - ${currencyToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteCurrencyMutation.isPending}
      />
    </Page>
  );
}

export default CurrencyPage;
