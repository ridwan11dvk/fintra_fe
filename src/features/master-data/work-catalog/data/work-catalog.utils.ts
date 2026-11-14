/**
 * Work Catalog - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const WORK_CATALOG_LIST_PAGE_TITLE = "Work Catalog";
export const WORK_CATALOG_CREATE_PAGE_TITLE = "Add Work Catalog";
export const WORK_CATALOG_EDIT_PAGE_TITLE = "Edit Work Catalog";
export const WORK_CATALOG_DETAIL_PAGE_TITLE = "Detail Work Catalog";
export const WORK_CATALOG_BASE = "work-catalog";
export const WORK_CATALOG_URL = "/master-data/" + WORK_CATALOG_BASE;
export const WORK_CATALOG_CREATE_URL = WORK_CATALOG_URL + "/create";

export const getWorkCatalogDetailUrl = (id: string | number) =>
  `${WORK_CATALOG_URL}/${id}`;

export const getWorkCatalogEditUrl = (id: string | number) =>
  `${WORK_CATALOG_URL}/${id}/edit`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const WORK_CATALOG_PERMISSION = "master-data:work-catalog:";
export const WORK_CATALOG_LIST_PERMISSION = WORK_CATALOG_PERMISSION + "list";
export const WORK_CATALOG_READ_PERMISSION = WORK_CATALOG_PERMISSION + "read";
export const WORK_CATALOG_CREATE_PERMISSION =
  WORK_CATALOG_PERMISSION + "create";
export const WORK_CATALOG_UPDATE_PERMISSION =
  WORK_CATALOG_PERMISSION + "update";
export const WORK_CATALOG_DELETE_PERMISSION =
  WORK_CATALOG_PERMISSION + "delete";
