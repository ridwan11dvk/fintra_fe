import type { GLAccountResponse } from "@/features/master-data/general-ledger-account/data/gl-account.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockGLAccount: GLAccountResponse = {
  id: 1,
  companyCode: "COMP1",
  baCode: "BA001",
  unitName: "Jakarta Finance",
  account: "61101",
  description: "Revenue from Product Sales",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedGLAccountResponse: PagedApiResponse<GLAccountResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockGLAccount],
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

export const singleGLAccountResponse: ApiResponse<GLAccountResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockGLAccount,
};

export const listGLAccountsByCompanyResponse: ApiResponse<GLAccountResponse[]> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: [mockGLAccount],
  };

export const glAccountHandlers = [
  // List
  http.get(`${BASE}/master/gl`, () => {
    return HttpResponse.json(pagedGLAccountResponse);
  }),

  // Get by ID
  http.get(`${BASE}/master/gl/:id`, () => {
    return HttpResponse.json(singleGLAccountResponse);
  }),

  // Get by company code
  http.get(`${BASE}/master/gl/company/:companyCode`, () => {
    return HttpResponse.json(listGLAccountsByCompanyResponse);
  }),

  // Get by BA code
  http.get(`${BASE}/master/gl/business-area/:baCode`, () => {
    return HttpResponse.json(listGLAccountsByCompanyResponse);
  }),

  // Create
  http.post(`${BASE}/master/gl`, () => {
    return HttpResponse.json(singleGLAccountResponse, { status: 201 });
  }),

  // Update
  http.put(`${BASE}/master/gl/:id`, () => {
    return HttpResponse.json(singleGLAccountResponse);
  }),

  // Delete
  http.delete(`${BASE}/master/gl/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
