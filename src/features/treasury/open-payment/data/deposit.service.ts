import type {
  CountByStatusResponse,
  DepositEditRequest,
  DepositResponse,
  DepositSummary,
} from "@/features/treasury/";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance, objectToFormData } from "@railfinance/core/lib";

const DEPOSIT_BASE_URL = "/treasury/deposit";

export const depositService = {
  /**
   * Get all deposits with pagination and filters
   */
  listDeposits: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<DepositResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<DepositResponse>>(
      DEPOSIT_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get deposit by ID
   */
  getDepositById: async (id: number): Promise<ApiResponse<DepositResponse>> => {
    const response = await axiosInstance.get<ApiResponse<DepositResponse>>(
      `${DEPOSIT_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Update deposit (edit specific fields)
   */
  updateDeposit: async (
    id: number,
    data: DepositEditRequest,
  ): Promise<ApiResponse<DepositResponse>> => {
    const formData = objectToFormData(data);
    const response = await axiosInstance.put<ApiResponse<DepositResponse>>(
      `${DEPOSIT_BASE_URL}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Update send status for single deposit
   */
  updateSendStatus: async (
    id: number,
    sendStatus: 0 | 1,
  ): Promise<ApiResponse<DepositResponse>> => {
    const response = await axiosInstance.put<ApiResponse<DepositResponse>>(
      `${DEPOSIT_BASE_URL}/${id}/send-status`,
      null,
      {
        params: { sendStatus },
      },
    );
    return response.data;
  },

  /**
   * Update send status for multiple deposits
   */
  bulkUpdateSendStatus: async (
    ids: number[],
    sendStatus: 0 | 1,
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.put<ApiResponse<{ message: string }>>(
      `${DEPOSIT_BASE_URL}/send-status/bulk`,
      ids,
      {
        params: { sendStatus },
      },
    );
    return response.data;
  },

  /**
   * Get deposit summary statistics
   */
  getSummary: async (): Promise<ApiResponse<DepositSummary>> => {
    const response = await axiosInstance.get<ApiResponse<DepositSummary>>(
      `${DEPOSIT_BASE_URL}/summary/stats`,
    );
    return response.data;
  },

  /**
   * Get count by send status
   */
  getCountByStatus: async (): Promise<ApiResponse<CountByStatusResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<CountByStatusResponse>
    >(`${DEPOSIT_BASE_URL}/summary/count-by-status`);
    return response.data;
  },
};
