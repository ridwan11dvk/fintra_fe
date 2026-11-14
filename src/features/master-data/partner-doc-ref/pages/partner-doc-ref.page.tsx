"use client";

import {
  PARTNER_DOC_REF_CREATE_PERMISSION,
  PARTNER_DOC_REF_LIST_PAGE_TITLE,
  PARTNER_DOC_REF_LIST_PERMISSION,
  PARTNER_DOC_REF_URL,
  partnerDocRefColumns,
  PartnerDocRefFormModal,
  partnerDocRefQueryKeys,
  partnerDocRefService,
  useDeletePartnerDocRefMutation,
  type PartnerDocRefResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export function PartnerDocRefListPage() {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerDocRefResponse | null;
  }>({ open: false, mode: "create", data: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: PartnerDocRefResponse | null;
  }>({ open: false, data: null });

  const queryClient = useQueryClient();

  const deleteDocRefMutation = useDeletePartnerDocRefMutation({
    onSuccess: () => {
      setDeleteModal({ open: false, data: null });
      queryClient.invalidateQueries({
        queryKey: partnerDocRefQueryKeys.lists(),
      });
    },
  });

  const handleOpenDeleteModal = (docRef: PartnerDocRefResponse) => {
    setDeleteModal({ open: true, data: docRef });
  };

  const handleToggleDeleteModal = (value: boolean) => {
    setDeleteModal((prev) => ({ ...prev, open: value }));
  };

  const handleConfirmDelete = () => {
    if (deleteModal.data) {
      deleteDocRefMutation.mutate(deleteModal.data.id);
    }
  };

  const handleCloseFormModal = () => {
    setFormModal({ open: false, mode: "create", data: null });
  };

  const handleOpenCreateFormModal = () => {
    setFormModal({ open: true, mode: "create", data: null });
  };

  const handleOpenEditFormModal = (docRef: PartnerDocRefResponse) => {
    setFormModal({ open: true, mode: "edit", data: docRef });
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: partnerDocRefQueryKeys.lists(),
    });
  };

  const columns: ColumnDef<PartnerDocRefResponse>[] = partnerDocRefColumns({
    onEdit: handleOpenEditFormModal,
    onDelete: handleOpenDeleteModal,
  });

  return (
    <Page
      type="base"
      title={PARTNER_DOC_REF_LIST_PAGE_TITLE}
      permission={PARTNER_DOC_REF_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: PARTNER_DOC_REF_LIST_PAGE_TITLE,
          url: PARTNER_DOC_REF_URL,
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title={PARTNER_DOC_REF_LIST_PAGE_TITLE}
          description="Manage document requirements for partner types and companies"
          actions={
            <ActionButton
              variant="add"
              showLabel
              onClick={handleOpenCreateFormModal}
              permission={PARTNER_DOC_REF_CREATE_PERMISSION}
            />
          }
        />

        <DataTable<PartnerDocRefResponse>
          title="All Partner Document References"
          columns={columns}
          queryKey={partnerDocRefQueryKeys.lists()}
          queryFn={partnerDocRefService.listPartnerDocRefs}
        />

        <PartnerDocRefFormModal
          open={formModal.open}
          onOpenChange={handleCloseFormModal}
          mode={formModal.mode}
          defaultValues={formModal.data || undefined}
          onSuccess={handleFormSuccess}
        />

        <ConfirmationModal
          open={deleteModal.open}
          onOpenChange={handleToggleDeleteModal}
          title="Delete Partner Document Reference"
          description={`Are you sure you want to delete the document reference "${deleteModal.data?.documentName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="destructive"
          isLoading={deleteDocRefMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteModal({ open: false, data: null });
          }}
        />
      </div>
    </Page>
  );
}
