/**
 * Posting Auto - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const POSTING_AUTO_LIST_PAGE_TITLE = "Incoming Payment";
export const POSTING_AUTO_BASE = "incoming-payment";
export const POSTING_AUTO_URL = "/monitoring/" + POSTING_AUTO_BASE;

export const POSTING_AUTO_DETAIL_PAGE_TITLE = "Posting Detail";

export const postingAutoDetailUrl = (
  reversalFlag: string,
  documentNumber: string,
  reference: string,
) =>
  `${POSTING_AUTO_URL}/${encodeURIComponent(reversalFlag)}/${encodeURIComponent(documentNumber)}/${encodeURIComponent(reference)}`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const POSTING_AUTO_PERMISSION = "monitoring:incoming-payment:";
export const POSTING_AUTO_LIST_PERMISSION = POSTING_AUTO_PERMISSION + "list";
export const POSTING_AUTO_READ_PERMISSION = POSTING_AUTO_PERMISSION + "read";
export const POSTING_AUTO_CREATE_PERMISSION =
  POSTING_AUTO_PERMISSION + "create";
export const POSTING_AUTO_UPDATE_PERMISSION =
  POSTING_AUTO_PERMISSION + "update";
export const POSTING_AUTO_DELETE_PERMISSION =
  POSTING_AUTO_PERMISSION + "delete";
