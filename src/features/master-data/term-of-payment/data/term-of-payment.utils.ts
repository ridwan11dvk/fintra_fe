/**
 * Term of Payment - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const TERM_OF_PAYMENT_LIST_PAGE_TITLE = "Term of Payment";
export const TERM_OF_PAYMENT_BASE = "top";
export const TERM_OF_PAYMENT_URL = "/master-data/" + TERM_OF_PAYMENT_BASE;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const TERM_OF_PAYMENT_PERMISSION = "master-data:top:";
export const TERM_OF_PAYMENT_LIST_PERMISSION =
  TERM_OF_PAYMENT_PERMISSION + "list";
export const TERM_OF_PAYMENT_READ_PERMISSION =
  TERM_OF_PAYMENT_PERMISSION + "read";
export const TERM_OF_PAYMENT_CREATE_PERMISSION =
  TERM_OF_PAYMENT_PERMISSION + "create";
export const TERM_OF_PAYMENT_UPDATE_PERMISSION =
  TERM_OF_PAYMENT_PERMISSION + "update";
export const TERM_OF_PAYMENT_DELETE_PERMISSION =
  TERM_OF_PAYMENT_PERMISSION + "delete";

// ============================================================================
// DISCOUNT FIELD UTILITY
// ============================================================================

export const discountSetValueAs = (value: unknown) =>
  value === "" || value === 0 ? null : value;
