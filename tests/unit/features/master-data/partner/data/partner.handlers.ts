import type {
  Partner,
  PartnerBankAccount,
  PartnerContact,
  PartnerDocument,
  PartnerErpCode,
  PartnerLegality,
  PartnerTaxProfile,
  PartnerTaxRate,
  PartnerVirtualAccount,
} from "@/features/master-data/partner/data/partner.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockPartner: Partner = {
  id: 1,
  name: "PT. Test Partner",
  partnerCode: "TST-001",
  partnerClassificationId: 1,
  partnerCategoryId: 2,
  partnerTypeId: 3,
  partnerSubTypeId: null,
  identityNumber: "ID001",
  identityNumberType: "NIK",
  nationality: "Indonesian",
  plans: null,
  companyEmail: "partner@test.com",
  companyPhoneNumber: "021-1234567",
  status: "ACTIVE",
  blacklistReason: null,
  blacklistDocument: null,
  isValidatedByDjp: false,
  integratedToErp: false,
  createdOn: "2024-01-01T00:00:00Z",
  modifiedOn: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  modifiedBy: "admin",
};

export const mockPartnerDocument: PartnerDocument = {
  id: 1,
  partnerId: 1,
  partnerDocRefId: 1,
  documentName: "Test Document",
  documentType: "PDF",
  documentDate: "2024-01-01",
  documentNumber: "DOC-001",
  documentPath: "/documents/test.pdf",
  description: "Test description",
  isActive: true,
};

export const mockPartnerContact: PartnerContact = {
  id: 1,
  partnerId: 1,
  name: "Jane Doe",
  position: "Manager",
  department: "Sales",
  phoneNumber: "021-9876543",
  email: "jane@test.com",
  preferredCommChannel: "EMAIL",
};

export const mockPartnerTaxRate: PartnerTaxRate = {
  id: 1,
  partnerId: 1,
  taxRateId: 1,
  taxRate: {
    id: 1,
    code: "PPN",
    name: "PPN",
    ratePercent: 11,
  },
  active: true,
};

export const mockPartnerBankAccount: PartnerBankAccount = {
  id: 1,
  partnerId: 1,
  companyCode: "COMP01",
  bankCenter: "BCA",
  bankBranch: "Jakarta",
  accountNumber: "1234567890",
  holderName: "PT. Test Partner",
  swiftCode: "CENAIDJA",
  currency: "IDR",
  isDefaultPayment: true,
  verificationStatus: "VERIFIED",
  active: true,
};

export const mockPartnerVirtualAccount: PartnerVirtualAccount = {
  id: 1,
  partnerId: 1,
  companyCode: "COMP01",
  bankCode: "BCA",
  type: "BANK",
  number: "1234567890",
  holder: "PT. Test Partner",
  active: true,
};

export const mockPartnerTaxProfile: PartnerTaxProfile = {
  id: 1,
  partnerId: 1,
  taxpayerName: "PT. Test Partner",
  npwpNumber: "1234567890123456",
  nitkuNumber: "1234567890123457",
  classification: "BADAN USAHA",
  isTaxExempt: false,
};

export const mockPartnerLegality: PartnerLegality = {
  id: 1,
  partnerId: 1,
  nibNumber: "NIB-001",
  deedEstablishmentNumber: "AKTA-001",
  deedAmendments: [],
};

export const mockPartnerErpCode: PartnerErpCode = {
  id: 1,
  partnerId: 1,
  erpCode: "ERP-001",
  companyCode: "COMP01",
  partnerClassificationId: 1,
  partnerCategoryId: 2,
  partnerTypeId: 3,
  partnerSubTypeId: null,
  isActive: true,
};

function paged<T>(content: T[]): PagedApiResponse<T> {
  return {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content,
      pagination: {
        total: content.length,
        pageSize: 10,
        pageNumber: 1,
        totalPages: 1,
        currentPage: 1,
        from: 1,
        to: content.length,
      },
    },
  };
}

function single<T>(data: T): ApiResponse<T> {
  return {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data,
  };
}

const deletedResponse = {
  status: "SUCCESS",
  message: "Data deleted successfully",
};

export const pagedPartnerResponse: PagedApiResponse<Partner> = paged([
  mockPartner,
]);
export const singlePartnerResponse: ApiResponse<Partner> = single(mockPartner);
export const pagedDocumentResponse: PagedApiResponse<PartnerDocument> = paged([
  mockPartnerDocument,
]);
export const singleDocumentResponse: ApiResponse<PartnerDocument> =
  single(mockPartnerDocument);
