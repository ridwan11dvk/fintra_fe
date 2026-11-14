/**
 * Company - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const COMPANY_LIST_PAGE_TITLE = "Companies";
export const COMPANY_BASE = "company";
export const COMPANY_URL = "/master-data/" + COMPANY_BASE;

export const COMPANY_CREATE_PAGE_TITLE = "Create Company";
export const COMPANY_UPDATE_PAGE_TITLE = "Edit Company";
export const COMPANY_DETAIL_PAGE_TITLE = "Company Details";

export const companyCreateUrl = (): string => `${COMPANY_URL}/create`;

export const companyDetailUrl = (id: number | string): string =>
  `${COMPANY_URL}/${id}/show`;

export const companyEditUrl = (id: number | string): string =>
  `${COMPANY_URL}/${id}/edit`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const COMPANY_PERMISSION = "master-data:company:";
export const COMPANY_LIST_PERMISSION = COMPANY_PERMISSION + "list";
export const COMPANY_READ_PERMISSION = COMPANY_PERMISSION + "read";
export const COMPANY_CREATE_PERMISSION = COMPANY_PERMISSION + "create";
export const COMPANY_UPDATE_PERMISSION = COMPANY_PERMISSION + "update";
export const COMPANY_DELETE_PERMISSION = COMPANY_PERMISSION + "delete";
