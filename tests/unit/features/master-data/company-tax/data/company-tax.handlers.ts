import type { CompanyTaxResponse } from "@/features/master-data/company-tax/data/company-tax.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockCompanyTax: CompanyTaxResponse = {
  id: 1,
  companyCode: "PT. ABC",
  taxRateId: 1,
  taxRate: {
    id: 1,
    code: "PPN-11",
    name: "PPN 11%",
    description: "Pajak Pertambahan Nilai 11%",
    taxType: "VAT",
    ratePercent: 11,
    coefficientNumerator: 11,
    coefficientDenominator: 100,
    startDate: "2024-01-01",
    endDate: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  glAccount: "2103",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedCompanyTaxResponse: PagedApiResponse<CompanyTaxResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockCompanyTax],
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

export const singleCompanyTaxResponse: ApiResponse<CompanyTaxResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockCompanyTax,
};

export const companyTaxHandlers = [
  http.get(`${BASE}/master/company-tax`, () =>
    HttpResponse.json(pagedCompanyTaxResponse),
  ),

  http.get(`${BASE}/master/company-tax/:id`, () =>
    HttpResponse.json(singleCompanyTaxResponse),
  ),

  http.post(`${BASE}/master/company-tax`, () =>
    HttpResponse.json(singleCompanyTaxResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/company-tax/:id`, () =>
    HttpResponse.json(singleCompanyTaxResponse),
  ),

  http.delete(`${BASE}/master/company-tax/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
