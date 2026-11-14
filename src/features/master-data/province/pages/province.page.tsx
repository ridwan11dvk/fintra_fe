import {
  PROVINCE_CREATE_PERMISSION,
  PROVINCE_LIST_PAGE_TITLE,
  PROVINCE_LIST_PERMISSION,
  PROVINCE_URL,
  ProvinceFormModal,
  provinceColumns,
  provinceQueryKeys,
  provinceService,
  useDeleteProvinceMutation,
  type ProvinceResponse,
} from "@/features/master-data/province";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function ProvincePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedProvince, setSelectedProvince] = useState<
    ProvinceResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [provinceToDelete, setProvinceToDelete] = useState<
    ProvinceResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteProvinceMutation = useDeleteProvinceMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: provinceQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setProvinceToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedProvince(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: ProvinceResponse) => {
    setFormMode("edit");
    setSelectedProvince(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: ProvinceResponse) => {
    setProvinceToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (provinceToDelete) {
      deleteProvinceMutation.mutate(provinceToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: provinceQueryKeys.lists(),
    });
  };

  const columns = provinceColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={PROVINCE_LIST_PAGE_TITLE}
      permission={PROVINCE_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: PROVINCE_LIST_PAGE_TITLE,
          url: PROVINCE_URL,
        },
      ]}
    >
      <PageHeader
        title={PROVINCE_LIST_PAGE_TITLE}
        description="Manage province master data for geographic organization"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={PROVINCE_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<ProvinceResponse>
        title="All Provinces"
        columns={columns}
        queryFn={provinceService.listProvinces}
        queryKey={provinceQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by code, name, or alias",
        }}
      />

      <ProvinceFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedProvince}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Province"
        description={`Are you sure you want to delete "${provinceToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteProvinceMutation.isPending}
      />
    </Page>
  );
}

export default ProvincePage;
