/**
 * Digital Vault API Service
 * Handles all API calls to the Digital Vault endpoints
 */

import type {
  VaultStationClosureDetail,
  VaultStationSummary,
  VaultStationSummaryTotal,
  VaultTransactionDetail,
} from "@/features/treasury";
import type { ApiResponse, InputValue, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const BASE_URL = "/treasury/digital-vault";

export const digitalVaultService = {
  /**
   * Get station summary list with filtering and pagination
   * @param params - Filter parameters (month, year, search, date range, pagination)
   * @returns Paginated station summary data with aggregated totals
   */
  listStationSummary: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<VaultStationSummary>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<VaultStationSummary>
    >(BASE_URL, { params });
    return response.data;
  },

  /**
   * Get total summary across all stations (for header display)
   * @returns Total closure and deposit amounts across all stations
   */
  totalStationSummary: async (
    params?: Record<string, InputValue>,
  ): Promise<ApiResponse<VaultStationSummaryTotal>> => {
    const response = await axiosInstance.get<
      ApiResponse<VaultStationSummaryTotal>
    >(`${BASE_URL}/total`, { params });
    return response.data;
  },

  /**
   * Get closure detail list for a specific station
   * @param stationName - Station name (URL-encoded)
   * @param params - Filter parameters (month, year, search, pagination)
   * @returns Paginated closure detail records
   */
  listClosureDetail: async (
    stationName: string,
    params?: PaginationParams,
  ): Promise<PagedApiResponse<VaultStationClosureDetail>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<VaultStationClosureDetail>
    >(`${BASE_URL}/${encodeURIComponent(stationName)}/closures`, { params });
    return response.data;
  },

  /**
   * Get transaction detail for a specific closure
   * Returns all deposit transactions associated with the closure
   * @param id - Payment header ID
   * @returns Transaction detail with all associated items
   */
  getTransactionDetail: async (
    id: number,
  ): Promise<ApiResponse<VaultTransactionDetail>> => {
    const response = await axiosInstance.get<
      ApiResponse<VaultTransactionDetail>
    >(`${BASE_URL}/transactions/${id}`);
    return response.data;
  },

  /**
   * Export transaction detail as Excel file
   * @param id - Payment header ID
   * @returns Blob of the Excel file for download
   */
  exportTransactionDetail: async (id: number): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${BASE_URL}/transactions/${id}/export`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },
};
