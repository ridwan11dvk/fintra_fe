import type {
  HouseBankRequest,
  HouseBankResponse,
} from "@/features/master-data/house-bank/data/house-bank.types";
import type { ApiResponse, ImportResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const HOUSE_BANK_BASE_URL = "/master/house-bank";

export const houseBankService = {
  /**
   * Get all house banks with pagination
   */
  listHouseBanks: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<HouseBankResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<HouseBankResponse>
    >(HOUSE_BANK_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get house bank by ID
   */
  getHouseBankById: async (
    id: number,
  ): Promise<ApiResponse<HouseBankResponse>> => {
    const response = await axiosInstance.get<ApiResponse<HouseBankResponse>>(
      `${HOUSE_BANK_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new house bank
   */
  createHouseBank: async (
    data: HouseBankRequest,
  ): Promise<ApiResponse<HouseBankResponse>> => {
    const response = await axiosInstance.post<ApiResponse<HouseBankResponse>>(
      HOUSE_BANK_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update house bank
   */
  updateHouseBank: async (
    id: number,
    data: HouseBankRequest,
  ): Promise<ApiResponse<HouseBankResponse>> => {
    const response = await axiosInstance.put<ApiResponse<HouseBankResponse>>(
      `${HOUSE_BANK_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete house bank
   */
  deleteHouseBank: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${HOUSE_BANK_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Export house banks to Excel
   */
  exportHouseBanks: async (search?: string): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${HOUSE_BANK_BASE_URL}/export`,
      {
        params: search ? { search } : undefined,
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Download house bank import template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${HOUSE_BANK_BASE_URL}/import/template`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Import house banks from Excel file
   */
  importHouseBanks: async (
    file: File,
    dryRun?: boolean,
  ): Promise<ApiResponse<ImportResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (dryRun !== undefined) {
      formData.append("dryRun", String(dryRun));
    }

    const response = await axiosInstance.post<ApiResponse<ImportResponse>>(
      `${HOUSE_BANK_BASE_URL}/import`,
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
