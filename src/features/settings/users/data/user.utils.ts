/**
 * Users - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const USER_LIST_PAGE_TITLE = "User Management";
export const USER_BASE = "user";
export const USER_URL = "/setting/" + USER_BASE;

export const INTERNAL_USER_LIST_PAGE_TITLE = "Internal Users";
export const INTERNAL_USER_CREATE_PAGE_TITLE = "Add Internal User";
export const INTERNAL_USER_UPDATE_PAGE_TITLE = "Edit Internal User";
export const INTERNAL_USER_DETAIL_PAGE_TITLE = "View Internal User";

export const EXTERNAL_USER_LIST_PAGE_TITLE = "External Users";
export const EXTERNAL_USER_CREATE_PAGE_TITLE = "Add External User";
export const EXTERNAL_USER_UPDATE_PAGE_TITLE = "Edit External User";
export const EXTERNAL_USER_DETAIL_PAGE_TITLE = "View External User";

export const SETTINGS_PAGE_TITLE = "Settings";

export const userUrl = (): string => USER_URL;

export const internalUserCreateUrl = (): string => `${USER_URL}/internal/add`;
export const internalUserDetailUrl = (id: number | string): string =>
  `${USER_URL}/internal/${id}`;
export const internalUserEditUrl = (id: number | string): string =>
  `${USER_URL}/internal/${id}/edit`;

export const externalUserCreateUrl = (): string => `${USER_URL}/external/add`;
export const externalUserDetailUrl = (id: number | string): string =>
  `${USER_URL}/external/${id}`;
export const externalUserEditUrl = (id: number | string): string =>
  `${USER_URL}/external/${id}/edit`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const USER_PERMISSION = "setting:user:";
export const USER_LIST_PERMISSION = USER_PERMISSION + "list";
export const USER_READ_PERMISSION = USER_PERMISSION + "read";
export const USER_CREATE_PERMISSION = USER_PERMISSION + "create";
export const USER_UPDATE_PERMISSION = USER_PERMISSION + "update";
export const USER_DELETE_PERMISSION = USER_PERMISSION + "delete";

// ============================================================================
// FORM OPTIONS
// ============================================================================

export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export const genderOptions = [
  { value: "Laki-Laki", label: "Male" },
  { value: "Perempuan", label: "Female" },
] as const;
