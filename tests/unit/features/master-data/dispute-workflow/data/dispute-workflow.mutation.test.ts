import {
  useToggleDisputeWorkflowMutation,
  useUpdateDisputeWorkflowMutation,
} from "@/features/master-data/dispute-workflow/data/dispute-workflow.mutation";
import type { UpdateDisputeWorkflowRequest } from "@/features/master-data/dispute-workflow/data/dispute-workflow.types";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("Dispute Workflow Mutations", () => {
  const dummyUpdateRequest: UpdateDisputeWorkflowRequest = {
    stageProcessCategory: "BUSINESS_LAYER",
    stageProcess: "budget-approval",
    details: [
      {
        rejectReasonCategory: "9",
        rejectDestination: "NON_DISPUTE",
        afterCaseCloseDestination: "ANOTHER_STAGE",
        nonDisputeRole: "17",
        stageProcess: "budget-approval",
        description: "Test update",
      },
    ],
  };

  describe("useToggleDisputeWorkflowMutation", () => {
    it("toggles active status successfully", async () => {
      const { result } = renderHook(() => useToggleDisputeWorkflowMutation());

      result.current.mutate({
        stageProcess: "budget-approval",
        isActive: true,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.message).toBe(
        "Dispute workflow status updated successfully",
      );
    });

    it("handles error when server fails", async () => {
      server.use(
        http.patch(
          `${BASE}/master/dispute-workflow/:stageProcess/activate`,
          () => HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      const { result } = renderHook(() => useToggleDisputeWorkflowMutation());

      result.current.mutate({
        stageProcess: "budget-approval",
        isActive: false,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeDefined();
    });
  });

  describe("useUpdateDisputeWorkflowMutation", () => {
    it("updates workflow successfully", async () => {
      const { result } = renderHook(() => useUpdateDisputeWorkflowMutation());

      result.current.mutate(dummyUpdateRequest);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("SUCCESS");
      expect(result.current.data?.message).toBe(
        "Dispute workflow updated successfully",
      );
    });

    it("handles error when server fails", async () => {
      server.use(
        http.put(`${BASE}/master/dispute-workflow`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      const { result } = renderHook(() => useUpdateDisputeWorkflowMutation());

      result.current.mutate(dummyUpdateRequest);

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeDefined();
    });
  });
});
