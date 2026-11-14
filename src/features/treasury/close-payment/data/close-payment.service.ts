import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance, objectToFormData } from "@railfinance/core/lib";
import type {
  ClosePaymentEditRequest,
  ClosePaymentResponse,
} from "./close-payment.types";

const CLOSE_PAYMENT_BASE_URL = "/treasury/close-payment";

/**
 * Response type for reset posting status operation with individual results
 */
export interface ResetPostingA8Result {
  name: string;
  invoiceNumber: string;
  success: boolean;
  reason?: string;
}

/**
 * Response type for bulk reset posting status
 */
export interface ResetPostingA8ResultResponse {
  message: string;
  status: "SUCCESS" | "ERROR" | "WARNING";
  data: ResetPostingA8Result[];
  errors: string[] | null;
}

export const closePaymentService = {
  /**
   * Get all close payments with pagination
   */
  listClosePayments: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<ClosePaymentResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<ClosePaymentResponse>
    >(CLOSE_PAYMENT_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get close payment by ID
   */
  getClosePaymentById: async (
    id: number,
  ): Promise<ApiResponse<ClosePaymentResponse>> => {
    const response = await axiosInstance.get<ApiResponse<ClosePaymentResponse>>(
      `${CLOSE_PAYMENT_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Update close payment (edit-only, specific fields only)
   * Only available when payment_status = 0 (Unpaid)
   */
  updateClosePayment: async (
    id: number,
    data: ClosePaymentEditRequest,
  ): Promise<ApiResponse<ClosePaymentResponse>> => {
    const formData = objectToFormData(data);
    const response = await axiosInstance.put<ApiResponse<ClosePaymentResponse>>(
      `${CLOSE_PAYMENT_BASE_URL}/${id}`,
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
   * Reset A8 posting status to 0 (Not Generated)
   * Can only reset records with status 1 (Partial) or 5 (Failed)
   * Returns results for each record attempted
   */
  resetPostingA8Status: async (
    ids: number[],
  ): Promise<ApiResponse<ResetPostingA8ResultResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<ResetPostingA8ResultResponse>
    >(`${CLOSE_PAYMENT_BASE_URL}/posting-status-reset`, {
      ids,
    });
    return response.data;
  },

  /**
   * Get count of unpaid payments
   */
  getUnpaidCount: async (): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      `${CLOSE_PAYMENT_BASE_URL}/summary/unpaid-count`,
    );
    return response.data;
  },

  /**
   * Get count by payment status
   */
  getCountByStatus: async (
    paymentStatus: 0 | 1,
  ): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      `${CLOSE_PAYMENT_BASE_URL}/summary/count-by-status`,
      {
        params: { paymentStatus },
      },
    );
    return response.data;
  },
};
