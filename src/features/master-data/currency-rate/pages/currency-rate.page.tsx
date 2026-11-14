import {
  CURRENCY_RATE_CREATE_PERMISSION,
  CURRENCY_RATE_LIST_PAGE_TITLE,
  CURRENCY_RATE_LIST_PERMISSION,
  CURRENCY_RATE_SYNC_PERMISSION,
  CURRENCY_RATE_URL,
  CurrencyRateFormModal,
  currencyRateColumns,
  currencyRateQueryKeys,
  currencyRateService,
  rateTypes,
  useDeleteCurrencyRateMutation,
  useSyncCurrencyRatesMutation,
  type CurrencyRateResponse,
} from "@/features/master-data/currency-rate";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CurrencyRatePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedRate, setSelectedRate] = useState<
    CurrencyRateResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<
    CurrencyRateResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteRateMutation = useDeleteCurrencyRateMutation({
    onSuccess: () => {
      setIsDeleteConfirmOpen(false);
      setRateToDelete(undefined);
    },
  });

  const sycMutation = useSyncCurrencyRatesMutation();

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedRate(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: CurrencyRateResponse) => {
    setFormMode("edit");
    setSelectedRate(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: CurrencyRateResponse) => {
    setRateToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (rateToDelete) {
      deleteRateMutation.mutate(rateToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: currencyRateQueryKeys.lists(),
    });
  };

  const columns = currencyRateColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={CURRENCY_RATE_LIST_PAGE_TITLE}
      permission={CURRENCY_RATE_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: CURRENCY_RATE_LIST_PAGE_TITLE,
          url: CURRENCY_RATE_URL,
        },
      ]}
    >
      <PageHeader
        title={CURRENCY_RATE_LIST_PAGE_TITLE}
        description="Manage currency exchange rates with effective dating (KMK and BI rates)"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={CURRENCY_RATE_CREATE_PERMISSION}
            />
            <ActionButton
              variant="generate"
              label="Sync Rates"
              showLabel
              onClick={() => sycMutation.mutate()}
              disabled={sycMutation.isPending}
              permission={CURRENCY_RATE_SYNC_PERMISSION}
            />
          </div>
        }
      />
      <DataTable<CurrencyRateResponse>
        title="All Currency Rates"
        columns={columns}
        queryFn={currencyRateService.listCurrencyRates}
        queryKey={currencyRateQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by description or rate type",
        }}
        filters={[
          {
            key: "rateType",
            label: "Rate Type",
            placeholder: "Filter by Rate Type",
            type: "select",
            options: rateTypes,
          },
        ]}
      />

      <CurrencyRateFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedRate}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Currency Rate"
        description={`Are you sure you want to delete this currency rate (${rateToDelete?.rateType})? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteRateMutation.isPending}
      />
    </Page>
  );
}

export default CurrencyRatePage;
