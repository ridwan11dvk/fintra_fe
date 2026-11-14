/**
 * Cashflow Category - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const CASHFLOW_CATEGORY_LIST_PAGE_TITLE = "Cashflow Category";
export const CASHFLOW_CATEGORY_CREATE_PAGE_TITLE = "Add Cashflow Category";
export const CASHFLOW_CATEGORY_EDIT_PAGE_TITLE = "Edit Cashflow Category";
export const CASHFLOW_CATEGORY_DETAIL_PAGE_TITLE = "Detail Cashflow Category";
export const CASHFLOW_CATEGORY_BASE = "cashflow-category";
export const CASHFLOW_CATEGORY_URL = "/master-data/" + CASHFLOW_CATEGORY_BASE;
export const CASHFLOW_CATEGORY_CREATE_URL = CASHFLOW_CATEGORY_URL + "/create";

export const getCashflowCategoryDetailUrl = (id: string | number) =>
  `${CASHFLOW_CATEGORY_URL}/${id}`;

export const getCashflowCategoryEditUrl = (id: string | number) =>
  `${CASHFLOW_CATEGORY_URL}/${id}/edit`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const CASHFLOW_CATEGORY_PERMISSION = "master-data:cashflow-category:";
export const CASHFLOW_CATEGORY_LIST_PERMISSION =
  CASHFLOW_CATEGORY_PERMISSION + "list";
export const CASHFLOW_CATEGORY_READ_PERMISSION =
  CASHFLOW_CATEGORY_PERMISSION + "read";
export const CASHFLOW_CATEGORY_CREATE_PERMISSION =
  CASHFLOW_CATEGORY_PERMISSION + "create";
export const CASHFLOW_CATEGORY_UPDATE_PERMISSION =
  CASHFLOW_CATEGORY_PERMISSION + "update";
export const CASHFLOW_CATEGORY_DELETE_PERMISSION =
  CASHFLOW_CATEGORY_PERMISSION + "delete";
