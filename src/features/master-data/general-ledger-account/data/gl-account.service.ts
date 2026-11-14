import type {
  GLAccountRequest,
  GeneralLedgerAccountResponse,
} from "@/features/master-data/general-ledger-account/data/gl-account.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const GL_ACCOUNT_BASE_URL = "/master/gl";

export const glAccountService = {
  /**
   * Get all GL accounts with pagination
   */
  listGLAccounts: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<GeneralLedgerAccountResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<GeneralLedgerAccountResponse>
    >(GL_ACCOUNT_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get GL account by ID
   */
  getGLAccountById: async (
    id: number,
  ): Promise<ApiResponse<GeneralLedgerAccountResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<GeneralLedgerAccountResponse>
    >(`${GL_ACCOUNT_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get GL accounts by company code
   */
  getGLAccountsByCompanyCode: async (
    companyCode: string,
  ): Promise<ApiResponse<GeneralLedgerAccountResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<GeneralLedgerAccountResponse[]>
    >(`${GL_ACCOUNT_BASE_URL}/company/${companyCode}`);
    return response.data;
  },

  /**
   * Get GL accounts by business area code
   */
  getGLAccountsByBACode: async (
    baCode: string,
  ): Promise<ApiResponse<GeneralLedgerAccountResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<GeneralLedgerAccountResponse[]>
    >(`${GL_ACCOUNT_BASE_URL}/business-area/${baCode}`);
    return response.data;
  },

  /**
   * Create a new GL account
   */
  createGLAccount: async (
    data: GLAccountRequest,
  ): Promise<ApiResponse<GeneralLedgerAccountResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<GeneralLedgerAccountResponse>
    >(GL_ACCOUNT_BASE_URL, data);
    return response.data;
  },

  /**
   * Update GL account
   */
  updateGLAccount: async (
    id: number,
    data: GLAccountRequest,
  ): Promise<ApiResponse<GeneralLedgerAccountResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<GeneralLedgerAccountResponse>
    >(`${GL_ACCOUNT_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete GL account
   */
  deleteGLAccount: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${GL_ACCOUNT_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
