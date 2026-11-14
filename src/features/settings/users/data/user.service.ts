import type {
  AdminChangePasswordRequest,
  BulkRKIPDateLimitRequest,
  ExternalUserRequest,
  ExternalUserResponse,
  InternalUserDirectCreateRequest,
  InternalUserDirectUpdateRequest,
  InternalUserEsaCreateRequest,
  InternalUserEsaUpdateRequest,
  InternalUserResponse,
  RkipDateLimitRequest,
} from "@/features/settings";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const INTERNAL_USERS_BASE_URL = "/users/internal";
const EXTERNAL_USERS_BASE_URL = "/users/external";

export const userService = {
  // Internal Users

  /**
   * Create internal user from ESA (NIPP lookup)
   */
  createInternalUserFromEsa: async (
    data: InternalUserEsaCreateRequest,
  ): Promise<ApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<InternalUserResponse>
    >(`${INTERNAL_USERS_BASE_URL}/esa`, data);
    return response.data;
  },

  /**
   * Create internal user with direct input (no ESA validation)
   */
  createInternalUserDirect: async (
    data: InternalUserDirectCreateRequest,
  ): Promise<ApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<InternalUserResponse>
    >(INTERNAL_USERS_BASE_URL, data);
    return response.data;
  },

  /**
   * Get internal user by ID
   */
  getInternalUser: async (
    id: number,
  ): Promise<ApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.get<ApiResponse<InternalUserResponse>>(
      `${INTERNAL_USERS_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Get internal user by NIPP from ESA
   */
  getInternalUserByNipp: async (
    nipp: string,
  ): Promise<ApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.get<ApiResponse<InternalUserResponse>>(
      `${INTERNAL_USERS_BASE_URL}/esa/${nipp}`,
    );
    return response.data;
  },

  /**
   * List all internal users with pagination
   */
  listInternalUsers: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<InternalUserResponse>
    >(INTERNAL_USERS_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Update internal user roles from ESA
   */
  updateInternalUserRolesFromEsa: async (
    id: number,
    data: InternalUserEsaUpdateRequest,
  ): Promise<ApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.put<ApiResponse<InternalUserResponse>>(
      `${INTERNAL_USERS_BASE_URL}/esa/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Update internal user with direct input (PATCH semantics)
   */
  patchInternalUser: async (
    id: number,
    data: InternalUserDirectUpdateRequest,
  ): Promise<ApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.patch<
      ApiResponse<InternalUserResponse>
    >(`${INTERNAL_USERS_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete internal user
   */
  deleteInternalUser: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${INTERNAL_USERS_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Delete a role assignment from an internal user
   */
  deleteInternalUserRole: async (
    id: number,
    roleId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${INTERNAL_USERS_BASE_URL}/${id}/roles/${roleId}`,
    );
    return response.data;
  },

  /**
   * Update internal user's RKIP date limit
   */
  updateInternalUserRkipDateLimit: async (
    id: number,
    dateLimit: string,
  ): Promise<ApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<InternalUserResponse>
    >(`${INTERNAL_USERS_BASE_URL}/${id}/rkip-date-limit`, { dateLimit });
    return response.data;
  },

  /**
   * Bulk update RKIP date limit by role IDs
   */
  updateInternalUserRkipDateLimitBulk: async (
    data: BulkRKIPDateLimitRequest,
  ): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.post<ApiResponse<number>>(
      `${INTERNAL_USERS_BASE_URL}/rkip-date-limit/bulk`,
      data,
    );
    return response.data;
  },

  /**
   * Update RKIP date limit for all internal users
   */
  updateInternalUserRkipDateLimitAll: async (
    data: RkipDateLimitRequest,
    moduleId?: number,
  ): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.post<ApiResponse<number>>(
      `${INTERNAL_USERS_BASE_URL}/rkip-date-limit/all`,
      data,
      { params: { moduleId } },
    );
    return response.data;
  },

  /**
   * Delete internal user's RKIP date limit
   */
  deleteInternalUserRkipDateLimit: async (
    id: number,
  ): Promise<ApiResponse<InternalUserResponse>> => {
    const response = await axiosInstance.delete<
      ApiResponse<InternalUserResponse>
    >(`${INTERNAL_USERS_BASE_URL}/${id}/rkip-date-limit`);
    return response.data;
  },

  /**
   * Change internal user password (admin operation)
   */
  changeInternalUserPassword: async (
    id: number,
    data: AdminChangePasswordRequest,
  ): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `${INTERNAL_USERS_BASE_URL}/${id}/change-password`,
      data,
    );
    return response.data;
  },

  // External Users

  /**
   * Create a new external user
   */
  createExternalUser: async (
    data: ExternalUserRequest,
  ): Promise<ApiResponse<ExternalUserResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<ExternalUserResponse>
    >(EXTERNAL_USERS_BASE_URL, data);
    return response.data;
  },

  /**
   * Get external user by ID
   */
  getExternalUser: async (
    id: number,
  ): Promise<ApiResponse<ExternalUserResponse>> => {
    const response = await axiosInstance.get<ApiResponse<ExternalUserResponse>>(
      `${EXTERNAL_USERS_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * List all external users with pagination
   */
  listExternalUsers: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<ExternalUserResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<ExternalUserResponse>
    >(EXTERNAL_USERS_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Update external user
   */
  updateExternalUser: async (
    id: number,
    data: ExternalUserRequest,
  ): Promise<ApiResponse<ExternalUserResponse>> => {
    const response = await axiosInstance.put<ApiResponse<ExternalUserResponse>>(
      `${EXTERNAL_USERS_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete external user
   */
  deleteExternalUser: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${EXTERNAL_USERS_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Change external user password (admin operation)
   */
  changeExternalUserPassword: async (
    id: number,
    data: AdminChangePasswordRequest,
  ): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `${EXTERNAL_USERS_BASE_URL}/${id}/change-password`,
      data,
    );
    return response.data;
  },
};
