import type { RegencyResponse } from "@/features/master-data/regency/data/regency.types";
import type {
  ApiResponse,
  OptionDataResponse,
  PagedApiResponse,
} from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockProvince = {
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

export const mockRegency: RegencyResponse = {
  id: 1,
  code: "REG001",
  name: "Bandung",
  provinceId: 1,
  province: mockProvince,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockRegencyInactive: RegencyResponse = {
  id: 2,
  code: "REG002",
  name: "Surabaya",
  provinceId: 1,
  province: { ...mockProvince, name: "East Java" },
  isActive: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockRegencyNoCodeNoProvince: RegencyResponse = {
  id: 3,
  name: "Central Java Regency",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedRegencyResponse: PagedApiResponse<RegencyResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockRegency],
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

export const singleRegencyResponse: ApiResponse<RegencyResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockRegency,
};

export const regencyByProvinceResponse: ApiResponse<RegencyResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockRegency],
};

export const mockOptionDataResponse: OptionDataResponse = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [
    { label: "1", value: "1", description: "West Java" },
    { label: "2", value: "2", description: "East Java" },
  ],
};

export const regencyHandlers = [
  http.get(`${BASE}/master/regency/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "Bandung", description: "Bandung" }],
    }),
  ),

  http.get(`${BASE}/data/province`, () => {
    return HttpResponse.json(mockOptionDataResponse);
  }),

  http.get(`${BASE}/master/regency`, () => {
    return HttpResponse.json(pagedRegencyResponse);
  }),

  http.get(`${BASE}/master/regency/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json(
        { message: "Regency not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(singleRegencyResponse);
  }),

  http.get(`${BASE}/master/regency/province/:provinceId`, ({ params }) => {
    const { provinceId } = params;
    if (provinceId === "999") {
      return HttpResponse.json(
        { message: "Province not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(regencyByProvinceResponse);
  }),

  http.post(`${BASE}/master/regency`, () => {
    return HttpResponse.json(singleRegencyResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/regency/:id`, () => {
    return HttpResponse.json(singleRegencyResponse);
  }),

  http.delete(`${BASE}/master/regency/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json(
        { message: "Regency not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
