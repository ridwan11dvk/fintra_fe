/**
 * Access Request Feature - API Service
 * Axios service layer for access request endpoints
 */

import type { PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  AccessRequestDetailResponse,
  AccessRequestResponse,
  ChangeAccessRequestStatus,
} from "./access-request.types";

export const accessRequestService = {
  /**
   * List pending access requests (admin only)
   * GET /api/access-request?page=0&size=20&search=...&status=...
   */
  listAccessRequests: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<AccessRequestResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<AccessRequestResponse>
    >("/access-request", { params });
    return response.data;
  },

  /**
   * Get access request details
   * GET /api/access-request/{requestId}
   */
  getAccessRequestById: async (
    requestId: number,
  ): Promise<AccessRequestDetailResponse> => {
    const response = await axiosInstance.get<AccessRequestDetailResponse>(
      `/access-request/${requestId}`,
    );
    return response.data;
  },

  /**
   * Change access request status (approve or reject)
   * PUT /api/access-request/{requestId}
   */
  changeAccessRequestStatus: async (
    requestId: number,
    data: ChangeAccessRequestStatus,
  ): Promise<AccessRequestResponse> => {
    const response = await axiosInstance.put<AccessRequestResponse>(
      `/access-request/${requestId}`,
      data,
    );
    return response.data;
  },
};
