import { StatusToggleModal, TableEmptyState } from "@/shared/components";
import {
  Button,
  DataTable,
  Page,
  PageHeader,
  toast,
  Visibility,
  type ApiResponse,
  type PagedApiResponse,
} from "@railfinance/core";
import { ImportModal } from "@railfinance/core/components/modal";
import type { ImportErrorReport } from "@railfinance/core/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Upload } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import {
  chartOfAccountColumns,
  ImportModalResult,
  type ImportModalResultData,
} from "../components";
import {
  chartOfAccountQueryKeys,
  chartOfAccountService,
  isExcelFile,
  type ImportChartOfAccountsVariables,
} from "../data";
import type {
  ChartOfAccountImportResponse,
  ChartOfAccountResponse,
} from "../data/chart-of-account.types";
import {
  CHART_OF_ACCOUNT_CREATE_PERMISSION,
  CHART_OF_ACCOUNT_CREATE_URL,
  CHART_OF_ACCOUNT_IMPORT_PERMISSION,
  CHART_OF_ACCOUNT_LIST_PAGE_TITLE,
  CHART_OF_ACCOUNT_LIST_PERMISSION,
  CHART_OF_ACCOUNT_URL,
  getChartOfAccountDetailUrl,
  getChartOfAccountEditUrl,
} from "../data/chart-of-account.utils";

/**
 * Injects TableEmptyState into the DataTable's empty cell when search/filter returns 0 results
 */
function TableEmptyStatePortal({
  containerRef,
  onResetFilter,
}: Readonly<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  onResetFilter: () => void;
}>) {
  const [targetCell, setTargetCell] = useState<HTMLTableCellElement | null>(
    null,
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkCell = () => {
      const cell = container.querySelector<HTMLTableCellElement>(
        "tbody td.text-center",
      );
      if (
        cell &&
        (cell.textContent?.trim() === "No results." ||
          cell.dataset.emptyPortal === "true")
      ) {
        if (!cell.dataset.emptyPortal) {
          cell.dataset.emptyPortal = "true";
          cell.textContent = "";
        }
        setTargetCell(cell);
      } else {
        setTargetCell(null);
      }
    };

    checkCell();

    const observer = new MutationObserver(checkCell);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerRef]);

  if (!targetCell) return null;

  return createPortal(
    <TableEmptyState onResetFilter={onResetFilter} />,
    targetCell,
  );
}

