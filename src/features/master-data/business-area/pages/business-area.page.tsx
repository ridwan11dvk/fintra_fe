import {
  BUSINESS_AREA_CREATE_PERMISSION,
  BUSINESS_AREA_EXPORT_PERMISSION,
  BUSINESS_AREA_IMPORT_PERMISSION,
  BUSINESS_AREA_LIST_PAGE_TITLE,
  BUSINESS_AREA_LIST_PERMISSION,
  BUSINESS_AREA_URL,
  businessAreaColumns,
  BusinessAreaFormModal,
  businessAreaQueryKeys,
  businessAreaService,
  useDeleteBusinessAreaMutation,
  useImportBusinessAreasMutation,
  type BusinessAreaResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal, ImportModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { toast } from "@railfinance/core/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function BusinessAreaPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedBusinessArea, setSelectedBusinessArea] = useState<
    BusinessAreaResponse | undefined
  >();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [businessAreaToDelete, setBusinessAreaToDelete] = useState<
    BusinessAreaResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteBusinessAreaMutation = useDeleteBusinessAreaMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: businessAreaQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setBusinessAreaToDelete(undefined);
    },
  });

  const importBusinessAreasMutation = useImportBusinessAreasMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: businessAreaQueryKeys.lists(),
      });
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedBusinessArea(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: BusinessAreaResponse) => {
    setFormMode("edit");
    setSelectedBusinessArea(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: BusinessAreaResponse) => {
    setBusinessAreaToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (businessAreaToDelete) {
      deleteBusinessAreaMutation.mutate(businessAreaToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: businessAreaQueryKeys.lists(),
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await businessAreaService.exportBusinessAreas();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `business_areas_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const columns = businessAreaColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={BUSINESS_AREA_LIST_PAGE_TITLE}
      permission={BUSINESS_AREA_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: BUSINESS_AREA_LIST_PAGE_TITLE,
          url: BUSINESS_AREA_URL,
        },
      ]}
    >
      <PageHeader
        title="Business Area"
        description="Manage business area master data including company codes, tax identification, and API credentials"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="export"
              label="Export"
              showLabel
              onClick={handleExport}
              disabled={isExporting}
              permission={BUSINESS_AREA_EXPORT_PERMISSION}
            />
            <ActionButton
              variant="upload"
              label="Import"
              showLabel
              onClick={() => setIsImportOpen(true)}
              permission={BUSINESS_AREA_IMPORT_PERMISSION}
            />
            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={BUSINESS_AREA_CREATE_PERMISSION}
            />
          </div>
        }
      />

      <DataTable<BusinessAreaResponse>
        title="All Business Areas"
        columns={columns}
        queryFn={businessAreaService.listBusinessAreas}
        queryKey={businessAreaQueryKeys.lists()}
        search={{
          key: "search",
          placeholder:
            "Search by name, code, company code, email, or client ID",
        }}
      />

      <BusinessAreaFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedBusinessArea}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Business Area"
        description={`Are you sure you want to delete "${businessAreaToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteBusinessAreaMutation.isPending}
      />

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        mutation={importBusinessAreasMutation}
        downloadTemplate={() => businessAreaService.downloadImportTemplate()}
        templateFileName="business_area_import_template.xlsx"
      />
    </Page>
  );
}

export default BusinessAreaPage;
