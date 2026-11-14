/**
 * Access Request Feature - Types & Interfaces
 * Matches API Contract data structures
 */

import type { Role } from "@/features/settings";

export type AccessRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AccessRequestResponse {
  id: number;
  userId: number;
  userType: string;
  userName: string;
  userNipp: string;
  status: AccessRequestStatus;
  moduleNames: string; // Comma-separated list
  roleNames: string; // Comma-separated list
  roles: Role[]; // List of roles requested
  requestNotes?: string;
  requestedAt: string;
  approvedAt: string | null;
  responseNotes: string | null;
  approvedBy: string | null;
}

export interface AccessRequestDetailResponse extends AccessRequestResponse {
  modules?: ModuleWithRoles[];
}

export interface ModuleWithRoles {
  moduleId: number;
  moduleName: string;
  availableRoles: Role[];
  approvedRoleId?: number | null;
}

// Request DTOs
export interface SubmitAccessRequest {
  moduleIds: number[];
  roleIds: number[];
  requestNotes?: string;
}

export interface ChangeAccessRequestStatus {
  status: "APPROVED" | "REJECTED";
  roles?: number[]; // Role IDs to assign (required for APPROVED)
  responseNotes?: string;
}

// Query Parameters
export interface AccessRequestListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: AccessRequestStatus;
}

// Dropdown/Select data
export interface ModuleDropdownOption {
  id: number;
  name: string;
}
