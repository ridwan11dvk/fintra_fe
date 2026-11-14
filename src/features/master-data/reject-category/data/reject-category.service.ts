import type { RejectCategoryRequest } from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import type { RejectCategoryResponse } from "@railfinance/core/masterdata";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const REJECT_CATEGORY_BASE_URL = "/master/reject-category";

export const rejectCategoryService = {
  listRejectCategories: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<RejectCategoryResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<RejectCategoryResponse>
    >(REJECT_CATEGORY_BASE_URL, { params });
    return response.data;
  },

  getRejectCategoryById: async (
    id: number,
  ): Promise<ApiResponse<RejectCategoryResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<RejectCategoryResponse>
    >(`${REJECT_CATEGORY_BASE_URL}/${id}`);
    return response.data;
  },

  createRejectCategory: async (
    data: RejectCategoryRequest,
  ): Promise<ApiResponse<RejectCategoryResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<RejectCategoryResponse>
    >(REJECT_CATEGORY_BASE_URL, data);
    return response.data;
  },

  updateRejectCategory: async (
    id: number,
    data: RejectCategoryRequest,
  ): Promise<ApiResponse<RejectCategoryResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<RejectCategoryResponse>
    >(`${REJECT_CATEGORY_BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteRejectCategory: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${REJECT_CATEGORY_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
