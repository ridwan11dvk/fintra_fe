import type { VillageResponse } from "@/features/master-data/village/data/village.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockVillageDistrict = {
  id: 1,
  code: "DIST001",
  name: "Test District",
  provinceId: 1,
  regencyId: 1,
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockVillage: VillageResponse = {
  id: 1,
  code: "VIL001",
  name: "Cihampelas",
  postalCode: "40141",
  provinceId: 1,
  regencyId: 1,
  districtId: 1,
  district: mockVillageDistrict,
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedVillageResponse: PagedApiResponse<VillageResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockVillage],
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

export const singleVillageResponse: ApiResponse<VillageResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockVillage,
};

export const villageHandlers = [
  http.get(`${BASE}/master/village/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "Cihampelas", description: "Cihampelas" }],
    }),
  ),

  http.get(`${BASE}/master/village`, () => {
    return HttpResponse.json(pagedVillageResponse);
  }),

  http.get(`${BASE}/master/village/:id`, () => {
    return HttpResponse.json(singleVillageResponse);
  }),

  http.get(`${BASE}/master/village/district/:districtId`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data fetched successfully",
      data: [mockVillage],
    });
  }),

  http.post(`${BASE}/master/village`, () => {
    return HttpResponse.json(singleVillageResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/village/:id`, () => {
    return HttpResponse.json(singleVillageResponse);
  }),

  http.delete(`${BASE}/master/village/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
