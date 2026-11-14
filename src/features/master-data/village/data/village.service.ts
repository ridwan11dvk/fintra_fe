import type {
  VillageRequest,
  VillageResponse,
} from "@/features/master-data/village/data/village.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const VILLAGE_BASE_URL = "/master/village";

export const villageService = {
  /**
   * Get all villages with pagination
   */
  listVillages: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<VillageResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<VillageResponse>>(
      VILLAGE_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get village by ID
   */
  getVillageById: async (id: number): Promise<ApiResponse<VillageResponse>> => {
    const response = await axiosInstance.get<ApiResponse<VillageResponse>>(
      `${VILLAGE_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get villages by district ID
   */
  getVillagesByDistrictId: async (
    districtId: number,
  ): Promise<ApiResponse<VillageResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<VillageResponse[]>>(
      `${VILLAGE_BASE_URL}/district/${districtId}`,
    );
    return response.data;
  },

  /**
   * Create a new village
   */
  createVillage: async (
    data: VillageRequest,
  ): Promise<ApiResponse<VillageResponse>> => {
    const response = await axiosInstance.post<ApiResponse<VillageResponse>>(
      VILLAGE_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update village
   */
  updateVillage: async (
    id: number,
    data: VillageRequest,
  ): Promise<ApiResponse<VillageResponse>> => {
    const response = await axiosInstance.put<ApiResponse<VillageResponse>>(
      `${VILLAGE_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete village
   */
  deleteVillage: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${VILLAGE_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
