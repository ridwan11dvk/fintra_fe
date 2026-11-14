import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import type { PermissionResponse, RoleResponse } from "@railfinance/core/masterdata";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  GroupedPermissionsApiResponse,
  PermissionsApiResponse,
  RoleApiResponse,
  RoleDetailApiResponse,
  RoleFullDetailApiResponse,
  RolePermissionRequest,
  RoleRequest,
} from "./role.types";

const ROLE_BASE_URL = "/master/role";
const PERMISSION_BASE_URL = "/master/permission";

export const roleService = {
  /**
   * Get all roles with pagination, search, and filtering
   */
  getRoles: async (
    params: PaginationParams,
  ): Promise<PagedApiResponse<RoleResponse>> => {
    const response = await axiosInstance.get(ROLE_BASE_URL, { params });
    return response.data;
  },

  /**
   * Get filtered roles for dropdowns.
   * Provide either moduleIds or roleId, not both.
   */
  getFilteredRoles: async (params?: {
    moduleIds?: number[];
    roleId?: number;
  }): Promise<ApiResponse<RoleResponse[]>> => {
    const response = await axiosInstance.get(`${ROLE_BASE_URL}/filtered`, {
      params,
    });
    return response.data;
  },

  /**
   * Get role by ID
   */
  getRoleById: async (id: number): Promise<RoleDetailApiResponse> => {
    const response = await axiosInstance.get(`${ROLE_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get role by name
   */
  getRoleByName: async (name: string): Promise<RoleDetailApiResponse> => {
    const response = await axiosInstance.get(`${ROLE_BASE_URL}/name/${name}`);
    return response.data;
  },

  /**
   * Get full role detail with company info, business areas, and module-grouped permissions
   */
  getRoleFullDetail: async (id: number): Promise<RoleFullDetailApiResponse> => {
    const response = await axiosInstance.get(
      `${ROLE_BASE_URL}/${id}/full-detail`,
    );
    return response.data;
  },

  /**
   * Create a new role
   */
  createRole: async (role: RoleRequest): Promise<RoleApiResponse> => {
    const response = await axiosInstance.post(ROLE_BASE_URL, role);
    return response.data;
  },

  /**
   * Update an existing role
   */
  updateRole: async (
    id: number,
    role: RoleRequest,
  ): Promise<RoleApiResponse> => {
    const response = await axiosInstance.put(`${ROLE_BASE_URL}/${id}`, role);
    return response.data;
  },

  /**
   * Delete a role
   */
  deleteRole: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`${ROLE_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Assign permissions to a role
   */
  assignPermissions: async (
    id: number,
    permissions: RolePermissionRequest,
  ): Promise<RoleDetailApiResponse> => {
    const response = await axiosInstance.post(
      `${ROLE_BASE_URL}/${id}/permissions`,
      permissions,
    );
    return response.data;
  },

  /**
   * Remove permissions from a role
   */
  removePermissions: async (
    id: number,
    permissions: RolePermissionRequest,
  ): Promise<RoleDetailApiResponse> => {
    const response = await axiosInstance.delete(
      `${ROLE_BASE_URL}/${id}/permissions`,
      { data: permissions },
    );
    return response.data;
  },

  /**
   * Get permissions for a role
   */
  getRolePermissions: async (id: number): Promise<PermissionsApiResponse> => {
    const response = await axiosInstance.get(
      `${ROLE_BASE_URL}/${id}/permissions`,
    );
    return response.data;
  },

  /**
   * Get all permissions with pagination, search, and filtering
   */
  getPermissions: async (
    params: PaginationParams & {
      search?: string;
      featureId?: number;
      moduleId?: number;
      moduleIds?: number[];
    },
  ): Promise<PagedApiResponse<PermissionResponse>> => {
    const response = await axiosInstance.get(PERMISSION_BASE_URL, { params });
    return response.data;
  },

  /**
   * Get permissions grouped by feature
   */
  getGroupedPermissions: async (params: {
    moduleId?: number;
    featureId?: number;
  }): Promise<GroupedPermissionsApiResponse> => {
    const response = await axiosInstance.get(`${PERMISSION_BASE_URL}/grouped`, {
      params,
    });
    return response.data;
  },
};
