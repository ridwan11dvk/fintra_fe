// Local type definitions matching the party-model partner API
// (railfinance-common master data, finalink_t_partner + child tables).
// NOTE: @railfinance/ui is consumed as a built npm package and does not yet
// export the new child types, so they are defined here.

export type { Partner, PartnerDocRefResponse as PartnerDocReference } from "@railfinance/core/masterdata";

// ============== CHILD RESOURCE TYPES ==============

/**
 * Partner role assignment (vendor / mitra / customer) per company code.
 */
export interface PartnerRole {
  id: number;
  partnerId: number;
  partnerName?: string | null;
  type: string;
  companyCode?: string | null;
  status?: string | null;
  blacklistReason?: string | null;
  blacklistDocument?: string | null;
}

/**
 * Partner contact person. Replaces the former correspondent/branch resource
 * (simplified: no address, no tax identity).
 */
export interface PartnerContact {
  id: number;
  partnerId: number;
  name?: string | null;
  position?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  preferredCommChannel?: string | null;
}

/**
 * Partner address with optional geo master FKs plus free-text city.
 */
export interface PartnerAddress {
  id: number;
  partnerId: number;
  name?: string | null;
  countryId?: number | null;
  provinceId?: number | null;
  regencyId?: number | null;
  districtId?: number | null;
  villageId?: number | null;
  city?: string | null;
  postalCode?: string | null;
  detail?: string | null;
  isDefault: boolean;
  isDefaultTax: boolean;
}

/**
 * Partner KBLI entry.
 */
export interface PartnerKbli {
  id: number;
  partnerId: number;
  code?: string | null;
  active: boolean;
}

/**
 * Deed amendment (perubahan akta) of a partner legality record.
 */
export interface PartnerDeedAmendment {
  id: number;
  legalityId: number;
  number?: string | null;
  date?: string | null;
  document?: string | null;
}

/**
 * Partner legality (1:1): NIB and deed of establishment with amendments.
 */
export interface PartnerLegality {
  id: number;
  partnerId: number;
  nibNumber?: string | null;
  nibDate?: string | null;
  nibDocument?: string | null;
  deedEstablishmentNumber?: string | null;
  deedEstablishmentDate?: string | null;
  deedEstablishmentDocument?: string | null;
  deedAmendments?: PartnerDeedAmendment[] | null;
}

/**
 * Partner tax profile (1:1): the tax identity carried by the partner row.
 */
export interface PartnerTaxProfile {
  id: number;
  partnerId: number;
  taxpayerName?: string | null;
  vatStatus?: string | null;
  address?: string | null;
  taxableEmployerNo?: string | null;
  npwpNumber?: string | null;
  npwpDocument?: string | null;
  nitkuNumber?: string | null;
  document?: string | null;
  classification?: string | null;
  vatRate?: string | null;
  wapuStatus?: string | null;
  isTaxExempt: boolean;
  exemptDocument?: string | null;
}

/**
 * Partner tax rate association. Renamed from PartnerTax; path stays /tax.
 */
export interface PartnerTaxRate {
  id: number;
  partnerId: number;
  taxRateId: number;
  /** Embedded tax rate detail (structural subset of TaxRateResponse). */
  taxRate?: {
    id: number;
    code?: string | null;
    name?: string | null;
    ratePercent?: number | null;
  } | null;
  active: boolean;
}

/**
 * @deprecated Use {@link PartnerTaxRate} instead.
 */
export type PartnerTax = PartnerTaxRate;

/**
 * Partner bank account. Absorbs the BANK side of the former transaction
 * account resource.
 */
export interface PartnerBankAccount {
  id: number;
  partnerId: number;
  companyCode?: string | null;
  bankCenter?: string | null;
  bankBranch?: string | null;
  accountNumber: string;
  holderName?: string | null;
  swiftCode?: string | null;
  currency?: string | null;
  isDefaultPayment: boolean;
  verificationStatus?: string | null;
  active: boolean;
}

/**
 * Partner virtual account. Absorbs the VA side of the former transaction
 * account resource.
 */
export interface PartnerVirtualAccount {
  id: number;
  partnerId: number;
  companyCode?: string | null;
  bankCode?: string | null;
  type?: string | null;
  number: string;
  holder?: string | null;
  active: boolean;
}

/**
 * Partner document.
 */
export interface PartnerDocument {
  id: number;
  partnerId?: number;
  partnerDocRefId?: number;
  documentName: string;
  documentPath?: string | null;
  documentType?: string | null;
  documentDate?: string | null;
  documentNumber?: string | null;
  description?: string | null;
  fileSize?: number | null;
  isActive?: boolean;
}

/**
 * Partner ERP code.
 */
export interface PartnerErpCode {
  id: number;
  partnerId?: number;
  erpCode: string;
  companyCode?: string | null;
  partnerClassificationId?: number | null;
  partnerCategoryId?: number | null;
  partnerLegalityId?: number | null;
  partnerRoleId?: number | null;
  partnerTypeId?: number | null;
  partnerSubTypeId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
}

// ============== REQUEST TYPES ==============

/**
 * Partner Request - Payload for create and update operations (multipart).
 * Aggregate child collections are serialized JSON strings.
 */
