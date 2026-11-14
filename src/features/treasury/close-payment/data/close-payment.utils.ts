/**
 * Close Payment - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const CLOSE_PAYMENT_LIST_PAGE_TITLE = "Close Payment";
export const CLOSE_PAYMENT_BASE = "close-payment";
export const CLOSE_PAYMENT_URL =
  "/treasury/incoming-payment/" + CLOSE_PAYMENT_BASE;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const CLOSE_PAYMENT_PERMISSION =
  "treasury:incoming-payment:close-payment:";
export const CLOSE_PAYMENT_LIST_PERMISSION = CLOSE_PAYMENT_PERMISSION + "list";
export const CLOSE_PAYMENT_READ_PERMISSION = CLOSE_PAYMENT_PERMISSION + "read";
export const CLOSE_PAYMENT_CREATE_PERMISSION =
  CLOSE_PAYMENT_PERMISSION + "create";
export const CLOSE_PAYMENT_UPDATE_PERMISSION =
  CLOSE_PAYMENT_PERMISSION + "update";
export const CLOSE_PAYMENT_DELETE_PERMISSION =
  CLOSE_PAYMENT_PERMISSION + "delete";
