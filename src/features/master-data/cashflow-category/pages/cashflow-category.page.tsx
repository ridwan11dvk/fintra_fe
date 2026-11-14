import {
  CASHFLOW_CATEGORY_CREATE_PERMISSION,
  CASHFLOW_CATEGORY_CREATE_URL,
  CASHFLOW_CATEGORY_LIST_PAGE_TITLE,
  CASHFLOW_CATEGORY_LIST_PERMISSION,
  CASHFLOW_CATEGORY_URL,
  cashflowCategoryColumns,
  cashflowCategoryQueryKeys,
  cashflowCategoryService,
  getCashflowCategoryDetailUrl,
  getCashflowCategoryEditUrl,
  useActivateCashflowCategoryMutation,
  useDeactivateCashflowCategoryMutation,
  type CashflowCategoryResponse,
} from "@/features/master-data";
import { StatusToggleModal } from "@/shared/components";
import { ActionButton } from "@railfinance/core/components/actions";
import { DataTable } from "@railfinance/core/components/data-table";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

export function CashflowCategoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusTarget, setStatusTarget] = useState<
    CashflowCategoryResponse | undefined
  >();

  const clearStatusTarget = () => {
    queryClient.invalidateQueries({
      queryKey: cashflowCategoryQueryKeys.lists(),
    });
    setStatusTarget(undefined);
  };

  const activateCashflowCategoryMutation = useActivateCashflowCategoryMutation({
    onSuccess: clearStatusTarget,
  });
  const deactivateCashflowCategoryMutation =
    useDeactivateCashflowCategoryMutation({
      onSuccess: clearStatusTarget,
    });

  const handleConfirmStatus = () => {
    if (!statusTarget) return;
    if (statusTarget.status === "ACTIVE") {
      deactivateCashflowCategoryMutation.mutate(statusTarget.id);
      return;
    }
    activateCashflowCategoryMutation.mutate(statusTarget.id);
  };

  const columns = cashflowCategoryColumns({
    onShow: (data: CashflowCategoryResponse) => {
      navigate(getCashflowCategoryDetailUrl(data.id));
    },
    onEdit: (data: CashflowCategoryResponse) => {
      navigate(getCashflowCategoryEditUrl(data.id));
    },
    onActivate: setStatusTarget,
    onDeactivate: setStatusTarget,
  });

  return (
    <Page
      type="base"
      title={CASHFLOW_CATEGORY_LIST_PAGE_TITLE}
      permission={
        import.meta.env.DEV ? undefined : CASHFLOW_CATEGORY_LIST_PERMISSION
      }
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        {
          title: CASHFLOW_CATEGORY_LIST_PAGE_TITLE,
          url: CASHFLOW_CATEGORY_URL,
        },
      ]}
    >
      <PageHeader
        title="Cashflow Category"
        withBackButton={false}
        actions={
          <ActionButton
            variant="add"
            label="Add Cashflow Category"
            showLabel
            onClick={() => navigate(CASHFLOW_CATEGORY_CREATE_URL)}
            permission={
              import.meta.env.DEV ? undefined : CASHFLOW_CATEGORY_CREATE_PERMISSION
            }
          />
        }
      />
      <DataTable<CashflowCategoryResponse>
        title="All Cashflow Category"
        columns={columns}
        queryFn={cashflowCategoryService.listCashflowCategories}
        queryKey={cashflowCategoryQueryKeys.lists()}
        search={{
          key: "code",
          placeholder: "Search Cashflow Category",
        }}
      />
      <StatusToggleModal
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(undefined);
        }}
        isActive={statusTarget?.status === "ACTIVE"}
        onConfirm={handleConfirmStatus}
        isLoading={
          activateCashflowCategoryMutation.isPending ||
          deactivateCashflowCategoryMutation.isPending
        }
        onCancel={clearStatusTarget}
      />
    </Page>
  );
}

export default CashflowCategoryPage;
