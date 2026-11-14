import {
  REGENCY_CREATE_PERMISSION,
  REGENCY_LIST_PAGE_TITLE,
  REGENCY_LIST_PERMISSION,
  REGENCY_URL,
  RegencyFormModal,
  regencyColumns,
  regencyQueryKeys,
  regencyService,
  useDeleteRegencyMutation,
  type RegencyResponse,
} from "@/features/master-data/regency";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function RegencyPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedRegency, setSelectedRegency] = useState<
    RegencyResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [regencyToDelete, setRegencyToDelete] = useState<
    RegencyResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteRegencyMutation = useDeleteRegencyMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regencyQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setRegencyToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedRegency(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: RegencyResponse) => {
    setFormMode("edit");
    setSelectedRegency(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: RegencyResponse) => {
    setRegencyToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (regencyToDelete) {
      deleteRegencyMutation.mutate(regencyToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: regencyQueryKeys.lists(),
    });
  };

  const columns = regencyColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={REGENCY_LIST_PAGE_TITLE}
      permission={REGENCY_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: REGENCY_LIST_PAGE_TITLE,
          url: REGENCY_URL,
        },
      ]}
    >
      <PageHeader
        title={REGENCY_LIST_PAGE_TITLE}
        description="Manage regency master data including regency codes, names, and province associations"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={REGENCY_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<RegencyResponse>
        title="All Regencies"
        columns={columns}
        queryFn={regencyService.listRegencies}
        queryKey={regencyQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by name or code",
        }}
      />

      <RegencyFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedRegency}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Regency"
        description={`Are you sure you want to delete "${regencyToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteRegencyMutation.isPending}
      />
    </Page>
  );
}

export default RegencyPage;
