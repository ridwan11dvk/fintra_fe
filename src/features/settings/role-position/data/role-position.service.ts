import type { ApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  RoleGroupedListApiResponse,
  RolePositionByRoleRequest,
  RolePositionDetailApiResponse,
  RolePositionDetailByRoleApiResponse,
  RolePositionGroupedResponse,
  RolePositionListApiResponse,
  RolePositionMutationApiResponse,
  RolePositionMutationByRoleApiResponse,
  RolePositionRequest,
} from "./role-position.types";

const POSITION_ROLE_BASE_URL = "/master/position-role";

export const rolePositionService = {
  /**
   * Get all position-role assignments with pagination and search
   */
  getRolePositions: async (
    params: PaginationParams & { search?: string },
  ): Promise<RolePositionListApiResponse> => {
    const response = await axiosInstance.get(POSITION_ROLE_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get position-role detail by assignment ID
   */
  getRolePositionById: async (
    id: number,
  ): Promise<ApiResponse<RolePositionGroupedResponse>> => {
    const response = await axiosInstance.get(`${POSITION_ROLE_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get position-role detail grouped by position
   */
  getRolePositionByPositionId: async (
    jobPositionId: number,
  ): Promise<RolePositionDetailApiResponse> => {
    const response = await axiosInstance.get(
      `${POSITION_ROLE_BASE_URL}/position/${jobPositionId}`,
    );
    return response.data;
  },

  /**
   * Assign roles to a position (create)
   */
  createPositionRole: async (
    data: RolePositionRequest,
  ): Promise<RolePositionMutationApiResponse> => {
    const response = await axiosInstance.post(POSITION_ROLE_BASE_URL, data);
    return response.data;
  },

  /**
   * Update roles for a position (replace all)
   */
  updatePositionRole: async (
    jobPositionId: number,
    data: RolePositionRequest,
  ): Promise<RolePositionMutationApiResponse> => {
    const response = await axiosInstance.put(
      `${POSITION_ROLE_BASE_URL}/position/${jobPositionId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a position-role assignment by ID
   */
  deleteRolePosition: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(
      `${POSITION_ROLE_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Delete all roles from a position
   */
  deleteAllRolesFromPosition: async (
    jobPositionId: number,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(
      `${POSITION_ROLE_BASE_URL}/position/${jobPositionId}`,
    );
    return response.data;
  },

  // ===========================================================================
  // Role-Position methods (reverse perspective: one role → many positions)
  // ===========================================================================

  /**
   * Get all position-role assignments grouped by role with pagination and search
   */
  getRolePositionsGroupedByRole: async (
    params: PaginationParams & { search?: string },
  ): Promise<RoleGroupedListApiResponse> => {
    const response = await axiosInstance.get(
      `${POSITION_ROLE_BASE_URL}/grouped-by-role`,
      { params },
    );
    return response.data;
  },

  /**
   * Get role-position detail by role ID
   */
  getPositionRoleDetailByRole: async (
    roleId: number,
  ): Promise<RolePositionDetailByRoleApiResponse> => {
    const response = await axiosInstance.get(
      `${POSITION_ROLE_BASE_URL}/role/${roleId}`,
    );
    return response.data;
  },

  /**
   * Assign job positions to a role (create)
   */
  assignPositionsToRole: async (
    data: RolePositionByRoleRequest,
  ): Promise<RolePositionMutationByRoleApiResponse> => {
    const response = await axiosInstance.post(
      `${POSITION_ROLE_BASE_URL}/assign-to-role`,
      data,
    );
    return response.data;
  },

  /**
   * Update job positions for a role (replace all)
   */
  updatePositionsForRole: async (
    roleId: number,
    data: RolePositionByRoleRequest,
  ): Promise<RolePositionMutationByRoleApiResponse> => {
    const response = await axiosInstance.put(
      `${POSITION_ROLE_BASE_URL}/role/${roleId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete all job positions from a role
   */
  deleteAllPositionsFromRole: async (
    roleId: number,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(
      `${POSITION_ROLE_BASE_URL}/role/${roleId}`,
    );
    return response.data;
  },
};
