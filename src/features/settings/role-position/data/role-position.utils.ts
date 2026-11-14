/**
 * Role Position - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const ROLE_POSITION_LIST_PAGE_TITLE = "Role Position Management";
export const ROLE_POSITION_BASE = "position-role";
export const ROLE_POSITION_URL = "/setting/" + ROLE_POSITION_BASE;

export const ROLE_POSITION_SHOW_PAGE_TITLE = "View Role Position";
export const ROLE_POSITION_CREATE_PAGE_TITLE = "Add Role Position";
export const ROLE_POSITION_UPDATE_PAGE_TITLE = "Edit Role Position";

export const rolePositionUrl = (): string => ROLE_POSITION_URL;
export const rolePositionDetailUrl = (id: number | string): string =>
  `${ROLE_POSITION_URL}/${id}`;
export const rolePositionCreateUrl = (): string =>
  `${ROLE_POSITION_URL}/create`;
export const rolePositionUpdateUrl = (id: number | string): string =>
  `${ROLE_POSITION_URL}/${id}/update`;

// URL helpers for reverse perspective (one role → many positions)
export const rolePositionCreateByRoleUrl = (): string =>
  `${ROLE_POSITION_URL}/by-role/create`;
export const rolePositionDetailByRoleUrl = (id: number | string): string =>
  `${ROLE_POSITION_URL}/by-role/${id}`;
export const rolePositionUpdateByRoleUrl = (id: number | string): string =>
  `${ROLE_POSITION_URL}/by-role/${id}/update`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const ROLE_POSITION_PERMISSION = "setting:position-role:";
export const ROLE_POSITION_LIST_PERMISSION = ROLE_POSITION_PERMISSION + "list";
export const ROLE_POSITION_READ_PERMISSION = ROLE_POSITION_PERMISSION + "read";
export const ROLE_POSITION_CREATE_PERMISSION =
  ROLE_POSITION_PERMISSION + "create";
export const ROLE_POSITION_UPDATE_PERMISSION =
  ROLE_POSITION_PERMISSION + "update";
export const ROLE_POSITION_DELETE_PERMISSION =
  ROLE_POSITION_PERMISSION + "delete";
