import {
  Button,
  DataTable,
  Page,
  PageHeader,
  Separator,
} from "@railfinance/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { rejectReasonColumns } from "../components";
import {
  DISPUTE_WORKFLOW_DETAIL_PAGE_TITLE,
  DISPUTE_WORKFLOW_LIST_PAGE_TITLE,
  DISPUTE_WORKFLOW_READ_PERMISSION,
  DISPUTE_WORKFLOW_URL,
  disputeWorkflowQueryKeys,
  disputeWorkflowService,
  getDisputeWorkflowDetailUrl,
  getDisputeWorkflowEditUrl,
  useDisputeWorkflows,
  type DisputeRejectReasonItem,
  type StageCatalogItem,
} from "../data";

export function DetailDisputeWorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const stageProcess = id ?? "";

  // Invalidate and ensure fresh data when opening detail view,
  // and clear cached query on unmount
  useEffect(() => {
    if (stageProcess) {
      queryClient.invalidateQueries({
        queryKey: disputeWorkflowQueryKeys.detail(stageProcess),
      });
    }
    return () => {
      if (stageProcess) {
        queryClient.removeQueries({
          queryKey: disputeWorkflowQueryKeys.detail(stageProcess),
        });
      }
    };
  }, [stageProcess, queryClient]);

  // Get stage info from navigation state if available
  const stageFromState = location.state as StageCatalogItem | undefined;

  // Fallback query in case user refreshed or accessed directly via URL
  const { data: catalogResponse } = useDisputeWorkflows(undefined, {
    enabled: !stageFromState && !!stageProcess,
  });

  const currentStage = useMemo(() => {
    if (stageFromState) return stageFromState;
    return catalogResponse?.data?.content?.find(
      (s) => s.stageProcess === stageProcess,
    );
  }, [stageFromState, catalogResponse, stageProcess]);

  const categoryName =
    currentStage?.stageProcessCategoryName ||
    currentStage?.stageProcessCategory ||
    "-";
  const processName = currentStage?.stageProcessName || stageProcess || "-";

  return (
    <Page
      type="base"
      title={DISPUTE_WORKFLOW_DETAIL_PAGE_TITLE}
      permission={DISPUTE_WORKFLOW_READ_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: DISPUTE_WORKFLOW_LIST_PAGE_TITLE, url: DISPUTE_WORKFLOW_URL },
        {
          title: DISPUTE_WORKFLOW_DETAIL_PAGE_TITLE,
          url: getDisputeWorkflowDetailUrl(stageProcess),
        },
      ]}
    >
      <div className="space-y-6">
        <PageHeader title="View Dispute Workflow" withBackButton={false} />

        {/* Separator di atas stage process */}
        <Separator />

        {/* Top Info Details */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-16">
            <span className="w-48 text-muted-foreground font-medium">
              Stage Process Category
            </span>
            <span className="font-medium text-foreground">{categoryName}</span>
          </div>
          <div className="flex items-center gap-16">
            <span className="w-48 text-muted-foreground font-medium">
              Stage Process Name
            </span>
            <span className="font-medium text-foreground">{processName}</span>
          </div>
        </div>

        {/* Separator di bawah stage process */}
        <Separator />

        {/* Table of Reject Reasons */}
        <DataTable<DisputeRejectReasonItem>
          title="All Reject Reason"
          columns={rejectReasonColumns}
          queryFn={(params) =>
            disputeWorkflowService.getDisputeWorkflowDetail(
              stageProcess,
              params,
            )
          }
          queryKey={disputeWorkflowQueryKeys.detail(stageProcess)}
          toolbar={{
            enableColumnToggle: false,
          }}
        />

        {/* Separator di bawah table */}
        <Separator />

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-24"
            onClick={() => navigate(DISPUTE_WORKFLOW_URL)}
          >
            Back
          </Button>
          <Button
            type="button"
            className="w-24 bg-[#1C2052] hover:bg-[#151945] text-white"
            onClick={() => {
              queryClient.removeQueries({
                queryKey: disputeWorkflowQueryKeys.detail(stageProcess),
              });
              navigate(getDisputeWorkflowEditUrl(stageProcess), {
                state: currentStage,
              });
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    </Page>
  );
}

export default DetailDisputeWorkflowPage;
