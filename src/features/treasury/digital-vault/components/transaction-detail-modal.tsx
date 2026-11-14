/**
 * Closure Detail Modal
 * Shows closure header info, summary totals, and deposit transaction list
 */

import type { VaultTransactionItem } from "@/features/treasury";
import {
  digitalVaultService,
  getBillingTypeVariant,
  getSAPStatusVariant,
  useTransactionDetail,
  VAULT_BILLING_TYPE_LABELS,
  VAULT_SAP_POSTING_STATUS_LABELS,
} from "@/features/treasury";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { formatCurrency, formatDate, toast } from "@railfinance/core/lib";
import { Modal } from "@railfinance/core/components/modal";
import { Skeleton } from "@railfinance/core/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@railfinance/core/ui/table";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

interface TransactionDetailModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedId: number;
}

function InfoRow({
  label,
  value,
}: Readonly<{ label: string; value: React.ReactNode }>) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4">
      <span className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-base font-medium text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

function StatTile({
  dotClassName,
  label,
  amount,
}: Readonly<{ dotClassName: string; label: string; amount: number }>) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-center justify-center gap-2">
        <span className={`size-2.5 shrink-0 rounded-full ${dotClassName}`} />
        <span className="flex-1 text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-3xl font-semibold text-foreground">
        {formatCurrency(amount)}
      </div>
    </div>
  );
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  selectedId,
}: TransactionDetailModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const {
    data: response,
    isLoading,
    isError,
  } = useTransactionDetail(selectedId ?? 0);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await digitalVaultService.exportTransactionDetail(
        selectedId ?? 0,
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `digital_vault_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const data = response?.data;

  const totals = useMemo(() => {
    const sumBy = (type: VaultTransactionItem["billingType"]) =>
      data?.depositDetails
        ?.filter((item) => item.billingType === type)
        .reduce((acc, item) => acc + item.depositAmount, 0) ?? 0;

    return {
      deposit: sumBy("DEPOSIT"),
      credit: sumBy("CREDIT"),
      completed: sumBy("COMPLETE"),
    };
  }, [data?.depositDetails]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-8 text-red-600">
          Failed to load closure detail. Please try again.
        </div>
      );
    }

    if (!data) return null;

    return (
      <div className="space-y-6">
        {/* Info cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border bg-background px-6 py-5 shadow-xs">
            <InfoRow label="Station" value={data.stationName} />
            <InfoRow label="Company name" value={data.companyCode} />
            <InfoRow
              label="Deposit status"
              value={
                <Badge variant={getBillingTypeVariant(data.latestBillingType)}>
                  {VAULT_BILLING_TYPE_LABELS[data.latestBillingType]}
                </Badge>
              }
            />
            <InfoRow
              label="SAP status"
              value={
                <Badge variant={getSAPStatusVariant(data.postingA8Status)}>
                  {data.postingA8Status
                    ? VAULT_SAP_POSTING_STATUS_LABELS[data.postingA8Status]
                    : VAULT_SAP_POSTING_STATUS_LABELS["NOT_POSTED"]}
                </Badge>
              }
            />
          </div>
          <div className="flex flex-col gap-2 rounded-xl border bg-background px-6 py-5 shadow-xs">
            <InfoRow label="Closure number" value={data.closureNumber} />
            <InfoRow
              label="Closure date"
              value={formatDate(data.closureDate)}
            />
            <InfoRow
              label="Virtual Account"
              value={data.virtualAccountNumber}
            />
            <InfoRow label="Bank" value={data.bankCode} />
          </div>
        </div>

        {/* Summary stats */}
        <div className="rounded-xl border bg-background p-6 shadow-xs">
          <div className="flex flex-col gap-6 divide-y sm:flex-row sm:divide-x sm:divide-y-0">
            <div className="sm:pr-4">
              <StatTile
                dotClassName="bg-warning"
                label="Total Closure"
                amount={data.closureAmount}
              />
            </div>
            <div className="pt-6 sm:px-4 sm:pt-0">
              <StatTile
                dotClassName="bg-info"
                label="Total Deposit"
                amount={totals.deposit}
              />
            </div>
            <div className="pt-6 sm:px-4 sm:pt-0">
              <StatTile
                dotClassName="bg-primary"
                label="Total Credit"
                amount={totals.credit}
              />
            </div>
            <div className="pt-6 sm:pl-4 sm:pt-0">
              <StatTile
                dotClassName="bg-success"
                label="Total Completed"
                amount={totals.completed}
              />
            </div>
          </div>
        </div>

        {/* Deposit Transaction table */}
        <div className="rounded-xl border bg-background shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <h3 className="text-lg font-semibold">Deposit Transaction</h3>
            {data.depositDetails?.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                disabled={isExporting}
              >
                <Download className="size-4" />
              </Button>
            )}
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">No</TableHead>
                  <TableHead className="text-xs">VA number</TableHead>
                  <TableHead className="text-xs">Deposit date</TableHead>
                  <TableHead className="text-right text-xs">Amount</TableHead>
                  <TableHead className="text-xs">Deposit status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.depositDetails?.length > 0 ? (
                  data.depositDetails.map(
                    (item: VaultTransactionItem, idx: number) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {data.virtualAccountNumber}
                        </TableCell>
                        <TableCell>{formatDate(item.depositDate)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.depositAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getBillingTypeVariant(item.billingType)}
                          >
                            {VAULT_BILLING_TYPE_LABELS[item.billingType]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-4"
                    >
                      No transactions recorded
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title="Closure Detail"
      onCancel={onClose}
      size="2xl"
    >
      {renderContent()}
    </Modal>
  );
}
