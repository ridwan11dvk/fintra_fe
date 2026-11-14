import type { CostCenterResponse } from "@/features/master-data/cost-center/data/cost-center.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockCostCenter: CostCenterResponse = {
  id: 1,
  companyCode: "COMP001",
  baCode: "BA001",
  costCenterCode: "CC-001",
  costCenterName: "Jakarta Head Office Cost Center",
  startDate: "2024-01-01",
  endDate: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedCostCenterResponse: PagedApiResponse<CostCenterResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockCostCenter],
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

export const singleCostCenterResponse: ApiResponse<CostCenterResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockCostCenter,
};

export const costCenterHandlers = [
  // List
  http.get(`${BASE}/master/cost-center`, () =>
    HttpResponse.json(pagedCostCenterResponse),
  ),

  // Active
  http.get(`${BASE}/master/cost-center/active`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data fetched successfully",
      data: [mockCostCenter],
    }),
  ),

  // By company and BA
  http.get(`${BASE}/master/cost-center/company/:companyCode/ba/:baCode`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data fetched successfully",
      data: [mockCostCenter],
    }),
  ),

  // By company, BA and type
  http.get(
    `${BASE}/master/cost-center/company/:companyCode/ba/:baCode/type/:type`,
    () =>
      HttpResponse.json({
        status: "SUCCESS",
        message: "Data fetched successfully",
        data: [mockCostCenter],
      }),
  ),

  // Get by ID
  http.get(`${BASE}/master/cost-center/:id`, () =>
    HttpResponse.json(singleCostCenterResponse),
  ),

  // Create
  http.post(`${BASE}/master/cost-center`, () =>
    HttpResponse.json(singleCostCenterResponse, { status: 201 }),
  ),

  // Update
  http.put(`${BASE}/master/cost-center/:id`, () =>
    HttpResponse.json(singleCostCenterResponse),
  ),

  // Delete
  http.delete(`${BASE}/master/cost-center/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
