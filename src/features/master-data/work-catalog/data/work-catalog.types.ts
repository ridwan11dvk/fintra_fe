type NumericValue = number | string | null;

export interface WorkCatalogApplicableTax {
  taxId: string;
  taxName?: string;
  coefficient?: NumericValue;
  ratePercent?: NumericValue;
}

export interface WorkCatalogRef {
  id: number;
  code?: string | null;
  name?: string | null;
}

/**
 * Work Catalog response — local until @railfinance/core ships WorkCatalogResponse.
 * Matches GET /master/work-catalog/{id} (WorkCatalogResponseDTO).
 */
export interface WorkCatalogResponse {
  id: number;
  workType: string;
  subCategory?: WorkCatalogRef | null;
  groupCategory?: WorkCatalogRef | null;
  mainCategory?: WorkCatalogRef | null;
  cashflowCategory?: WorkCatalogRef | null;
  procurementSchema?: WorkCatalogRef | null;
  description?: string | null;
  isActive: boolean;
  taxes?: WorkCatalogTaxDetail[];
  createdOn?: string;
  modifiedOn?: string;
  createdBy?: string;
  modifiedBy?: string;
  /** Legacy form-only fallbacks (not returned by current API). */
  businessEntityTaxes?: WorkCatalogApplicableTax[];
  individualTaxes?: WorkCatalogApplicableTax[];
}

export type WorkCatalogTaxSubject = "BADAN_USAHA" | "PERORANGAN";

export interface WorkCatalogTaxDetail {
  id?: number;
  taxSubject: WorkCatalogTaxSubject;
  taxRateId: number;
  taxRateCode?: string | null;
  taxRateName?: string | null;
  taxName?: string | null;
  taxType?: string | null;
  coefficientNumerator?: number | null;
  coefficientDenominator?: number | null;
  coefficient?: NumericValue;
  ratePercent?: NumericValue;
  sortOrder?: number | null;
}

export interface WorkCatalogTaxRequest {
  taxSubject: WorkCatalogTaxSubject;
  taxRateId: number;
}

/**
 * Payload for POST and PUT /master/work-catalog
 */
export interface WorkCatalogRequest {
  workType: string;
  subCategoryId: number;
  groupCategoryId: number;
  mainCategoryId: number | null;
  cashflowCategoryId: number;
  procurementSchemaId: number;
  description: string;
  taxes: WorkCatalogTaxRequest[];
}
