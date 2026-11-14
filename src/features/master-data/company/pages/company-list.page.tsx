import type { CompanyResponse } from "@/features/master-data";
import {
  COMPANY_CREATE_PERMISSION,
  COMPANY_LIST_PERMISSION,
  COMPANY_URL,
  companyColumns,
  companyCreateUrl,
  companyDetailUrl,
  companyEditUrl,
  companyQueryKeys,
  companyService,
  useDeleteCompanyMutation,
  useImportCompaniesMutation,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal, ImportModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { toast } from "@railfinance/core/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

export function CompanyListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<
    CompanyResponse | undefined
  >();

  const deleteCompanyMutation = useDeleteCompanyMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setCompanyToDelete(undefined);
    },
  });

  const importCompaniesMutation = useImportCompaniesMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyQueryKeys.lists(),
      });
    },
  });

  const handleOpenCreate = () => {
    navigate(companyCreateUrl());
  };

  const handleView = (company: CompanyResponse) => {
    navigate(companyDetailUrl(company.id));
  };

  const handleEdit = (company: CompanyResponse) => {
    navigate(companyEditUrl(company.id));
  };

  const handleDelete = (company: CompanyResponse) => {
    setCompanyToDelete(company);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      deleteCompanyMutation.mutate(companyToDelete.id);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await companyService.exportCompanies();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `companies_export_${new Date().toISOString().split("T")[0]}.xlsx`;
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

  const columns = companyColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title="Companies"
      permission={COMPANY_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: "Companies",
          url: COMPANY_URL,
        },
      ]}
    >
      <PageHeader
        title="Companies"
        description="Manage company master data with logo, documents, and attachments"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="export"
              label="Export"
              showLabel
              onClick={handleExport}
              disabled={isExporting}
              permission="master-data:company:export"
            />
            <ActionButton
              variant="upload"
              label="Import"
              showLabel
              onClick={() => setIsImportOpen(true)}
              permission="master-data:company:import"
            />
            <ActionButton
              variant="add"
              showLabel
              onClick={handleOpenCreate}
              permission={COMPANY_CREATE_PERMISSION}
            />
          </div>
        }
      />

      <DataTable<CompanyResponse>
        title="All Companies"
        columns={columns}
        queryKey={companyQueryKeys.lists()}
        queryFn={companyService.listCompanies}
        search={{
          key: "search",
          placeholder: "Search ",
        }}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Company"
        confirmText="Delete"
        confirmVariant="destructive"
        description={`Are you sure you want to delete "${companyToDelete?.name}"? This action cannot be undone.`}
        isLoading={deleteCompanyMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setCompanyToDelete(undefined);
        }}
      />

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        mutation={importCompaniesMutation}
        downloadTemplate={() => companyService.downloadImportTemplate()}
        templateFileName="company_import_template.xlsx"
      />
    </Page>
  );
}
