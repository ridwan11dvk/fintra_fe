/**
 * Dispute Workflow - Utility constants and routes
 */

export const DISPUTE_WORKFLOW_LIST_PAGE_TITLE = "Dispute Workflow";
export const DISPUTE_WORKFLOW_BASE = "dispute-workflow";
export const DISPUTE_WORKFLOW_URL = "/master-data/" + DISPUTE_WORKFLOW_BASE;

export const DISPUTE_WORKFLOW_EDIT_PAGE_TITLE = "Edit Dispute Workflow";
export const getDisputeWorkflowEditUrl = (id: string) =>
  `${DISPUTE_WORKFLOW_URL}/${id}/edit`;

export const DISPUTE_WORKFLOW_DETAIL_PAGE_TITLE = "View Dispute Workflow";
export const getDisputeWorkflowDetailUrl = (id: string) =>
  `${DISPUTE_WORKFLOW_URL}/${id}`;

export const DISPUTE_WORKFLOW_PERMISSION = "master-data:approval-workflow:";
export const DISPUTE_WORKFLOW_LIST_PERMISSION =
  DISPUTE_WORKFLOW_PERMISSION + "list";
export const DISPUTE_WORKFLOW_READ_PERMISSION =
  DISPUTE_WORKFLOW_PERMISSION + "read";
export const DISPUTE_WORKFLOW_CREATE_PERMISSION =
  DISPUTE_WORKFLOW_PERMISSION + "create";
export const DISPUTE_WORKFLOW_UPDATE_PERMISSION =
  DISPUTE_WORKFLOW_PERMISSION + "update";
export const DISPUTE_WORKFLOW_DELETE_PERMISSION =
  DISPUTE_WORKFLOW_PERMISSION + "delete";
