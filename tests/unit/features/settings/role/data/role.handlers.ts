import type {
  PermissionResponse,
  RoleDetailResponse,
  RoleResponse,
} from "@/features/settings/role/data/role.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockRole: RoleResponse = {
  id: 1,
  name: "Admin",
  description: "Administrator role",
  moduleId: 1,
  module: { id: 1, name: "Master Data" },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockPermission: PermissionResponse = {
  id: 1,
  name: "master-data:bank:list",
  resource: "master-data:bank",
  description: "View bank list",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockModule: { id: number; name: string } = {
  id: 1,
  name: "Master Data",
};

export const mockRoleDetail: RoleDetailResponse = {
  id: 1,
  name: "Admin",
  description: "Administrator role",
  moduleId: 1,
  module: { id: 1, name: "Master Data" },
  permissions: [mockPermission],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedRoleResponse: PagedApiResponse<RoleResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockRole],
    pagination: {
      total: 1,
      pageSize: 10,
      pageNumber: 1,
      totalPages: 1,
      currentPage: 1,
      from: 1,
      to: 1,
    },
  },
};

export const singleRoleResponse: ApiResponse<RoleResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockRole,
};

export const roleDetailResponse: ApiResponse<RoleDetailResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockRoleDetail,
};

export const permissionsListResponse: ApiResponse<PermissionResponse[]> = {
  status: "SUCCESS",
  message: "Permissions fetched successfully",
  data: [mockPermission],
};

export const pagedPermissionResponse: PagedApiResponse<PermissionResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockPermission],
    pagination: {
      total: 1,
      pageSize: 10,
      pageNumber: 1,
      totalPages: 1,
      currentPage: 1,
      from: 1,
      to: 1,
    },
  },
};

export const roleHandlers = [
  http.get(`${BASE}/master/role`, () => HttpResponse.json(pagedRoleResponse)),

  http.get(`${BASE}/master/role/:id`, () =>
    HttpResponse.json(roleDetailResponse),
  ),

  http.get(`${BASE}/master/role/name/:name`, () =>
    HttpResponse.json(roleDetailResponse),
  ),

  http.post(`${BASE}/master/role`, () =>
    HttpResponse.json(singleRoleResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/role/:id`, () =>
    HttpResponse.json(singleRoleResponse),
  ),

  http.delete(`${BASE}/master/role/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),

  http.post(`${BASE}/master/role/:id/permissions`, () =>
    HttpResponse.json(roleDetailResponse),
  ),

  http.delete(`${BASE}/master/role/:id/permissions`, () =>
    HttpResponse.json(roleDetailResponse),
  ),

  http.get(`${BASE}/master/role/:id/permissions`, () =>
    HttpResponse.json(permissionsListResponse),
  ),

  http.get(`${BASE}/master/permission`, () =>
    HttpResponse.json(pagedPermissionResponse),
  ),
];
