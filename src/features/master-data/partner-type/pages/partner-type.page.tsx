import {
  PARTNER_TYPE_CREATE_PERMISSION,
  PARTNER_TYPE_LIST_PAGE_TITLE,
  PARTNER_TYPE_LIST_PERMISSION,
  PARTNER_TYPE_URL,
  PartnerTypeFormModal,
  partnerTypeColumns,
  partnerTypeQueryKeys,
  partnerTypeService,
  useDeletePartnerTypeMutation,
  type PartnerTypeResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function PartnerTypePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPartnerType, setSelectedPartnerType] = useState<
    PartnerTypeResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [partnerTypeToDelete, setPartnerTypeToDelete] = useState<
    PartnerTypeResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deletePartnerTypeMutation = useDeletePartnerTypeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnerTypeQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setPartnerTypeToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedPartnerType(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: PartnerTypeResponse) => {
    setFormMode("edit");
    setSelectedPartnerType(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: PartnerTypeResponse) => {
    setPartnerTypeToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partnerTypeToDelete) {
      deletePartnerTypeMutation.mutate(partnerTypeToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: partnerTypeQueryKeys.lists(),
    });
  };

  const columns = partnerTypeColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={PARTNER_TYPE_LIST_PAGE_TITLE}
      permission={PARTNER_TYPE_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: PARTNER_TYPE_LIST_PAGE_TITLE,
          url: PARTNER_TYPE_URL,
        },
      ]}
    >
      <PageHeader
        title={PARTNER_TYPE_LIST_PAGE_TITLE}
        description="Manage partner types including codes, names, and legality associations"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={PARTNER_TYPE_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<PartnerTypeResponse>
        title="All Partner Types"
        columns={columns}
        queryFn={partnerTypeService.listPartnerTypes}
        queryKey={partnerTypeQueryKeys.lists()}
        toolbar={{
          enableColumnToggle: true,
        }}
        search={{
          key: "search",
          placeholder: "Search by name or code",
        }}
      />

      <PartnerTypeFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedPartnerType}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Partner Type"
        description={`Are you sure you want to delete "${partnerTypeToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deletePartnerTypeMutation.isPending}
      />
    </Page>
  );
}

export default PartnerTypePage;
