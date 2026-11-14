import type {
  BusinessAreaRequest,
  BusinessAreaResponse,
} from "@/features/master-data/business-area/data/business-area.types";
import type { ApiResponse, ImportResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const BUSINESS_AREA_BASE_URL = "/master/business-area";

export const businessAreaService = {
  /**
   * Get all business areas with pagination
   */
  listBusinessAreas: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<BusinessAreaResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<BusinessAreaResponse>
    >(BUSINESS_AREA_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get business area by ID
   */
  getBusinessAreaById: async (
    id: number,
  ): Promise<ApiResponse<BusinessAreaResponse>> => {
    const response = await axiosInstance.get<ApiResponse<BusinessAreaResponse>>(
      `${BUSINESS_AREA_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get business area by code
   */
  getBusinessAreaByCode: async (
    baCode: string,
  ): Promise<ApiResponse<BusinessAreaResponse>> => {
    const response = await axiosInstance.get<ApiResponse<BusinessAreaResponse>>(
      `${BUSINESS_AREA_BASE_URL}/code/${baCode}`,
    );
    return response.data;
  },

  /**
   * Create a new business area
   */
  createBusinessArea: async (
    data: BusinessAreaRequest,
  ): Promise<ApiResponse<BusinessAreaResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<BusinessAreaResponse>
    >(BUSINESS_AREA_BASE_URL, data);

    return response.data;
  },

  /**
   * Update business area
   */
  updateBusinessArea: async (
    id: number,
    data: BusinessAreaRequest,
  ): Promise<ApiResponse<BusinessAreaResponse>> => {
    const response = await axiosInstance.put<ApiResponse<BusinessAreaResponse>>(
      `${BUSINESS_AREA_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete business area
   */
  deleteBusinessArea: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${BUSINESS_AREA_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Export business areas to Excel
   */
  exportBusinessAreas: async (search?: string): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${BUSINESS_AREA_BASE_URL}/export`,
      {
        params: search ? { search } : undefined,
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Download business area import template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${BUSINESS_AREA_BASE_URL}/import/template`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Import business areas from Excel file
   */
  importBusinessAreas: async (
    file: File,
    dryRun?: boolean,
  ): Promise<ApiResponse<ImportResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (dryRun !== undefined) {
      formData.append("dryRun", String(dryRun));
    }

    const response = await axiosInstance.post<ApiResponse<ImportResponse>>(
      `${BUSINESS_AREA_BASE_URL}/import`,
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
