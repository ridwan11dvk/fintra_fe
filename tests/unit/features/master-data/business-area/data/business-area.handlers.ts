import type { BusinessAreaResponse } from "@/features/master-data/business-area/data/business-area.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockBusinessArea: BusinessAreaResponse = {
  id: 1,
  companyCode: "PTABC",
  name: "Business Area Jakarta",
  baCode: "BA-JKT-01",
  branchCode: "BR-001",
  email: "ba.jakarta@ptabc.com",
  taxEmail: "tax.jakarta@ptabc.com",
  nitku: "0012345678",
  npwp: "123456789012345",
  clientId: "CLIENT_001",
  clientSecret: "SECRET_001",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedBusinessAreaResponse: PagedApiResponse<BusinessAreaResponse> =
  {
    status: "SUCCESS",
    message: "Business areas fetched successfully",
    data: {
      content: [mockBusinessArea],
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

export const singleBusinessAreaResponse: ApiResponse<BusinessAreaResponse> = {
  status: "SUCCESS",
  message: "Business area fetched successfully",
  data: mockBusinessArea,
};

export const businessAreaHandlers = [
  http.get(`${BASE}/master/business-area/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "Corporate", description: "Corporate" }],
    }),
  ),

  http.get(`${BASE}/master/business-area`, () => {
    return HttpResponse.json(pagedBusinessAreaResponse);
  }),

  http.get(`${BASE}/master/business-area/:id`, () => {
    return HttpResponse.json(singleBusinessAreaResponse);
  }),

  http.get(`${BASE}/master/business-area/code/:baCode`, () => {
    return HttpResponse.json(singleBusinessAreaResponse);
  }),

  http.post(`${BASE}/master/business-area`, () => {
    return HttpResponse.json(singleBusinessAreaResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/business-area/:id`, () => {
    return HttpResponse.json(singleBusinessAreaResponse);
  }),

  http.delete(`${BASE}/master/business-area/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),

  http.get(`${BASE}/master/business-area/export`, () => {
    return new HttpResponse(
      new Blob(["excel-data"], { type: "application/vnd.ms-excel" }),
      {
        headers: { "Content-Type": "application/vnd.ms-excel" },
      },
    );
  }),

  http.get(`${BASE}/master/business-area/import/template`, () => {
    return new HttpResponse(
      new Blob(["template-data"], { type: "application/vnd.ms-excel" }),
      {
        headers: { "Content-Type": "application/vnd.ms-excel" },
      },
    );
  }),

  http.post(`${BASE}/master/business-area/import`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Import successful",
      data: {
        summary: { total: 5, success: 5, failed: 0 },
        rowErrors: [],
        errorReport: { fileUrl: null },
      },
    });
  }),
];
