import type {
  PartnerDocRefRequest,
  PartnerDocRefResponse,
} from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const PARTNER_DOC_REF_BASE_URL = "/master/partner/doc-ref";

export const partnerDocRefService = {
  /**
   * Get all partner document references with pagination
   */
  listPartnerDocRefs: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PartnerDocRefResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PartnerDocRefResponse>
    >(PARTNER_DOC_REF_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get filtered partner document references (public endpoint)
   */
  getFilteredPartnerDocRefs: async (filters?: {
    companyCode?: string;
    countryId?: number;
    partnerCategoryId?: number;
    partnerLegalityId?: number;
    partnerRoleId?: number;
    partnerTypeId?: number;
    partnerSubTypeId?: number;
  }): Promise<ApiResponse<PartnerDocRefResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerDocRefResponse[]>
    >(`${PARTNER_DOC_REF_BASE_URL}/filtered`, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get partner document reference by ID
   */
  getPartnerDocRefById: async (
    id: number,
  ): Promise<ApiResponse<PartnerDocRefResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerDocRefResponse>
    >(`${PARTNER_DOC_REF_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get partner document references by country
   */
  getByCountry: async (
    countryId: number,
  ): Promise<ApiResponse<PartnerDocRefResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerDocRefResponse[]>
    >(`${PARTNER_DOC_REF_BASE_URL}/country/${countryId}`);
    return response.data;
  },

  /**
   * Get partner document references by country and company
   */
  getByCountryAndCompany: async (
    countryId: number,
    companyCode: string,
  ): Promise<ApiResponse<PartnerDocRefResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerDocRefResponse[]>
    >(
      `${PARTNER_DOC_REF_BASE_URL}/country/${countryId}/company/${companyCode}`,
    );
    return response.data;
  },

  /**
   * Create a new partner document reference
   */
  createPartnerDocRef: async (
    data: PartnerDocRefRequest,
  ): Promise<ApiResponse<PartnerDocRefResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<PartnerDocRefResponse>
    >(PARTNER_DOC_REF_BASE_URL, data);
    return response.data;
  },

  /**
   * Update a partner document reference
   */
  updatePartnerDocRef: async (
    id: number,
    data: PartnerDocRefRequest,
  ): Promise<ApiResponse<PartnerDocRefResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<PartnerDocRefResponse>
    >(`${PARTNER_DOC_REF_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a partner document reference
   */
  deletePartnerDocRef: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_DOC_REF_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
