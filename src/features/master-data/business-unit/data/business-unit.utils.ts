/**
 * Business Unit - Utility constants and helpers
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const BUSINESS_UNIT_LIST_PAGE_TITLE = "Business Unit";
export const BUSINESS_UNIT_CREATE_PAGE_TITLE = "Add Business Unit";
export const BUSINESS_UNIT_EDIT_PAGE_TITLE = "Edit Business Unit";
export const BUSINESS_UNIT_DETAIL_PAGE_TITLE = "View Business Unit";
export const BUSINESS_UNIT_BASE = "business-unit";
export const BUSINESS_UNIT_URL = "/master-data/" + BUSINESS_UNIT_BASE;
export const BUSINESS_UNIT_CREATE_URL = BUSINESS_UNIT_URL + "/create";

export const getBusinessUnitDetailUrl = (id: string | number) =>
  `${BUSINESS_UNIT_URL}/${id}`;

export const getBusinessUnitEditUrl = (id: string | number) =>
  `${BUSINESS_UNIT_URL}/${id}/edit`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const BUSINESS_UNIT_PERMISSION = "master-data:business-unit:";
export const BUSINESS_UNIT_LIST_PERMISSION =
  BUSINESS_UNIT_PERMISSION + "list";
export const BUSINESS_UNIT_READ_PERMISSION =
  BUSINESS_UNIT_PERMISSION + "read";
export const BUSINESS_UNIT_CREATE_PERMISSION =
  BUSINESS_UNIT_PERMISSION + "create";
export const BUSINESS_UNIT_UPDATE_PERMISSION =
  BUSINESS_UNIT_PERMISSION + "update";
export const BUSINESS_UNIT_DELETE_PERMISSION =
  BUSINESS_UNIT_PERMISSION + "delete";
export const BUSINESS_UNIT_EXPORT_PERMISSION =
  BUSINESS_UNIT_PERMISSION + "export";
export const BUSINESS_UNIT_IMPORT_PERMISSION =
  BUSINESS_UNIT_PERMISSION + "import";
