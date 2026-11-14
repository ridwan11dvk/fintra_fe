import {
  REVENUE_CENTER_CREATE_PERMISSION,
  REVENUE_CENTER_CREATE_URL,
  REVENUE_CENTER_LIST_PAGE_TITLE,
  REVENUE_CENTER_LIST_PERMISSION,
  REVENUE_CENTER_URL,
  getRevenueCenterDetailUrl,
  getRevenueCenterEditUrl,
  revenueCenterColumns,
  revenueCenterQueryKeys,
  revenueCenterService,
  useActivateRevenueCenterMutation,
  useDeactivateRevenueCenterMutation,
  useDeleteRevenueCenterMutation,
  type RevenueCenterResponse,
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

export function RevenueCenterPage() {
  const navigate = useNavigate();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [revenueCenterToDelete, setRevenueCenterToDelete] = useState<
    RevenueCenterResponse | undefined
  >();

  const [statusTarget, setStatusTarget] = useState<
    RevenueCenterResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteRevenueCenterMutation = useDeleteRevenueCenterMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: revenueCenterQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setRevenueCenterToDelete(undefined);
    },
  });

  const clearStatusTarget = () => {
    queryClient.invalidateQueries({
      queryKey: revenueCenterQueryKeys.lists(),
    });
    setStatusTarget(undefined);
  };

  const activateRevenueCenterMutation = useActivateRevenueCenterMutation({
    onSuccess: clearStatusTarget,
  });

  const deactivateRevenueCenterMutation = useDeactivateRevenueCenterMutation({
    onSuccess: clearStatusTarget,
  });

  const handleOpenCreate = () => {
    navigate(REVENUE_CENTER_CREATE_URL);
  };

  const handleOpenShow = (data: RevenueCenterResponse) => {
    navigate(getRevenueCenterDetailUrl(data.id));
  };

  const handleOpenEdit = (data: RevenueCenterResponse) => {
    navigate(getRevenueCenterEditUrl(data.id));
  };

  const handleConfirmDelete = () => {
    if (revenueCenterToDelete) {
      deleteRevenueCenterMutation.mutate(revenueCenterToDelete.id);
    }
  };

  const handleActivate = (data: RevenueCenterResponse) => {
    setStatusTarget(data);
  };

  const handleDeactivate = (data: RevenueCenterResponse) => {
    setStatusTarget(data);
  };

  const handleConfirmStatus = () => {
    if (!statusTarget) return;
    if (statusTarget.isActive) {
      deactivateRevenueCenterMutation.mutate(statusTarget.id);
      return;
    }
    activateRevenueCenterMutation.mutate(statusTarget.id);
  };

  const columns = revenueCenterColumns({
    onShow: handleOpenShow,
    onEdit: handleOpenEdit,
    onActivate: handleActivate,
    onDeactivate: handleDeactivate,
  });

  return (
    <Page
      type="base"
      title={REVENUE_CENTER_LIST_PAGE_TITLE}
      permission={REVENUE_CENTER_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: REVENUE_CENTER_LIST_PAGE_TITLE,
          url: REVENUE_CENTER_URL,
        },
      ]}
    >
      <PageHeader
        title="Revenue Center"
        withBackButton={false}
        actions={
          <ActionButton
            variant="add"
            label="Add Revenue Center"
            showLabel
            onClick={handleOpenCreate}
            permission={REVENUE_CENTER_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<RevenueCenterResponse>
        title="All Revenue Center"
        columns={columns}
        queryFn={revenueCenterService.listRevenueCenters}
        queryKey={revenueCenterQueryKeys.lists()}
        search={{
          key: "revenueCenterId",
          placeholder: "Search Revenue Center",
        }}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Revenue Center"
        description={`Are you sure you want to delete "${revenueCenterToDelete?.code}" (${revenueCenterToDelete?.id})? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteRevenueCenterMutation.isPending}
      />

      <StatusToggleModal
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(undefined);
        }}
        isActive={statusTarget?.isActive}
        onConfirm={handleConfirmStatus}
        isLoading={
          activateRevenueCenterMutation.isPending ||
          deactivateRevenueCenterMutation.isPending
        }
      />
    </Page>
  );
}

export default RevenueCenterPage;
