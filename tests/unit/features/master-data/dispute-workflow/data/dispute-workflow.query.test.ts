import {
  disputeWorkflowQueryKeys,
  useDisputeWorkflowDetail,
  useDisputeWorkflows,
} from "@/features/master-data/dispute-workflow/data/dispute-workflow.query";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it } from "vitest";

describe("disputeWorkflowQueryKeys", () => {
  it("all returns base key array", () => {
    expect(disputeWorkflowQueryKeys.all).toEqual(["dispute-workflows"]);
  });

  it("lists() returns lists key array", () => {
    expect(disputeWorkflowQueryKeys.lists()).toEqual([
      "dispute-workflows",
      "list",
    ]);
  });

  it("list() returns list query key with params", () => {
    expect(disputeWorkflowQueryKeys.list({ page: 0, size: 10 })).toEqual([
      "dispute-workflows",
      "list",
      { page: 0, size: 10 },
    ]);
  });

  it("details() returns details key array", () => {
    expect(disputeWorkflowQueryKeys.details()).toEqual([
      "dispute-workflows",
      "detail",
    ]);
  });

  it("detail(stageProcess) returns detail query key", () => {
    expect(disputeWorkflowQueryKeys.detail("budget-approval")).toEqual([
      "dispute-workflows",
      "detail",
      "budget-approval",
    ]);
  });

  it("detailList(stageProcess, params) returns detail query key with params", () => {
    expect(
      disputeWorkflowQueryKeys.detailList("budget-approval", {
        page: 0,
        size: 10,
      }),
    ).toEqual([
      "dispute-workflows",
      "detail",
      "budget-approval",
      { page: 0, size: 10 },
    ]);
  });
});

describe("Dispute Workflow Queries", () => {
  it("useDisputeWorkflows fetches dispute workflows list", async () => {
    const { result } = renderHook(() => useDisputeWorkflows());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(2);
  });

  it("useDisputeWorkflowDetail fetches detail for a specific stage process", async () => {
    const { result } = renderHook(() =>
      useDisputeWorkflowDetail("budget-approval"),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(1);
    expect(result.current.data?.data.content[0].rejectReasonCategoryName).toBe(
      "Policy Violation",
    );
  });
});
