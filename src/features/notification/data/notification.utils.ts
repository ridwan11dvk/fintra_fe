/**
 * Notification - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const NOTIFICATION_LIST_PAGE_TITLE = "Notification";
export const NOTIFICATION_BASE = "notification";
export const NOTIFICATION_URL = "/" + NOTIFICATION_BASE;

export const ANNOUNCEMENT_LIST_PAGE_TITLE = "Announcement";
export const ANNOUNCEMENT_BASE = "announcement";
export const ANNOUNCEMENT_URL = "/" + ANNOUNCEMENT_BASE;

export const notificationUrl = (): string => NOTIFICATION_URL;
export const announcementUrl = (): string => ANNOUNCEMENT_URL;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const NOTIFICATION_PERMISSION = "app:notification:";
export const NOTIFICATION_LIST_PERMISSION = NOTIFICATION_PERMISSION + "view";
export const NOTIFICATION_READ_PERMISSION = NOTIFICATION_PERMISSION + "view";
export const NOTIFICATION_CREATE_PERMISSION =
  NOTIFICATION_PERMISSION + "manage";
export const NOTIFICATION_UPDATE_PERMISSION =
  NOTIFICATION_PERMISSION + "manage";
export const NOTIFICATION_DELETE_PERMISSION =
  NOTIFICATION_PERMISSION + "delete";
