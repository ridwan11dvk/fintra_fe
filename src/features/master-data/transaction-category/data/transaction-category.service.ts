import type {
  TransactionCategoryRequest,
  TransactionCategoryResponse,
} from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const TRANSACTION_CATEGORY_BASE_URL = "/master/transaction-category";

export const transactionCategoryService = {
  /**
   * Get all transaction categories with pagination
   */
  listTransactionCategories: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<TransactionCategoryResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<TransactionCategoryResponse>
    >(TRANSACTION_CATEGORY_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get transaction category by ID
   */
  getTransactionCategoryById: async (
    id: number,
  ): Promise<ApiResponse<TransactionCategoryResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<TransactionCategoryResponse>
    >(`${TRANSACTION_CATEGORY_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new transaction category
   */
  createTransactionCategory: async (
    data: TransactionCategoryRequest,
  ): Promise<ApiResponse<TransactionCategoryResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<TransactionCategoryResponse>
    >(TRANSACTION_CATEGORY_BASE_URL, data);
    return response.data;
  },

  /**
   * Update transaction category
   */
  updateTransactionCategory: async (
    id: number,
    data: TransactionCategoryRequest,
  ): Promise<ApiResponse<TransactionCategoryResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<TransactionCategoryResponse>
    >(`${TRANSACTION_CATEGORY_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete transaction category
   */
  deleteTransactionCategory: async (
    id: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${TRANSACTION_CATEGORY_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
