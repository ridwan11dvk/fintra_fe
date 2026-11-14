import type { CategoryRequest, LookupValueResponse } from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const LOOKUP_VALUE_BASE_URL = "/master/lookup-value";

/**
 * Drop empty-string filter params so pageable/status/type bindings are not
 * sent to the backend with blank values (enum/bool conversion would fail).
 */
const sanitizeParams = (params?: PaginationParams) => {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
};

export const lookupValueService = {
  listCategories: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<LookupValueResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<LookupValueResponse>
    >(LOOKUP_VALUE_BASE_URL, { params: sanitizeParams(params) });
    return response.data;
  },

  getLookupValueById: async (
    id: number,
  ): Promise<ApiResponse<LookupValueResponse>> => {
    const response = await axiosInstance.get<ApiResponse<LookupValueResponse>>(
      `${LOOKUP_VALUE_BASE_URL}/${id}`,
    );
    return response.data;
  },

  createCategory: async (
    data: CategoryRequest,
  ): Promise<ApiResponse<LookupValueResponse>> => {
    const response = await axiosInstance.post<ApiResponse<LookupValueResponse>>(
      LOOKUP_VALUE_BASE_URL,
      data,
    );
    return response.data;
  },

  updateCategory: async (
    id: number,
    data: CategoryRequest,
  ): Promise<ApiResponse<LookupValueResponse>> => {
    const response = await axiosInstance.put<ApiResponse<LookupValueResponse>>(
      `${LOOKUP_VALUE_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  deleteCategory: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${LOOKUP_VALUE_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
