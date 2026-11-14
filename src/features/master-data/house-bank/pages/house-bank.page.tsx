import {
  HOUSE_BANK_CREATE_PERMISSION,
  HOUSE_BANK_EXPORT_PERMISSION,
  HOUSE_BANK_IMPORT_PERMISSION,
  HOUSE_BANK_LIST_PAGE_TITLE,
  HOUSE_BANK_LIST_PERMISSION,
  HOUSE_BANK_URL,
  HouseBankFormModal,
  houseBankColumns,
  houseBankQueryKeys,
  houseBankService,
  useDeleteHouseBankMutation,
  useImportHouseBanksMutation,
  type HouseBankResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal, ImportModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { toast } from "@railfinance/core/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function HouseBankPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedHouseBank, setSelectedHouseBank] = useState<
    HouseBankResponse | undefined
  >();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [houseBankToDelete, setHouseBankToDelete] = useState<
    HouseBankResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteHouseBankMutation = useDeleteHouseBankMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: houseBankQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setHouseBankToDelete(undefined);
    },
  });

  const importHouseBanksMutation = useImportHouseBanksMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: houseBankQueryKeys.lists(),
      });
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedHouseBank(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: HouseBankResponse) => {
    setFormMode("edit");
    setSelectedHouseBank(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: HouseBankResponse) => {
    setHouseBankToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (houseBankToDelete) {
      deleteHouseBankMutation.mutate(houseBankToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: houseBankQueryKeys.lists(),
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await houseBankService.exportHouseBanks();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `house_banks_export_${new Date().toISOString().split("T")[0]}.xlsx`;
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

  const columns = houseBankColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={HOUSE_BANK_LIST_PAGE_TITLE}
      permission={HOUSE_BANK_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: HOUSE_BANK_LIST_PAGE_TITLE,
          url: HOUSE_BANK_URL,
        },
      ]}
    >
      <PageHeader
        title="House Bank"
        description="Manage organization-owned bank accounts used for transactions and payment processing"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="export"
              label="Export"
              showLabel
              onClick={handleExport}
              disabled={isExporting}
              permission={HOUSE_BANK_EXPORT_PERMISSION}
            />
            <ActionButton
              variant="upload"
              label="Import"
              showLabel
              onClick={() => setIsImportOpen(true)}
              permission={HOUSE_BANK_IMPORT_PERMISSION}
            />
            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={HOUSE_BANK_CREATE_PERMISSION}
            />
          </div>
        }
      />
      <DataTable<HouseBankResponse>
        title="All House Banks"
        columns={columns}
        queryFn={houseBankService.listHouseBanks}
        queryKey={houseBankQueryKeys.lists()}
        search={{
          key: "accountName",
          placeholder:
            "Search by account name, account ID, account number, or ERP code",
        }}
      />

      <HouseBankFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedHouseBank}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete House Bank"
        description={`Are you sure you want to delete "${houseBankToDelete?.accountName}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteHouseBankMutation.isPending}
      />

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        mutation={importHouseBanksMutation}
        downloadTemplate={() => houseBankService.downloadImportTemplate()}
        templateFileName="house_bank_import_template.xlsx"
      />
    </Page>
  );
}

export default HouseBankPage;
