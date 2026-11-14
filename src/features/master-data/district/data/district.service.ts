import type {
  DistrictRequest,
  DistrictResponse,
} from "@/features/master-data/district/data/district.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const DISTRICT_BASE_URL = "/master/district";

export const districtService = {
  /**
   * Get all districts with pagination
   */
  listDistricts: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<DistrictResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<DistrictResponse>
    >(DISTRICT_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get district by ID
   */
  getDistrictById: async (
    id: number,
  ): Promise<ApiResponse<DistrictResponse>> => {
    const response = await axiosInstance.get<ApiResponse<DistrictResponse>>(
      `${DISTRICT_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get districts by regency ID
   */
  getDistrictsByRegencyId: async (
    regencyId: number,
  ): Promise<ApiResponse<DistrictResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<DistrictResponse[]>>(
      `${DISTRICT_BASE_URL}/regency/${regencyId}`,
    );
    return response.data;
  },

  /**
   * Create a new district
   */
  createDistrict: async (
    data: DistrictRequest,
  ): Promise<ApiResponse<DistrictResponse>> => {
    const response = await axiosInstance.post<ApiResponse<DistrictResponse>>(
      DISTRICT_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update district
   */
  updateDistrict: async (
    id: number,
    data: DistrictRequest,
  ): Promise<ApiResponse<DistrictResponse>> => {
    const response = await axiosInstance.put<ApiResponse<DistrictResponse>>(
      `${DISTRICT_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete district
   */
  deleteDistrict: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${DISTRICT_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
