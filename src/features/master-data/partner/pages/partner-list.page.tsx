import type { Partner } from "@/features/master-data";
import {
  PARTNER_CREATE_PERMISSION,
  PARTNER_LIST_PAGE_TITLE,
  PARTNER_LIST_PERMISSION,
  PARTNER_URL,
  partnerColumns,
  partnerCreateUrl,
  partnerDetailUrl,
  partnerEditUrl,
  partnerQueryKeys,
  partnerService,
  useDeletePartnerMutation,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

export function PartnerListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | undefined>();

  const deletePartnerMutation = useDeletePartnerMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setPartnerToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    navigate(partnerCreateUrl());
  };

  const handleView = (partner: Partner) => {
    navigate(partnerDetailUrl(partner.id));
  };

  const handleEdit = (partner: Partner) => {
    navigate(partnerEditUrl(partner.id));
  };

  const handleDelete = (partner: Partner) => {
    setPartnerToDelete(partner);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partnerToDelete?.id) {
      deletePartnerMutation.mutate(partnerToDelete.id);
    }
  };

  return (
    <Page
      type="base"
      title="Partners"
      permission={PARTNER_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: PARTNER_LIST_PAGE_TITLE,
          url: PARTNER_URL,
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Partners"
          description="Manage partner information including suppliers, customers, and other business entities"
          actions={
            <ActionButton
              variant="add"
              showLabel
              onClick={handleOpenCreate}
              permission={PARTNER_CREATE_PERMISSION}
            />
          }
        />

        <DataTable<Partner>
          title="All Partners"
          columns={partnerColumns({
            onView: handleView,
            onEdit: handleEdit,
            onDelete: handleDelete,
          })}
          queryKey={partnerQueryKeys.lists()}
          queryFn={partnerService.listPartners}
          search={{
            key: "search",
            placeholder: "Search..",
          }}
        />

        <ConfirmationModal
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
          title="Delete Partner"
          description={`Are you sure you want to delete partner "${partnerToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="destructive"
          isLoading={deletePartnerMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteConfirmOpen(false);
            setPartnerToDelete(undefined);
          }}
        />
      </div>
    </Page>
  );
}

export default PartnerListPage;
