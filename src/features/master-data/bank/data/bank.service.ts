import type {
  BankImportResponse,
  BankRequest,
  BankResponse,
} from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const BANK_BASE_URL = "/master/bank";

export const bankService = {
  /**
   * Get all banks with pagination
   */
  listBanks: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<BankResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<BankResponse>>(
      BANK_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get bank by ID
   */
  getBankById: async (id: number): Promise<ApiResponse<BankResponse>> => {
    const response = await axiosInstance.get<ApiResponse<BankResponse>>(
      `${BANK_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new bank
   */
  createBank: async (data: BankRequest): Promise<ApiResponse<BankResponse>> => {
    const response = await axiosInstance.post<ApiResponse<BankResponse>>(
      BANK_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update bank
   */
  updateBank: async (
    id: number,
    data: BankRequest,
  ): Promise<ApiResponse<BankResponse>> => {
    const response = await axiosInstance.put<ApiResponse<BankResponse>>(
      `${BANK_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete bank
   */
  deleteBank: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${BANK_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Export banks to Excel
   */
  exportBanks: async (search?: string): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(`${BANK_BASE_URL}/export`, {
      params: search ? { search } : undefined,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Download bank import template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${BANK_BASE_URL}/import/template`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Import banks from Excel file
   */
  importBanks: async (
    file: File,
    dryRun?: boolean,
  ): Promise<ApiResponse<BankImportResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (dryRun !== undefined) {
      formData.append("dryRun", String(dryRun));
    }

    const response = await axiosInstance.post<ApiResponse<BankImportResponse>>(
      `${BANK_BASE_URL}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
