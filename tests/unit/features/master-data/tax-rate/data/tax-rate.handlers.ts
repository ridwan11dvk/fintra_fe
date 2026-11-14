import type { TaxRateResponse } from "@/features/master-data/tax-rate/data/tax-rate.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockTaxRate: TaxRateResponse = {
  id: 1,
  code: "PPN_17",
  name: "PPN 17%",
  description: "Value Added Tax 17%",
  taxType: "PPN",
  ratePercent: 17,
  coefficientNumerator: 17,
  coefficientDenominator: 100,
  isUsedInRkip: true,
  postingType: "OUTPUT",
  isPostingRequired: true,
  startDate: "2024-01-01",
  endDate: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockTaxRateWithEndDate: TaxRateResponse = {
  id: 2,
  code: "PPN_11",
  name: "PPN 11%",
  description: "Value Added Tax 11%",
  taxType: "PPN",
  ratePercent: 11,
  coefficientNumerator: 11,
  coefficientDenominator: 100,
  isUsedInRkip: false,
  postingType: "INPUT",
  isPostingRequired: false,
  startDate: "2022-04-01",
  endDate: "2024-12-31",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockTaxRateMinimal: TaxRateResponse = {
  id: 3,
  code: "PPh_2",
  name: "PPh 2%",
  taxType: "PPh",
  ratePercent: 2,
  coefficientNumerator: 2,
  coefficientDenominator: 100,
  startDate: "2024-01-01",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedTaxRateResponse: PagedApiResponse<TaxRateResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockTaxRate],
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

export const singleTaxRateResponse: ApiResponse<TaxRateResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockTaxRate,
};

export const taxRateHandlers = [
  http.get(`${BASE}/master/tax-rates/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "PPN 11%", description: "PPN 11%" }],
    }),
  ),

  http.get(`${BASE}/master/tax-rates`, () => {
    return HttpResponse.json(pagedTaxRateResponse);
  }),

  http.get(`${BASE}/master/tax-rates/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json(
        { message: "Tax rate not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(singleTaxRateResponse);
  }),

  http.get(`${BASE}/master/tax-rates/code/:code`, ({ params }) => {
    const { code } = params;
    if (code === "NONEXISTENT") {
      return HttpResponse.json(
        { message: "Tax rate not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(singleTaxRateResponse);
  }),

  http.post(`${BASE}/master/tax-rates`, () => {
    return HttpResponse.json(singleTaxRateResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/tax-rates/:id`, () => {
    return HttpResponse.json(singleTaxRateResponse);
  }),

  http.delete(`${BASE}/master/tax-rates/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json(
        { message: "Tax rate not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
