import type {
  CustomsOfficeRequest,
  CustomsOfficeResponse,
} from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const CUSTOMS_OFFICE_BASE_URL = "/master/customs-office";
const CUSTOMS_OFFICE_BASE_URL_ALT = "/master/customs-office/list";

export const customsOfficeService = {
  /**
   * Get all customs offices with pagination
   */
  listCustomsOffices: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<CustomsOfficeResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<CustomsOfficeResponse>
    >(CUSTOMS_OFFICE_BASE_URL, {
      params,
    });
    return response.data;
  },

  listCustomsOfficesAlt: async (params?: {
    search?: string;
  }): Promise<ApiResponse<CustomsOfficeResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<CustomsOfficeResponse[]>
    >(CUSTOMS_OFFICE_BASE_URL_ALT, {
      params,
    });
    return response.data;
  },

  /**
   * Get customs office by ID
   */
  getCustomsOfficeById: async (
    id: number,
  ): Promise<ApiResponse<CustomsOfficeResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<CustomsOfficeResponse>
    >(`${CUSTOMS_OFFICE_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new customs office
   */
  createCustomsOffice: async (
    data: CustomsOfficeRequest,
  ): Promise<ApiResponse<CustomsOfficeResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<CustomsOfficeResponse>
    >(CUSTOMS_OFFICE_BASE_URL, data);
    return response.data;
  },

  /**
   * Update customs office
   */
  updateCustomsOffice: async (
    id: number,
    data: CustomsOfficeRequest,
  ): Promise<ApiResponse<CustomsOfficeResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<CustomsOfficeResponse>
    >(`${CUSTOMS_OFFICE_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete customs office
   */
  deleteCustomsOffice: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${CUSTOMS_OFFICE_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
