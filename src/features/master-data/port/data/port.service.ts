import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  PortImportResponse,
  PortRequest,
  PortResponse,
} from "./port.types";

const PORT_BASE_URL = "/master/port";

export const portService = {
  /**
   * Get all ports with pagination
   */
  listPorts: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PortResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<PortResponse>>(
      PORT_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  listPortsAlt: async (
    customsOfficeId: number,
    params?: { search?: string },
  ): Promise<ApiResponse<PortResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<PortResponse[]>>(
      `${PORT_BASE_URL}/list/customs-office/${customsOfficeId}`,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get ports by customs office with pagination
   */
  listPortsByCustomsOffice: async (
    customsOfficeId: number,
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PortResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<PortResponse>>(
      `${PORT_BASE_URL}/customs-office/${customsOfficeId}`,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get port by ID
   */
  getPortById: async (id: number): Promise<ApiResponse<PortResponse>> => {
    const response = await axiosInstance.get<ApiResponse<PortResponse>>(
      `${PORT_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new port
   */
  createPort: async (data: PortRequest): Promise<ApiResponse<PortResponse>> => {
    const response = await axiosInstance.post<ApiResponse<PortResponse>>(
      PORT_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update port
   */
  updatePort: async (
    id: number,
    data: PortRequest,
  ): Promise<ApiResponse<PortResponse>> => {
    const response = await axiosInstance.put<ApiResponse<PortResponse>>(
      `${PORT_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete port
   */
  deletePort: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${PORT_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Export ports to Excel
   */
  exportPorts: async (search?: string): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(`${PORT_BASE_URL}/export`, {
      params: search ? { search } : undefined,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Download port import template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${PORT_BASE_URL}/import/template`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Import ports from Excel file
   */
  importPorts: async (
    file: File,
    dryRun?: boolean,
  ): Promise<ApiResponse<PortImportResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (dryRun !== undefined) {
      formData.append("dryRun", String(dryRun));
    }

    const response = await axiosInstance.post<ApiResponse<PortImportResponse>>(
      `${PORT_BASE_URL}/import`,
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
