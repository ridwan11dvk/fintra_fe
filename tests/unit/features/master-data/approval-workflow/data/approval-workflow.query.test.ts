import {
  approvalWorkflowQueryKeys,
  useApprovalWorkflowDetail,
  useApprovalWorkflowStageTemplate,
  useListApprovalWorkflows,
  useStageCategoryOptions,
  useStageProcessOptions,
  useTransactionTypeOptions,
} from "@/features/master-data/approval-workflow/data/approval-workflow.query";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it } from "vitest";

describe("approvalWorkflowQueryKeys", () => {
  it("all returns base key array", () => {
    expect(approvalWorkflowQueryKeys.all).toEqual(["approvalWorkflows"]);
  });

  it("lists() returns lists key array", () => {
    expect(approvalWorkflowQueryKeys.lists()).toEqual([
      "approvalWorkflows",
      "list",
    ]);
  });

  it("list() returns list query key", () => {
    expect(approvalWorkflowQueryKeys.list()).toEqual([
      "approvalWorkflows",
      "list",
    ]);
  });

  it("details() returns details key array", () => {
    expect(approvalWorkflowQueryKeys.details()).toEqual([
      "approvalWorkflows",
      "detail",
    ]);
  });

  it("detail(type) returns detail key for specified type", () => {
    expect(approvalWorkflowQueryKeys.detail("SUPPLIER_PAYMENT")).toEqual([
      "approvalWorkflows",
      "detail",
      "SUPPLIER_PAYMENT",
    ]);
  });

  it("transactionTypeOptions() returns options key", () => {
    expect(approvalWorkflowQueryKeys.transactionTypeOptions()).toEqual([
      "approvalWorkflows",
      "options",
      "transaction-type",
      1,
    ]);
    expect(approvalWorkflowQueryKeys.transactionTypeOptions(2)).toEqual([
      "approvalWorkflows",
      "options",
      "transaction-type",
      2,
    ]);
  });

  it("stageCategoryOptions() returns options key", () => {
    expect(approvalWorkflowQueryKeys.stageCategoryOptions()).toEqual([
      "approvalWorkflows",
      "options",
      "stage-category",
    ]);
  });

  it("stageProcessOptions(stageCategory) returns options key with category", () => {
    expect(approvalWorkflowQueryKeys.stageProcessOptions("FINANCIAL")).toEqual([
      "approvalWorkflows",
      "options",
      "stage-process",
      "FINANCIAL",
    ]);
  });

  it("stageProcessOptions() without category returns options key without category", () => {
    expect(approvalWorkflowQueryKeys.stageProcessOptions()).toEqual([
      "approvalWorkflows",
      "options",
      "stage-process",
    ]);
  });

  it("defaultStages(transactionTypeId) returns the template key for that type", () => {
    expect(approvalWorkflowQueryKeys.defaultStages(42)).toEqual([
      "approvalWorkflows",
      "template",
      42,
    ]);
  });
});

describe("Approval Workflow Queries", () => {
  describe("useListApprovalWorkflows", () => {
    it("fetches approval workflows successfully", async () => {
      const { result } = renderHook(() => useListApprovalWorkflows());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.data).toHaveLength(2);
      expect(result.current.data?.data[0].transactionType).toBe(
        "SUPPLIER_PAYMENT",
      );
    });
  });

  describe("useApprovalWorkflowDetail", () => {
    it("fetches workflow detail when type is provided", async () => {
      const { result } = renderHook(() =>
        useApprovalWorkflowDetail("SUPPLIER_PAYMENT"),
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.data.transactionType).toBe(1);
    });

    it("does not fetch when type is undefined or empty", async () => {
      const { result } = renderHook(() => useApprovalWorkflowDetail(""));

      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("useTransactionTypeOptions", () => {
    it("fetches transaction type options successfully", async () => {
      const { result } = renderHook(() => useTransactionTypeOptions(1));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.data).toHaveLength(2);
      expect(result.current.data?.data[0].value).toBe(1);
    });
  });

  describe("useStageCategoryOptions", () => {
    it("fetches stage category options successfully", async () => {
      const { result } = renderHook(() => useStageCategoryOptions());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.data).toHaveLength(2);
    });
  });

  describe("useStageProcessOptions", () => {
    it("fetches stage process options when stageCategory is provided", async () => {
      const { result } = renderHook(() =>
        useStageProcessOptions("FINANCIAL"),
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.data).toHaveLength(2);
    });

    it("fetches all stage process options when stageCategory is omitted", async () => {
      const { result } = renderHook(() => useStageProcessOptions());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.data).toHaveLength(2);
    });
  });

  describe("useApprovalWorkflowStageTemplate", () => {
    it("fetches ordered default stages for a transaction type", async () => {
      const { result } = renderHook(() => useApprovalWorkflowStageTemplate(1));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.data.map((stage) => stage.stageProcessName)).toEqual([
        "Business Unit Verification",
        "Financial Control",
      ]);
    });

    it("does not fetch when the transaction type is missing", () => {
      const { result } = renderHook(() => useApprovalWorkflowStageTemplate());

      expect(result.current.fetchStatus).toBe("idle");
    });
  });
});
