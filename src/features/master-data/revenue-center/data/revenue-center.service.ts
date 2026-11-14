import type {
  RevenueCenterRequest,
  RevenueCenterResponse,
} from "@/features/master-data/revenue-center/data/revenue-center.types";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const REVENUE_CENTER_BASE_URL = "/master/revenue-center";

export const revenueCenterService = {
  listRevenueCenters: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<RevenueCenterResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<RevenueCenterResponse>
    >(REVENUE_CENTER_BASE_URL, {
      params,
    });
    return response.data;
  },

  getActiveRevenueCenters: async (): Promise<
    ApiResponse<RevenueCenterResponse[]>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<RevenueCenterResponse[]>
    >(`${REVENUE_CENTER_BASE_URL}/active`);
    return response.data;
  },

  getRevenueCentersByCompanyAndBA: async (
    companyCode: string,
    baCode: string,
  ): Promise<ApiResponse<RevenueCenterResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<RevenueCenterResponse[]>
    >(`${REVENUE_CENTER_BASE_URL}/company/${companyCode}/ba/${baCode}`);
    return response.data;
  },

  getRevenueCenterById: async (
    id: number,
  ): Promise<ApiResponse<RevenueCenterResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<RevenueCenterResponse>
    >(`${REVENUE_CENTER_BASE_URL}/${id}`);
    return response.data;
  },

  createRevenueCenter: async (
    data: RevenueCenterRequest,
  ): Promise<ApiResponse<RevenueCenterResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<RevenueCenterResponse>
    >(REVENUE_CENTER_BASE_URL, data);
    return response.data;
  },

  updateRevenueCenter: async (
    id: number,
    data: RevenueCenterRequest,
  ): Promise<ApiResponse<RevenueCenterResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<RevenueCenterResponse>
    >(`${REVENUE_CENTER_BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteRevenueCenter: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${REVENUE_CENTER_BASE_URL}/${id}`,
    );
    return response.data;
  },

  activateRevenueCenter: async (
    id: number,
  ): Promise<ApiResponse<RevenueCenterResponse>> => {
    const response = await axiosInstance.patch<
      ApiResponse<RevenueCenterResponse>
    >(`${REVENUE_CENTER_BASE_URL}/${id}/activate`);
    return response.data;
  },

  deactivateRevenueCenter: async (
    id: number,
  ): Promise<ApiResponse<RevenueCenterResponse>> => {
    const response = await axiosInstance.patch<
      ApiResponse<RevenueCenterResponse>
    >(`${REVENUE_CENTER_BASE_URL}/${id}/deactivate`);
    return response.data;
  },
};
