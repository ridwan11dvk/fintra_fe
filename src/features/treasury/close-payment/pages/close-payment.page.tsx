import { DataTable } from "@railfinance/core/components/data-table";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import { toast } from "@railfinance/core/lib";
import { Button } from "@railfinance/core/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { closePaymentColumns } from "../components/close-payment-columns";
import { ClosePaymentDetailModal } from "../components/close-payment-detail-modal";
import { ClosePaymentFormModal } from "../components/close-payment-form-modal";
import { useResetPostingA8StatusMutation } from "../data/close-payment.mutation";
import {
  closePaymentQueryKeys,
  useGetClosePaymentById,
  useGetUnpaidCount,
} from "../data/close-payment.query";
import {
  closePaymentService,
  type ResetPostingA8Result,
} from "../data/close-payment.service";
import type { ClosePaymentResponse } from "../data/close-payment.types";
import {
  CLOSE_PAYMENT_LIST_PAGE_TITLE,
  CLOSE_PAYMENT_LIST_PERMISSION,
  CLOSE_PAYMENT_URL,
} from "../data/close-payment.utils";

export function ClosePaymentPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClosePayment, setSelectedClosePayment] = useState<
    ClosePaymentResponse | undefined
  >();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [recordsToReset, setRecordsToReset] = useState<ClosePaymentResponse[]>(
    [],
  );
  const [isResetResultOpen, setIsResetResultOpen] = useState(false);
  const [resetResults, setResetResults] = useState<ResetPostingA8Result[]>([]);
  const [selectedClosePayments, setSelectedClosePayments] = useState<
    ClosePaymentResponse[]
  >([]);

  const queryClient = useQueryClient();

  // Fetch detail when needed
  const detailQuery = useGetClosePaymentById(selectedClosePayment?.id ?? 0, {
    enabled: !!selectedClosePayment?.id && isDetailOpen,
  });

  // Fetch unpaid count for summary
  const unpaidCountQuery = useGetUnpaidCount();

  const resetMutation = useResetPostingA8StatusMutation({
    onSuccess: (response) => {
      if (response.data) {
        setResetResults(response.data.data);
        setIsResetResultOpen(true);
        setIsResetConfirmOpen(false);
        setSelectedClosePayments([]);
      }
      // Invalidate list queries to refresh
      queryClient.invalidateQueries({
        queryKey: closePaymentQueryKeys.lists(),
      });
      // Invalidate summary
      queryClient.invalidateQueries({
        queryKey: closePaymentQueryKeys.summaries(),
      });
    },
    onError: () => {
      toast.error("Failed to reset posting status");
    },
  });

  const handleOpenDetail = (data: ClosePaymentResponse) => {
    setSelectedClosePayment(data);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (data: ClosePaymentResponse) => {
    // Only allow edit if payment status is Unpaid (0)
    if (data.paymentStatus !== 0) {
      toast.error("Can only edit unpaid records (payment_status = 0)");
      return;
    }
    setSelectedClosePayment(data);
    setIsFormOpen(true);
  };

  const handleReset = (data: ClosePaymentResponse) => {
    setRecordsToReset([data]);
    setIsResetConfirmOpen(true);
  };

  const handleBulkReset = () => {
    if (selectedClosePayments.length === 0) {
      toast.error("Please select at least one record to reset");
      return;
    }

    // Filter for eligible records (posting_a8_status = 1 or 5)
    const eligibleRecords = selectedClosePayments.filter(
      (r) => r.postingA8Status === 1 || r.postingA8Status === 5,
    );

    if (eligibleRecords.length === 0) {
      toast.warning(
        "Selected records do not have eligible posting status (must be Partial or Failed)",
      );
      return;
    }

    setRecordsToReset(eligibleRecords);
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    const ids = recordsToReset.map((r) => r.id);
    resetMutation.mutate(ids);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: closePaymentQueryKeys.lists(),
    });
  };

  const columns = closePaymentColumns({
    onDetail: handleOpenDetail,
    onEdit: handleOpenEdit,
    onReset: handleReset,
  });

  const detailData = detailQuery.data?.data || selectedClosePayment;

  return (
    <Page
      type="treasury"
      title={CLOSE_PAYMENT_LIST_PAGE_TITLE}
      permission={CLOSE_PAYMENT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Treasury",
          url: "#",
        },
        {
          title: CLOSE_PAYMENT_LIST_PAGE_TITLE,
          url: CLOSE_PAYMENT_URL,
        },
      ]}
    >
      <PageHeader
        title="Close Payment"
        description="Close payment transactions including invoice tracking, payment status, and posting status. Data originates from external systems and cannot be created through this interface."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Unpaid Records
          </p>
          <p className="text-3xl font-bold">
            {unpaidCountQuery.data?.data ?? 0}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Requires Posting Reset
          </p>
          <p className="text-3xl font-bold">—</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<ClosePaymentResponse>
        title="All Close Payments"
        description={
          selectedClosePayments.length > 0
            ? `${selectedClosePayments.length} record(s) selected`
            : ""
        }
        columns={columns}
        queryFn={closePaymentService.listClosePayments}
        queryKey={closePaymentQueryKeys.lists()}
        search={{
          key: "invoiceNumber",
          placeholder:
            "Search by invoice number, customer name, transaction ID, or PPF number",
        }}
        selectedItems={selectedClosePayments}
        onItemSelect={setSelectedClosePayments}
        actions={
          selectedClosePayments.length > 0 && (
            <>
              {/* Bulk Actions */}
              <Button onClick={handleBulkReset}>Reset Posting Status</Button>
              <Button
                variant="destructive-outline"
                onClick={() => setSelectedClosePayments([])}
              >
                Clear Selection
              </Button>
            </>
          )
        }
      />

      {/* Detail Modal */}
      <ClosePaymentDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        data={detailData}
      />

      {/* Edit Modal */}
      <ClosePaymentFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        defaultValues={selectedClosePayment}
        onSuccess={handleFormSuccess}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Reset Posting Status"
        description={`Are you sure you want to reset the posting status for ${recordsToReset.length} record(s)? This will set the posting status to "Not Generated".`}
        onConfirm={handleConfirmReset}
        isLoading={resetMutation.isPending}
        confirmText="Reset"
        confirmVariant="default"
      />

      {/* Reset Results Modal */}
      {isResetResultOpen && resetResults.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">
              Reset Posting Results
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
              {resetResults.map((result) => (
                <div
                  key={`${result.name}-${result.invoiceNumber}`}
                  className="flex gap-3 p-3 bg-muted rounded-lg border"
                >
                  <div className="shrink-0">
                    {result.success ? (
                      <span className="text-lg text-green-600">✓</span>
                    ) : (
                      <span className="text-lg text-red-600">✗</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {result.name} ({result.invoiceNumber})
                    </p>
                    {result.success ? (
                      <p className="text-xs text-green-600">Reset successful</p>
                    ) : (
                      <p className="text-xs text-red-600">
                        {result.reason || "Reset failed"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsResetResultOpen(false)}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Page>
  );
}

export default ClosePaymentPage;
