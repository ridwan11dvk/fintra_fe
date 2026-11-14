/**
 * Deposit (Open Payment) - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const DEPOSIT_LIST_PAGE_TITLE = "Open Payment";
export const DEPOSIT_BASE = "open-payment";
export const DEPOSIT_URL = "/treasury/incoming-payment/" + DEPOSIT_BASE;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const DEPOSIT_PERMISSION =
  "treasury:incoming-payment:open-payment:deposit:";
export const DEPOSIT_LIST_PERMISSION = DEPOSIT_PERMISSION + "list";
export const DEPOSIT_READ_PERMISSION = DEPOSIT_PERMISSION + "read";
export const DEPOSIT_CREATE_PERMISSION = DEPOSIT_PERMISSION + "create";
export const DEPOSIT_UPDATE_PERMISSION = DEPOSIT_PERMISSION + "update";
export const DEPOSIT_DELETE_PERMISSION = DEPOSIT_PERMISSION + "delete";
