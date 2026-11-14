/**
 * FAQ - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const FAQ_LIST_PAGE_TITLE = "FAQ Management";
export const FAQ_BASE = "faq";
export const FAQ_URL = "/setting/" + FAQ_BASE;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const FAQ_PERMISSION = "app:faq:";
export const FAQ_LIST_PERMISSION = FAQ_PERMISSION + "list";
export const FAQ_READ_PERMISSION = FAQ_PERMISSION + "read";
export const FAQ_CREATE_PERMISSION = FAQ_PERMISSION + "create";
export const FAQ_UPDATE_PERMISSION = FAQ_PERMISSION + "update";
export const FAQ_DELETE_PERMISSION = FAQ_PERMISSION + "delete";

// ============================================================================
// TARGET CATEGORY CONSTANTS
// ============================================================================

/** Category type code whose categories are valid FAQ targets. */
export const FAQ_TARGET_TYPE_CODE = "FAQ_TARGET";

// ============================================================================
// VALIDITY STATUS
// ============================================================================

/**
 * Computes the display validity status of a FAQ from its date window.
 */
export type FaqValidityStatus = "active" | "scheduled" | "expired";

export function getFaqValidityStatus(
  startDate: string | undefined,
  endDate: string | undefined | null,
): FaqValidityStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (start > today) {
      return "scheduled";
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    if (end < today) {
      return "expired";
    }
  }

  return "active";
}