import {
  BANK_CREATE_PERMISSION,
  BANK_EXPORT_PERMISSION,
  BANK_IMPORT_PERMISSION,
  BANK_LIST_PAGE_TITLE,
  BANK_LIST_PERMISSION,
  BANK_URL,
  BankFormModal,
  bankColumns,
  bankQueryKeys,
  bankService,
  useDeleteBankMutation,
  useImportBanksMutation,
  type BankResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal, ImportModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { toast } from "@railfinance/core/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function BankPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedBank, setSelectedBank] = useState<BankResponse | undefined>();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<BankResponse | undefined>();

  const queryClient = useQueryClient();

  const deleteBankMutation = useDeleteBankMutation({
    onSuccess: () => {
      setIsDeleteConfirmOpen(false);
      setBankToDelete(undefined);
    },
  });

  const importBanksMutation = useImportBanksMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bankQueryKeys.lists(),
      });
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedBank(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: BankResponse) => {
    setFormMode("edit");
    setSelectedBank(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: BankResponse) => {
    setBankToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bankToDelete) {
      deleteBankMutation.mutate(bankToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: bankQueryKeys.lists(),
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await bankService.exportBanks();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `banks_export_${new Date().toISOString().split("T")[0]}.xlsx`;
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

  const columns = bankColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={BANK_LIST_PAGE_TITLE}
      permission={BANK_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: BANK_LIST_PAGE_TITLE,
          url: BANK_URL,
        },
      ]}
    >
      <PageHeader
        title={BANK_LIST_PAGE_TITLE}
        description="Manage bank master data including payment system codes (RTGS, BIFAST, SKN, Online)"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="export"
              label="Export"
              showLabel
              onClick={handleExport}
              disabled={isExporting}
              permission={BANK_EXPORT_PERMISSION}
            />
            <ActionButton
              variant="upload"
              label="Import"
              showLabel
              onClick={() => setIsImportOpen(true)}
              permission={BANK_IMPORT_PERMISSION}
            />
            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={BANK_CREATE_PERMISSION}
            />
          </div>
        }
      />
      <DataTable<BankResponse>
        title="All Banks"
        columns={columns}
        queryFn={bankService.listBanks}
        queryKey={bankQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by bank name or code",
        }}
      />

      <BankFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedBank}
        onSuccess={handleFormSuccess}
      />

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        mutation={importBanksMutation}
        downloadTemplate={() => bankService.downloadImportTemplate()}
        templateFileName="bank_import_template.xlsx"
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Bank"
        description={`Are you sure you want to delete "${bankToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteBankMutation.isPending}
      />
    </Page>
  );
}

export default BankPage;
