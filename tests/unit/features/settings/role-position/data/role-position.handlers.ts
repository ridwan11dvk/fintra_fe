import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";
const URL = `${BASE}/master/position-role`;

export const mockRolePositionGrouped = {
  jobPositionId: 1,
  jobPositionCode: "JP-001",
  jobPositionName: "Manager",
  roles: [{ id: 1, name: "Admin", code: "ADM" }],
};

const pagedResponse: PagedApiResponse<typeof mockRolePositionGrouped> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockRolePositionGrouped],
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

const detailResponse: ApiResponse<{
  jobPosition: { id: number; code: string; name: string };
  roles: Array<{ id: number; name: string }>;
}> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    jobPosition: { id: 1, code: "JP-001", name: "Manager" },
    roles: [{ id: 1, name: "Admin" }],
  },
};

const roleDetailResponse: ApiResponse<{
  role: { id: number; name: string };
  jobPositions: Array<{ id: number; code: string; name: string }>;
}> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    role: { id: 1, name: "Admin" },
    jobPositions: [{ id: 1, code: "JP-001", name: "Manager" }],
  },
};

const roleGroupedPaged: PagedApiResponse<{
  roleId: number;
  roleName: string;
  roleCode: string;
  jobPositions: Array<{ id: number; name: string; code: string }>;
}> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [
      {
        roleId: 1,
        roleName: "Admin",
        roleCode: "ADM",
        jobPositions: [{ id: 1, name: "Manager", code: "JP-001" }],
      },
    ],
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

const deleted = { status: "SUCCESS", message: "Deleted" };

export const rolePositionHandlers = [
  http.get(URL, () => HttpResponse.json(pagedResponse)),
  http.get(`${URL}/grouped-by-role`, () => HttpResponse.json(roleGroupedPaged)),
  http.get(`${URL}/position/:jobPositionId`, () =>
    HttpResponse.json(detailResponse),
  ),
  http.get(`${URL}/role/:roleId`, () => HttpResponse.json(roleDetailResponse)),
  http.get(`${URL}/:id`, () => HttpResponse.json(detailResponse)),
  http.post(URL, () => HttpResponse.json(detailResponse, { status: 201 })),
  http.post(`${URL}/assign-to-role`, () =>
    HttpResponse.json(roleDetailResponse, { status: 201 }),
  ),
  http.put(`${URL}/position/:jobPositionId`, () =>
    HttpResponse.json(detailResponse),
  ),
  http.put(`${URL}/role/:roleId`, () => HttpResponse.json(roleDetailResponse)),
  http.delete(`${URL}/position/:jobPositionId`, () =>
    HttpResponse.json(deleted),
  ),
  http.delete(`${URL}/role/:roleId`, () => HttpResponse.json(deleted)),
  http.delete(`${URL}/:id`, () => HttpResponse.json(deleted)),
];
