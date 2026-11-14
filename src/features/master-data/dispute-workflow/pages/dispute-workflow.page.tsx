import { TableEmptyState } from "@/shared/components";
import {
  DataTable,
  Page,
  PageHeader,
} from "@railfinance/core";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { disputeWorkflowColumns } from "../components";
import {
  DISPUTE_WORKFLOW_LIST_PAGE_TITLE,
  DISPUTE_WORKFLOW_LIST_PERMISSION,
  DISPUTE_WORKFLOW_URL,
  disputeWorkflowQueryKeys,
  disputeWorkflowService,
  getDisputeWorkflowDetailUrl,
  getDisputeWorkflowEditUrl,
  type StageCatalogItem,
} from "../data";

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

export function DisputeWorkflowPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: disputeWorkflowQueryKeys.all,
    });
  }, [queryClient]);

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

  const handleView = useCallback(
    (item: StageCatalogItem) => {
      queryClient.removeQueries({
        queryKey: disputeWorkflowQueryKeys.detail(item.stageProcess),
      });
      navigate(getDisputeWorkflowDetailUrl(item.stageProcess), { state: item });
    },
    [navigate, queryClient],
  );

  const handleEdit = useCallback(
    (item: StageCatalogItem) => {
      queryClient.removeQueries({
        queryKey: disputeWorkflowQueryKeys.detail(item.stageProcess),
      });
      navigate(getDisputeWorkflowEditUrl(item.stageProcess), { state: item });
    },
    [navigate, queryClient],
  );

  const columns = useMemo(
    () =>
      disputeWorkflowColumns({
        onView: handleView,
        onEdit: handleEdit,
      }),
    [handleView, handleEdit],
  );

  return (
    <Page
      type="base"
      title={DISPUTE_WORKFLOW_LIST_PAGE_TITLE}
      permission={DISPUTE_WORKFLOW_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: DISPUTE_WORKFLOW_LIST_PAGE_TITLE,
          url: DISPUTE_WORKFLOW_URL,
        },
      ]}
    >
      <div className="space-y-6">
        <PageHeader title="Dispute Workflow" withBackButton={false} />

        <div ref={tableContainerRef} className="relative">
          <DataTable<StageCatalogItem>
            title="All Dispute Workflow"
            columns={columns}
            queryFn={disputeWorkflowService.listDisputeWorkflows}
            queryKey={disputeWorkflowQueryKeys.lists()}
            search={{
              key: "search",
              placeholder: "Search Dispute Workflow",
            }}
            toolbar={{
              enableColumnToggle: false,
            }}
          />

          <TableEmptyStatePortal
            containerRef={tableContainerRef}
            onResetFilter={handleResetFilter}
          />
        </div>
      </div>
    </Page>
  );
}

export default DisputeWorkflowPage;
