import type { ApiResponse } from "@railfinance/core/types";
import type { PermissionResponse } from "@railfinance/core/masterdata";

export interface M2mClientRequest {
  name: string;
  description?: string;
  permissionIds?: number[];
  expiresAt?: string | null;
}

export interface M2mClientUpdateRequest {
  name: string;
  description?: string;
  status?: string;
  expiresAt?: string | null;
}

export interface M2mClientPermissionRequest {
  permissionIds: number[];
}

export interface M2mClientResponse {
  id: number;
  name: string;
  description?: string;
  status: string;
  expiresAt?: string | null;
  permissions: PermissionResponse[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface M2mClientCreateResponse {
  id: number;
  name: string;
  description?: string;
  token: string;
  status: string;
  expiresAt?: string | null;
  permissionIds: number[];
  createdAt: string;
}

export interface M2mClientAuditResponse {
  id: number;
  apiClientId: number;
  actionType: string;
  summary?: string;
  userNipp?: string;
  userName?: string;
  ipAddress?: string;
  changedFields?: Record<string, { label: string; old: string; new: string }>;
  createdAt: string;
}

export type M2mClient = M2mClientResponse;
export type M2mClientCreateData = M2mClientCreateResponse;
export type M2mClientApiResponse = ApiResponse<M2mClientResponse>;
export type M2mClientCreateApiResponse = ApiResponse<M2mClientCreateResponse>;
