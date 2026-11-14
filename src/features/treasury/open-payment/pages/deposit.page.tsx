import {
  DEPOSIT_LIST_PAGE_TITLE,
  DEPOSIT_LIST_PERMISSION,
  DEPOSIT_URL,
  depositColumns,
  DepositDetailModal,
  DepositFormModal,
  depositQueryKeys,
  depositService,
  DepositSummaryCards,
  useBulkUpdateSendStatusMutation,
  useUpdateSendStatusMutation,
  type DepositResponse,
} from "@/features/treasury";
import { queryClient } from "@railfinance/core";
import { DataTable } from "@railfinance/core/components/data-table";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import { toast } from "@railfinance/core/lib";
import { Button } from "@railfinance/core/ui/button";
import { useState } from "react";

export function DepositPage() {
  //TO DO : change to Open Payment Page, and rename variables accordingly
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSendStatusConfirmOpen, setIsSendStatusConfirmOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<
    DepositResponse | undefined
  >();
  const [selectedDeposits, setSelectedDeposits] = useState<DepositResponse[]>(
    [],
  );

  // Mutations
  const updateSendStatusMutation = useUpdateSendStatusMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: depositQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: depositQueryKeys.summaries(),
      });
      setIsSendStatusConfirmOpen(false);
      setSelectedDeposit(undefined);
    },
  });

  const bulkUpdateSendStatusMutation = useBulkUpdateSendStatusMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: depositQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: depositQueryKeys.summaries(),
      });
      setSelectedDeposits([]);
    },
  });

  // Handlers
  const handleOpenDetail = (data: DepositResponse) => {
    setSelectedDeposit(data);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (data: DepositResponse) => {
    setSelectedDeposit(data);
    setIsFormOpen(true);
  };

  const handleToggleSendStatus = (data: DepositResponse) => {
    setSelectedDeposit(data);
    setIsSendStatusConfirmOpen(true);
  };

  const handleConfirmSendStatusChange = () => {
    if (!selectedDeposit) return;
    const newStatus: 0 | 1 = selectedDeposit.sendStatus === 0 ? 1 : 0;
    updateSendStatusMutation.mutate({
      id: selectedDeposit.id,
      sendStatus: newStatus,
    });
  };

  const handleBulkUpdateSendStatus = (newStatus: 0 | 1) => {
    if (selectedDeposits.length === 0) {
      toast.error("Please select at least one deposit");
      return;
    }
    const ids = selectedDeposits.map((d) => d.id);
    bulkUpdateSendStatusMutation.mutate({
      ids,
      sendStatus: newStatus,
    });
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedDeposit(undefined);
  };

  const columns = depositColumns({
    onDetail: handleOpenDetail,
    onEdit: handleOpenEdit,
    onToggleSendStatus: handleToggleSendStatus,
  });

  return (
    <Page
      type="treasury"
      title={DEPOSIT_LIST_PAGE_TITLE}
      permission={DEPOSIT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Treasury",
          url: "#",
        },
        {
          title: DEPOSIT_LIST_PAGE_TITLE,
          url: DEPOSIT_URL,
        },
      ]}
    >
      <PageHeader
        title="Deposit"
        description="Deposit transactions monitoring. View, edit, and manage transmission status for virtual account deposits."
      />

      {/* Summary Cards */}
      <div className="mb-6">
        <DepositSummaryCards />
      </div>

      {/* Data Table */}
      <div className="border rounded-lg">
        <DataTable<DepositResponse>
          title="All Deposits"
          description={
            selectedDeposits.length > 0
              ? `${selectedDeposits.length} record(s) selected`
              : ""
          }
          columns={columns}
          queryFn={depositService.listDeposits}
          queryKey={depositQueryKeys.lists()}
          search={{
            key: "search",
          }}
          filters={[
            {
              key: "sendStatus",
              label: "Send Status",
              type: "select",
              options: [
                { value: "0", label: "Not Sent", description: "" },
                { value: "1", label: "Sent", description: "" },
              ],
            },
          ]}
          selectedItems={selectedDeposits}
          onItemSelect={setSelectedDeposits}
          actions={
            selectedDeposits.length > 0 && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdateSendStatus(1)}
                >
                  Mark as Sent
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdateSendStatus(0)}
                >
                  Mark as Not Sent
                </Button>
              </div>
            )
          }
        />
      </div>

      {/* Modals */}
      <DepositDetailModal
        deposit={selectedDeposit}
        isOpen={isDetailOpen}
        isLoading={false}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedDeposit(undefined);
        }}
      />

      <DepositFormModal
        deposit={selectedDeposit}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDeposit(undefined);
        }}
        onSuccess={handleFormSuccess}
      />

      {/* Send Status Confirmation Modal */}
      <ConfirmationModal
        open={isSendStatusConfirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsSendStatusConfirmOpen(false);
            setSelectedDeposit(undefined);
          }
        }}
        title="Update Send Status"
        description={`Are you sure you want to mark this deposit as ${
          selectedDeposit?.sendStatus === 0 ? "Sent" : "Not Sent"
        }?`}
        onConfirm={handleConfirmSendStatusChange}
        onCancel={() => {
          setIsSendStatusConfirmOpen(false);
          setSelectedDeposit(undefined);
        }}
        isLoading={updateSendStatusMutation.isPending}
      />
    </Page>
  );
}

export default DepositPage;
