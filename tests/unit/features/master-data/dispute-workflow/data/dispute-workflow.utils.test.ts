import {
  DISPUTE_WORKFLOW_BASE,
  DISPUTE_WORKFLOW_CREATE_PERMISSION,
  DISPUTE_WORKFLOW_DELETE_PERMISSION,
  DISPUTE_WORKFLOW_DETAIL_PAGE_TITLE,
  DISPUTE_WORKFLOW_EDIT_PAGE_TITLE,
  DISPUTE_WORKFLOW_LIST_PAGE_TITLE,
  DISPUTE_WORKFLOW_LIST_PERMISSION,
  DISPUTE_WORKFLOW_PERMISSION,
  DISPUTE_WORKFLOW_READ_PERMISSION,
  DISPUTE_WORKFLOW_UPDATE_PERMISSION,
  DISPUTE_WORKFLOW_URL,
  getDisputeWorkflowDetailUrl,
  getDisputeWorkflowEditUrl,
} from "@/features/master-data/dispute-workflow/data/dispute-workflow.utils";
import { describe, expect, it } from "vitest";

describe("dispute-workflow.utils", () => {
  it("defines correct URL constants", () => {
    expect(DISPUTE_WORKFLOW_BASE).toBe("dispute-workflow");
    expect(DISPUTE_WORKFLOW_URL).toBe("/master-data/dispute-workflow");
  });

  it("builds correct dynamic URLs", () => {
    expect(getDisputeWorkflowEditUrl("budget-approval")).toBe(
      "/master-data/dispute-workflow/budget-approval/edit",
    );
    expect(getDisputeWorkflowDetailUrl("budget-approval")).toBe(
      "/master-data/dispute-workflow/budget-approval",
    );
  });

  it("defines correct titles", () => {
    expect(DISPUTE_WORKFLOW_LIST_PAGE_TITLE).toBe("Dispute Workflow");
    expect(DISPUTE_WORKFLOW_EDIT_PAGE_TITLE).toBe("Edit Dispute Workflow");
    expect(DISPUTE_WORKFLOW_DETAIL_PAGE_TITLE).toBe("View Dispute Workflow");
  });

  it("defines permissions aligned with approval workflow", () => {
    expect(DISPUTE_WORKFLOW_PERMISSION).toBe("master-data:approval-workflow:");
    expect(DISPUTE_WORKFLOW_LIST_PERMISSION).toBe(
      "master-data:approval-workflow:list",
    );
    expect(DISPUTE_WORKFLOW_READ_PERMISSION).toBe(
      "master-data:approval-workflow:read",
    );
    expect(DISPUTE_WORKFLOW_CREATE_PERMISSION).toBe(
      "master-data:approval-workflow:create",
    );
    expect(DISPUTE_WORKFLOW_UPDATE_PERMISSION).toBe(
      "master-data:approval-workflow:update",
    );
    expect(DISPUTE_WORKFLOW_DELETE_PERMISSION).toBe(
      "master-data:approval-workflow:delete",
    );
  });
});
