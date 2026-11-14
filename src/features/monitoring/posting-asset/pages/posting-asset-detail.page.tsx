/**
 * Posting Asset - Transaction Detail Page
 * Shows all individual records for a specific transaction group
 */

import {
  POSTING_ASSET_CREATE_PERMISSION,
  POSTING_ASSET_DETAIL_PAGE_TITLE,
  POSTING_ASSET_LIST_PAGE_TITLE,
  POSTING_ASSET_READ_PERMISSION,
  POSTING_ASSET_URL,
  postingAssetDetailColumns,
  PostingAssetFormModal,
  useDeletePostingAssetMutation,
  usePostingAssetByTransaction,
  type PostingAsset,
} from "@/features/monitoring";
import type { FormMode } from "@railfinance/core/types";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { formatDate } from "@railfinance/core/lib";
import { OfflineDataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { SapStatusBadge } from "@railfinance/core/components/badges";
import { useState } from "react";
import { useParams } from "react-router";

export function PostingAssetDetailPage() {
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    mode: FormMode;
    record: Partial<PostingAsset> | null;
  }>({ isOpen: false, mode: "create", record: null });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    record: PostingAsset | null;
  }>({ isOpen: false, record: null });

  const deleteMutation = useDeletePostingAssetMutation({
    onSuccess: () => setDeleteModal({ isOpen: false, record: null }),
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
  } = usePostingAssetByTransaction(reversalFlag, documentNumber, reference);

  const records = response?.data ?? [];
  const firstRecord = records[0];

  // Calculate total S (Debit) and H (Credit)
  const totalDebit = records
    .filter((record) => record.debitCreditFlag === "S")
    .reduce((sum, record) => sum + (record.amount ?? 0), 0);

  const totalCredit = records
    .filter((record) => record.debitCreditFlag === "H")
    .reduce((sum, record) => sum + (record.amount ?? 0), 0);

  // Amount is absolute difference between S and H
  const amount = Math.abs(totalDebit - totalCredit);

  const newRecordSeed: Partial<PostingAsset> = {
    reversalFlag: reversalFlag as PostingAsset["reversalFlag"],
    documentType: firstRecord?.documentType ?? null,
    transactionCode: firstRecord?.transactionCode ?? null,
    documentNumber,
    documentDate: firstRecord?.documentDate,
    reference: reference || null,
    recordNumber: firstRecord?.recordNumber ?? null,
    postingDate: firstRecord?.postingDate,
    debitCreditFlag: firstRecord?.debitCreditFlag ?? null,
    fiscalYear: firstRecord?.fiscalYear ?? new Date().getFullYear(),
    virtualAccount: firstRecord?.virtualAccount ?? null,
    amount: amount,
  };

  const columns = postingAssetDetailColumns({
    onEdit: (record) => setFormModal({ isOpen: true, mode: "edit", record }),
    onDelete: (record) => setDeleteModal({ isOpen: true, record }),
  });

  return (
    <Page
      type="monitoring"
      title={POSTING_ASSET_DETAIL_PAGE_TITLE}
      permission={POSTING_ASSET_READ_PERMISSION}
      breadcrumbs={[
        { title: "Monitoring", url: "#" },
        { title: POSTING_ASSET_LIST_PAGE_TITLE, url: POSTING_ASSET_URL },
        { title: POSTING_ASSET_DETAIL_PAGE_TITLE, url: "#" },
      ]}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && !isError && records.length === 0}
    >
      <PageHeader
        title={POSTING_ASSET_DETAIL_PAGE_TITLE}
        description={`Document: ${documentNumber} · Reference: ${reference || "-"} · Reversal Flag: ${reversalFlag}`}
        actions={
          <ActionButton
            variant="add"
            showLabel
            permission={POSTING_ASSET_CREATE_PERMISSION}
            visible={firstRecord?.sapStatus !== "S"}
            onClick={() =>
              setFormModal({
                isOpen: true,
                mode: "create",
                record: newRecordSeed,
              })
            }
          />
        }
      />
      <div className="space-y-4">
        {/* Transaction Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-background rounded-lg shadow-lg">
          <div>
            <p className="text-xs text-muted-foreground">Document Number</p>
            <p className="font-medium text-sm">{documentNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reference</p>
            <p className="font-medium text-sm">{reference || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reversal Flag</p>
            <p className="font-medium text-sm">{reversalFlag}</p>
          </div>
          {firstRecord && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Document Date</p>
                <p className="font-medium text-sm">
                  {formatDate(firstRecord.documentDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SAP Status</p>
                {firstRecord.sapStatus ? (
                  <SapStatusBadge status={firstRecord.sapStatus} />
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Records Table */}
        <OfflineDataTable
          title={`Records`}
          columns={columns}
          data={records}
          toolbar={{ enableColumnToggle: true }}
        />
      </div>

      <PostingAssetFormModal
        open={formModal.isOpen}
        mode={formModal.mode}
        defaultValues={formModal.record ?? undefined}
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
        description={`Are you sure you want to delete this record? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteModal.record?.id) {
            deleteMutation.mutate(deleteModal.record.id);
          }
        }}
      />
    </Page>
  );
}
