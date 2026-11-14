import type { ProvinceResponse } from "@/features/master-data/province/data/province.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockProvince: ProvinceResponse = {
  id: 1,
  code: "PROV001",
  name: "West Java",
  alias: "Jabar",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockProvinceInactive: ProvinceResponse = {
  id: 2,
  code: "PROV002",
  name: "East Java",
  alias: "Jatim",
  isActive: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedProvinceResponse: PagedApiResponse<ProvinceResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockProvince],
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

export const singleProvinceResponse: ApiResponse<ProvinceResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockProvince,
};

export const provinceHandlers = [
  http.get(`${BASE}/master/province/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "West Java", description: "West Java" }],
    }),
  ),

  http.get(`${BASE}/master/province`, () => {
    return HttpResponse.json(pagedProvinceResponse);
  }),

  http.get(`${BASE}/master/province/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json(
        { message: "Province not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(singleProvinceResponse);
  }),

  http.post(`${BASE}/master/province`, () => {
    return HttpResponse.json(singleProvinceResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/province/:id`, () => {
    return HttpResponse.json(singleProvinceResponse);
  }),

  http.delete(`${BASE}/master/province/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json(
        { message: "Province not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
