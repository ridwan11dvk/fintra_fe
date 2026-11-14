import type {
  ProvinceRequest,
  ProvinceResponse,
} from "@/features/master-data/province/data/province.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const PROVINCE_BASE_URL = "/master/province";

export const provinceService = {
  /**
   * Get all provinces with pagination
   */
  listProvinces: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<ProvinceResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<ProvinceResponse>
    >(PROVINCE_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get province by ID
   */
  getProvinceById: async (
    id: number,
  ): Promise<ApiResponse<ProvinceResponse>> => {
    const response = await axiosInstance.get<ApiResponse<ProvinceResponse>>(
      `${PROVINCE_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new province
   */
  createProvince: async (
    data: ProvinceRequest,
  ): Promise<ApiResponse<ProvinceResponse>> => {
    const response = await axiosInstance.post<ApiResponse<ProvinceResponse>>(
      PROVINCE_BASE_URL,
      data,
    );

    return response.data;
  },

  /**
   * Update province
   */
  updateProvince: async (
    id: number,
    data: ProvinceRequest,
  ): Promise<ApiResponse<ProvinceResponse>> => {
    const response = await axiosInstance.put<ApiResponse<ProvinceResponse>>(
      `${PROVINCE_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete province
   */
  deleteProvince: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PROVINCE_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
