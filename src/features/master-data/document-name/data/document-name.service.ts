import type { DocumentNameRequest } from "@/features/master-data";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import type { DocumentNameResponse } from "./document-name.types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const DOCUMENT_NAME_BASE_URL = "/master/document-name";

export const documentNameService = {
  listDocumentNames: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<DocumentNameResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<DocumentNameResponse>
    >(DOCUMENT_NAME_BASE_URL, { params });
    return response.data;
  },

  getDocumentNameById: async (
    id: number,
  ): Promise<ApiResponse<DocumentNameResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<DocumentNameResponse>
    >(`${DOCUMENT_NAME_BASE_URL}/${id}`);
    return response.data;
  },

  createDocumentName: async (
    data: DocumentNameRequest,
  ): Promise<ApiResponse<DocumentNameResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<DocumentNameResponse>
    >(DOCUMENT_NAME_BASE_URL, data);
    return response.data;
  },

  updateDocumentName: async (
    id: number,
    data: DocumentNameRequest,
  ): Promise<ApiResponse<DocumentNameResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<DocumentNameResponse>
    >(`${DOCUMENT_NAME_BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteDocumentName: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${DOCUMENT_NAME_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
