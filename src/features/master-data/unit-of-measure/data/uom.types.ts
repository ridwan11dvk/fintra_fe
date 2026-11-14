import type { ImportResponse } from "@railfinance/core/types";
import type { UomResponse as UomResponseBase } from "@railfinance/core/masterdata";

/**
 * UomResponse extended with the new i18n + required-alias fields.
 * Local extension until @railfinance/ui ships them; drop this override
 * once the package publishes the updated UomResponse type.
 */
export type UomResponse = UomResponseBase & {
  unitEn?: string | null;
  unitAlias: string;
};

/** Alias kept for existing consumers */
export type UomImportResponse = ImportResponse;

/**
 * Uom Request - Payload for create and update operations
 */
export interface UomRequest {
  code: string;
  unit: string;
  unitEn?: string;
  unitAlias: string;
  isActive: boolean;
}
