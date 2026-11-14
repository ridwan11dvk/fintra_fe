import type {
  PartnerClassificationRequest,
  PartnerClassificationResponse,
} from "@/features/master-data/partner-classification/data/partner-classification.types";
import type { ApiResponse, OptionItemResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const PARTNER_CLASSIFICATION_BASE_URL = "/master/partner/classification";

export const partnerClassificationService = {
  /**
   * Get all partner classifications with pagination
   */
  listPartnerClassifications: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PartnerClassificationResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PartnerClassificationResponse>
    >(PARTNER_CLASSIFICATION_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get options for partner classifications (e.g., for dropdowns)
   */
  getPartnerClassificationOptions: async (): Promise<OptionItemResponse> => {
    const response = await axiosInstance.get<OptionItemResponse>(
      `${PARTNER_CLASSIFICATION_BASE_URL}/options`,
    );
    return response.data;
  },

  /**
   * Get partner classification by ID
   */
  getPartnerClassificationById: async (
    id: number,
  ): Promise<ApiResponse<PartnerClassificationResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerClassificationResponse>
    >(`${PARTNER_CLASSIFICATION_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new partner classification
   */
  createPartnerClassification: async (
    data: PartnerClassificationRequest,
  ): Promise<ApiResponse<PartnerClassificationResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<PartnerClassificationResponse>
    >(PARTNER_CLASSIFICATION_BASE_URL, data);
    return response.data;
  },

  /**
   * Update partner classification
   */
  updatePartnerClassification: async (
    id: number,
    data: PartnerClassificationRequest,
  ): Promise<ApiResponse<PartnerClassificationResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<PartnerClassificationResponse>
    >(`${PARTNER_CLASSIFICATION_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete partner classification
   */
  deletePartnerClassification: async (
    id: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_CLASSIFICATION_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
