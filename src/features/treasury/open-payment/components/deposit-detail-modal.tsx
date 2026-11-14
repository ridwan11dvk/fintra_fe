import { type DepositResponse, SEND_STATUS_LABELS } from "@/features/treasury";
import { Badge } from "@railfinance/core/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@railfinance/core/ui/dialog";
import { FilePreview } from "@railfinance/core/components/modal";
import { formatCurrency, formatDate } from "@railfinance/core/lib";
import { Skeleton } from "@railfinance/core/ui/skeleton";
import { useState } from "react";

function DepositDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
}

function DepositDetailContent({
  deposit,
  onPreview,
}: Readonly<{
  deposit: DepositResponse;
  onPreview: () => void;
}>) {
  return (
    <div className="space-y-6">
      {/* Agent Information Section */}
      <div>
        <h3 className="font-semibold mb-3">Agent Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Agent Code</p>
            <p className="font-medium">{deposit.agentCode || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{deposit.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Virtual Account</p>
            <p className="font-medium">{deposit.virtualAccount || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reference No.</p>
            <p className="font-medium">{deposit.referenceNumber || "-"}</p>
          </div>
        </div>
      </div>

      {/* Deposit Details Section */}
      <div>
        <h3 className="font-semibold mb-3">Deposit Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Deposit Date</p>
            <p className="font-medium">
              {deposit.depositDate
                ? formatDate(deposit.depositDate, "DD/MM/YYYY", true)
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">
              {deposit.amount ? formatCurrency(deposit.amount) : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Opening Balance</p>
            <p className="font-medium">
              {deposit.openingBalance
                ? formatCurrency(deposit.openingBalance)
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Closing Balance</p>
            <p className="font-medium">
              {deposit.closingBalance
                ? formatCurrency(deposit.closingBalance)
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Bank Information Section */}
      <div>
        <h3 className="font-semibold mb-3">Bank Information</h3>
        <div>
          <p className="text-sm text-muted-foreground">Bank Code</p>
          <p className="font-medium">{deposit.bankCode || "-"}</p>
        </div>
      </div>

      {/* Document Section */}
      {deposit.documentPath && (
        <div>
          <h3 className="font-semibold mb-3">Document</h3>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Attached Document
            </p>
            <button
              onClick={onPreview}
              className="text-primary hover:underline text-sm font-medium"
            >
              View Document
            </button>
          </div>
        </div>
      )}

      {/* Status Section */}
      <div>
        <h3 className="font-semibold mb-3">Status</h3>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Send Status</p>
          <Badge variant={deposit.sendStatus === 0 ? "secondary" : "default"}>
            {SEND_STATUS_LABELS[deposit.sendStatus]}
          </Badge>
        </div>
      </div>

      {/* Audit Section */}
      <div>
        <h3 className="font-semibold mb-3">Audit Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Created By</p>
            <p className="font-medium">{deposit.createdBy || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">
              {deposit.createdAt
                ? formatDate(deposit.createdAt, "DD/MM/YYYY", true)
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated By</p>
            <p className="font-medium">{deposit.updatedBy || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated At</p>
            <p className="font-medium">
              {deposit.updatedAt
                ? formatDate(deposit.updatedAt, "DD/MM/YYYY", true)
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepositDetailEmpty() {
  return (
    <p className="text-center text-muted-foreground">No deposit data found</p>
  );
}

interface DepositDetailModalProps {
  deposit: DepositResponse | undefined;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
}

export function DepositDetailModal({
  deposit,
  isOpen,
  isLoading,
  onClose,
}: Readonly<DepositDetailModalProps>) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deposit Details</DialogTitle>
          <DialogDescription>
            Complete information for this deposit record
          </DialogDescription>
        </DialogHeader>

        {isLoading && <DepositDetailSkeleton />}
        {!isLoading && deposit && (
          <>
            <DepositDetailContent
              deposit={deposit}
              onPreview={() => setIsPreviewOpen(true)}
            />
            {deposit.documentPath && (
              <FilePreview
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                filePath={deposit.documentPath}
                title="Deposit Document"
              />
            )}
          </>
        )}
        {!isLoading && !deposit && <DepositDetailEmpty />}
      </DialogContent>
    </Dialog>
  );
}
