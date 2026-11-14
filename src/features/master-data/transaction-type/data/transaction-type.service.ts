import type {
  TransactionTypeRequest,
  TransactionTypeResponse,
} from "@/features/master-data/transaction-type/data/transaction-type.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const TRANSACTION_TYPE_BASE_URL = "/master/transaction-type";

export const transactionTypeService = {
  /**
   * Get all transaction types with pagination
   */
  listTransactionTypes: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<TransactionTypeResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<TransactionTypeResponse>
    >(TRANSACTION_TYPE_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get transaction type by ID
   */
  getTransactionTypeById: async (
    id: number,
  ): Promise<ApiResponse<TransactionTypeResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<TransactionTypeResponse>
    >(`${TRANSACTION_TYPE_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get transaction types by company code
   */
  getTransactionTypesByCompanyCode: async (
    companyCode: string,
  ): Promise<ApiResponse<TransactionTypeResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TransactionTypeResponse[]>
    >(`${TRANSACTION_TYPE_BASE_URL}/company/${companyCode}`);
    return response.data;
  },

  /**
   * Get transaction type by company code and tcode
   */
  getTransactionTypeByCompanyAndTcode: async (
    companyCode: string,
    tcode: string,
  ): Promise<ApiResponse<TransactionTypeResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<TransactionTypeResponse>
    >(`${TRANSACTION_TYPE_BASE_URL}/company/${companyCode}/tcode/${tcode}`);
    return response.data;
  },

  /**
   * Get transaction types by module ID
   */
  getTransactionTypesByModuleId: async (
    moduleId: number,
  ): Promise<ApiResponse<TransactionTypeResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TransactionTypeResponse[]>
    >(`${TRANSACTION_TYPE_BASE_URL}/module/${moduleId}`);
    return response.data;
  },

  /**
   * Create a new transaction type
   */
  createTransactionType: async (
    data: TransactionTypeRequest,
  ): Promise<ApiResponse<TransactionTypeResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<TransactionTypeResponse>
    >(TRANSACTION_TYPE_BASE_URL, data);

    return response.data;
  },

  /**
   * Update transaction type
   */
  updateTransactionType: async (
    id: number,
    data: TransactionTypeRequest,
  ): Promise<ApiResponse<TransactionTypeResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<TransactionTypeResponse>
    >(`${TRANSACTION_TYPE_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete transaction type
   */
  deleteTransactionType: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${TRANSACTION_TYPE_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
