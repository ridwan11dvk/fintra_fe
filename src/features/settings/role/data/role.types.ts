import type { ApiResponse, PagedApiResponse } from "@railfinance/core/types";
import type { PermissionGroupResponse, PermissionResponse, RoleDetailResponse, RoleFullDetailResponse, RoleResponse } from "@railfinance/core/masterdata";

export interface RoleRequest {
  name: string;
  code?: string;
  companyCode?: string;
  isActive?: boolean;
  type?: string;
  businessAreaIds?: number[];
  permissionIds?: number[];
  description?: string;
}

export interface RolePermissionRequest {
  permissionIds: number[];
}

// Domain Type Aliases
export type Role = RoleResponse;
export type Permission = PermissionResponse;
export type RoleApiResponse = ApiResponse<RoleResponse>;
export type RoleDetailApiResponse = ApiResponse<RoleDetailResponse>;
export type PagedRoleApiResponse = PagedApiResponse<RoleResponse>;
export type PermissionsApiResponse = ApiResponse<PermissionResponse[]>;
export type GroupedPermissionsApiResponse = ApiResponse<
  PermissionGroupResponse[]
>;
export type RoleFullDetailApiResponse = ApiResponse<RoleFullDetailResponse>;
