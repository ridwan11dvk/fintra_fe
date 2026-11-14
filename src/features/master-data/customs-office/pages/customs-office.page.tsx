import {
  CUSTOMS_OFFICE_CREATE_PERMISSION,
  CUSTOMS_OFFICE_LIST_PAGE_TITLE,
  CUSTOMS_OFFICE_LIST_PERMISSION,
  CUSTOMS_OFFICE_URL,
  CustomsOfficeFormModal,
  customsOfficeColumns,
  customsOfficeQueryKeys,
  customsOfficeService,
  useDeleteCustomsOfficeMutation,
  type CustomsOfficeResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CustomsOfficePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCustomsOffice, setSelectedCustomsOffice] = useState<
    CustomsOfficeResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [customsOfficeToDelete, setCustomsOfficeToDelete] = useState<
    CustomsOfficeResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteCustomsOfficeMutation = useDeleteCustomsOfficeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customsOfficeQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setCustomsOfficeToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedCustomsOffice(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: CustomsOfficeResponse) => {
    setFormMode("edit");
    setSelectedCustomsOffice(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: CustomsOfficeResponse) => {
    setCustomsOfficeToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customsOfficeToDelete) {
      deleteCustomsOfficeMutation.mutate(customsOfficeToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: customsOfficeQueryKeys.lists(),
    });
  };

  const columns = customsOfficeColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={CUSTOMS_OFFICE_LIST_PAGE_TITLE}
      permission={CUSTOMS_OFFICE_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: CUSTOMS_OFFICE_LIST_PAGE_TITLE,
          url: CUSTOMS_OFFICE_URL,
        },
      ]}
    >
      <PageHeader
        title="Customs Office"
        description="Manage customs office master data for Indonesian Customs Authority offices"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={CUSTOMS_OFFICE_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<CustomsOfficeResponse>
        title="All Customs Offices"
        columns={columns}
        queryFn={customsOfficeService.listCustomsOffices}
        queryKey={customsOfficeQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by code or name",
        }}
      />

      <CustomsOfficeFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedCustomsOffice}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Customs Office"
        description={`Are you sure you want to delete "${customsOfficeToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteCustomsOfficeMutation.isPending}
      />
    </Page>
  );
}

export default CustomsOfficePage;
