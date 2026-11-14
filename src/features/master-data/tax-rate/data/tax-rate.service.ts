import type { TaxRateRequest, TaxRateResponse } from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const TAX_RATE_BASE_URL = "/master/tax-rates";

export const taxRateService = {
  /**
   * Get all tax rates with pagination
   */
  listTaxRates: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<TaxRateResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<TaxRateResponse>>(
      TAX_RATE_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get tax rate by ID
   */
  getTaxRateById: async (id: number): Promise<ApiResponse<TaxRateResponse>> => {
    const response = await axiosInstance.get<ApiResponse<TaxRateResponse>>(
      `${TAX_RATE_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get tax rate by code
   */
  getTaxRateByCode: async (
    code: string,
  ): Promise<ApiResponse<TaxRateResponse>> => {
    const response = await axiosInstance.get<ApiResponse<TaxRateResponse>>(
      `${TAX_RATE_BASE_URL}/code/${code}`,
    );
    return response.data;
  },

  /**
   * Create a new tax rate
   */
  createTaxRate: async (
    data: TaxRateRequest,
  ): Promise<ApiResponse<TaxRateResponse>> => {
    const response = await axiosInstance.post<ApiResponse<TaxRateResponse>>(
      TAX_RATE_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update tax rate
   */
  updateTaxRate: async (
    id: number,
    data: TaxRateRequest,
  ): Promise<ApiResponse<TaxRateResponse>> => {
    const response = await axiosInstance.put<ApiResponse<TaxRateResponse>>(
      `${TAX_RATE_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete tax rate
   */
  deleteTaxRate: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${TAX_RATE_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
