/**
 * Approval Workflow - Utility constants and routes
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const APPROVAL_WORKFLOW_LIST_PAGE_TITLE = "Approval Workflow";
export const APPROVAL_WORKFLOW_BASE = "approval-workflow";
export const APPROVAL_WORKFLOW_URL = "/master-data/" + APPROVAL_WORKFLOW_BASE;

export const APPROVAL_WORKFLOW_CREATE_PAGE_TITLE = "Add Approval Workflow";
export const APPROVAL_WORKFLOW_CREATE_URL = APPROVAL_WORKFLOW_URL + "/create";

export const APPROVAL_WORKFLOW_EDIT_PAGE_TITLE = "Edit Approval Workflow";
export const getApprovalWorkflowEditUrl = (id: string | number) =>
  `${APPROVAL_WORKFLOW_URL}/${id}/edit`;

export const APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE = "View Approval Workflow";
export const getApprovalWorkflowDetailUrl = (id: string | number) =>
  `${APPROVAL_WORKFLOW_URL}/${id}`;

// ============================================================================
// BADGE VARIANT HELPER
// ============================================================================

export function getLayerBadgeVariant(
  layer: string,
): "info-outline" | "success-outline" | "warning-outline" | "indigo-outline" | "purple-outline" | "outline" {
  const normalized = (layer || "").toUpperCase().replaceAll(/[\s-]+/g, "_");

  switch (normalized) {
    case "BUSINESS_LAYER":
      return "info-outline";
    case "FSSC_POP":
    case "FSSC":
      return "success-outline";
    case "FINANCIAL":
    case "FINANCE":
      return "warning-outline";
    case "TREASURY":
      return "indigo-outline";
    default:
      return "outline";
  }
}

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const APPROVAL_WORKFLOW_PERMISSION = "master-data:approval-workflow:";
export const APPROVAL_WORKFLOW_LIST_PERMISSION =
  APPROVAL_WORKFLOW_PERMISSION + "list";
export const APPROVAL_WORKFLOW_READ_PERMISSION =
  APPROVAL_WORKFLOW_PERMISSION + "read";
export const APPROVAL_WORKFLOW_CREATE_PERMISSION =
  APPROVAL_WORKFLOW_PERMISSION + "create";
export const APPROVAL_WORKFLOW_UPDATE_PERMISSION =
  APPROVAL_WORKFLOW_PERMISSION + "update";
export const APPROVAL_WORKFLOW_DELETE_PERMISSION =
  APPROVAL_WORKFLOW_PERMISSION + "delete";

// ============================================================================
// NUMBER FORMATTER
// ============================================================================

/**
 * Format a numeric string with thousand comma separators.
 */
export function formatNumberWithCommas(val: string | number | undefined | null): string {
  const str = String(val ?? "");
  const digitsOnly = str.replaceAll(/\D/g, "");
  if (!digitsOnly) return "";
  const normalized = digitsOnly.replace(/^0+(?=\d)/, "");
  return BigInt(normalized).toLocaleString("en-US");
}

/**
 * Format summary SLA to ensure "day" is appended if not already present.
 */
export function formatSummarySla(val: string | number | undefined | null): string {
  if (val === undefined || val === null || val === "") return "-";
  const str = String(val).trim();
  if (/\bdays?\b/i.test(str)) {
    return str;
  }
  return `${str} day`;
}

