import type {
  RegencyRequest,
  RegencyResponse,
} from "@/features/master-data/regency/data/regency.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const REGENCY_BASE_URL = "/master/regency";

export const regencyService = {
  /**
   * Get all regencies with pagination
   */
  listRegencies: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<RegencyResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<RegencyResponse>>(
      REGENCY_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get regency by ID
   */
  getRegencyById: async (id: number): Promise<ApiResponse<RegencyResponse>> => {
    const response = await axiosInstance.get<ApiResponse<RegencyResponse>>(
      `${REGENCY_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get regencies by province ID
   */
  getRegenciesByProvinceId: async (
    provinceId: number,
  ): Promise<ApiResponse<RegencyResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<RegencyResponse[]>>(
      `${REGENCY_BASE_URL}/province/${provinceId}`,
    );
    return response.data;
  },

  /**
   * Create a new regency
   */
  createRegency: async (
    data: RegencyRequest,
  ): Promise<ApiResponse<RegencyResponse>> => {
    const response = await axiosInstance.post<ApiResponse<RegencyResponse>>(
      REGENCY_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update regency
   */
  updateRegency: async (
    id: number,
    data: RegencyRequest,
  ): Promise<ApiResponse<RegencyResponse>> => {
    const response = await axiosInstance.put<ApiResponse<RegencyResponse>>(
      `${REGENCY_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete regency
   */
  deleteRegency: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${REGENCY_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
