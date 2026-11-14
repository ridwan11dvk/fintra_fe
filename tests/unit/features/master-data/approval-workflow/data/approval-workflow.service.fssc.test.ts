import { approvalWorkflowService } from "@/features/master-data/approval-workflow/data";
import type { CreateApprovalWorkflowRequest } from "@/features/master-data/approval-workflow/data";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

const payload: CreateApprovalWorkflowRequest = {
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

describe("approvalWorkflowService FSSC-APW", () => {
  it("FSSC-APW-002: lists one card per Transaction Type with workflow", async () => {
    const result = await approvalWorkflowService.listApprovalWorkflows();
    expect(result.status).toBe("SUCCESS");
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].transactionType).toBeTruthy();
  });

  it("FSSC-APW-004: returns empty list when no workflows exist", async () => {
    server.use(
      http.get(`${BASE}/master/approval-workflow`, () =>
        HttpResponse.json({ status: "SUCCESS", message: "ok", data: [] }),
      ),
    );
    const result = await approvalWorkflowService.listApprovalWorkflows();
    expect(result.data).toEqual([]);
  });

  it("FSSC-APW-009: creates Approval Workflow successfully", async () => {
    const result = await approvalWorkflowService.createApprovalWorkflow(payload);
    expect(result.status).toBe("SUCCESS");
  });

  it("FSSC-APW-010: Description is optional on Add", async () => {
    const result = await approvalWorkflowService.createApprovalWorkflow({
      ...payload,
      description: "",
    });
    expect(result.status).toBe("SUCCESS");
  });

  it("FSSC-APW-011: rejects Transaction Type that already has a workflow", async () => {
    server.use(
      http.post(`${BASE}/master/approval-workflow`, () =>
        HttpResponse.json(
          { message: "Transaction type already has a workflow" },
          { status: 400 },
        ),
      ),
    );
    await expect(
      approvalWorkflowService.createApprovalWorkflow(payload),
    ).rejects.toThrow();
  });

  it("FSSC-APW-037: opens View Detail for a Transaction Type", async () => {
    const result =
      await approvalWorkflowService.getApprovalWorkflowDetail("SUPPLIER_PAYMENT");
    expect(result.status).toBe("SUCCESS");
    expect(result.data.levels.length).toBeGreaterThan(0);
  });

  it("FSSC-APW-044: updates Workflow name and Description", async () => {
    const result = await approvalWorkflowService.updateApprovalWorkflow({
      ...payload,
      name: "Updated Workflow",
      description: "Updated desc",
    });
    expect(result.status).toBe("SUCCESS");
  });

  it("FSSC-APW-035: rejects Save without at least one level", async () => {
    server.use(
      http.post(`${BASE}/master/approval-workflow`, () =>
        HttpResponse.json({ message: "At least one level is required" }, { status: 400 }),
      ),
    );
    await expect(
      approvalWorkflowService.createApprovalWorkflow({ ...payload, levels: [] }),
    ).rejects.toThrow();
  });
});
