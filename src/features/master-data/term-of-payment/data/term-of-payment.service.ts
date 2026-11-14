import type {
  TermOfPaymentRequest,
  TermOfPaymentResponse,
} from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const TERM_OF_PAYMENT_BASE_URL = "/master/term-of-payment";

export const termOfPaymentService = {
  /**
   * Get all payment terms with pagination
   */
  listTermOfPayments: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<TermOfPaymentResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<TermOfPaymentResponse>
    >(TERM_OF_PAYMENT_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get payment term by ID
   */
  getTermOfPaymentById: async (
    id: number,
  ): Promise<ApiResponse<TermOfPaymentResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<TermOfPaymentResponse>
    >(`${TERM_OF_PAYMENT_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new payment term
   */
  createTermOfPayment: async (
    data: TermOfPaymentRequest,
  ): Promise<ApiResponse<TermOfPaymentResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<TermOfPaymentResponse>
    >(TERM_OF_PAYMENT_BASE_URL, data);
    return response.data;
  },

  /**
   * Update payment term
   */
  updateTermOfPayment: async (
    id: number,
    data: TermOfPaymentRequest,
  ): Promise<ApiResponse<TermOfPaymentResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<TermOfPaymentResponse>
    >(`${TERM_OF_PAYMENT_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete payment term
   */
  deleteTermOfPayment: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${TERM_OF_PAYMENT_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
