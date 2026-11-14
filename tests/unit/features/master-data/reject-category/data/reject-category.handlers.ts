import type {
  ApiResponse,
  PagedApiResponse,
  RejectCategoryResponse,
} from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockRejectCategory: RejectCategoryResponse = {
  id: 1,
  name: "Invalid Data",
  description: "Invalid data rejection",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedRejectCategoryResponse: PagedApiResponse<RejectCategoryResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockRejectCategory],
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

export const singleRejectCategoryResponse: ApiResponse<RejectCategoryResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: mockRejectCategory,
  };

export const rejectCategoryHandlers = [
  http.get(`${BASE}/master/reject-category`, () =>
    HttpResponse.json(pagedRejectCategoryResponse),
  ),

  http.get(`${BASE}/master/reject-category/:id`, () =>
    HttpResponse.json(singleRejectCategoryResponse),
  ),

  http.post(`${BASE}/master/reject-category`, () =>
    HttpResponse.json(singleRejectCategoryResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/reject-category/:id`, () =>
    HttpResponse.json(singleRejectCategoryResponse),
  ),

  http.delete(`${BASE}/master/reject-category/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
