import {
  WORK_CATALOG_CREATE_PERMISSION,
  WORK_CATALOG_CREATE_URL,
  WORK_CATALOG_LIST_PAGE_TITLE,
  WORK_CATALOG_LIST_PERMISSION,
  WORK_CATALOG_URL,
  getWorkCatalogDetailUrl,
  getWorkCatalogEditUrl,
  workCatalogColumns,
  workCatalogQueryKeys,
  workCatalogService,
  useActivateWorkCatalogMutation,
  useDeactivateWorkCatalogMutation,
  useDeleteWorkCatalogMutation,
  type WorkCatalogResponse,
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

export function WorkCatalogPage() {
  const navigate = useNavigate();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [workCatalogToDelete, setWorkCatalogToDelete] = useState<
    WorkCatalogResponse | undefined
  >();

  const [statusTarget, setStatusTarget] = useState<
    WorkCatalogResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteWorkCatalogMutation = useDeleteWorkCatalogMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workCatalogQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setWorkCatalogToDelete(undefined);
    },
  });

  const clearStatusTarget = () => {
    queryClient.invalidateQueries({
      queryKey: workCatalogQueryKeys.lists(),
    });
    setStatusTarget(undefined);
  };

  const activateWorkCatalogMutation = useActivateWorkCatalogMutation({
    onSuccess: clearStatusTarget,
  });

  const deactivateWorkCatalogMutation = useDeactivateWorkCatalogMutation({
    onSuccess: clearStatusTarget,
  });

  const handleOpenCreate = () => {
    navigate(WORK_CATALOG_CREATE_URL);
  };

  const handleOpenShow = (data: WorkCatalogResponse) => {
    navigate(getWorkCatalogDetailUrl(data.id));
  };

  const handleOpenEdit = (data: WorkCatalogResponse) => {
    navigate(getWorkCatalogEditUrl(data.id));
  };

  const handleConfirmDelete = () => {
    if (workCatalogToDelete) {
      deleteWorkCatalogMutation.mutate(workCatalogToDelete.id);
    }
  };

  const handleActivate = (data: WorkCatalogResponse) => {
    setStatusTarget(data);
  };

  const handleDeactivate = (data: WorkCatalogResponse) => {
    setStatusTarget(data);
  };

  const handleConfirmStatus = () => {
    if (!statusTarget) return;
    if (statusTarget.isActive) {
      deactivateWorkCatalogMutation.mutate(statusTarget.id);
      return;
    }
    activateWorkCatalogMutation.mutate(statusTarget.id);
  };

  const columns = workCatalogColumns({
    onShow: handleOpenShow,
    onEdit: handleOpenEdit,
    onActivate: handleActivate,
    onDeactivate: handleDeactivate,
  });

  return (
    <Page
      type="base"
      title={WORK_CATALOG_LIST_PAGE_TITLE}
      permission={WORK_CATALOG_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: WORK_CATALOG_LIST_PAGE_TITLE,
          url: WORK_CATALOG_URL,
        },
      ]}
    >
      <PageHeader
        title="Work Catalog"
        withBackButton={false}
        actions={
          <ActionButton
            variant="add"
            label="Add Work Catalog"
            showLabel
            onClick={handleOpenCreate}
            permission={WORK_CATALOG_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<WorkCatalogResponse>
        title="All Work Catalog"
        columns={columns}
        queryFn={workCatalogService.listWorkCatalogs}
        queryKey={workCatalogQueryKeys.lists()}
        search={{
          key: "workCatalogId",
          placeholder: "Search Work Catalog",
        }}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Work Catalog"
        description={`Are you sure you want to delete "${workCatalogToDelete?.workType}" (${workCatalogToDelete?.id})? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteWorkCatalogMutation.isPending}
      />

      <StatusToggleModal
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(undefined);
        }}
        isActive={statusTarget?.isActive}
        onConfirm={handleConfirmStatus}
        isLoading={
          activateWorkCatalogMutation.isPending ||
          deactivateWorkCatalogMutation.isPending
        }
        onCancel={clearStatusTarget}
      />
    </Page>
  );
}

export default WorkCatalogPage;
