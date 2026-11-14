import type {
  UomImportResponse,
  UomRequest,
  UomResponse,
} from "@/features/master-data/unit-of-measure/data/uom.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const UOM_BASE_URL = "/master/uom";

export const uomService = {
  /**
   * Get all units of measure with pagination
   */
  listUoms: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<UomResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<UomResponse>>(
      UOM_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get all active units of measure (no pagination)
   */
  getActiveUoms: async (): Promise<ApiResponse<UomResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<UomResponse[]>>(
      `${UOM_BASE_URL}/active`,
    );
    return response.data;
  },

  /**
   * Get unit of measure by ID
   */
  getUomById: async (id: number): Promise<ApiResponse<UomResponse>> => {
    const response = await axiosInstance.get<ApiResponse<UomResponse>>(
      `${UOM_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get unit of measure by code
   */
  getUomByCode: async (code: string): Promise<ApiResponse<UomResponse>> => {
    const response = await axiosInstance.get<ApiResponse<UomResponse>>(
      `${UOM_BASE_URL}/code/${code}`,
    );
    return response.data;
  },

  /**
   * Create a new unit of measure
   */
  createUom: async (data: UomRequest): Promise<ApiResponse<UomResponse>> => {
    const response = await axiosInstance.post<ApiResponse<UomResponse>>(
      UOM_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update unit of measure
   */
  updateUom: async (
    id: number,
    data: UomRequest,
  ): Promise<ApiResponse<UomResponse>> => {
    const response = await axiosInstance.put<ApiResponse<UomResponse>>(
      `${UOM_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete unit of measure
   */
  deleteUom: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${UOM_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Export units of measure to Excel
   */
  exportUoms: async (search?: string): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(`${UOM_BASE_URL}/export`, {
      params: search ? { search } : undefined,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Download uom import template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${UOM_BASE_URL}/import/template`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Import units of measure from Excel file
   */
  importUoms: async (
    file: File,
    dryRun?: boolean,
  ): Promise<ApiResponse<UomImportResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (dryRun !== undefined) {
      formData.append("dryRun", String(dryRun));
    }

    const response = await axiosInstance.post<ApiResponse<UomImportResponse>>(
      `${UOM_BASE_URL}/import`,
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
