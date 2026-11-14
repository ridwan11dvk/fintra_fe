import { disputeWorkflowService } from "@/features/master-data/dispute-workflow/data/dispute-workflow.service";
import {
  DISPUTE_WORKFLOW_DETAIL_PAGE_TITLE,
  DISPUTE_WORKFLOW_EDIT_PAGE_TITLE,
  DISPUTE_WORKFLOW_LIST_PAGE_TITLE,
  DISPUTE_WORKFLOW_URL,
  getDisputeWorkflowDetailUrl,
  getDisputeWorkflowEditUrl,
} from "@/features/master-data/dispute-workflow/data/dispute-workflow.utils";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("dispute-workflow FSSC-DPW", () => {
  it("FSSC-DPW-003: list returns Stage Process rows", async () => {
    const result = await disputeWorkflowService.listDisputeWorkflows();
    expect(result.status).toBe("SUCCESS");
    expect(result.data.content.length).toBeGreaterThan(0);
    expect(result.data.content[0].stageProcess).toBeTruthy();
  });

  it("FSSC-DPW-004: forwards search keyword when listing", async () => {
    let search: string | null = null;
    server.use(
      http.get(`${BASE}/master/dispute-workflow`, ({ request }) => {
        search = new URL(request.url).searchParams.get("search");
        return HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: {
            content: [],
            pagination: {
              total: 0,
              pageSize: 10,
              pageNumber: 1,
              totalPages: 0,
              currentPage: 1,
              from: 0,
              to: 0,
            },
          },
        });
      }),
    );
    await disputeWorkflowService.listDisputeWorkflows({
      search: "budget",
    } as { search: string });
    expect(search).toBe("budget");
  });

  it("FSSC-DPW-013: loads View Detail for a Stage Process", async () => {
    const result =
      await disputeWorkflowService.getDisputeWorkflowDetail("budget-approval");
    expect(result.status).toBe("SUCCESS");
    expect(result.data.content.length).toBeGreaterThan(0);
  });

  it("FSSC-DPW-014: detail exposes reject-reason rule fields", async () => {
    const result =
      await disputeWorkflowService.getDisputeWorkflowDetail("budget-approval");
    const row = result.data.content[0];
    expect(row.rejectReasonCategoryName).toBeTruthy();
  });

  it("FSSC-DPW-021: edit URL and title are defined for list Edit action", () => {
    expect(DISPUTE_WORKFLOW_EDIT_PAGE_TITLE).toBe("Edit Dispute Workflow");
    expect(getDisputeWorkflowEditUrl("budget-approval")).toBe(
      `${DISPUTE_WORKFLOW_URL}/budget-approval/edit`,
    );
  });

  it("FSSC-DPW-013: detail URL and title are defined for View", () => {
    expect(DISPUTE_WORKFLOW_DETAIL_PAGE_TITLE).toBe("View Dispute Workflow");
    expect(getDisputeWorkflowDetailUrl("budget-approval")).toBe(
      `${DISPUTE_WORKFLOW_URL}/budget-approval`,
    );
  });

  it("FSSC-DPW-030: optional Description is accepted on update payload", async () => {
    let body: { details?: { description?: string }[] } | undefined;
    server.use(
      http.put(`${BASE}/master/dispute-workflow`, async ({ request }) => {
        body = (await request.json()) as {
          details?: { description?: string }[];
        };
        return HttpResponse.json({
          status: "SUCCESS",
          message: "updated",
          data: {},
        });
      }),
    );
    await disputeWorkflowService.updateDisputeWorkflow({
      stageProcessCategory: "BUSINESS_LAYER",
      stageProcess: "budget-approval",
      details: [
        {
          rejectReasonCategory: "9",
          rejectDestination: "NON_DISPUTE",
          afterCaseCloseDestination: "ANOTHER_STAGE",
          nonDisputeRole: "17",
          stageProcess: "budget-approval",
          description: "",
        },
      ],
    });
    expect(body?.details?.[0]?.description).toBe("");
  });

  it("FSSC-DPW-041: deactivates Dispute Workflow", async () => {
    const result = await disputeWorkflowService.toggleDisputeWorkflowActive(
      "budget-approval",
      { isActive: false },
    );
    expect(result.status).toBe("SUCCESS");
  });

  it("FSSC-DPW-043: activates Dispute Workflow", async () => {
    const result = await disputeWorkflowService.toggleDisputeWorkflowActive(
      "budget-approval",
      { isActive: true },
    );
    expect(result.status).toBe("SUCCESS");
  });

  it("FSSC-DPW-002: list page title exists without an Add route helper", () => {
    expect(DISPUTE_WORKFLOW_LIST_PAGE_TITLE).toBe("Dispute Workflow");
    expect(DISPUTE_WORKFLOW_URL).toBe("/master-data/dispute-workflow");
  });
});
