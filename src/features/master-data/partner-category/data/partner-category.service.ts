import type {
  PartnerCategoryRequest,
  PartnerCategoryResponse,
} from "@/features/master-data/partner-category/data/partner-category.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const PARTNER_CATEGORY_BASE_URL = "/master/partner/category";

export const partnerCategoryService = {
  /**
   * Get all partner categories with pagination
   */
  listPartnerCategories: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PartnerCategoryResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PartnerCategoryResponse>
    >(PARTNER_CATEGORY_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get partner category by ID
   */
  getPartnerCategoryById: async (
    id: number,
  ): Promise<ApiResponse<PartnerCategoryResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<PartnerCategoryResponse>
    >(`${PARTNER_CATEGORY_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new partner category
   */
  createPartnerCategory: async (
    data: PartnerCategoryRequest,
  ): Promise<ApiResponse<PartnerCategoryResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<PartnerCategoryResponse>
    >(PARTNER_CATEGORY_BASE_URL, data);
    return response.data;
  },

  /**
   * Update partner category
   */
  updatePartnerCategory: async (
    id: number,
    data: PartnerCategoryRequest,
  ): Promise<ApiResponse<PartnerCategoryResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<PartnerCategoryResponse>
    >(`${PARTNER_CATEGORY_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete partner category
   */
  deletePartnerCategory: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PARTNER_CATEGORY_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
