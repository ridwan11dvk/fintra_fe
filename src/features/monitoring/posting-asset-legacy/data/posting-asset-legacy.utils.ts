/**
 * Posting Asset Legacy - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const POSTING_ASSET_LEGACY_LIST_PAGE_TITLE = "Invoice Legacy";
export const POSTING_ASSET_LEGACY_BASE = "invoice-legacy";
export const POSTING_ASSET_LEGACY_URL =
  "/monitoring/" + POSTING_ASSET_LEGACY_BASE;

export const POSTING_ASSET_LEGACY_DETAIL_PAGE_TITLE = "Posting Detail";

export const postingAssetLegacyDetailUrl = (
  reversalFlag: string,
  documentNumber: string,
  reference: string,
): string =>
  `${POSTING_ASSET_LEGACY_URL}/${encodeURIComponent(reversalFlag)}/${encodeURIComponent(documentNumber)}/${encodeURIComponent(reference)}`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const POSTING_ASSET_LEGACY_PERMISSION = "monitoring:invoice:";
export const POSTING_ASSET_LEGACY_LIST_PERMISSION =
  POSTING_ASSET_LEGACY_PERMISSION + "list";
export const POSTING_ASSET_LEGACY_READ_PERMISSION =
  POSTING_ASSET_LEGACY_PERMISSION + "read";
export const POSTING_ASSET_LEGACY_CREATE_PERMISSION =
  POSTING_ASSET_LEGACY_PERMISSION + "create";
export const POSTING_ASSET_LEGACY_UPDATE_PERMISSION =
  POSTING_ASSET_LEGACY_PERMISSION + "update";
export const POSTING_ASSET_LEGACY_DELETE_PERMISSION =
  POSTING_ASSET_LEGACY_PERMISSION + "delete";
