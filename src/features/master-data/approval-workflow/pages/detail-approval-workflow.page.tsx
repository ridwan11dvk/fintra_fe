import {
  Badge,
  Button,
  Page,
  PageHeader,
  Separator,
  useGetModuleByName,
  useGetTransactionTypeOptions,
  Visibility,
} from "@railfinance/core";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
  APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE,
  APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
  APPROVAL_WORKFLOW_READ_PERMISSION,
  APPROVAL_WORKFLOW_UPDATE_PERMISSION,
  APPROVAL_WORKFLOW_URL,
  formatSummarySla,
  getApprovalWorkflowDetailUrl,
  getApprovalWorkflowEditUrl,
  getLayerBadgeVariant,
  useApprovalWorkflowDetail,
  type ApprovalLevelItem,
} from "../data";

export function DetailApprovalWorkflowPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading } = useApprovalWorkflowDetail(id);
  const { data: moduleData } = useGetModuleByName("Payable");
  const { data: txOptionsRes } = useGetTransactionTypeOptions(
    moduleData?.data?.id,
  );

  const detailData = response?.data;

  const transactionTypeLabel = useMemo(() => {
    const rawType = detailData?.transactionType || id;
    if (!rawType) return "-";
    const typeOptions = txOptionsRes?.data ?? [];
    const found = typeOptions.find(
      (opt) => String(opt.value) === String(rawType),
    );
    return found?.label || detailData?.name || rawType;
  }, [detailData, id, txOptionsRes?.data]);

  const levels: ApprovalLevelItem[] = useMemo(() => {
    if (!detailData?.levels || detailData.levels.length === 0) return [];
    return detailData.levels.map((lvl, idx) => ({
      id: lvl.id || `lvl-${idx + 1}`,
      order: idx + 1,
      layer: lvl.stageProcessCategoryName || lvl.stageProcessCategory,
      title: lvl.stageProcessName || "-",
      description: lvl.outputStep || "",
    }));
  }, [detailData]);

  if (!isLoading && !detailData) {
    return (
      <Page
        type="base"
        title={APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE}
        permission={APPROVAL_WORKFLOW_READ_PERMISSION}
        breadcrumbs={[
          { title: "Master Data", url: "#" },
          {
            title: APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
            url: APPROVAL_WORKFLOW_URL,
          },
          {
            title: APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE,
            url: "#",
          },
        ]}
      >
        <PageHeader
          title={APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE}
          withBackButton={false}
        />
        <Separator className="mb-8" />
        <div className="py-12 text-center text-muted-foreground">
          <p>Approval workflow not found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(APPROVAL_WORKFLOW_URL)}
          >
            Back to Approval Workflows
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page
      type="base"
      title={APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE}
      permission={APPROVAL_WORKFLOW_READ_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        {
          title: APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
          url: APPROVAL_WORKFLOW_URL,
        },
        {
          title: APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE,
          url: getApprovalWorkflowDetailUrl(id ?? ""),
        },
      ]}
    >
      <PageHeader
        title={APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE}
        withBackButton={false}
      />

      <Separator className="mb-8" />

      {/* Info Details Section */}
      <div className="space-y-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
          <span className="w-56 text-sm font-medium text-foreground shrink-0">
            Transaction type
          </span>
          <span className="text-sm text-foreground">
            {transactionTypeLabel}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
          <span className="w-56 text-sm font-medium text-foreground shrink-0">
            Workflow name
          </span>
          <span className="text-sm text-foreground">
            {detailData?.name ?? "-"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
          <span className="w-56 text-sm font-medium text-foreground shrink-0">
            Description
          </span>
          <span className="text-sm text-foreground">
            {detailData?.description || "-"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
          <span className="w-56 text-sm font-medium text-foreground shrink-0">
            Summary SLA
          </span>
          <span className="text-sm text-foreground">
            {formatSummarySla(detailData?.summarySla)}
          </span>
        </div>
      </div>

      {/* Approval Levels Section */}
      <div className="mt-10 mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Approval levels
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Approvals run from top to bottom. Drag to reorder.
        </p>
      </div>

      {/* Read-Only Levels List */}
      <div className="space-y-3 relative">
        {levels.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Vertical connector line between cards */}
            {index < levels.length - 1 && (
              <div className="absolute left-[30px] top-10 -bottom-3.5 w-px bg-border z-0" />
            )}

            {/* Read-only Level Card */}
            <div className="relative z-10 flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-border bg-card shadow-2xs">
              {/* Order Number Badge */}
              <div className="size-7 rounded-full bg-[#1b2559] text-white flex items-center justify-center font-semibold text-xs shrink-0 select-none">
                {item.order}
              </div>

              {/* Layer Badge, Title, & Description */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={getLayerBadgeVariant(item.layer)}
                    className="text-[11px] font-normal px-2.5 py-0.5 rounded-full"
                  >
                    {item.layer}
                  </Badge>
                  <span className="font-semibold text-sm text-foreground">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="mt-8 mb-6" />

      {/* Bottom Actions: Back and Edit */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="px-5 h-9"
          onClick={() => navigate(APPROVAL_WORKFLOW_URL)}
        >
          Back
        </Button>
        <Visibility permission={APPROVAL_WORKFLOW_UPDATE_PERMISSION}>
          <Button
            type="button"
            className="bg-[#1b2559] hover:bg-[#1b2559]/90 text-white px-5 h-9"
            onClick={() => navigate(getApprovalWorkflowEditUrl(detailData?.transactionType || id || ""))}
          >
            Edit
          </Button>
        </Visibility>
      </div>
    </Page>
  );
}

export default DetailApprovalWorkflowPage;
