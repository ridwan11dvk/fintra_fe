import type { CompanyTaxResponse } from "@/features/master-data";
import {
  COMPANY_TAX_CREATE_PERMISSION,
  COMPANY_TAX_LIST_PAGE_TITLE,
  COMPANY_TAX_LIST_PERMISSION,
  COMPANY_TAX_URL,
  CompanyTaxFormModal,
  companyTaxColumns,
  companyTaxQueryKeys,
  companyTaxService,
  useDeleteCompanyTaxMutation,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CompanyTaxPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCompanyTax, setSelectedCompanyTax] = useState<
    CompanyTaxResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [companyTaxToDelete, setCompanyTaxToDelete] = useState<
    CompanyTaxResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteMutation = useDeleteCompanyTaxMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyTaxQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setCompanyTaxToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedCompanyTax(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: CompanyTaxResponse) => {
    setFormMode("edit");
    setSelectedCompanyTax(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: CompanyTaxResponse) => {
    setCompanyTaxToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (companyTaxToDelete) {
      deleteMutation.mutate(companyTaxToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: companyTaxQueryKeys.lists(),
    });
  };

  const columns = companyTaxColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={COMPANY_TAX_LIST_PAGE_TITLE}
      permission={COMPANY_TAX_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: COMPANY_TAX_LIST_PAGE_TITLE, url: COMPANY_TAX_URL },
      ]}
    >
      <PageHeader
        title="Tax Assignment Management"
        description="Manage company tax rate assignments including GL account mappings and effective date ranges"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={COMPANY_TAX_CREATE_PERMISSION}
          />
        }
      />

      <DataTable<CompanyTaxResponse>
        title="All Company Tax Assignments"
        columns={columns}
        queryFn={companyTaxService.listCompanyTaxes}
        queryKey={companyTaxQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by company code, GL account, or tax rate",
        }}
      />

      <CompanyTaxFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedCompanyTax}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Company Tax Assignment"
        description={`Are you sure you want to delete this company tax assignment for "${companyTaxToDelete?.companyCode}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </Page>
  );
}

export default CompanyTaxPage;
