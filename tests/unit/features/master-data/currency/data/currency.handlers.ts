import type { CurrencyResponse } from "@/features/master-data/currency/data/currency.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockCurrency: CurrencyResponse = {
  id: 1,
  countryId: 1,
  country: {
    id: 1,
    name: "Indonesia",
    iso2Code: "ID",
    iso3Code: "IDN",
    dialCode: "+62",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  code: "IDR",
  name: "Indonesian Rupiah",
  symbol: "Rp",
  lowestValue: 1.0,
  isPrimary: true,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedCurrencyResponse: PagedApiResponse<CurrencyResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockCurrency],
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

export const singleCurrencyResponse: ApiResponse<CurrencyResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockCurrency,
};

export const currencyHandlers = [
  http.get(`${BASE}/master/currency/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "IDR", description: "Indonesian Rupiah" }],
    }),
  ),

  http.get(`${BASE}/master/currency`, () =>
    HttpResponse.json(pagedCurrencyResponse),
  ),

  http.get(`${BASE}/master/currency/:id`, ({ params }) => {
    if (params.id === "999") {
      return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }
    return HttpResponse.json(singleCurrencyResponse);
  }),

  http.get(`${BASE}/master/currency/country/:countryId`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data fetched successfully",
      data: [mockCurrency],
    }),
  ),

  http.get(`${BASE}/master/currency/country/:countryId/active`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data fetched successfully",
      data: [mockCurrency],
    }),
  ),

  http.post(`${BASE}/master/currency`, () =>
    HttpResponse.json(singleCurrencyResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/currency/:id`, () =>
    HttpResponse.json(singleCurrencyResponse),
  ),

  http.delete(`${BASE}/master/currency/:id`, ({ params }) => {
    if (params.id === "999") {
      return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),

  http.post(`${BASE}/master/currency/sync`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data synced successfully",
    }),
  ),
];
