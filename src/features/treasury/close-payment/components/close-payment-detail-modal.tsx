import { FilePreview, Modal } from "@railfinance/core/components/modal";
import { formatCurrency, formatDate } from "@railfinance/core/lib";
import { StatusBadge } from "@railfinance/core/components/badges";
import { useState } from "react";
import {
  PAYMENT_SOURCE_LABELS,
  PAYMENT_STATUS_LABELS,
  POSTING_A8_STATUS_LABELS,
  type ClosePaymentResponse,
} from "../data/close-payment.types";

interface ClosePaymentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ClosePaymentResponse;
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: Readonly<DetailRowProps>) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b last:border-b-0">
      <span className="text-sm font-medium text-muted-foreground min-w-45">
        {label}
      </span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export function ClosePaymentDetailModal({
  open,
  onOpenChange,
  data,
}: Readonly<ClosePaymentDetailModalProps>) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!data) return null;

  const statusMap: Record<
    0 | 1 | 2 | 5,
    "active" | "inactive" | "warning" | "error"
  > = {
    0: "inactive",
    1: "warning",
    2: "active",
    5: "error",
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Close Payment Details"
      className="max-w-2xl"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3 text-foreground">
            Customer Information
          </h3>
          <DetailRow label="Customer ID" value={data.custId} />
          <DetailRow label="Customer Name" value={data.name} />
        </div>

        {/* Transaction References */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3 text-foreground">
            Transaction References
          </h3>
          <DetailRow label="Transaction ID" value={data.transId} />
          <DetailRow label="Invoice No." value={data.invoiceNumber} />
          <DetailRow label="PPF No." value={data.ppfNumber} />
        </div>

        {/* Dates */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3 text-foreground">Dates</h3>
          <DetailRow
            label="Invoice Date"
            value={formatDate(data.invoiceDate, "DD/MM/YYYY", true)}
          />
          <DetailRow
            label="Payment Date"
            value={formatDate(data.paymentDate, "DD/MM/YYYY", true)}
          />
          <DetailRow
            label="Due Date"
            value={formatDate(data.dueDate, "DD/MM/YYYY", true)}
          />
          <DetailRow
            label="Print Date"
            value={formatDate(data.printDate, "DD/MM/YYYY", true)}
          />
        </div>

        {/* Amounts */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3 text-foreground">
            Amounts
          </h3>
          <DetailRow
            label="Invoice Amount"
            value={formatCurrency(data.amount, "IDR")}
          />
          <DetailRow
            label="Payment Amount"
            value={formatCurrency(data.paymentAmount, "IDR")}
          />
          <DetailRow
            label="VAT"
            value={formatCurrency(data.vatAmount, "IDR")}
          />
          <DetailRow
            label="WHT"
            value={formatCurrency(data.whtAmount, "IDR")}
          />
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3 text-foreground">
            Payment Information
          </h3>
          <DetailRow label="Bank Code" value={data.bankCode} />
          <DetailRow label="Account Number" value={data.bankAccountNumber} />
          <DetailRow
            label="Account Holder Name"
            value={data.bankAccountHolder}
          />
          <DetailRow label="Payment Type" value={data.paymentType} />
          <DetailRow label="Bank Rule ID" value={data.bankRuleId} />
          <DetailRow
            label="Transfer Receipt"
            value={
              data.transferReceiptPath ? (
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  View File
                </button>
              ) : (
                "—"
              )
            }
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3 text-foreground">Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between gap-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                Payment Status
              </span>
              <StatusBadge
                status={data.paymentStatus === 1 ? "active" : "inactive"}
                label={PAYMENT_STATUS_LABELS[data.paymentStatus]}
              />
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                Posting Status
              </span>
              <StatusBadge
                status={statusMap[data.postingA8Status]}
                label={POSTING_A8_STATUS_LABELS[data.postingA8Status]}
              />
            </div>
            <div className="flex justify-between gap-4 py-2 border-b">
              <span className="text-sm font-medium text-muted-foreground">
                Source
              </span>
              <span className="text-sm font-medium">
                {PAYMENT_SOURCE_LABELS[data.source]}
              </span>
            </div>
          </div>
        </div>

        {/* Audit */}
        <div>
          <h3 className="font-semibold text-sm mb-3 text-foreground">
            Audit Trail
          </h3>
          <DetailRow label="Created By" value={data.createdBy} />
          <DetailRow
            label="Created At"
            value={formatDate(data.createdAt, "DD/MM/YYYY", true)}
          />
          <DetailRow label="Updated By" value={data.updatedBy} />
          <DetailRow
            label="Updated At"
            value={formatDate(data.updatedAt, "DD/MM/YYYY", true)}
          />
        </div>
      </div>

      {/* File Preview Modal */}
      {data.transferReceiptPath && (
        <FilePreview
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          filePath={data.transferReceiptPath}
          title="Transfer Receipt"
        />
      )}
    </Modal>
  );
}
