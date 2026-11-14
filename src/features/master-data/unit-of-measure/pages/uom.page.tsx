import {
  UOM_CREATE_PERMISSION,
  UOM_EXPORT_PERMISSION,
  UOM_IMPORT_PERMISSION,
  UOM_LIST_PAGE_TITLE,
  UOM_LIST_PERMISSION,
  UOM_URL,
  UomFormModal,
  uomColumns,
  uomQueryKeys,
  uomService,
  useDeleteUomMutation,
  useExportUomsMutation,
  useImportUomsMutation,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal, ImportModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { type UomResponse } from "@railfinance/core/masterdata";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function UomPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUom, setSelectedUom] = useState<UomResponse | undefined>();

  const [isImportOpen, setIsImportOpen] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [uomToDelete, setUomToDelete] = useState<UomResponse | undefined>();

  const queryClient = useQueryClient();

  const deleteUomMutation = useDeleteUomMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: uomQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setUomToDelete(undefined);
    },
  });

  const importUomsMutation = useImportUomsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: uomQueryKeys.lists(),
      });
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedUom(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: UomResponse) => {
    setFormMode("edit");
    setSelectedUom(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: UomResponse) => {
    setUomToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (uomToDelete) {
      deleteUomMutation.mutate(uomToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: uomQueryKeys.lists(),
    });
  };

  const { mutate: handleExport, isPending: isExporting } =
    useExportUomsMutation();

  const columns = uomColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={UOM_LIST_PAGE_TITLE}
      permission={UOM_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: UOM_LIST_PAGE_TITLE,
          url: UOM_URL,
        },
      ]}
    >
      <PageHeader
        title={UOM_LIST_PAGE_TITLE}
        description="Manage Unit of Measure used for measuring quantities in transactions and master data"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="export"
              label="Export"
              showLabel
              onClick={() => handleExport()}
              disabled={isExporting}
              permission={UOM_EXPORT_PERMISSION}
            />
            <ActionButton
              variant="upload"
              label="Import"
              showLabel
              onClick={() => setIsImportOpen(true)}
              permission={UOM_IMPORT_PERMISSION}
            />
            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={UOM_CREATE_PERMISSION}
            />
          </div>
        }
      />
      <DataTable<UomResponse>
        title="All Units of Measure"
        columns={columns}
        queryFn={uomService.listUoms}
        queryKey={uomQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by name or code",
        }}
      />

      <UomFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedUom}
        onSuccess={handleFormSuccess}
      />

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        mutation={importUomsMutation}
        downloadTemplate={() => uomService.downloadImportTemplate()}
        templateFileName="uom_import_template.xlsx"
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Unit of Measure"
        description={`Are you sure you want to delete "${uomToDelete?.unit}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteUomMutation.isPending}
      />
    </Page>
  );
}

export default UomPage;
