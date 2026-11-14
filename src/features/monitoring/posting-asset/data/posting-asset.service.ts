/**
 * Posting Asset Feature Service
 * All HTTP calls go through axiosInstance
 */

import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  PostingAsset,
  PostingAssetGroup,
  PostingAssetRequest,
  PostingAssetStatusSummary,
} from "./posting-asset.types";

const BASE_URL = "/monitoring/posting/asset";

export const postingAssetService = {
  /**
   * Get grouped posting asset list with pagination and filtering
   */
  listGrouped: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PostingAssetGroup>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PostingAssetGroup>
    >(BASE_URL, { params });
    return response.data;
  },

  /**
   * Get detail records by transaction (reversalFlag + documentNumber + reference)
   */
  getByTransaction: async (
    reversalFlag: string,
    documentNumber: string,
    reference: string,
  ): Promise<ApiResponse<PostingAsset[]>> => {
    const response = await axiosInstance.get<ApiResponse<PostingAsset[]>>(
      `${BASE_URL}/${encodeURIComponent(reversalFlag)}/${encodeURIComponent(documentNumber)}/${encodeURIComponent(reference)}`,
    );
    return response.data;
  },

  /**
   * Get a single posting asset by ID
   */
  getById: async (id: number): Promise<ApiResponse<PostingAsset>> => {
    const response = await axiosInstance.get<ApiResponse<PostingAsset>>(
      `${BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new posting asset record
   */
  create: async (
    data: PostingAssetRequest,
  ): Promise<ApiResponse<PostingAsset>> => {
    const response = await axiosInstance.post<ApiResponse<PostingAsset>>(
      BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update an existing posting asset record
   */
  update: async (
    id: number,
    data: PostingAssetRequest,
  ): Promise<ApiResponse<PostingAsset>> => {
    const response = await axiosInstance.put<ApiResponse<PostingAsset>>(
      `${BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a posting asset record by ID
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
    ApiResponse<PostingAssetStatusSummary>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<PostingAssetStatusSummary>
    >(`${BASE_URL}/summary/status`);
    return response.data;
  },
};
