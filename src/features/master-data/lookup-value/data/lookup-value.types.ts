export type { LookupValueResponse } from "@railfinance/core/masterdata";

/**
 * Lookup Value Request - Payload for create and update operations
 */
export interface CategoryRequest {
  typeCode: string;
  code?: string | null;
  name: string;
  nameEn?: string | null;
  description?: string;
  descriptionEn?: string;
  moduleId?: number | null;
  featureId?: number | null;
  isActive?: boolean;
}
