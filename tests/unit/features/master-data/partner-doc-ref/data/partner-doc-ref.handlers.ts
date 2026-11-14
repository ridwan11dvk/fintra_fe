import type { PartnerDocRefResponse } from "@/features/master-data/partner-doc-ref/data/partner-doc-ref.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockPartnerDocRef: PartnerDocRefResponse = {
  id: 1,
  countryId: 1,
  countryName: "Indonesia",
  companyCode: "C001",
  partnerCategoryId: 1,
  partnerCategoryName: "Supplier",
  partnerTypeId: 1,
  partnerTypeName: "Individual",
  partnerSubTypeId: 1,
  partnerSubTypeName: "Local",
  documentName: "KTP",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedPartnerDocRefResponse: PagedApiResponse<PartnerDocRefResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockPartnerDocRef],
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

export const singlePartnerDocRefResponse: ApiResponse<PartnerDocRefResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockPartnerDocRef,
};

export const multiplePartnerDocRefResponse: ApiResponse<
  PartnerDocRefResponse[]
> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockPartnerDocRef],
};

export const partnerDocRefHandlers = [
  http.get(`${BASE}/master/partner/doc-ref`, () =>
    HttpResponse.json(pagedPartnerDocRefResponse),
  ),

  http.get(`${BASE}/master/partner/doc-ref/filtered`, () =>
    HttpResponse.json(multiplePartnerDocRefResponse),
  ),

  http.get(`${BASE}/master/partner/doc-ref/:id`, () =>
    HttpResponse.json(singlePartnerDocRefResponse),
  ),

  http.get(`${BASE}/master/partner/doc-ref/country/:countryId`, () =>
    HttpResponse.json(multiplePartnerDocRefResponse),
  ),

  http.get(
    `${BASE}/master/partner/doc-ref/country/:countryId/company/:companyCode`,
    () => HttpResponse.json(multiplePartnerDocRefResponse),
  ),

  http.post(`${BASE}/master/partner/doc-ref`, () =>
    HttpResponse.json(singlePartnerDocRefResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/partner/doc-ref/:id`, () =>
    HttpResponse.json(singlePartnerDocRefResponse),
  ),

  http.delete(`${BASE}/master/partner/doc-ref/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