export interface PartnerRequest {
  partnerCode: string;
  name: string;
  legalName?: string | null;
  companyGroup?: string | null;
  legalityStatus?: string | null;
  businessSizing?: string | null;
  region?: string | null;
  partnerCategoryId?: number | null;
  partnerClassificationId?: number | null;
  partnerTypeId?: number | null;
  partnerSubTypeId?: number | null;
  identityNumber?: string | null;
  identityNumberType?: string | null;
  nationality?: string | null;
  plans?: string | null;
  companyWebsite?: string | null;
  companyEmail?: string | null;
  companyPhoneNumber?: string | null;
  status?: string | null;
  blacklistReason?: string | null;
  blacklistDocument?: string | null;
  blacklistDocumentObject?: File | null;
  parentId?: number | null;
  isDataComplete?: boolean;
  isValidatedByDjp?: boolean;
  integratedToErp?: boolean;
  // Tax profile (NPWP / NITKU)
  taxpayerName?: string | null;
  vatStatus?: string | null;
  taxAddress?: string | null;
  taxableEmployerNo?: string | null;
  npwpNumber?: string | null;
  npwpDocument?: string | null;
  nitkuNumber?: string | null;
  taxDocument?: string | null;
  taxClassification?: string | null;
  vatRate?: string | null;
  wapuStatus?: string | null;
  isTaxExempt?: boolean;
  taxExemptDocument?: string | null;
  // Aggregate child collections (JSON strings in the multipart payload)
  partnerRolesJson?: string;
  partnerAddressesJson?: string;
  partnerContactsJson?: string;
  partnerKblisJson?: string;
  partnerTaxProfileJson?: string;
  partnerLegalityJson?: string;
  partnerBankAccountsJson?: string;
  partnerVirtualAccountsJson?: string;
  partnerTaxesJson?: string;
  partnerDocuments?: PartnerDocumentRequest[]; // For handling document uploads in the form
  fileIndexMapping?: string; // For handling file uploads in the form
}

/**
 * Partner Document Request - Payload for document upload
 */
export interface PartnerDocumentRequest {
  partnerId?: number;
  partnerDocRefId?: number;
  documentName: string;
  documentType?: string | null;
  documentDate?: string | null;
  documentNumber?: string | null;
  description?: string | null;
  isActive?: boolean;
  file?: File;
  fileSize?: number;
}

/**
 * Partner Role Request - Payload for role creation/update
 */
export interface PartnerRoleRequest {
  partnerId?: number;
  type: string;
  companyCode?: string | null;
  status?: string | null;
  blacklistReason?: string | null;
  blacklistDocument?: string | null;
  file?: File | null;
}

/**
 * Partner Contact Request - Payload for contact creation/update
 */
export interface PartnerContactRequest {
  partnerId?: number;
  name?: string | null;
  position?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  preferredCommChannel?: string | null;
}

/**
 * Partner Address Request - Payload for address creation/update
 */
export interface PartnerAddressRequest {
  partnerId?: number;
  name?: string | null;
  countryId?: number | null;
  provinceId?: number | null;
  regencyId?: number | null;
  districtId?: number | null;
  villageId?: number | null;
  city?: string | null;
  postalCode?: string | null;
  detail?: string | null;
  isDefault?: boolean;
  isDefaultTax?: boolean;
}

/**
 * Partner KBLI Request - Payload for kbli creation/update
 */
export interface PartnerKbliRequest {
  partnerId?: number;
  code: string;
  active?: boolean;
}

/**
 * Partner Legality Request - Payload for legality creation/update
 */
export interface PartnerLegalityRequest {
  partnerId?: number;
  nibNumber?: string | null;
  nibDate?: string | null;
  nibDocument?: string | null;
  deedEstablishmentNumber?: string | null;
  deedEstablishmentDate?: string | null;
  deedEstablishmentDocument?: string | null;
  deedAmendments?: PartnerDeedAmendmentRequest[];
}

/**
 * Partner Deed Amendment Request - Payload for deed amendment creation/update
 */
export interface PartnerDeedAmendmentRequest {
  legalityId?: number;
  number?: string | null;
  date?: string | null;
  document?: string | null;
}

/**
 * Partner Tax Profile Request - Payload for tax profile creation/update
 */
export interface PartnerTaxProfileRequest {
  partnerId?: number;
  taxpayerName?: string | null;
  vatStatus?: string | null;
  address?: string | null;
  taxableEmployerNo?: string | null;
  npwpNumber?: string | null;
  npwpDocument?: string | null;
  nitkuNumber?: string | null;
  document?: string | null;
  classification?: string | null;
  vatRate?: string | null;
  wapuStatus?: string | null;
  isTaxExempt?: boolean;
  exemptDocument?: string | null;
}

/**
 * Partner Tax Rate Request - Payload for tax association (path /tax)
 */
export interface PartnerTaxRateRequest {
  partnerId?: number;
  taxRateId: number;
  active?: boolean;
}

/**
 * @deprecated Use {@link PartnerTaxRateRequest} instead.
 */
export type PartnerTaxRequest = PartnerTaxRateRequest;

/**
 * Partner Bank Account Request - Payload for bank account creation/update
 */
export interface PartnerBankAccountRequest {
  partnerId?: number;
  companyCode?: string | null;
  bankCenter?: string | null;
  bankBranch?: string | null;
  accountNumber: string;
  holderName?: string | null;
  swiftCode?: string | null;
  currency?: string | null;
  isDefaultPayment?: boolean;
  active?: boolean;
}

/**
 * Partner Virtual Account Request - Payload for VA creation/update
 */
export interface PartnerVirtualAccountRequest {
  partnerId?: number;
  companyCode?: string | null;
  bankCode?: string | null;
  type?: string | null;
  number: string;
  holder?: string | null;
  active?: boolean;
}

/**
 * Partner ERP Code Request - Payload for ERP code creation/update
 */
export interface PartnerErpCodeRequest {
  partnerId?: number;
  erpCode: string;
  companyCode?: string | null;
  partnerClassificationId?: number | null;
  partnerCategoryId?: number | null;
  partnerLegalityId?: number | null;
  partnerRoleId?: number | null;
  partnerTypeId?: number | null;
  partnerSubTypeId?: number | null;
  isActive?: boolean;
}
