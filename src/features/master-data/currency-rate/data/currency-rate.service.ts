import type {
  CurrencyRateRequest,
  CurrencyRateResponse,
} from "@/features/master-data/currency-rate/data/currency-rate.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const CURRENCY_RATE_BASE_URL = "/master/currency-rate";

export interface CurrencyRateListParams extends PaginationParams {
  search?: string;
  currencyCode?: string;
  rateType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const currencyRateService = {
  /**
   * Get all currency rates with pagination
   */
  listCurrencyRates: async (
    params?: CurrencyRateListParams,
  ): Promise<PagedApiResponse<CurrencyRateResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<CurrencyRateResponse>
    >(CURRENCY_RATE_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get currency rate by ID
   */
  getCurrencyRateById: async (
    id: number,
  ): Promise<ApiResponse<CurrencyRateResponse>> => {
    const response = await axiosInstance.get<ApiResponse<CurrencyRateResponse>>(
      `${CURRENCY_RATE_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get currency rates by currency code
   */
  getCurrencyRatesByCurrency: async (
    currencyCode: string,
  ): Promise<ApiResponse<CurrencyRateResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<CurrencyRateResponse[]>
    >(`${CURRENCY_RATE_BASE_URL}/currency/${currencyCode}`);
    return response.data;
  },

  /**
   * Get currency rates by currency code and rate type
   */
  getCurrencyRatesByType: async (
    currencyCode: string,
    rateType: string,
  ): Promise<ApiResponse<CurrencyRateResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<CurrencyRateResponse[]>
    >(
      `${CURRENCY_RATE_BASE_URL}/currency/${currencyCode}/rate-type/${rateType}`,
    );
    return response.data;
  },

  /**
   * Get latest rates by rate type
   */
  getLatestRatesByRateType: async (
    rateType: string,
  ): Promise<ApiResponse<CurrencyRateResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<CurrencyRateResponse[]>
    >(`${CURRENCY_RATE_BASE_URL}/rate-type/${rateType}/latest`);
    return response.data;
  },

  /**
   * Get rate at specific date
   */
  getRateAtDate: async (
    currencyCode: string,
    rateType: string,
    date: string,
  ): Promise<ApiResponse<CurrencyRateResponse>> => {
    const response = await axiosInstance.get<ApiResponse<CurrencyRateResponse>>(
      `${CURRENCY_RATE_BASE_URL}/currency/${currencyCode}/rate-type/${rateType}/at-date`,
      {
        params: { date },
      },
    );
    return response.data;
  },

  /**
   * Get latest rate
   */
  getLatestRate: async (
    currencyCode: string,
    rateType: string,
  ): Promise<ApiResponse<CurrencyRateResponse>> => {
    const response = await axiosInstance.get<ApiResponse<CurrencyRateResponse>>(
      `${CURRENCY_RATE_BASE_URL}/currency/${currencyCode}/rate-type/${rateType}/latest`,
    );
    return response.data;
  },

  /**
   * Create a new currency rate
   */
  createCurrencyRate: async (
    data: CurrencyRateRequest,
  ): Promise<ApiResponse<CurrencyRateResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<CurrencyRateResponse>
    >(CURRENCY_RATE_BASE_URL, data);
    return response.data;
  },

  /**
   * Update currency rate
   */
  updateCurrencyRate: async (
    id: number,
    data: CurrencyRateRequest,
  ): Promise<ApiResponse<CurrencyRateResponse>> => {
    const response = await axiosInstance.put<ApiResponse<CurrencyRateResponse>>(
      `${CURRENCY_RATE_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete currency rate
   */
  deleteCurrencyRate: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${CURRENCY_RATE_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Sync currency rates with external source
   */
  syncCurrencyRates: async (): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post<ApiResponse<string>>(
      `${CURRENCY_RATE_BASE_URL}/sync`,
    );
    return response.data;
  },
};
