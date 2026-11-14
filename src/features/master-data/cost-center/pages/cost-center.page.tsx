import {
  COST_CENTER_CREATE_PERMISSION,
  COST_CENTER_LIST_PAGE_TITLE,
  COST_CENTER_LIST_PERMISSION,
  COST_CENTER_URL,
  CostCenterFormModal,
  costCenterColumns,
  costCenterQueryKeys,
  costCenterService,
  useDeleteCostCenterMutation,
  type CostCenterResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CostCenterPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCostCenter, setSelectedCostCenter] = useState<
    CostCenterResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [costCenterToDelete, setCostCenterToDelete] = useState<
    CostCenterResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteCostCenterMutation = useDeleteCostCenterMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: costCenterQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setCostCenterToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedCostCenter(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: CostCenterResponse) => {
    setFormMode("edit");
    setSelectedCostCenter(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: CostCenterResponse) => {
    setCostCenterToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (costCenterToDelete) {
      deleteCostCenterMutation.mutate(costCenterToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: costCenterQueryKeys.lists(),
    });
  };

  const columns = costCenterColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={COST_CENTER_LIST_PAGE_TITLE}
      permission={COST_CENTER_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: COST_CENTER_LIST_PAGE_TITLE,
          url: COST_CENTER_URL,
        },
      ]}
    >
      <PageHeader
        title="Cost Center"
        description="Manage cost center master data for organizational structure and financial tracking"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={COST_CENTER_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<CostCenterResponse>
        title="All Cost Centers"
        columns={columns}
        queryFn={costCenterService.listCostCenters}
        queryKey={costCenterQueryKeys.lists()}
        search={{
          key: "costCenterCode",
          placeholder:
            "Search by cost center code, name, company code, or BA code",
        }}
      />

      <CostCenterFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedCostCenter}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Cost Center"
        description={`Are you sure you want to delete "${costCenterToDelete?.costCenterName}" (${costCenterToDelete?.costCenterCode})? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteCostCenterMutation.isPending}
      />
    </Page>
  );
}

export default CostCenterPage;
