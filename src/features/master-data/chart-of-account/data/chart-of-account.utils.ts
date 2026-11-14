/**
 * Chart of Account - Utility constants and helpers
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const CHART_OF_ACCOUNT_LIST_PAGE_TITLE = "Chart of Account";
export const CHART_OF_ACCOUNT_CREATE_PAGE_TITLE = "Add Chart of Account";
export const CHART_OF_ACCOUNT_EDIT_PAGE_TITLE = "Edit Chart of Account";
export const CHART_OF_ACCOUNT_DETAIL_PAGE_TITLE = "View Chart of Account";
export const CHART_OF_ACCOUNT_BASE = "chart-of-account";
export const CHART_OF_ACCOUNT_URL = "/master-data/" + CHART_OF_ACCOUNT_BASE;
export const CHART_OF_ACCOUNT_CREATE_URL = CHART_OF_ACCOUNT_URL + "/create";

export const getChartOfAccountDetailUrl = (id: string | number) =>
  `${CHART_OF_ACCOUNT_URL}/${id}`;

export const getChartOfAccountEditUrl = (id: string | number) =>
  `${CHART_OF_ACCOUNT_URL}/${id}/edit`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const CHART_OF_ACCOUNT_PERMISSION = "master-data:chart-of-account:";
export const CHART_OF_ACCOUNT_LIST_PERMISSION =
  CHART_OF_ACCOUNT_PERMISSION + "list";
export const CHART_OF_ACCOUNT_READ_PERMISSION =
  CHART_OF_ACCOUNT_PERMISSION + "read";
export const CHART_OF_ACCOUNT_CREATE_PERMISSION =
  CHART_OF_ACCOUNT_PERMISSION + "create";
export const CHART_OF_ACCOUNT_UPDATE_PERMISSION =
  CHART_OF_ACCOUNT_PERMISSION + "update";
export const CHART_OF_ACCOUNT_DELETE_PERMISSION =
  CHART_OF_ACCOUNT_PERMISSION + "delete";
export const CHART_OF_ACCOUNT_EXPORT_PERMISSION =
  CHART_OF_ACCOUNT_PERMISSION + "export";
export const CHART_OF_ACCOUNT_IMPORT_PERMISSION =
  CHART_OF_ACCOUNT_PERMISSION + "import";
