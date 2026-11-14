import type { PartnerClassificationResponse } from "@/features/master-data/partner-classification/data/partner-classification.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockPartnerClassification: PartnerClassificationResponse = {
  id: 1,
  name: "Distributor",
  description: "Distributor classification",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedPartnerClassificationResponse: PagedApiResponse<PartnerClassificationResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockPartnerClassification],
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

export const singlePartnerClassificationResponse: ApiResponse<PartnerClassificationResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: mockPartnerClassification,
  };

export const partnerClassificationHandlers = [
  http.get(`${BASE}/master/partner/classification/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "Individual" }],
    }),
  ),

  http.get(`${BASE}/master/partner/classification`, () =>
    HttpResponse.json(pagedPartnerClassificationResponse),
  ),

  http.get(`${BASE}/master/partner/classification/:id`, () =>
    HttpResponse.json(singlePartnerClassificationResponse),
  ),

  http.post(`${BASE}/master/partner/classification`, () =>
    HttpResponse.json(singlePartnerClassificationResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/partner/classification/:id`, () =>
    HttpResponse.json(singlePartnerClassificationResponse),
  ),

  http.delete(`${BASE}/master/partner/classification/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
