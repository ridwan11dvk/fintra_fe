import type { PartnerCategoryResponse } from "@/features/master-data/partner-category/data/partner-category.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockPartnerCategory: PartnerCategoryResponse = {
  id: 1,
  name: "Supplier",
  description: "Supplier category",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedPartnerCategoryResponse: PagedApiResponse<PartnerCategoryResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockPartnerCategory],
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

export const singlePartnerCategoryResponse: ApiResponse<PartnerCategoryResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: mockPartnerCategory,
  };

export const partnerCategoryHandlers = [
  http.get(`${BASE}/master/partner/category`, () =>
    HttpResponse.json(pagedPartnerCategoryResponse),
  ),

  http.get(`${BASE}/master/partner/category/:id`, () =>
    HttpResponse.json(singlePartnerCategoryResponse),
  ),

  http.post(`${BASE}/master/partner/category`, () =>
    HttpResponse.json(singlePartnerCategoryResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/partner/category/:id`, () =>
    HttpResponse.json(singlePartnerCategoryResponse),
  ),

  http.delete(`${BASE}/master/partner/category/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
