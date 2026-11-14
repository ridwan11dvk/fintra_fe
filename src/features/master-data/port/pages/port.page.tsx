import {
  PORT_CREATE_PERMISSION,
  PORT_EXPORT_PERMISSION,
  PORT_IMPORT_PERMISSION,
  PORT_LIST_PAGE_TITLE,
  PORT_LIST_PERMISSION,
  PORT_URL,
  PortFormModal,
  portColumns,
  portQueryKeys,
  portService,
  useDeletePortMutation,
  useExportPortsMutation,
  useImportPortsMutation,
  type PortResponse,
} from "@/features/master-data/port";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal, ImportModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function PortPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPort, setSelectedPort] = useState<PortResponse | undefined>();

  const [isImportOpen, setIsImportOpen] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [portToDelete, setPortToDelete] = useState<PortResponse | undefined>();

  const queryClient = useQueryClient();

  const deletePortMutation = useDeletePortMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: portQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setPortToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedPort(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: PortResponse) => {
    setFormMode("edit");
    setSelectedPort(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: PortResponse) => {
    setPortToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (portToDelete) {
      deletePortMutation.mutate(portToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: portQueryKeys.lists(),
    });
  };

  const importPortsMutation = useImportPortsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: portQueryKeys.lists(),
      });
    },
  });

  const { mutate: handleExport, isPending: isExporting } =
    useExportPortsMutation();

  const columns = portColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={PORT_LIST_PAGE_TITLE}
      permission={PORT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: PORT_LIST_PAGE_TITLE,
          url: PORT_URL,
        },
      ]}
    >
      <PageHeader
        title={PORT_LIST_PAGE_TITLE}
        description="Manage port master data including port codes, names, and customs office assignments for import/export operations"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="export"
              label="Export"
              showLabel
              onClick={() => handleExport()}
              disabled={isExporting}
              permission={PORT_EXPORT_PERMISSION}
            />
            <ActionButton
              variant="upload"
              label="Import"
              showLabel
              onClick={() => setIsImportOpen(true)}
              permission={PORT_IMPORT_PERMISSION}
            />
            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={PORT_CREATE_PERMISSION}
            />
          </div>
        }
      />
      <DataTable<PortResponse>
        title="All Ports"
        columns={columns}
        queryFn={portService.listPorts}
        queryKey={portQueryKeys.lists()}
        search={{
          key: "code",
          placeholder: "Search by port code or name",
        }}
      />

      <PortFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedPort}
        onSuccess={handleFormSuccess}
      />

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        mutation={importPortsMutation}
        downloadTemplate={() => portService.downloadImportTemplate()}
        templateFileName="port_import_template.xlsx"
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Port"
        description={`Are you sure you want to delete "${portToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deletePortMutation.isPending}
      />
    </Page>
  );
}

export default PortPage;
