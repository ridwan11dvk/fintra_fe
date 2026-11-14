/**
 * Posting Asset Legacy - Transaction Detail Page
 * Shows all individual records for a specific transaction group
 */

import {
  POSTING_ASSET_LEGACY_CREATE_PERMISSION,
  POSTING_ASSET_LEGACY_DETAIL_PAGE_TITLE,
  POSTING_ASSET_LEGACY_LIST_PAGE_TITLE,
  POSTING_ASSET_LEGACY_READ_PERMISSION,
  POSTING_ASSET_LEGACY_URL,
  postingAssetLegacyDetailColumns,
  PostingAssetLegacyFormModal,
  useDeletePostingAssetLegacyMutation,
  usePostingAssetLegacyByTransaction,
  useRegeneratePostingAssetLegacyMutation,
  useSendToSapPostingAssetLegacyMutation,
  type PostingAssetLegacyDetail,
} from "@/features/monitoring";
import type { FormMode } from "@railfinance/core/types";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { OfflineDataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useState } from "react";
import { useParams } from "react-router";

export function PostingAssetLegacyDetailPage() {
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    mode: FormMode;
    record: Partial<PostingAssetLegacyDetail> | null;
  }>({ isOpen: false, mode: "create", record: null });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    record: PostingAssetLegacyDetail | null;
  }>({ isOpen: false, record: null });

  const [regenerateModal, setRegenerateModal] = useState(false);
  const [sendToSapModal, setSendToSapModal] = useState(false);

  const deleteMutation = useDeletePostingAssetLegacyMutation({
    onSuccess: () => setDeleteModal({ isOpen: false, record: null }),
  });

  const regenerateMutation = useRegeneratePostingAssetLegacyMutation({
    onSuccess: () => setRegenerateModal(false),
  });

  const sendToSapMutation = useSendToSapPostingAssetLegacyMutation({
    onSuccess: () => setSendToSapModal(false),
  });

  const {
    reversalFlag = "",
    documentNumber = "",
    reference = "",
  } = useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = usePostingAssetLegacyByTransaction(
    reversalFlag,
    documentNumber,
    reference,
  );

  const records = response?.data ?? [];
  const firstRecord = records[0];

  const totalDebit = records
    .filter((record) => record.DEBIT_KREDIT === "D")
    .reduce((sum, record) => sum + Number.parseFloat(record.AMOUNT || "0"), 0);

  const totalCredit = records
    .filter((record) => record.DEBIT_KREDIT === "K")
    .reduce((sum, record) => sum + Number.parseFloat(record.AMOUNT || "0"), 0);

  const amount = Math.abs(totalDebit - totalCredit);

  const transactionKey = {
    reversal: reversalFlag,
    noDok: documentNumber,
    reference: reference,
  };

  const newRecordSeed: Partial<PostingAssetLegacyDetail> = {
    REVERSAL: reversalFlag,
    DOC_TYPE: firstRecord?.DOC_TYPE ?? null,
    TCODE: firstRecord?.TCODE ?? null,
    NO_DOK: documentNumber,
    DOC_DATE: firstRecord?.DOC_DATE,
    REFERENCE: reference || null,
    RECORD_NUMBER: firstRecord?.RECORD_NUMBER ?? null,
    POSTING_DATE: firstRecord?.POSTING_DATE,
    DEBIT_KREDIT: firstRecord?.DEBIT_KREDIT ?? null,
    Fiscal_year: firstRecord?.Fiscal_year ?? new Date().getFullYear(),
    virtual_acc: firstRecord?.virtual_acc ?? null,
    AMOUNT: String(amount),
  };

  const columns = postingAssetLegacyDetailColumns({
    onEdit: (record) => setFormModal({ isOpen: true, mode: "edit", record }),
    onDelete: (record) => setDeleteModal({ isOpen: true, record }),
  });

  return (
    <Page
      type="monitoring"
      title={POSTING_ASSET_LEGACY_DETAIL_PAGE_TITLE}
      permission={POSTING_ASSET_LEGACY_READ_PERMISSION}
      breadcrumbs={[
        { title: "Monitoring", url: "#" },
        {
          title: POSTING_ASSET_LEGACY_LIST_PAGE_TITLE,
          url: POSTING_ASSET_LEGACY_URL,
        },
        { title: POSTING_ASSET_LEGACY_DETAIL_PAGE_TITLE, url: "#" },
      ]}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && !isError && records.length === 0}
    >
      <PageHeader
        title={POSTING_ASSET_LEGACY_DETAIL_PAGE_TITLE}
        description={`Document: ${documentNumber} · Reference: ${reference || "-"} · Reversal Flag: ${reversalFlag}`}
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="generate"
              showLabel
              label="Regenerate"
              visible={firstRecord?.status0 !== "S"}
              disabled={regenerateMutation.isPending}
              onClick={() => setRegenerateModal(true)}
            />
            <ActionButton
              variant="sent"
              showLabel
              label="Send to SAP"
              visible={firstRecord?.status0 !== "S"}
              disabled={sendToSapMutation.isPending}
              onClick={() => setSendToSapModal(true)}
            />
            <ActionButton
              variant="add"
              showLabel
              permission={POSTING_ASSET_LEGACY_CREATE_PERMISSION}
              visible={firstRecord?.status0 !== "S"}
              onClick={() =>
                setFormModal({
                  isOpen: true,
                  mode: "create",
                  record: newRecordSeed,
                })
              }
            />
          </div>
        }
      />
      <div className="space-y-4">
        <OfflineDataTable
          title="Records"
          columns={columns}
          data={records}
          toolbar={{ enableColumnToggle: true }}
        />
      </div>

      <PostingAssetLegacyFormModal
        open={formModal.isOpen}
        mode={formModal.mode}
        defaultValues={formModal.record ?? undefined}
        transactionKey={transactionKey}
        onOpenChange={(open) =>
          setFormModal((prev) => ({ ...prev, isOpen: open }))
        }
        onSuccess={() => {
          setFormModal({ isOpen: false, mode: "create", record: null });
        }}
      />

      <ConfirmationModal
        open={deleteModal.isOpen}
        onOpenChange={(open) =>
          setDeleteModal((prev) => ({ ...prev, isOpen: open }))
        }
        title="Delete Record"
        description="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteModal.record?.indeks != null) {
            deleteMutation.mutate({
              reversal: reversalFlag,
              noDok: documentNumber,
              reference: reference,
              indeks: String(deleteModal.record.indeks),
            });
          }
        }}
      />

      <ConfirmationModal
        open={regenerateModal}
        onOpenChange={setRegenerateModal}
        title="Regenerate Posting"
        description="Are you sure you want to regenerate this posting? Existing entries will be replaced."
        confirmText="Regenerate"
        confirmVariant="default"
        isLoading={regenerateMutation.isPending}
        onConfirm={() => {
          regenerateMutation.mutate({
            reversal: reversalFlag,
            noDok: documentNumber,
            reference,
          });
        }}
      />

      <ConfirmationModal
        open={sendToSapModal}
        onOpenChange={setSendToSapModal}
        title="Send to SAP"
        description="Are you sure you want to send this posting to SAP for processing?"
        confirmText="Send to SAP"
        confirmVariant="default"
        isLoading={sendToSapMutation.isPending}
        onConfirm={() => {
          sendToSapMutation.mutate({
            reversal: reversalFlag,
            noDok: documentNumber,
            reference,
          });
        }}
      />
    </Page>
  );
}
