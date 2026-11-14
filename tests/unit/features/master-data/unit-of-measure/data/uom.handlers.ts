import type { UomResponse } from "@/features/master-data/unit-of-measure/data/uom.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockUom: UomResponse = {
  id: 1,
  code: "KG",
  unit: "Kilogram",
  unitEn: "Kilogram",
  unitAlias: "KG",
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedUomResponse: PagedApiResponse<UomResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockUom],
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

export const singleUomResponse: ApiResponse<UomResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockUom,
};

export const uomHandlers = [
  http.get(`${BASE}/master/uom`, () => {
    return HttpResponse.json(pagedUomResponse);
  }),

  http.get(`${BASE}/master/uom/active`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data fetched successfully",
      data: [mockUom],
    });
  }),

  http.get(`${BASE}/master/uom/:id`, () => {
    return HttpResponse.json(singleUomResponse);
  }),

  http.get(`${BASE}/master/uom/code/:code`, () => {
    return HttpResponse.json(singleUomResponse);
  }),

  http.post(`${BASE}/master/uom`, () => {
    return HttpResponse.json(singleUomResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/uom/:id`, () => {
    return HttpResponse.json(singleUomResponse);
  }),

  http.delete(`${BASE}/master/uom/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
