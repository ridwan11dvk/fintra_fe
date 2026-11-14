import type { ImportResponse } from "@railfinance/core/types";
import type { TaxableItemTreeNode, TaxableItemWithParentResponse } from "@railfinance/core/masterdata";

// Response types are single-sourced from @railfinance/ui
// (list rows include parent/module details, hence the WithParent variant)
export type {
  TaxableItemWithParentResponse as TaxableItemResponse,
  TaxableItemTreeNode,
};

/**
 * Taxable Item Type Enum - using const object pattern
 */
export const TaxableItemType = {
  SERVICE: "SERVICE",
  GOODS: "GOODS",
} as const;

export type TaxableItemType =
  (typeof TaxableItemType)[keyof typeof TaxableItemType];

/**
 * Taxable Item Request - Payload for create and update operations
 */
export interface TaxableItemRequest {
  code?: string;
  altCode?: string;
  fullCode?: string;
  fullAltCode?: string;
  name: string;
  level?: number;
  parentId?: number | null;
  type: TaxableItemType;
  costCenterIds?: number[];
  moduleId?: number;
  isActive?: boolean;
}

/**
 * Flat row from GET /rows endpoint — level-4 leaf with full ancestor chain
 */
export interface TaxableItemRow {
  level1: TaxableItemWithParentResponse | null;
  level2: TaxableItemWithParentResponse | null;
  level3: TaxableItemWithParentResponse | null;
  level4: TaxableItemWithParentResponse | null;
}

/**
 * Taxable Item Import Response - Response from import endpoint
 */
export type TaxableItemImportResponse = ImportResponse;
