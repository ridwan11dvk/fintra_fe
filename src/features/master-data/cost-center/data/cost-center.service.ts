import type {
  CostCenterRequest,
  CostCenterResponse,
} from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const COST_CENTER_BASE_URL = "/master/cost-center";

export const costCenterService = {
  /**
   * Get all cost centers with pagination
   */
  listCostCenters: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<CostCenterResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<CostCenterResponse>
    >(COST_CENTER_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get all active cost centers
   */
  getActiveCostCenters: async (): Promise<
    ApiResponse<CostCenterResponse[]>
  > => {
    const response = await axiosInstance.get<ApiResponse<CostCenterResponse[]>>(
      `${COST_CENTER_BASE_URL}/active`,
    );
    return response.data;
  },

  /**
   * Get cost centers by company and business area
   */
  getCostCentersByCompanyAndBA: async (
    companyCode: string,
    baCode: string,
  ): Promise<ApiResponse<CostCenterResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<CostCenterResponse[]>>(
      `${COST_CENTER_BASE_URL}/company/${companyCode}/ba/${baCode}`,
    );
    return response.data;
  },

  /**
   * Get cost centers by company, business area, and type
   */
  getCostCentersByCompanyBAAndType: async (
    companyCode: string,
    baCode: string,
    type: "BA" | "Unit",
  ): Promise<ApiResponse<CostCenterResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<CostCenterResponse[]>>(
      `${COST_CENTER_BASE_URL}/company/${companyCode}/ba/${baCode}/type/${type}`,
    );
    return response.data;
  },

  /**
   * Get cost center by ID
   */
  getCostCenterById: async (
    id: number,
  ): Promise<ApiResponse<CostCenterResponse>> => {
    const response = await axiosInstance.get<ApiResponse<CostCenterResponse>>(
      `${COST_CENTER_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new cost center
   */
  createCostCenter: async (
    data: CostCenterRequest,
  ): Promise<ApiResponse<CostCenterResponse>> => {
    const response = await axiosInstance.post<ApiResponse<CostCenterResponse>>(
      COST_CENTER_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update cost center
   */
  updateCostCenter: async (
    id: number,
    data: CostCenterRequest,
  ): Promise<ApiResponse<CostCenterResponse>> => {
    const response = await axiosInstance.put<ApiResponse<CostCenterResponse>>(
      `${COST_CENTER_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete cost center
   */
  deleteCostCenter: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${COST_CENTER_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
