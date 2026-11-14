/**
 * Posting Auto Legacy API Service
 * Handles all API calls to the Monitoring Legacy Payment endpoints
 */

import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  BatchPostingRequest,
  BatchRegenerateResult,
  BatchSendToSapResult,
  PostingAutoLegacyDetail,
  PostingAutoLegacyGroup,
  PostingAutoLegacyRequest,
  PostingGenerateAutoRequest,
  SendToSapResponse,
} from "./posting-auto-legacy.types";

const BASE_URL = "/monitoring-legacy/posting/payments";

export const postingAutoLegacyService = {
  /**
   * Get grouped posting auto legacy list with pagination and filtering
   */
  list: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<PostingAutoLegacyGroup>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<PostingAutoLegacyGroup>
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
  ): Promise<ApiResponse<PostingAutoLegacyDetail[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<PostingAutoLegacyDetail[]>
    >(
      `${BASE_URL}/${encodeURIComponent(reversal)}/${encodeURIComponent(noDok)}/${encodeURIComponent(reference)}`,
    );
    return response.data;
  },

  /**
   * Create a new payment line item
   */
  create: async (
    data: PostingAutoLegacyRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update an existing payment line item
   */
  update: async (
    reversal: string,
    noDok: string,
    reference: string,
    indeks: string,
    data: PostingAutoLegacyRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.put<ApiResponse<void>>(
      `${BASE_URL}/${encodeURIComponent(reversal)}/${encodeURIComponent(noDok)}/${encodeURIComponent(reference)}/${encodeURIComponent(indeks)}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a payment line item
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
   * Generate posting entries for a payment invoice number
   */
  generate: async (
    data: PostingGenerateAutoRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `${BASE_URL}/generate`,
      data,
    );
    return response.data;
  },

  /**
   * Regenerate posting entries for an existing payment document group
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
   * Send payment to SAP for processing
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
   * Batch send multiple payments to SAP
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
   * Batch regenerate multiple payment posting entries
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
