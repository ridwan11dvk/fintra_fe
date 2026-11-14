import type { ImportResponse } from "@railfinance/core/types";

// Response types are single-sourced from @railfinance/ui
export type {
  CompanyFileResponse,
  CompanyResponse,
} from "@railfinance/core/masterdata";

/**
 * Company Request - Payload for create and update operations
 */
export interface CompanyRequest {
  code: string;
  name: string;
  alias?: string | null;
  npwp?: string | null;
  pgMerchantId?: string | null;
  city?: string | null;
  address?: string | null;
  businessType?: string | null;
  moduleIds?: number[];
  isActive: boolean;
  companyFiles?: Array<CompanyFileRequest>;
}

/**
 * Company File Request - Payload for file upload/update
 */
export interface CompanyFileRequest {
  companyId?: number;
  name?: string;
  alias?: string;
  documentDate?: string;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
  file?: File;
  fileName?: string;
  fileSize?: number;
}

/**
 * Company Import Response - Response from import endpoint
 */
export type CompanyImportResponse = ImportResponse;
