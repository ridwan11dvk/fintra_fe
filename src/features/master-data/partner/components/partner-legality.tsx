import {
  PARTNER_UPDATE_PERMISSION,
  PartnerDeedAmendmentFormModal,
  PartnerLegalityFormModal,
  useDeletePartnerDeedAmendmentMutation,
  useDeletePartnerLegalityMutation,
  useGetPartnerLegality,
} from "@/features/master-data";
import type { PartnerDeedAmendment } from "@/features/master-data/partner/data/partner.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ConfirmationModal, FilePreview } from "@railfinance/core/components/modal";
import { OfflineDataTable } from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface PartnerLegalityContentProps {
  partnerId: number;
  open?: boolean;
}

function getDeedAmendmentColumns(
  onEdit: (amendment: PartnerDeedAmendment) => void,
  onDelete: (id: number) => void,
): ColumnDef<PartnerDeedAmendment>[] {
  return [
    {
      accessorKey: "number",
      header: "Amendment Number",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "document",
      header: "Document",
      cell: (info) => info.getValue() || "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <ActionButton
            variant="edit"
            onClick={() => onEdit(info.row.original)}
          />
          <ActionButton
            variant="delete"
            onClick={() => onDelete(info.row.original.id ?? 0)}
          />
        </div>
      ),
    },
  ];
}

