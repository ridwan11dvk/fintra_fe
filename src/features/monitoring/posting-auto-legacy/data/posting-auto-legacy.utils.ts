/**
 * Posting Auto Legacy - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const POSTING_AUTO_LEGACY_LIST_PAGE_TITLE = "Incoming Payment Legacy";
export const POSTING_AUTO_LEGACY_BASE = "incoming-payment-legacy";
export const POSTING_AUTO_LEGACY_URL =
  "/monitoring/" + POSTING_AUTO_LEGACY_BASE;

export const POSTING_AUTO_LEGACY_DETAIL_PAGE_TITLE = "Posting Detail";

export const postingAutoLegacyDetailUrl = (
  reversalFlag: string,
  documentNumber: string,
  reference: string,
): string =>
  `${POSTING_AUTO_LEGACY_URL}/${encodeURIComponent(reversalFlag)}/${encodeURIComponent(documentNumber)}/${encodeURIComponent(reference)}`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const POSTING_AUTO_LEGACY_PERMISSION = "monitoring:incoming-payment:";
export const POSTING_AUTO_LEGACY_LIST_PERMISSION =
  POSTING_AUTO_LEGACY_PERMISSION + "list";
export const POSTING_AUTO_LEGACY_READ_PERMISSION =
  POSTING_AUTO_LEGACY_PERMISSION + "read";
export const POSTING_AUTO_LEGACY_CREATE_PERMISSION =
  POSTING_AUTO_LEGACY_PERMISSION + "create";
export const POSTING_AUTO_LEGACY_UPDATE_PERMISSION =
  POSTING_AUTO_LEGACY_PERMISSION + "update";
export const POSTING_AUTO_LEGACY_DELETE_PERMISSION =
  POSTING_AUTO_LEGACY_PERMISSION + "delete";
