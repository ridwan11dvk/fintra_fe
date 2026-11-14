/**
 * Role - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const SETTING_SECTION_TITLE = "Settings";

export const ROLE_LIST_PAGE_TITLE = "Role Management";
export const ROLE_BASE = "role";
export const ROLE_URL = "/setting/" + ROLE_BASE;

export const ROLE_SHOW_PAGE_TITLE = "Role Detail";
export const ROLE_CREATE_PAGE_TITLE = "Create Role";
export const ROLE_UPDATE_PAGE_TITLE = "Update Role";

export const roleUrl = (): string => ROLE_URL;
export const roleDetailUrl = (id: number | string): string =>
  `${ROLE_URL}/${id}`;
export const roleCreateUrl = (): string => `${ROLE_URL}/create`;
export const roleUpdateUrl = (id: number | string): string =>
  `${ROLE_URL}/${id}/update`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const ROLE_PERMISSION = "setting:role:";
export const ROLE_LIST_PERMISSION = ROLE_PERMISSION + "list";
export const ROLE_READ_PERMISSION = ROLE_PERMISSION + "read";
export const ROLE_CREATE_PERMISSION = ROLE_PERMISSION + "create";
export const ROLE_UPDATE_PERMISSION = ROLE_PERMISSION + "update";
export const ROLE_DELETE_PERMISSION = ROLE_PERMISSION + "delete";
