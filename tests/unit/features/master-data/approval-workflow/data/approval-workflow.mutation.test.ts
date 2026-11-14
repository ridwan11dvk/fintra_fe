import {
  useCreateApprovalWorkflowMutation,
  useUpdateApprovalWorkflowMutation,
  type CreateApprovalWorkflowRequest,
} from "@/features/master-data/approval-workflow/data";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("Approval Workflow Mutations", () => {
  const dummyPayload: CreateApprovalWorkflowRequest = {
    transactionType: 1,
    name: "Supplier Payment Workflow",
    description: "Workflow for supplier payments",
    currency: "IDR",
    levels: [
      {
        stageProcessCategory: "FINANCIAL",
        stageProcess: "financial-approval",
        outputStep: "Approval Step",
        roleSetting: "MANUAL",
        role: "Role 2",
        bands: [],
      },
    ],
  };

  describe("useCreateApprovalWorkflowMutation", () => {
    it("mutates successfully with valid payload", async () => {
      const { result } = renderHook(() => useCreateApprovalWorkflowMutation());

      result.current.mutate(dummyPayload);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.message).toBe(
        "Approval workflow created successfully",
      );
    });

    it("handles error when server fails", async () => {
      server.use(
        http.post(`${BASE}/master/approval-workflow`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      const { result } = renderHook(() => useCreateApprovalWorkflowMutation());

      result.current.mutate(dummyPayload);

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeDefined();
    });
  });

  describe("useUpdateApprovalWorkflowMutation", () => {
    it("mutates successfully with id and payload", async () => {
      const { result } = renderHook(() => useUpdateApprovalWorkflowMutation());

      result.current.mutate({
        id: "1246ac32-40d2-47c7-828c-bf37ae0868a0",
        payload: dummyPayload,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.message).toBe(
        "Approval workflow updated successfully",
      );
    });

    it("handles error when server fails", async () => {
      server.use(
        http.put(`${BASE}/master/approval-workflow/:id`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      const { result } = renderHook(() => useUpdateApprovalWorkflowMutation());

      result.current.mutate({
        id: "1246ac32-40d2-47c7-828c-bf37ae0868a0",
        payload: dummyPayload,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeDefined();
    });
  });
});
