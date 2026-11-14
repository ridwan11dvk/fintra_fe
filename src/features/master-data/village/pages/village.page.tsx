import {
  VILLAGE_CREATE_PERMISSION,
  VILLAGE_LIST_PAGE_TITLE,
  VILLAGE_LIST_PERMISSION,
  VILLAGE_URL,
  VillageFormModal,
  useDeleteVillageMutation,
  villageColumns,
  villageQueryKeys,
  villageService,
  type VillageResponse,
} from "@/features/master-data/village";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function VillagePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedVillage, setSelectedVillage] = useState<
    VillageResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [villageToDelete, setVillageToDelete] = useState<
    VillageResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteVillageMutation = useDeleteVillageMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: villageQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setVillageToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedVillage(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: VillageResponse) => {
    setFormMode("edit");
    setSelectedVillage(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: VillageResponse) => {
    setVillageToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (villageToDelete) {
      deleteVillageMutation.mutate(villageToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: villageQueryKeys.lists(),
    });
  };

  const columns = villageColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={VILLAGE_LIST_PAGE_TITLE}
      permission={VILLAGE_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: VILLAGE_LIST_PAGE_TITLE,
          url: VILLAGE_URL,
        },
      ]}
    >
      <PageHeader
        title={VILLAGE_LIST_PAGE_TITLE}
        description="Manage village master data including village codes, names, postal codes, and district associations"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={VILLAGE_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<VillageResponse>
        title="All Villages"
        columns={columns}
        queryFn={villageService.listVillages}
        queryKey={villageQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by name, code, or postal code",
        }}
      />

      <VillageFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedVillage}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Village"
        description={`Are you sure you want to delete "${villageToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteVillageMutation.isPending}
      />
    </Page>
  );
}

export default VillagePage;
