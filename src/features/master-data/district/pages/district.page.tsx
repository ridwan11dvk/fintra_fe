import {
  DISTRICT_CREATE_PERMISSION,
  DISTRICT_LIST_PAGE_TITLE,
  DISTRICT_LIST_PERMISSION,
  DISTRICT_URL,
  DistrictFormModal,
  districtColumns,
  districtQueryKeys,
  districtService,
  useDeleteDistrictMutation,
  type DistrictResponse,
} from "@/features/master-data/district";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function DistrictPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDistrict, setSelectedDistrict] = useState<
    DistrictResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState<
    DistrictResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteDistrictMutation = useDeleteDistrictMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: districtQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setDistrictToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedDistrict(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: DistrictResponse) => {
    setFormMode("edit");
    setSelectedDistrict(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: DistrictResponse) => {
    setDistrictToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (districtToDelete) {
      deleteDistrictMutation.mutate(districtToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: districtQueryKeys.lists(),
    });
  };

  const columns = districtColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={DISTRICT_LIST_PAGE_TITLE}
      permission={DISTRICT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: DISTRICT_LIST_PAGE_TITLE,
          url: DISTRICT_URL,
        },
      ]}
    >
      <PageHeader
        title="District"
        description="Manage district master data including district codes, names, and regency associations"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={DISTRICT_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<DistrictResponse>
        title="All Districts"
        columns={columns}
        queryFn={districtService.listDistricts}
        queryKey={districtQueryKeys.lists()}
      />

      <DistrictFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedDistrict}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete District"
        description={`Are you sure you want to delete the district "${districtToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        isLoading={deleteDistrictMutation.isPending}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </Page>
  );
}
