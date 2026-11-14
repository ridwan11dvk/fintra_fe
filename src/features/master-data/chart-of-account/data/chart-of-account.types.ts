import type { ImportResponse } from "@railfinance/core/types";

/**
 * Chart of Account Response from Backend API
 */
export interface ChartOfAccountResponse {
  id: number;
  code: string;
  name: string;
  level: number;
  description: string;
  active: boolean;
  /** Kept for backward compatibility if referenced */
  isLinked?: boolean;
}

export type ChartOfAccountImportResponse = ImportResponse;

/**
 * Chart of Account Request Body
 */
export interface ChartOfAccountRequest {
  code: string;
  name: string;
  level: number;
  description?: string;
  active?: boolean;
}

export interface ChartOfAccountActionHandlers {
  onView?: (item: ChartOfAccountResponse) => void;
  onActivate?: (item: ChartOfAccountResponse) => void;
  onDeactivate?: (item: ChartOfAccountResponse) => void;
  onEdit?: (item: ChartOfAccountResponse) => void;
  onDelete?: (item: ChartOfAccountResponse) => void;
}
