/**
 * Posting Asset Legacy API Service
 * Handles all API calls to the Monitoring Legacy Invoice endpoints
 */

import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  BatchPostingRequest,
  BatchRegenerateResult,
  BatchSendToSapResult,
  PostingAssetLegacyDetail,
  PostingAssetLegacyGroup,
  PostingAssetLegacyRequest,
  PostingGenerateAssetRequest,
  SendToSapResponse,
} from "./posting-asset-legacy.types";

const BASE_URL = "/monitoring-legacy/posting/invoices";

export const postingAssetLegacyService = {
  /**
   * Get grouped posting asset legacy list with pagination and filtering
   */
  list: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PostingAssetLegacyGroup>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PostingAssetLegacyGroup>
    >(BASE_URL, { params });
    return response.data;
  },

  /**
   * Get detail records by transaction (reversal + noDok + reference)
   */
  getByTransaction: async (
    reversal: string,
    noDok: string,
    reference: string,
  ): Promise<ApiResponse<PostingAssetLegacyDetail[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PostingAssetLegacyDetail[]>
    >(
      `${BASE_URL}/${encodeURIComponent(reversal)}/${encodeURIComponent(noDok)}/${encodeURIComponent(reference)}`,
    );
    return response.data;
  },

  /**
   * Create a new invoice line item
   */
  create: async (
    data: PostingAssetLegacyRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update an existing invoice line item
   */
  update: async (
    reversal: string,
    noDok: string,
    reference: string,
    indeks: string,
    data: PostingAssetLegacyRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.put<ApiResponse<void>>(
      `${BASE_URL}/${encodeURIComponent(reversal)}/${encodeURIComponent(noDok)}/${encodeURIComponent(reference)}/${encodeURIComponent(indeks)}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete an invoice line item
   */
  delete: async (
    reversal: string,
    noDok: string,
    reference: string,
    indeks: string,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      `${BASE_URL}/${encodeURIComponent(reversal)}/${encodeURIComponent(noDok)}/${encodeURIComponent(reference)}/${encodeURIComponent(indeks)}`,
    );
    return response.data;
  },

  /**
   * Generate posting entries for an invoice number
   */
  generate: async (
    data: PostingGenerateAssetRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `${BASE_URL}/generate`,
      data,
    );
    return response.data;
  },

  /**
   * Regenerate posting entries for an existing invoice document group
   */
  regenerate: async (
    reversal: string,
    noDok: string,
    reference: string,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `${BASE_URL}/${encodeURIComponent(reversal)}/${encodeURIComponent(noDok)}/${encodeURIComponent(reference)}/regenerate`,
    );
    return response.data;
  },

  /**
   * Send invoice to SAP for processing
   */
  sendToSap: async (
    reversal: string,
    noDok: string,
    reference: string,
  ): Promise<ApiResponse<SendToSapResponse>> => {
    const response = await axiosInstance.post<ApiResponse<SendToSapResponse>>(
      `${BASE_URL}/${encodeURIComponent(reversal)}/${encodeURIComponent(noDok)}/${encodeURIComponent(reference)}/send-to-sap`,
    );
    return response.data;
  },

  /**
   * Batch send multiple invoices to SAP
   */
  batchSendToSap: async (
    data: BatchPostingRequest,
  ): Promise<ApiResponse<BatchSendToSapResult>> => {
    const response = await axiosInstance.post<
      ApiResponse<BatchSendToSapResult>
    >(`${BASE_URL}/batch/send-to-sap`, data);
    return response.data;
  },

  /**
   * Batch regenerate multiple invoice posting entries
   */
  batchRegenerate: async (
    data: BatchPostingRequest,
  ): Promise<ApiResponse<BatchRegenerateResult>> => {
    const response = await axiosInstance.post<
      ApiResponse<BatchRegenerateResult>
    >(`${BASE_URL}/batch/regenerate`, data);
    return response.data;
  },
};
