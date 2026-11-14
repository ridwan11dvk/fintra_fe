import { disputeWorkflowService } from "@/features/master-data/dispute-workflow/data/dispute-workflow.service";
import type { UpdateDisputeWorkflowRequest } from "@/features/master-data/dispute-workflow/data/dispute-workflow.types";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("disputeWorkflowService", () => {
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

  describe("listDisputeWorkflows()", () => {
    it("returns list of dispute workflows on success", async () => {
      const result = await disputeWorkflowService.listDisputeWorkflows();

      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(2);
      expect(result.data.content[0].stageProcess).toBe("budget-approval");
    });

    it("throws when server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/dispute-workflow`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(
        disputeWorkflowService.listDisputeWorkflows(),
      ).rejects.toThrow();
    });
  });

  describe("toggleDisputeWorkflowActive()", () => {
    it("toggles active status successfully", async () => {
      const result = await disputeWorkflowService.toggleDisputeWorkflowActive(
        "budget-approval",
        { isActive: true },
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Dispute workflow status updated successfully");
    });

    it("throws when server returns 500", async () => {
      server.use(
        http.patch(
          `${BASE}/master/dispute-workflow/:stageProcess/activate`,
          () => {
            return HttpResponse.json(
              { message: "Internal Server Error" },
              { status: 500 },
            );
          },
        ),
      );

      await expect(
        disputeWorkflowService.toggleDisputeWorkflowActive("budget-approval", {
          isActive: false,
        }),
      ).rejects.toThrow();
    });
  });

  describe("getDisputeWorkflowDetail()", () => {
    it("returns dispute workflow detail for stage process", async () => {
      const result = await disputeWorkflowService.getDisputeWorkflowDetail(
        "budget-approval",
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].rejectReasonCategoryName).toBe(
        "Policy Violation",
      );
    });

    it("throws when server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/dispute-workflow/detail`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(
        disputeWorkflowService.getDisputeWorkflowDetail("budget-approval"),
      ).rejects.toThrow();
    });
  });

  describe("updateDisputeWorkflow()", () => {
    it("updates dispute workflow successfully", async () => {
      const result =
        await disputeWorkflowService.updateDisputeWorkflow(dummyUpdateRequest);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Dispute workflow updated successfully");
    });

    it("throws when server returns 500", async () => {
      server.use(
        http.put(`${BASE}/master/dispute-workflow`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(
        disputeWorkflowService.updateDisputeWorkflow(dummyUpdateRequest),
      ).rejects.toThrow();
    });
  });
});
