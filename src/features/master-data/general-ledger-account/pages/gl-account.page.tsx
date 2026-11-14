import {
  GL_ACCOUNT_CREATE_PERMISSION,
  GL_ACCOUNT_LIST_PAGE_TITLE,
  GL_ACCOUNT_LIST_PERMISSION,
  GL_ACCOUNT_URL,
  glAccountColumns,
  GLAccountFormModal,
  glAccountQueryKeys,
  glAccountService,
  useDeleteGLAccountMutation,
  type GeneralLedgerAccountResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function GLAccountPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedGLAccount, setSelectedGLAccount] = useState<
    GeneralLedgerAccountResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [glAccountToDelete, setGLAccountToDelete] = useState<
    GeneralLedgerAccountResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteGLAccountMutation = useDeleteGLAccountMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: glAccountQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setGLAccountToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedGLAccount(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: GeneralLedgerAccountResponse) => {
    setFormMode("edit");
    setSelectedGLAccount(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: GeneralLedgerAccountResponse) => {
    setGLAccountToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (glAccountToDelete) {
      deleteGLAccountMutation.mutate(glAccountToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: glAccountQueryKeys.lists(),
    });
  };

  const columns = glAccountColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={GL_ACCOUNT_LIST_PAGE_TITLE}
      permission={GL_ACCOUNT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: GL_ACCOUNT_LIST_PAGE_TITLE,
          url: GL_ACCOUNT_URL,
        },
      ]}
    >
      <PageHeader
        title="General Ledger Account"
        description="Manage GL account master data including company, business area, and GL code mappings"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={GL_ACCOUNT_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<GeneralLedgerAccountResponse>
        title="All GL Accounts"
        columns={columns}
        queryFn={glAccountService.listGLAccounts}
        queryKey={glAccountQueryKeys.lists()}
        search={{
          key: "companyCode",
          placeholder:
            "Search by company code, BA code, unit name, or GL codes",
        }}
      />

      <GLAccountFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedGLAccount}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete GL Account"
        description="Are you sure you want to delete this GL account? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={deleteGLAccountMutation.isPending}
        confirmVariant="destructive"
      />
    </Page>
  );
}

export default GLAccountPage;
