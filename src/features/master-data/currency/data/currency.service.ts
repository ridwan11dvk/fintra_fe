import type {
  CurrencyRequest,
  CurrencyResponse,
} from "@/features/master-data/currency/data/currency.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const CURRENCY_BASE_URL = "/master/currency";

export const currencyService = {
  /**
   * Get all currencies with pagination
   */
  listCurrencies: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<CurrencyResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<CurrencyResponse>
    >(CURRENCY_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get currency by ID
   */
  getCurrencyById: async (
    id: number,
  ): Promise<ApiResponse<CurrencyResponse>> => {
    const response = await axiosInstance.get<ApiResponse<CurrencyResponse>>(
      `${CURRENCY_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get currencies by country
   */
  getCurrenciesByCountry: async (
    countryId: number,
  ): Promise<ApiResponse<CurrencyResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<CurrencyResponse[]>>(
      `${CURRENCY_BASE_URL}/country/${countryId}`,
    );
    return response.data;
  },

  /**
   * Get active currencies by country
   */
  getActiveCurrenciesByCountry: async (
    countryId: number,
  ): Promise<ApiResponse<CurrencyResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<CurrencyResponse[]>>(
      `${CURRENCY_BASE_URL}/country/${countryId}/active`,
    );
    return response.data;
  },

  /**
   * Create a new currency
   */
  createCurrency: async (
    data: CurrencyRequest,
  ): Promise<ApiResponse<CurrencyResponse>> => {
    const response = await axiosInstance.post<ApiResponse<CurrencyResponse>>(
      CURRENCY_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update currency
   */
  updateCurrency: async (
    id: number,
    data: CurrencyRequest,
  ): Promise<ApiResponse<CurrencyResponse>> => {
    const response = await axiosInstance.put<ApiResponse<CurrencyResponse>>(
      `${CURRENCY_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete currency
   */
  deleteCurrency: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${CURRENCY_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Sync currencies with external source
   */
  syncCurrencies: async (): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post<ApiResponse<string>>(
      `${CURRENCY_BASE_URL}/sync`,
    );
    return response.data;
  },
};