export function PartnerLegalityContent({
  partnerId,
  open,
}: Readonly<PartnerLegalityContentProps>) {
  // 0..1 resource: 404 (not created yet) is a normal state, handled silently
  const legalityQuery = useGetPartnerLegality(partnerId, {
    enabled: partnerId > 0 && open,
  });

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    path: string | undefined | null;
  }>({
    open: false,
    path: "",
  });
  const [amendmentModal, setAmendmentModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data: PartnerDeedAmendment | null;
  }>({ open: false, mode: "create", data: null });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [amendmentDeleteModal, setAmendmentDeleteModal] = useState<{
    open: boolean;
    amendmentId: number | null;
  }>({ open: false, amendmentId: null });

  const deleteLegalityMutation = useDeletePartnerLegalityMutation({
    onSuccess: () => setDeleteModalOpen(false),
  });

  const deleteAmendmentMutation = useDeletePartnerDeedAmendmentMutation({
    onSuccess: () =>
      setAmendmentDeleteModal({ open: false, amendmentId: null }),
  });

  const legality = legalityQuery.data?.data ?? null;
  const isLoading = legalityQuery.isLoading;
  // A 404 means the legality record has not been created yet
  const notCreated = legalityQuery.isError;

  const legalityId = legality?.id ?? 0;

  const handleDeleteLegality = () => {
    if (legality?.id) {
      deleteLegalityMutation.mutate({ partnerId, legalityId: legality.id });
    }
  };

  const handleConfirmDeleteAmendment = () => {
    if (amendmentDeleteModal.amendmentId && legalityId) {
      deleteAmendmentMutation.mutate({
        partnerId,
        legalityId,
        amendmentId: amendmentDeleteModal.amendmentId,
      });
    }
  };

  const renderBody = () => {
    if (isLoading) {
      return <p className="text-sm text-gray-500">Loading legality…</p>;
    }
    if (notCreated || !legality) {
      return (
        <p className="text-sm text-gray-500">
          No legality record has been created for this partner yet.
        </p>
      );
    }
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">NIB Number</p>
            <p className="font-medium">{legality.nibNumber || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">NIB Date</p>
            <p className="font-medium">{legality.nibDate || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">NIB Document</p>
            <div>
              <ActionButton
                variant="show"
                buttonVariant="outline"
                showLabel
                label="View File"
                disabled={!legality.nibDocument}
                onClick={() =>
                  setPreviewModal({
                    open: true,
                    path: legality?.nibDocument,
                  })
                }
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Deed of Establishment Number
            </p>
            <p className="font-medium">
              {legality.deedEstablishmentNumber || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Deed of Establishment Date</p>
            <p className="font-medium">
              {legality.deedEstablishmentDate || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Deed of Establishment Document
            </p>
            <p className="font-medium">
              <ActionButton
                variant="show"
                buttonVariant="outline"
                showLabel
                label="View File"
                disabled={!legality.deedEstablishmentDocument}
                onClick={() =>
                  setPreviewModal({
                    open: true,
                    path: legality?.deedEstablishmentDocument,
                  })
                }
              />
            </p>
          </div>
        </div>

        {/* Deed Amendments */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Deed Amendments</h3>
            <ActionButton
              variant="add"
              showLabel
              label="Add Amendment"
              onClick={() =>
                setAmendmentModal({
                  open: true,
                  mode: "create",
                  data: null,
                })
              }
              permission={PARTNER_UPDATE_PERMISSION}
            />
          </div>
          <OfflineDataTable
            columns={getDeedAmendmentColumns(
              (amendment) =>
                setAmendmentModal({
                  open: true,
                  mode: "edit",
                  data: amendment,
                }),
              (amendmentId) =>
                setAmendmentDeleteModal({
                  open: true,
                  amendmentId,
                }),
            )}
            data={legality.deedAmendments ?? []}
            enablePagination={false}
            title=""
            toolbar={{
              enableColumnToggle: false,
            }}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Partner Legality</CardTitle>
          <CardDescription>
            NIB and deed of establishment for this partner
          </CardDescription>
          <CardAction>
            {legality ? (
              <div className="flex items-center gap-2">
                <ActionButton
                  variant="edit"
                  buttonVariant="success-outline"
                  showLabel
                  label="Edit"
                  onClick={() => setFormModalOpen(true)}
                  permission={PARTNER_UPDATE_PERMISSION}
                />
                <ActionButton
                  variant="delete"
                  buttonVariant="destructive-outline"
                  showLabel
                  onClick={() => setDeleteModalOpen(true)}
                  permission={PARTNER_UPDATE_PERMISSION}
                />
              </div>
            ) : (
              <ActionButton
                variant="add"
                showLabel
                label="Add Legality"
                onClick={() => setFormModalOpen(true)}
                disabled={isLoading}
                permission={PARTNER_UPDATE_PERMISSION}
              />
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">{renderBody()}</CardContent>
      </Card>

      <PartnerLegalityFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        mode={legality ? "edit" : "create"}
        partnerId={partnerId}
        defaultValues={legality ?? undefined}
        onSuccess={() => {}}
      />

      <PartnerDeedAmendmentFormModal
        open={amendmentModal.open}
        onOpenChange={(open) =>
          setAmendmentModal((prev) => ({ ...prev, open }))
        }
        mode={amendmentModal.mode}
        partnerId={partnerId}
        legalityId={legalityId}
        defaultValues={amendmentModal.data ?? undefined}
        onSuccess={() => {}}
      />

      {/* Legality Delete Confirmation */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Legality"
        description="Are you sure you want to delete this legality record? Deed amendments will also be removed. This action cannot be undone."
        onConfirm={handleDeleteLegality}
        confirmVariant="destructive"
        isLoading={deleteLegalityMutation.isPending}
      />

      {/* Deed Amendment Delete Confirmation */}
      <ConfirmationModal
        open={amendmentDeleteModal.open}
        onOpenChange={(open) =>
          setAmendmentDeleteModal((prev) => ({ ...prev, open }))
        }
        title="Delete Deed Amendment"
        description="Are you sure you want to delete this deed amendment? This action cannot be undone."
        onConfirm={handleConfirmDeleteAmendment}
        confirmVariant="destructive"
        isLoading={deleteAmendmentMutation.isPending}
      />

      <FilePreview
        filePath={previewModal.path as string}
        open={previewModal.open}
        onOpenChange={(open) =>
          setPreviewModal({
            open,
            path: "",
          })
        }
      />
    </>
  );
}
