/**
 * Banner - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const BANNER_LIST_PAGE_TITLE = "Banner Management";
export const BANNER_BASE = "banner";
export const BANNER_URL = "/setting/" + BANNER_BASE;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const BANNER_PERMISSION = "app:banner:";
export const BANNER_LIST_PERMISSION = BANNER_PERMISSION + "list";
export const BANNER_READ_PERMISSION = BANNER_PERMISSION + "read";
export const BANNER_CREATE_PERMISSION = BANNER_PERMISSION + "create";
export const BANNER_UPDATE_PERMISSION = BANNER_PERMISSION + "update";
export const BANNER_DELETE_PERMISSION = BANNER_PERMISSION + "delete";

// ============================================================================
// IMAGE CONSTRAINTS
// ============================================================================

export const BANNER_IMAGE_MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const BANNER_IMAGE_ACCEPTED_TYPES =
  "image/jpeg,image/png,image/webp";
export const BANNER_IMAGE_ACCEPTED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const;

/**
 * Computes the display validity status of a banner from its date window.
 */
export type BannerValidityStatus = "active" | "scheduled" | "expired";

export function getBannerValidityStatus(
  startDate: string | undefined,
  endDate: string | undefined | null,
): BannerValidityStatus {
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
