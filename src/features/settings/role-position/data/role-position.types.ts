import type { ApiResponse, PagedApiResponse } from "@railfinance/core/types";
import type { JobPositionResponse, RoleResponse } from "@railfinance/core/masterdata";

export interface RoleSimple {
  id: number;
  name: string;
  code?: string;
}

export interface RolePositionGroupedResponse {
  jobPositionId: number;
  jobPositionCode: string;
  jobPositionName: string;
  roles: RoleSimple[];
}

export interface RolePositionRequest {
  jobPositionId: number;
  roleIds: number[];
}

export interface RolePositionDetailResponse {
  jobPosition: JobPositionResponse;
  roles: RoleResponse[];
}

export interface RolePositionSingleResponse {
  id: number;
  jobPosition: JobPositionResponse;
  role: RoleResponse;
}

// Reverse perspective types (one role → many job positions)
export interface JobPositionSimple {
  id: number;
  name: string;
  code: string;
}

export interface RoleGroupedResponse {
  roleId: number;
  roleName: string;
  roleCode: string;
  jobPositions: JobPositionSimple[];
}

export interface RolePositionByRoleRequest {
  roleId: number;
  jobPositionIds: number[];
}

export interface RolePositionDetailByRoleResponse {
  role: RoleResponse;
  jobPositions: JobPositionResponse[];
}

// API Response types
export type RolePositionListApiResponse =
  PagedApiResponse<RolePositionGroupedResponse>;
export type RolePositionDetailApiResponse =
  ApiResponse<RolePositionDetailResponse>;
export type RolePositionSingleApiResponse =
  ApiResponse<RolePositionSingleResponse>;
export type RolePositionMutationApiResponse =
  ApiResponse<RolePositionDetailResponse>;

// API Response types for reverse perspective
export type RoleGroupedListApiResponse = PagedApiResponse<RoleGroupedResponse>;
export type RolePositionDetailByRoleApiResponse =
  ApiResponse<RolePositionDetailByRoleResponse>;
export type RolePositionMutationByRoleApiResponse =
  ApiResponse<RolePositionDetailByRoleResponse>;

// Alias for convenience
export type RolePosition = RolePositionGroupedResponse;
export type RolePositionByRole = RoleGroupedResponse;
