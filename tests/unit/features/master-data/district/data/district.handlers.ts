import type { DistrictResponse } from "@/features/master-data/district/data/district.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockDistrict: DistrictResponse = {
  id: 1,
  code: "DIST001",
  name: "Bandung City",
  provinceId: 1,
  regencyId: 1,
  regency: {
    id: 1,
    name: "Bandung",
    code: "BDG",
    provinceId: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedDistrictResponse: PagedApiResponse<DistrictResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockDistrict],
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

export const singleDistrictResponse: ApiResponse<DistrictResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockDistrict,
};

export const districtListResponse: ApiResponse<DistrictResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockDistrict],
};

export const districtHandlers = [
  http.get(`${BASE}/master/district/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "Coblong", description: "Coblong" }],
    }),
  ),

  http.get(`${BASE}/master/district`, () =>
    HttpResponse.json(pagedDistrictResponse),
  ),

  http.get(`${BASE}/master/district/:id`, () =>
    HttpResponse.json(singleDistrictResponse),
  ),

  http.get(`${BASE}/master/district/regency/:regencyId`, () =>
    HttpResponse.json(districtListResponse),
  ),

  http.post(`${BASE}/master/district`, () =>
    HttpResponse.json(singleDistrictResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/district/:id`, () =>
    HttpResponse.json(singleDistrictResponse),
  ),

  http.delete(`${BASE}/master/district/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
