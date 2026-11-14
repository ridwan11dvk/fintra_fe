/**
 * Revenue Center - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const REVENUE_CENTER_LIST_PAGE_TITLE = "Revenue Center";
export const REVENUE_CENTER_CREATE_PAGE_TITLE = "Add Revenue Center";
export const REVENUE_CENTER_EDIT_PAGE_TITLE = "Edit Revenue Center";
export const REVENUE_CENTER_DETAIL_PAGE_TITLE = "Detail Revenue Center";
export const REVENUE_CENTER_BASE = "revenue-center";
export const REVENUE_CENTER_URL = "/master-data/" + REVENUE_CENTER_BASE;
export const REVENUE_CENTER_CREATE_URL = REVENUE_CENTER_URL + "/create";

export const getRevenueCenterDetailUrl = (id: string | number) =>
  `${REVENUE_CENTER_URL}/${id}`;

export const getRevenueCenterEditUrl = (id: string | number) =>
  `${REVENUE_CENTER_URL}/${id}/edit`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const REVENUE_CENTER_PERMISSION = "master-data:revenue-center:";
export const REVENUE_CENTER_LIST_PERMISSION = REVENUE_CENTER_PERMISSION + "list";
export const REVENUE_CENTER_READ_PERMISSION = REVENUE_CENTER_PERMISSION + "read";
export const REVENUE_CENTER_CREATE_PERMISSION =
  REVENUE_CENTER_PERMISSION + "create";
export const REVENUE_CENTER_UPDATE_PERMISSION =
  REVENUE_CENTER_PERMISSION + "update";
export const REVENUE_CENTER_DELETE_PERMISSION =
  REVENUE_CENTER_PERMISSION + "delete";