export const pagedContactResponse: PagedApiResponse<PartnerContact> = paged([
  mockPartnerContact,
]);
export const singleContactResponse: ApiResponse<PartnerContact> =
  single(mockPartnerContact);
export const contactListResponse: ApiResponse<PartnerContact[]> = single([
  mockPartnerContact,
]);
export const pagedTaxResponse: PagedApiResponse<PartnerTaxRate> = paged([
  mockPartnerTaxRate,
]);
export const singleTaxResponse: ApiResponse<PartnerTaxRate> =
  single(mockPartnerTaxRate);
export const pagedBankAccountResponse: PagedApiResponse<PartnerBankAccount> =
  paged([mockPartnerBankAccount]);
export const singleBankAccountResponse: ApiResponse<PartnerBankAccount> =
  single(mockPartnerBankAccount);
export const bankAccountListResponse: ApiResponse<PartnerBankAccount[]> =
  single([mockPartnerBankAccount]);
export const pagedVirtualAccountResponse: PagedApiResponse<PartnerVirtualAccount> =
  paged([mockPartnerVirtualAccount]);
export const singleVirtualAccountResponse: ApiResponse<PartnerVirtualAccount> =
  single(mockPartnerVirtualAccount);
export const virtualAccountListResponse: ApiResponse<PartnerVirtualAccount[]> =
  single([mockPartnerVirtualAccount]);
export const singleTaxProfileResponse: ApiResponse<PartnerTaxProfile> = single(
  mockPartnerTaxProfile,
);
export const singleLegalityResponse: ApiResponse<PartnerLegality> =
  single(mockPartnerLegality);
export const pagedErpCodeResponse: PagedApiResponse<PartnerErpCode> = paged([
  mockPartnerErpCode,
]);
export const singleErpCodeResponse: ApiResponse<PartnerErpCode> =
  single(mockPartnerErpCode);

