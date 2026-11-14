import {
  CASHFLOW_GROUP_CREATE_PERMISSION,
  CASHFLOW_GROUP_CREATE_URL,
  CASHFLOW_GROUP_LIST_PAGE_TITLE,
  CASHFLOW_GROUP_LIST_PERMISSION,
  CASHFLOW_GROUP_URL,
  cashflowGroupColumns,
  cashflowGroupQueryKeys,
  cashflowGroupService,
  getCashflowGroupDetailUrl,
  getCashflowGroupEditUrl,
  useActivateCashflowGroupMutation,
  useDeactivateCashflowGroupMutation,
  useDeleteCashflowGroupMutation,
  type CashflowGroupResponse,
} from "@/features/master-data";
import { StatusToggleModal } from "@/shared/components";
import { ActionButton } from "@railfinance/core/components/actions";
import { DataTable } from "@railfinance/core/components/data-table";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

export function CashflowGroupPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusTarget, setStatusTarget] = useState<
    CashflowGroupResponse | undefined
  >();
  const [deleteTarget, setDeleteTarget] = useState<
    CashflowGroupResponse | undefined
  >();

  const clearStatusTarget = () => {
    queryClient.invalidateQueries({
      queryKey: cashflowGroupQueryKeys.lists(),
    });
    setStatusTarget(undefined);
  };

  const activateCashflowGroupMutation = useActivateCashflowGroupMutation({
    onSuccess: clearStatusTarget,
  });
  const deactivateCashflowGroupMutation = useDeactivateCashflowGroupMutation({
    onSuccess: clearStatusTarget,
  });
  const deleteCashflowGroupMutation = useDeleteCashflowGroupMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cashflowGroupQueryKeys.lists(),
      });
      setDeleteTarget(undefined);
    },
  });

  const handleConfirmStatus = () => {
    if (!statusTarget) return;
    if (statusTarget.status === "ACTIVE") {
      deactivateCashflowGroupMutation.mutate(statusTarget.id);
      return;
    }
    activateCashflowGroupMutation.mutate(statusTarget.id);
  };

  const columns = cashflowGroupColumns({
    onShow: (data: CashflowGroupResponse) => {
      navigate(getCashflowGroupDetailUrl(data.id));
    },
    onEdit: (data: CashflowGroupResponse) => {
      navigate(getCashflowGroupEditUrl(data.id));
    },
    onActivate: setStatusTarget,
    onDeactivate: setStatusTarget,
    onDelete: setDeleteTarget,
  });

  return (
    <Page
      type="base"
      title={CASHFLOW_GROUP_LIST_PAGE_TITLE}
      permission={
        import.meta.env.DEV ? undefined : CASHFLOW_GROUP_LIST_PERMISSION
      }
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        {
          title: CASHFLOW_GROUP_LIST_PAGE_TITLE,
          url: CASHFLOW_GROUP_URL,
        },
      ]}
    >
      <PageHeader
        title="Cashflow Group"
        withBackButton={false}
        actions={
          <ActionButton
            variant="add"
            label="Add Cashflow Group"
            showLabel
            onClick={() => navigate(CASHFLOW_GROUP_CREATE_URL)}
            permission={
              import.meta.env.DEV ? undefined : CASHFLOW_GROUP_CREATE_PERMISSION
            }
          />
        }
      />
      <DataTable<CashflowGroupResponse>
        title="All Cashflow Group"
        columns={columns}
        queryFn={cashflowGroupService.listCashflowGroups}
        queryKey={cashflowGroupQueryKeys.lists()}
        search={{
          key: "code",
          placeholder: "Search Cashflow Group",
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
          activateCashflowGroupMutation.isPending ||
          deactivateCashflowGroupMutation.isPending
        }
        onCancel={clearStatusTarget}
      />
      <ConfirmationModal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(undefined);
        }}
        title="Delete Cashflow Group"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteTarget) deleteCashflowGroupMutation.mutate(deleteTarget.id);
        }}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteCashflowGroupMutation.isPending}
      />
    </Page>
  );
}

export default CashflowGroupPage;
