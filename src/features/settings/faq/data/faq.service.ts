import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type { FaqRequest, FaqResponse } from "./faq.types";

const FAQ_BASE_URL = "/setting/faq";

export const faqService = {
  /**
   * Get all FAQs with pagination and optional search/target filters
   */
  listFaqs: async (
    params?: PaginationParams & { target?: string },
  ): Promise<PagedApiResponse<FaqResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<FaqResponse>>(
      FAQ_BASE_URL,
      { params },
    );
    return response.data;
  },

  /**
   * Get FAQ by ID
   */
  getFaqById: async (id: number): Promise<ApiResponse<FaqResponse>> => {
    const response = await axiosInstance.get<ApiResponse<FaqResponse>>(
      `${FAQ_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new FAQ (plain JSON body; FAQs carry no attachments)
   */
  createFaq: async (data: FaqRequest): Promise<ApiResponse<FaqResponse>> => {
    const response = await axiosInstance.post<ApiResponse<FaqResponse>>(
      FAQ_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update a FAQ
   */
  updateFaq: async (
    id: number,
    data: FaqRequest,
  ): Promise<ApiResponse<FaqResponse>> => {
    const response = await axiosInstance.put<ApiResponse<FaqResponse>>(
      `${FAQ_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a FAQ
   */
  deleteFaq: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${FAQ_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