export const partnerHandlers = [
  // -----------------------------------------------------------------------
  // Standalone child resources. These MUST be registered before the
  // `GET /master/partner/:id` handler below, otherwise paths such as
  // `/master/partner/contact` would be captured by `:id`.
  // -----------------------------------------------------------------------

  // List partner contacts (standalone resource, partnerId query filter)
  http.get(`${BASE}/master/partner/contact`, () => {
    return HttpResponse.json(pagedContactResponse);
  }),

  // List partner bank accounts (standalone resource, partnerId query filter)
  http.get(`${BASE}/master/partner/bank-account`, () => {
    return HttpResponse.json(pagedBankAccountResponse);
  }),

  // List partner virtual accounts (standalone resource, partnerId query filter)
  http.get(`${BASE}/master/partner/virtual-account`, () => {
    return HttpResponse.json(pagedVirtualAccountResponse);
  }),

  // List partner tax rate associations (standalone resource, partnerId filter)
  http.get(`${BASE}/master/partner/tax`, () => {
    return HttpResponse.json(pagedTaxResponse);
  }),

  // Filtered document references
  http.get(`${BASE}/master/partner/doc-ref/filtered`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data fetched successfully",
      data: [],
    });
  }),

  // List partner contacts as a plain list (nested read)
  http.get(`${BASE}/master/partner/:partnerId/contact`, () => {
    return HttpResponse.json(contactListResponse);
  }),

  // List partner bank accounts as a plain list (nested read)
  http.get(`${BASE}/master/partner/:partnerId/bank-account`, () => {
    return HttpResponse.json(bankAccountListResponse);
  }),

  // List partner virtual accounts as a plain list (nested read)
  http.get(`${BASE}/master/partner/:partnerId/virtual-account`, () => {
    return HttpResponse.json(virtualAccountListResponse);
  }),

  // Get partner tax profile (1:1)
  http.get(`${BASE}/master/partner/:partnerId/tax-profile`, () => {
    return HttpResponse.json(singleTaxProfileResponse);
  }),

  // Get partner legality (1:1)
  http.get(`${BASE}/master/partner/:partnerId/legality`, () => {
    return HttpResponse.json(singleLegalityResponse);
  }),

  // List partner documents
  http.get(`${BASE}/master/partner/:partnerId/document`, () => {
    return HttpResponse.json(pagedDocumentResponse);
  }),

  // Create partner document
  http.post(`${BASE}/master/partner/:partnerId/document`, () => {
    return HttpResponse.json(singleDocumentResponse, { status: 201 });
  }),

  // Update partner document
  http.put(`${BASE}/master/partner/:partnerId/document/:documentId`, () => {
    return HttpResponse.json(singleDocumentResponse);
  }),

  // Delete partner document
  http.delete(`${BASE}/master/partner/:partnerId/document/:documentId`, () => {
    return HttpResponse.json(deletedResponse);
  }),

  // Create partner contact (standalone resource)
  http.post(`${BASE}/master/partner/contact`, () => {
    return HttpResponse.json(singleContactResponse, { status: 201 });
  }),

  // Update partner contact (standalone resource)
  http.put(`${BASE}/master/partner/contact/:contactId`, () => {
    return HttpResponse.json(singleContactResponse);
  }),

  // Delete partner contact (standalone resource)
  http.delete(`${BASE}/master/partner/contact/:contactId`, () => {
    return HttpResponse.json(deletedResponse);
  }),

  // Create partner tax rate association (standalone resource)
  http.post(`${BASE}/master/partner/tax`, () => {
    return HttpResponse.json(singleTaxResponse, { status: 201 });
  }),

  // Update partner tax rate association (standalone resource)
  http.put(`${BASE}/master/partner/tax/:taxId`, () => {
    return HttpResponse.json(singleTaxResponse);
  }),

  // Delete partner tax rate association (standalone resource)
  http.delete(`${BASE}/master/partner/tax/:taxId`, () => {
    return HttpResponse.json(deletedResponse);
  }),

  // Create partner bank account (standalone resource)
  http.post(`${BASE}/master/partner/bank-account`, () => {
    return HttpResponse.json(singleBankAccountResponse, { status: 201 });
  }),

  // Update partner bank account (standalone resource)
  http.put(`${BASE}/master/partner/bank-account/:bankAccountId`, () => {
    return HttpResponse.json(singleBankAccountResponse);
  }),

  // Delete partner bank account (standalone resource)
  http.delete(`${BASE}/master/partner/bank-account/:bankAccountId`, () => {
    return HttpResponse.json(deletedResponse);
  }),

  // Create partner virtual account (standalone resource)
  http.post(`${BASE}/master/partner/virtual-account`, () => {
    return HttpResponse.json(singleVirtualAccountResponse, { status: 201 });
  }),

  // Update partner virtual account (standalone resource)
  http.put(`${BASE}/master/partner/virtual-account/:virtualAccountId`, () => {
    return HttpResponse.json(singleVirtualAccountResponse);
  }),

  // Delete partner virtual account (standalone resource)
  http.delete(
    `${BASE}/master/partner/virtual-account/:virtualAccountId`,
    () => {
      return HttpResponse.json(deletedResponse);
    },
  ),

  // -----------------------------------------------------------------------
  // Partner ERP codes (nested)
  // -----------------------------------------------------------------------

  // List partner ERP codes
  http.get(`${BASE}/master/partner/:partnerId/erp-code`, () => {
    return HttpResponse.json(pagedErpCodeResponse);
  }),

  // Get partner ERP code by ID
  http.get(`${BASE}/master/partner/:partnerId/erp-code/:erpCodeId`, () => {
    return HttpResponse.json(singleErpCodeResponse);
  }),

  // Create partner ERP code
  http.post(`${BASE}/master/partner/:partnerId/erp-code`, () => {
    return HttpResponse.json(singleErpCodeResponse, { status: 201 });
  }),

  // Update partner ERP code
  http.put(`${BASE}/master/partner/:partnerId/erp-code/:erpCodeId`, () => {
    return HttpResponse.json(singleErpCodeResponse);
  }),

  // Delete partner ERP code
  http.delete(`${BASE}/master/partner/:partnerId/erp-code/:erpCodeId`, () => {
    return HttpResponse.json(deletedResponse);
  }),

  // -----------------------------------------------------------------------
  // Partner aggregate (registered last so `:id` never shadows child paths)
  // -----------------------------------------------------------------------

  // List partners
  http.get(`${BASE}/master/partner`, () => {
    return HttpResponse.json(pagedPartnerResponse);
  }),

  // Create partner
  http.post(`${BASE}/master/partner`, () => {
    return HttpResponse.json(singlePartnerResponse, { status: 201 });
  }),

  // Get partner by ID
  http.get(`${BASE}/master/partner/:id`, () => {
    return HttpResponse.json(singlePartnerResponse);
  }),

  // Update partner
  http.put(`${BASE}/master/partner/:id`, () => {
    return HttpResponse.json(singlePartnerResponse);
  }),

  // Delete partner
  http.delete(`${BASE}/master/partner/:id`, () => {
    return HttpResponse.json(deletedResponse);
  }),
];
