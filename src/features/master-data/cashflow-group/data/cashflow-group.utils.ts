/**
 * Cashflow Group - Utility functions and constants
 */

export const CASHFLOW_GROUP_LIST_PAGE_TITLE = "Cashflow Group";
export const CASHFLOW_GROUP_CREATE_PAGE_TITLE = "Add Cashflow Group";
export const CASHFLOW_GROUP_EDIT_PAGE_TITLE = "Edit Cashflow Group";
export const CASHFLOW_GROUP_DETAIL_PAGE_TITLE = "Detail Cashflow Group";
export const CASHFLOW_GROUP_BASE = "cashflow-group";
export const CASHFLOW_GROUP_URL = "/master-data/" + CASHFLOW_GROUP_BASE;
export const CASHFLOW_GROUP_CREATE_URL = CASHFLOW_GROUP_URL + "/create";

export const getCashflowGroupDetailUrl = (id: string | number) =>
  `${CASHFLOW_GROUP_URL}/${id}`;

export const getCashflowGroupEditUrl = (id: string | number) =>
  `${CASHFLOW_GROUP_URL}/${id}/edit`;

export const CASHFLOW_GROUP_PERMISSION = "master-data:cashflow-group:";
export const CASHFLOW_GROUP_LIST_PERMISSION = CASHFLOW_GROUP_PERMISSION + "list";
export const CASHFLOW_GROUP_READ_PERMISSION = CASHFLOW_GROUP_PERMISSION + "read";
export const CASHFLOW_GROUP_CREATE_PERMISSION =
  CASHFLOW_GROUP_PERMISSION + "create";
export const CASHFLOW_GROUP_UPDATE_PERMISSION =
  CASHFLOW_GROUP_PERMISSION + "update";
export const CASHFLOW_GROUP_DELETE_PERMISSION =
  CASHFLOW_GROUP_PERMISSION + "delete";

export const CASHFLOW_TYPE_OPTIONS = [
  { value: "RECIPIENT", label: "Recipient/Target" },
  { value: "PROVIDER", label: "Provider" },
] as const;

export function getCashflowTypeLabel(value?: string | null) {
  return (
    CASHFLOW_TYPE_OPTIONS.find((option) => option.value === value)?.label || "—"
  );
}

export function getExceptionLabel(value?: string | null) {
  if (value == null) return "—";
  return value === "1" ? "Yes" : value === "0" ? "No" : value;
}
