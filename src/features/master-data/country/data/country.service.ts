import type { CountryRequest, CountryResponse } from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const COUNTRY_BASE_URL = "/master/country";

export const countryService = {
  /**
   * Get all countries with pagination
   */
  listCountries: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<CountryResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<CountryResponse>>(
      COUNTRY_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get country by ID
   */
  getCountryById: async (id: number): Promise<ApiResponse<CountryResponse>> => {
    const response = await axiosInstance.get<ApiResponse<CountryResponse>>(
      `${COUNTRY_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new country
   */
  createCountry: async (
    data: CountryRequest,
  ): Promise<ApiResponse<CountryResponse>> => {
    const response = await axiosInstance.post<ApiResponse<CountryResponse>>(
      COUNTRY_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update country
   */
  updateCountry: async (
    id: number,
    data: CountryRequest,
  ): Promise<ApiResponse<CountryResponse>> => {
    const response = await axiosInstance.put<ApiResponse<CountryResponse>>(
      `${COUNTRY_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete country
   */
  deleteCountry: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${COUNTRY_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
