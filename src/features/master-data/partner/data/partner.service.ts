import type {
  Partner,
  PartnerBankAccount,
  PartnerBankAccountRequest,
  PartnerContact,
  PartnerContactRequest,
  PartnerDeedAmendment,
  PartnerDeedAmendmentRequest,
  PartnerDocReference,
  PartnerDocument,
  PartnerDocumentRequest,
  PartnerErpCode,
  PartnerErpCodeRequest,
  PartnerKbli,
  PartnerKbliRequest,
  PartnerLegality,
  PartnerLegalityRequest,
  PartnerRequest,
  PartnerRole,
  PartnerRoleRequest,
  PartnerTaxProfile,
  PartnerTaxProfileRequest,
  PartnerTaxRate,
  PartnerTaxRateRequest,
  PartnerVirtualAccount,
  PartnerVirtualAccountRequest,
} from "@/features/master-data/partner/data/partner.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance, objectToFormData } from "@railfinance/core/lib";

import { payableApi } from "@/features/master-data/shared/payable-api";

const PARTNER_BASE_URL = "/master/partner";

export const partnerService = {
  /**
   * Get all partners with pagination
   */
  listPartners: async (
    params?: PaginationParams & { search?: string; status?: string },
  ): Promise<PagedApiResponse<Partner>> => {
    const response = await axiosInstance.get<PagedApiResponse<Partner>>(
      PARTNER_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get partner by ID
   */
  getPartnerById: async (id: number): Promise<ApiResponse<Partner>> => {
    const response = await axiosInstance.get<ApiResponse<Partner>>(
      `${PARTNER_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new partner
   */
  createPartner: async (
    data: PartnerRequest,
  ): Promise<ApiResponse<Partner>> => {
    const formData = objectToFormData(data);

    const response = await axiosInstance.post<ApiResponse<Partner>>(
      PARTNER_BASE_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Update partner
   */
  updatePartner: async (
    id: number,
    data: Partial<PartnerRequest>,
  ): Promise<ApiResponse<Partner>> => {
    const formData = objectToFormData(data);

    const response = await axiosInstance.put<ApiResponse<Partner>>(
      `${PARTNER_BASE_URL}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Delete partner
   */
  deletePartner: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/${id}`,
    );
    return response.data;
  },

  // ============== DOCUMENT ENDPOINTS (nested, multipart) ==============

  /**
   * Get partner documents with pagination
   */
  listPartnerDocuments: async (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ): Promise<PagedApiResponse<PartnerDocument>> => {
    const response = await axiosInstance.get<PagedApiResponse<PartnerDocument>>(
      `${PARTNER_BASE_URL}/${partnerId}/document`,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Create partner document with file upload
   */
  uploadPartnerDocument: async (
    partnerId: number,
    data: PartnerDocumentRequest,
  ): Promise<ApiResponse<PartnerDocument>> => {
    const formData = objectToFormData(data);
    const response = await axiosInstance.post<ApiResponse<PartnerDocument>>(
      `${PARTNER_BASE_URL}/${partnerId}/document`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Update partner document metadata
   */
  updatePartnerDocument: async (
    partnerId: number,
    documentId: number,
    data: Partial<PartnerDocumentRequest>,
  ): Promise<ApiResponse<PartnerDocument>> => {
    const formData = objectToFormData(data);

    const response = await axiosInstance.put<ApiResponse<PartnerDocument>>(
      `${PARTNER_BASE_URL}/${partnerId}/document/${documentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Delete partner document
   */
  deletePartnerDocument: async (
    partnerId: number,
    documentId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/${partnerId}/document/${documentId}`,
    );
    return response.data;
  },

  // ============== CONTACT ENDPOINTS ==============

  /**
   * Get contacts of a partner, paginated (standalone resource with partnerId filter)
   */
  listPartnerContacts: async (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ): Promise<PagedApiResponse<PartnerContact>> => {
    const response = await axiosInstance.get<PagedApiResponse<PartnerContact>>(
      `${PARTNER_BASE_URL}/contact`,
      {
        params: { ...params, partnerId },
      },
    );
    return response.data;
  },

  /**
   * Get all contacts of a partner as a plain list (nested read)
   */
  getPartnerContactsList: async (
    partnerId: number,
  ): Promise<ApiResponse<PartnerContact[]>> => {
    const response = await axiosInstance.get<ApiResponse<PartnerContact[]>>(
      `${PARTNER_BASE_URL}/${partnerId}/contact`,
    );
    return response.data;
  },

  /**
   * Create partner contact (standalone resource)
   */
  createPartnerContact: async (
    data: PartnerContactRequest,
  ): Promise<ApiResponse<PartnerContact>> => {
    const response = await axiosInstance.post<ApiResponse<PartnerContact>>(
      `${PARTNER_BASE_URL}/contact`,
      data,
    );
    return response.data;
  },

  /**
   * Update partner contact (standalone resource)
   */
  updatePartnerContact: async (
    contactId: number,
    data: Partial<PartnerContactRequest>,
  ): Promise<ApiResponse<PartnerContact>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerContact>>(
      `${PARTNER_BASE_URL}/contact/${contactId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete partner contact (standalone resource)
   */
  deletePartnerContact: async (
    contactId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/contact/${contactId}`,
    );
    return response.data;
  },

  // ============== ROLE ENDPOINTS ==============

  /**
   * Get roles of a partner, paginated (standalone resource with partnerId filter)
   */
  listPartnerRoles: async (
    partnerId: number,
    params?: PaginationParams & {
      search?: string;
      type?: string;
      companyCode?: string;
      status?: string;
    },
  ): Promise<PagedApiResponse<PartnerRole>> => {
    const response = await axiosInstance.get<PagedApiResponse<PartnerRole>>(
      `${PARTNER_BASE_URL}/role`,
      {
        params: { ...params, partnerId },
      },
    );
    return response.data;
  },

  /**
   * Get all roles of a partner as a plain list (nested read)
   */
  getPartnerRolesList: async (
    partnerId: number,
  ): Promise<ApiResponse<PartnerRole[]>> => {
    const response = await axiosInstance.get<ApiResponse<PartnerRole[]>>(
      `${PARTNER_BASE_URL}/${partnerId}/role`,
    );
    return response.data;
  },

  /**
   * Create partner role (standalone resource)
   */
  createPartnerRole: async (
    data: PartnerRoleRequest,
  ): Promise<ApiResponse<PartnerRole>> => {
    const formData = new FormData();
    if (data.partnerId !== undefined && data.partnerId !== null) {
      formData.append("partnerId", String(data.partnerId));
    }
    formData.append("type", data.type);
    if (data.companyCode) formData.append("companyCode", data.companyCode);
    if (data.status) formData.append("status", data.status);
    if (data.blacklistReason) formData.append("blacklistReason", data.blacklistReason);
    if (data.blacklistDocument) formData.append("blacklistDocument", data.blacklistDocument);
    if (data.file) formData.append("file", data.file);

    const response = await axiosInstance.post<ApiResponse<PartnerRole>>(
      `${PARTNER_BASE_URL}/role`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  /**
   * Update partner role (standalone resource)
   */
  updatePartnerRole: async (
    roleId: number,
    data: Partial<PartnerRoleRequest>,
  ): Promise<ApiResponse<PartnerRole>> => {
    const formData = new FormData();
    if (data.partnerId !== undefined && data.partnerId !== null) {
      formData.append("partnerId", String(data.partnerId));
    }
    if (data.type !== undefined) formData.append("type", data.type);
    if (data.companyCode !== undefined && data.companyCode !== null) {
      formData.append("companyCode", data.companyCode);
    }
    if (data.status !== undefined && data.status !== null) {
      formData.append("status", data.status);
    }
    if (data.blacklistReason !== undefined && data.blacklistReason !== null) {
      formData.append("blacklistReason", data.blacklistReason);
    }
    if (data.blacklistDocument !== undefined && data.blacklistDocument !== null) {
      formData.append("blacklistDocument", data.blacklistDocument);
    }
    if (data.file) formData.append("file", data.file);

    const response = await axiosInstance.put<ApiResponse<PartnerRole>>(
      `${PARTNER_BASE_URL}/role/${roleId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  /**
   * Delete partner role (standalone resource)
   */
  deletePartnerRole: async (roleId: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/role/${roleId}`,
    );
    return response.data;
  },

  // ============== KBLI ENDPOINTS ==============

  /**
   * Get KBLI entries of a partner, paginated (standalone resource with partnerId filter)
   */
  listPartnerKblis: async (
    partnerId: number,
    params?: PaginationParams & { search?: string; active?: boolean },
  ): Promise<PagedApiResponse<PartnerKbli>> => {
    const queryParams: Record<string, string | number | undefined> = {
      partnerId,
      page: params?.page,
      size: params?.size,
      search: params?.search,
      active: params?.active === undefined ? undefined : String(params.active),
    };
    const data = await payableApi.get<NonNullable<PagedApiResponse<PartnerKbli>["data"]>>(
      "/api/master/partner/kbli",
      queryParams,
    );
    return { status: "SUCCESS", message: "Partner KBLIs retrieved successfully", data };
  },

  /**
   * Get all KBLI entries of a partner as a plain list (nested read)
   */
  getPartnerKblisList: async (
    partnerId: number,
  ): Promise<ApiResponse<PartnerKbli[]>> => {
    const response = await axiosInstance.get<ApiResponse<PartnerKbli[]>>(
      `${PARTNER_BASE_URL}/${partnerId}/kbli`,
    );
    return response.data;
  },

  /**
   * Create partner KBLI entry (standalone resource)
   */
  createPartnerKbli: async (
    data: PartnerKbliRequest,
  ): Promise<ApiResponse<PartnerKbli>> => {
    const created = await payableApi.post<PartnerKbli>("/api/master/partner/kbli", data);
    return { status: "SUCCESS", message: "Partner KBLI created successfully", data: created };
  },

  /**
   * Update partner KBLI entry (standalone resource)
   */
  updatePartnerKbli: async (
    kbliId: number,
    data: Partial<PartnerKbliRequest>,
  ): Promise<ApiResponse<PartnerKbli>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerKbli>>(
      `${PARTNER_BASE_URL}/kbli/${kbliId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete partner KBLI entry (standalone resource)
   */
  deletePartnerKbli: async (kbliId: number): Promise<ApiResponse<string>> => {
    const message = await payableApi.delete<string>(`/api/master/partner/kbli/${kbliId}`);
    return { status: "SUCCESS", message, data: message };
  },

  // ============== LEGALITY ENDPOINTS ==============

  /**
   * Get the legality record of a partner (1:1, nested read)
   */
  getPartnerLegality: async (
    partnerId: number,
  ): Promise<ApiResponse<PartnerLegality>> => {
    const response = await axiosInstance.get<ApiResponse<PartnerLegality>>(
      `${PARTNER_BASE_URL}/${partnerId}/legality`,
    );
    return response.data;
  },

  /**
   * Get deed amendments of a partner legality record (nested read under the
   * legality resource)
   */
  listPartnerDeedAmendments: async (
    legalityId: number,
  ): Promise<ApiResponse<PartnerDeedAmendment[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerDeedAmendment[]>
    >(`${PARTNER_BASE_URL}/legality/${legalityId}/deed-amendment`);
    return response.data;
  },

  /**
   * Create partner legality (standalone resource)
   */
  createPartnerLegality: async (
    data: PartnerLegalityRequest,
  ): Promise<ApiResponse<PartnerLegality>> => {
    const response = await axiosInstance.post<ApiResponse<PartnerLegality>>(
      `${PARTNER_BASE_URL}/legality`,
      data,
    );
    return response.data;
  },

  /**
   * Update partner legality (standalone resource)
   */
  updatePartnerLegality: async (
    legalityId: number,
    data: Partial<PartnerLegalityRequest>,
  ): Promise<ApiResponse<PartnerLegality>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerLegality>>(
      `${PARTNER_BASE_URL}/legality/${legalityId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete partner legality (standalone resource)
   */
  deletePartnerLegality: async (
    legalityId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/legality/${legalityId}`,
    );
    return response.data;
  },

  /**
   * Create deed amendment under a legality (standalone resource)
   */
  createPartnerDeedAmendment: async (
    legalityId: number,
    data: PartnerDeedAmendmentRequest,
  ): Promise<ApiResponse<PartnerDeedAmendment>> => {
    const response = await axiosInstance.post<
      ApiResponse<PartnerDeedAmendment>
    >(`${PARTNER_BASE_URL}/legality/${legalityId}/deed-amendment`, data);
    return response.data;
  },

  /**
   * Update deed amendment under a legality (standalone resource)
   */
  updatePartnerDeedAmendment: async (
    legalityId: number,
    amendmentId: number,
    data: Partial<PartnerDeedAmendmentRequest>,
  ): Promise<ApiResponse<PartnerDeedAmendment>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerDeedAmendment>>(
      `${PARTNER_BASE_URL}/legality/${legalityId}/deed-amendment/${amendmentId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete deed amendment under a legality (standalone resource)
   */
  deletePartnerDeedAmendment: async (
    legalityId: number,
    amendmentId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/legality/${legalityId}/deed-amendment/${amendmentId}`,
    );
    return response.data;
  },

  // ============== TAX PROFILE ENDPOINTS ==============

  /**
   * Get the tax profile of a partner (1:1, nested read)
   */
  getPartnerTaxProfile: async (
    partnerId: number,
  ): Promise<ApiResponse<PartnerTaxProfile>> => {
    const response = await axiosInstance.get<ApiResponse<PartnerTaxProfile>>(
      `${PARTNER_BASE_URL}/${partnerId}/tax-profile`,
    );
    return response.data;
  },

  /**
   * Create partner tax profile (standalone resource)
   */
  createPartnerTaxProfile: async (
    data: PartnerTaxProfileRequest,
  ): Promise<ApiResponse<PartnerTaxProfile>> => {
    const response = await axiosInstance.post<ApiResponse<PartnerTaxProfile>>(
      `${PARTNER_BASE_URL}/tax-profile`,
      data,
    );
    return response.data;
  },

  /**
   * Update partner tax profile (standalone resource)
   */
  updatePartnerTaxProfile: async (
    taxProfileId: number,
    data: Partial<PartnerTaxProfileRequest>,
  ): Promise<ApiResponse<PartnerTaxProfile>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerTaxProfile>>(
      `${PARTNER_BASE_URL}/tax-profile/${taxProfileId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete partner tax profile (standalone resource)
   */
  deletePartnerTaxProfile: async (
    taxProfileId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/tax-profile/${taxProfileId}`,
    );
    return response.data;
  },

  // ============== TAX RATE ENDPOINTS (kept path /tax) ==============

  /**
   * Get partner tax rate associations, paginated (standalone resource with
   * partnerId filter; there is no nested /{partnerId}/tax list endpoint)
   */
  listPartnerTaxes: async (
    partnerId: number,
    params?: PaginationParams & { search?: string; active?: boolean },
  ): Promise<PagedApiResponse<PartnerTaxRate>> => {
    const response = await axiosInstance.get<PagedApiResponse<PartnerTaxRate>>(
      `${PARTNER_BASE_URL}/tax`,
      {
        params: { ...params, partnerId },
      },
    );
    return response.data;
  },

  /**
   * Create partner tax rate association (standalone resource)
   */
  createPartnerTax: async (
    partnerId: number,
    data: PartnerTaxRateRequest,
  ): Promise<ApiResponse<PartnerTaxRate>> => {
    const response = await axiosInstance.post<ApiResponse<PartnerTaxRate>>(
      `${PARTNER_BASE_URL}/tax`,
      { ...data, partnerId },
    );
    return response.data;
  },

  /**
   * Update partner tax rate association (standalone resource)
   */
  updatePartnerTax: async (
    partnerId: number,
    taxId: number,
    data: Partial<PartnerTaxRateRequest>,
  ): Promise<ApiResponse<PartnerTaxRate>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerTaxRate>>(
      `${PARTNER_BASE_URL}/tax/${taxId}`,
      { ...data, partnerId },
    );
    return response.data;
  },

  /**
   * Delete partner tax rate association (standalone resource)
   */
  deletePartnerTax: async (taxId: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/tax/${taxId}`,
    );
    return response.data;
  },

  // ============== Doc Reference ENDPOINTS ==============
  /**
   * Get filtered list of documents for reference in forms (e.g. when associating a document to a partner)
   */
  getFilteredDocRef: async (
    companyCode: string | undefined,
    countryId?: number,
    partnerCategoryId?: number,
    partnerTypeId?: number,
    partnerSubTypeId?: number,
    partnerLegalityId?: number,
    partnerRoleId?: number,
  ): Promise<ApiResponse<Array<PartnerDocReference>>> => {
    const response = await axiosInstance.get<
      ApiResponse<Array<PartnerDocReference>>
    >(`${PARTNER_BASE_URL}/doc-ref/filtered`, {
      params: {
        companyCode,
        countryId,
        partnerCategoryId,
        partnerTypeId,
        partnerSubTypeId,
        partnerLegalityId,
        partnerRoleId,
      },
    });
    return response.data;
  },

  // ============== BANK ACCOUNT ENDPOINTS ==============

  /**
   * Get bank accounts of a partner, paginated (standalone resource with
   * partnerId filter)
   */
  listPartnerBankAccounts: async (
    partnerId: number,
    params?: PaginationParams & {
      search?: string;
      companyCode?: string;
      verificationStatus?: string;
    },
  ): Promise<PagedApiResponse<PartnerBankAccount>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PartnerBankAccount>
    >(`${PARTNER_BASE_URL}/bank-account`, {
      params: { ...params, partnerId },
    });
    return response.data;
  },

  /**
   * Get all bank accounts of a partner as a plain list (nested read)
   */
  getPartnerBankAccountsList: async (
    partnerId: number,
  ): Promise<ApiResponse<PartnerBankAccount[]>> => {
    const response = await axiosInstance.get<ApiResponse<PartnerBankAccount[]>>(
      `${PARTNER_BASE_URL}/${partnerId}/bank-account`,
    );
    return response.data;
  },

  /**
   * Create partner bank account (standalone resource)
   */
  createPartnerBankAccount: async (
    data: PartnerBankAccountRequest,
  ): Promise<ApiResponse<PartnerBankAccount>> => {
    const response = await axiosInstance.post<ApiResponse<PartnerBankAccount>>(
      `${PARTNER_BASE_URL}/bank-account`,
      data,
    );
    return response.data;
  },

  /**
   * Update partner bank account (standalone resource)
   */
  updatePartnerBankAccount: async (
    bankAccountId: number,
    data: Partial<PartnerBankAccountRequest>,
  ): Promise<ApiResponse<PartnerBankAccount>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerBankAccount>>(
      `${PARTNER_BASE_URL}/bank-account/${bankAccountId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete partner bank account (standalone resource)
   */
  deletePartnerBankAccount: async (
    bankAccountId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/bank-account/${bankAccountId}`,
    );
    return response.data;
  },

  // ============== VIRTUAL ACCOUNT ENDPOINTS ==============

  /**
   * Get virtual accounts of a partner, paginated (standalone resource with
   * partnerId filter)
   */
  listPartnerVirtualAccounts: async (
    partnerId: number,
    params?: PaginationParams & {
      search?: string;
      companyCode?: string;
      type?: string;
    },
  ): Promise<PagedApiResponse<PartnerVirtualAccount>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PartnerVirtualAccount>
    >(`${PARTNER_BASE_URL}/virtual-account`, {
      params: { ...params, partnerId },
    });
    return response.data;
  },

  /**
   * Get all virtual accounts of a partner as a plain list (nested read)
   */
  getPartnerVirtualAccountsList: async (
    partnerId: number,
  ): Promise<ApiResponse<PartnerVirtualAccount[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerVirtualAccount[]>
    >(`${PARTNER_BASE_URL}/${partnerId}/virtual-account`);
    return response.data;
  },

  /**
   * Create partner virtual account (standalone resource)
   */
  createPartnerVirtualAccount: async (
    data: PartnerVirtualAccountRequest,
  ): Promise<ApiResponse<PartnerVirtualAccount>> => {
    const response = await axiosInstance.post<
      ApiResponse<PartnerVirtualAccount>
    >(`${PARTNER_BASE_URL}/virtual-account`, data);
    return response.data;
  },

  /**
   * Update partner virtual account (standalone resource)
   */
  updatePartnerVirtualAccount: async (
    virtualAccountId: number,
    data: Partial<PartnerVirtualAccountRequest>,
  ): Promise<ApiResponse<PartnerVirtualAccount>> => {
    const response = await axiosInstance.put<
      ApiResponse<PartnerVirtualAccount>
    >(`${PARTNER_BASE_URL}/virtual-account/${virtualAccountId}`, data);
    return response.data;
  },

  /**
   * Delete partner virtual account (standalone resource)
   */
  deletePartnerVirtualAccount: async (
    virtualAccountId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/virtual-account/${virtualAccountId}`,
    );
    return response.data;
  },

  // ============== ERP CODE ENDPOINTS (nested) ==============

  /**
   * Get partner ERP codes with pagination
   */
  listPartnerErpCodes: async (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ): Promise<PagedApiResponse<PartnerErpCode>> => {
    const response = await axiosInstance.get<PagedApiResponse<PartnerErpCode>>(
      `${PARTNER_BASE_URL}/${partnerId}/erp-code`,
      { params },
    );
    return response.data;
  },

  /**
   * Get ERP code by ID
   */
  getPartnerErpCodeById: async (
    partnerId: number,
    erpCodeId: number,
  ): Promise<ApiResponse<PartnerErpCode>> => {
    const response = await axiosInstance.get<ApiResponse<PartnerErpCode>>(
      `${PARTNER_BASE_URL}/${partnerId}/erp-code/${erpCodeId}`,
    );
    return response.data;
  },

  /**
   * Create partner ERP code
   */
  createPartnerErpCode: async (
    partnerId: number,
    data: PartnerErpCodeRequest,
  ): Promise<ApiResponse<PartnerErpCode>> => {
    const response = await axiosInstance.post<ApiResponse<PartnerErpCode>>(
      `${PARTNER_BASE_URL}/${partnerId}/erp-code`,
      { partnerId, ...data },
    );
    return response.data;
  },

  /**
   * Update partner ERP code
   */
  updatePartnerErpCode: async (
    partnerId: number,
    erpCodeId: number,
    data: Partial<PartnerErpCodeRequest>,
  ): Promise<ApiResponse<PartnerErpCode>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerErpCode>>(
      `${PARTNER_BASE_URL}/${partnerId}/erp-code/${erpCodeId}`,
      { partnerId, ...data },
    );
    return response.data;
  },

  /**
   * Delete partner ERP code
   */
  deletePartnerErpCode: async (
    partnerId: number,
    erpCodeId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_BASE_URL}/${partnerId}/erp-code/${erpCodeId}`,
    );
    return response.data;
  },
};
