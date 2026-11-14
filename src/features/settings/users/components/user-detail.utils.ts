import { formatDate } from "@railfinance/core/lib";

export type UserDetailEntry = {
  label: string;
  value?: string | number | null;
  /** Span the whole row, used for long free-text values. */
  full?: boolean;
};

export function hasUserDetailValue(entry: UserDetailEntry): boolean {
  return entry.value !== undefined && entry.value !== null && entry.value !== "";
}

export function hasUserDetailValues(entries: UserDetailEntry[]): boolean {
  return entries.some(hasUserDetailValue);
}

/**
 * Formats an optional date, returning undefined when the value is missing so
 * the detail grid can skip the row entirely.
 */
export function formatOptionalDate(
  value: string | null | undefined,
  withTime = false,
): string | undefined {
  return value ? formatDate(value, "DD/MM/YYYY", withTime) : undefined;
}
