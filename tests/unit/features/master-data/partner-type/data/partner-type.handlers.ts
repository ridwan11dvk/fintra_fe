import type { PartnerTypeResponse } from "@/features/master-data/partner-type/data/partner-type.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockPartnerType: PartnerTypeResponse = {
  id: 1,
  code: "DS",
  partnerLegalityId: 1,
  partnerLegality: { id: 1, name: "Supplier" },
  parentId: null,
  parent: null,
  name: "Domestic Supplier",
  description: "Local domestic supplier",
  isActive: true,
  integratedToErp: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedPartnerTypeResponse: PagedApiResponse<PartnerTypeResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockPartnerType],
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

export const singlePartnerTypeResponse: ApiResponse<PartnerTypeResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockPartnerType,
};

export const multiplePartnerTypeResponse: ApiResponse<PartnerTypeResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockPartnerType],
};

export const partnerTypeHandlers = [
  http.get(`${BASE}/master/partner/type`, () =>
    HttpResponse.json(pagedPartnerTypeResponse),
  ),

  http.get(`${BASE}/master/partner/type/:id`, () =>
    HttpResponse.json(singlePartnerTypeResponse),
  ),

  http.get(`${BASE}/master/partner/type/legality/:legalityId/root`, () =>
    HttpResponse.json(multiplePartnerTypeResponse),
  ),

  http.get(`${BASE}/master/partner/type/:parentId/subtypes`, () =>
    HttpResponse.json(multiplePartnerTypeResponse),
  ),

  http.post(`${BASE}/master/partner/type`, () =>
    HttpResponse.json(singlePartnerTypeResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/partner/type/:id`, () =>
    HttpResponse.json(singlePartnerTypeResponse),
  ),

  http.delete(`${BASE}/master/partner/type/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