export function ChartOfAccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Toggle confirmation modal state
  const [toggleTarget, setToggleTarget] =
    useState<ChartOfAccountResponse | null>(null);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  // Import modal states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [importResult, setImportResult] =
    useState<ImportModalResultData | null>(null);
  const fullImportResultRef =
    useRef<ApiResponse<ChartOfAccountImportResponse> | null>(null);

  const importMutation = useMutation<
    ApiResponse<ChartOfAccountImportResponse>,
    Error,
    ImportChartOfAccountsVariables
  >({
    mutationFn: async (vars) => {
      if (!isExcelFile(vars.file)) {
        throw new Error("Only Excel files (.xlsx, .xls) are allowed");
      }
      const response = await chartOfAccountService.importChartOfAccounts(
        vars.file,
        vars.dryRun,
      );
      fullImportResultRef.current = response;
      // Strip errorReport to prevent ImportModal from auto-downloading
      return {
        ...response,
        data: response.data
          ? {
              ...response.data,
              errorReport: undefined as unknown as ImportErrorReport,
            }
          : response.data,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chartOfAccountQueryKeys.lists(),
      });
      const fullRes = fullImportResultRef.current;
      setImportResult({
        status: fullRes?.status ?? "SUCCESS",
        message: fullRes?.message ?? "Chart of Account import completed",
        summary: fullRes?.data?.summary,
        rowErrors: fullRes?.data?.rowErrors ?? [],
        errorReport: fullRes?.data?.errorReport ?? null,
      });
      setIsImportModalOpen(false);
      setIsResultModalOpen(true);
    },
    onError: (error: unknown) => {
      const err = error as {
        message?: string;
        response?: { data?: ApiResponse<ChartOfAccountImportResponse> };
      };
      const responseData = err?.response?.data;
      setImportResult({
        status: responseData?.status ?? "ERROR",
        message:
          responseData?.message ||
          err?.message ||
          "Failed to import Chart of Account",
        summary: responseData?.data?.summary,
        rowErrors: responseData?.data?.rowErrors ?? [],
        errorReport: responseData?.data?.errorReport ?? null,
      });
      setIsImportModalOpen(false);
      setIsResultModalOpen(true);
    },
  });

  const handleCreate = () => {
    navigate(CHART_OF_ACCOUNT_CREATE_URL);
  };

  const handleView = useCallback(
    (item: ChartOfAccountResponse) => {
      navigate(getChartOfAccountDetailUrl(item.id));
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (item: ChartOfAccountResponse) => {
      navigate(getChartOfAccountEditUrl(item.id));
    },
    [navigate],
  );

  const handleToggle = useCallback((item: ChartOfAccountResponse) => {
    setToggleTarget(item);
  }, []);

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;

    setIsToggleLoading(true);
    try {
      const willBeActive = !toggleTarget.active;
      const res = willBeActive
        ? await chartOfAccountService.activateChartOfAccount(toggleTarget.id)
        : await chartOfAccountService.deactivateChartOfAccount(toggleTarget.id);
      queryClient.invalidateQueries({
        queryKey: chartOfAccountQueryKeys.lists(),
      });

      toast.success(
        res?.message ||
        (willBeActive
          ? "Chart of Account activated successfully"
          : "Chart of Account deactivated successfully"),
      );
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        response?: { data?: { message?: string } };
      };
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update status",
      );
    } finally {
      setIsToggleLoading(false);
      setToggleTarget(null);
    }
  };

  const handleResetFilter = () => {
    const input = tableContainerRef.current?.querySelector<HTMLInputElement>(
      "input#search, input[placeholder*='Search']",
    );
    if (input) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        globalThis.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const columns = chartOfAccountColumns({
    onView: handleView,
    onEdit: handleEdit,
    onActivate: handleToggle,
    onDeactivate: handleToggle,
  });

  const handleDataLoaded = (data: PagedApiResponse<ChartOfAccountResponse>) => {
    if (data.data?.pagination?.total !== undefined) {
      setTotalCount(data.data.pagination.total);
    }
  };

  return (
    <Page
      type="base"
      title={CHART_OF_ACCOUNT_LIST_PAGE_TITLE}
      permission={CHART_OF_ACCOUNT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: CHART_OF_ACCOUNT_LIST_PAGE_TITLE,
          url: CHART_OF_ACCOUNT_URL,
        },
      ]}
    >
      <PageHeader
        title={CHART_OF_ACCOUNT_LIST_PAGE_TITLE}
        withBackButton={false}
        actions={
          <div className="flex items-center gap-3">
            <Visibility permission={CHART_OF_ACCOUNT_IMPORT_PERMISSION}>
              <Button
                variant="outline"
                className="gap-2 border-primary/40 text-primary hover:bg-primary/5 font-medium"
                onClick={() => setIsImportModalOpen(true)}
              >
                <Upload className="h-4 w-4" />
                Import Excel
              </Button>
            </Visibility>

            <Visibility permission={CHART_OF_ACCOUNT_CREATE_PERMISSION}>
              <Button
                className="gap-2 bg-[#1b2559] hover:bg-[#1b2559]/90 text-white font-medium"
                onClick={handleCreate}
              >
                <PlusCircle className="h-4 w-4" />
                Add Chart of Account
              </Button>
            </Visibility>
          </div>
        }
      />

      {/* Table Container wrapping DataTable and TableEmptyState portal */}
      <div ref={tableContainerRef} className="relative">
        <DataTable<ChartOfAccountResponse>
          title="All Chart of Account"
          badge={{
            enabled: true,
            label: `${totalCount} data`,
            variant: "outline",
          }}
          columns={columns}
          queryFn={chartOfAccountService.listChartOfAccounts}
          queryKey={chartOfAccountQueryKeys.lists()}
          search={{
            key: "search",
            label: "Search",
            placeholder: "Search Chart of Account",
          }}
          toolbar={{
            enableColumnToggle: false,
            enableFullscreenToggle: false,
          }}
          onDataLoaded={handleDataLoaded}
        />

        <TableEmptyStatePortal
          containerRef={tableContainerRef}
          onResetFilter={handleResetFilter}
        />
      </div>

      {/* Reusable StatusToggleModal from @/shared/components */}
      <StatusToggleModal
        open={!!toggleTarget}
        onOpenChange={(open) => {
          if (!open && !isToggleLoading) setToggleTarget(null);
        }}
        isActive={toggleTarget?.active}
        isLoading={isToggleLoading}
        onConfirm={handleConfirmToggle}
        onCancel={() => setToggleTarget(null)}
      />

      {/* Import Modal */}
      <ImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        title="Import Chart of Account"
        mutation={importMutation}
        downloadTemplate={() => chartOfAccountService.downloadImportTemplate()}
        templateFileName="chart_of_account_import_template.xlsx"
        acceptedFormats=".xlsx,.xls"
      />

      {/* Import Result Modal */}
      <ImportModalResult
        open={isResultModalOpen}
        onOpenChange={setIsResultModalOpen}
        result={importResult}
        title="Import Result"
      />
    </Page>
  );
}

export default ChartOfAccountPage;
