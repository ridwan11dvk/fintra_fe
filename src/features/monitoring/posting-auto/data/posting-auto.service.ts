/**
 * Posting Auto API Service
 * Handles all API calls to the Posting Auto endpoints
 */

import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  PostingAuto,
  PostingAutoGroup,
  PostingAutoRequest,
  PostingAutoStatusSummary,
} from "./posting-auto.types";

const BASE_URL = "/monitoring/posting/auto";

export const postingAutoService = {
  /**
   * Get grouped posting autos with pagination and filtering
   */
  listGrouped: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PostingAutoGroup>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PostingAutoGroup>
    >(BASE_URL, { params });
    return response.data;
  },

  /**
   * Get all posting auto records for a specific transaction
   */
  getByTransaction: async (
    reversalFlag: string,
    documentNumber: string,
    reference: string,
  ): Promise<ApiResponse<PostingAuto[]>> => {
    const response = await axiosInstance.get<ApiResponse<PostingAuto[]>>(
      `${BASE_URL}/${encodeURIComponent(reversalFlag)}/${encodeURIComponent(documentNumber)}/${encodeURIComponent(reference)}`,
    );
    return response.data;
  },

  /**
   * Get a single posting auto by ID
   */
  getById: async (id: number): Promise<ApiResponse<PostingAuto>> => {
    const response = await axiosInstance.get<ApiResponse<PostingAuto>>(
      `${BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new posting auto record
   */
  create: async (
    data: PostingAutoRequest,
  ): Promise<ApiResponse<PostingAuto>> => {
    const response = await axiosInstance.post<ApiResponse<PostingAuto>>(
      BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update an existing posting auto record
   */
  update: async (
    id: number,
    data: PostingAutoRequest,
  ): Promise<ApiResponse<PostingAuto>> => {
    const response = await axiosInstance.put<ApiResponse<PostingAuto>>(
      `${BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a posting auto record by ID
   */
  delete: async (id: number): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.delete<ApiResponse<number>>(
      `${BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get status summary counts
   */
  getStatusSummary: async (): Promise<
    ApiResponse<PostingAutoStatusSummary>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<PostingAutoStatusSummary>
    >(`${BASE_URL}/summary/status`);
    return response.data;
  },
};
