/**
 * Posting Asset - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const POSTING_ASSET_LIST_PAGE_TITLE = "Posting Invoice";
export const POSTING_ASSET_BASE = "invoice";
export const POSTING_ASSET_URL = "/monitoring/" + POSTING_ASSET_BASE;

export const POSTING_ASSET_DETAIL_PAGE_TITLE = "Posting Detail";

export const postingAssetDetailUrl = (
  reversalFlag: string,
  documentNumber: string,
  reference: string,
): string =>
  `${POSTING_ASSET_URL}/${encodeURIComponent(reversalFlag)}/${encodeURIComponent(documentNumber)}/${encodeURIComponent(reference)}`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const POSTING_ASSET_PERMISSION = "monitoring:invoice:";
export const POSTING_ASSET_LIST_PERMISSION = POSTING_ASSET_PERMISSION + "list";
export const POSTING_ASSET_READ_PERMISSION = POSTING_ASSET_PERMISSION + "read";
export const POSTING_ASSET_CREATE_PERMISSION =
  POSTING_ASSET_PERMISSION + "create";
export const POSTING_ASSET_UPDATE_PERMISSION =
  POSTING_ASSET_PERMISSION + "update";
export const POSTING_ASSET_DELETE_PERMISSION =
  POSTING_ASSET_PERMISSION + "delete";
