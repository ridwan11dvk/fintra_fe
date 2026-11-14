import type {
  PartnerTypeRequest,
  PartnerTypeResponse,
} from "@/features/master-data/partner-type/data/partner-type.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const PARTNER_TYPE_BASE_URL = "/master/partner/type";

export const partnerTypeService = {
  /**
   * Get all partner types with pagination
   */
  listPartnerTypes: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PartnerTypeResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PartnerTypeResponse>
    >(PARTNER_TYPE_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get partner type by ID
   */
  getPartnerTypeById: async (
    id: number,
  ): Promise<ApiResponse<PartnerTypeResponse>> => {
    const response = await axiosInstance.get<ApiResponse<PartnerTypeResponse>>(
      `${PARTNER_TYPE_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get root partner types by legality
   */
  getRootPartnerTypesByLegality: async (
    legalityId: number,
  ): Promise<ApiResponse<PartnerTypeResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerTypeResponse[]>
    >(`${PARTNER_TYPE_BASE_URL}/legality/${legalityId}/root`);
    return response.data;
  },

  /**
   * Get sub-types of a partner type
   */
  getPartnerTypeSubtypes: async (
    parentId: number,
  ): Promise<ApiResponse<PartnerTypeResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerTypeResponse[]>
    >(`${PARTNER_TYPE_BASE_URL}/${parentId}/subtypes`);
    return response.data;
  },

  /**
   * Create a new partner type
   */
  createPartnerType: async (
    data: PartnerTypeRequest,
  ): Promise<ApiResponse<PartnerTypeResponse>> => {
    const response = await axiosInstance.post<ApiResponse<PartnerTypeResponse>>(
      PARTNER_TYPE_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update partner type
   */
  updatePartnerType: async (
    id: number,
    data: PartnerTypeRequest,
  ): Promise<ApiResponse<PartnerTypeResponse>> => {
    const response = await axiosInstance.put<ApiResponse<PartnerTypeResponse>>(
      `${PARTNER_TYPE_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete partner type
   */
  deletePartnerType: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_TYPE_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
