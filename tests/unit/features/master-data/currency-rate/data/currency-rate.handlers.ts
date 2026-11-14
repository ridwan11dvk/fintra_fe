import type { CurrencyRateResponse } from "@/features/master-data/currency-rate/data/currency-rate.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockCurrencyRate: CurrencyRateResponse = {
  id: 1,
  currencyCode: "USD",
  rateType: "KMK",
  rate: 15500.5,
  description: "Official USD rate",
  startDate: "2024-01-01T00:00:00Z",
  endDate: "2024-12-31T00:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockCurrencyRateNoEnd: CurrencyRateResponse = {
  id: 2,
  currencyCode: "EUR",
  rateType: "BI",
  rate: 16800.0,
  description: "EUR BI rate",
  startDate: "2024-06-01T00:00:00Z",
  endDate: null,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedCurrencyRateResponse: PagedApiResponse<CurrencyRateResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockCurrencyRate, mockCurrencyRateNoEnd],
      pagination: {
        total: 2,
        pageSize: 10,
        pageNumber: 1,
        totalPages: 1,
        currentPage: 1,
        from: 1,
        to: 2,
      },
    },
  };

export const singleCurrencyRateResponse: ApiResponse<CurrencyRateResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockCurrencyRate,
};

export const listCurrencyRateResponse: ApiResponse<CurrencyRateResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockCurrencyRate, mockCurrencyRateNoEnd],
};

export const currencyRateHandlers = [
  http.get(`${BASE}/master/currency-rate`, () => {
    return HttpResponse.json(pagedCurrencyRateResponse);
  }),

  http.get(`${BASE}/master/currency-rate/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json(
        { message: "Currency rate not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(singleCurrencyRateResponse);
  }),

  http.get(`${BASE}/master/currency-rate/currency/:currencyCode`, () => {
    return HttpResponse.json(listCurrencyRateResponse);
  }),

  http.get(
    `${BASE}/master/currency-rate/currency/:currencyCode/rate-type/:rateType`,
    () => {
      return HttpResponse.json(listCurrencyRateResponse);
    },
  ),

  http.get(`${BASE}/master/currency-rate/rate-type/:rateType/latest`, () => {
    return HttpResponse.json(listCurrencyRateResponse);
  }),

  http.get(
    `${BASE}/master/currency-rate/currency/:currencyCode/rate-type/:rateType/at-date`,
    () => {
      return HttpResponse.json(singleCurrencyRateResponse);
    },
  ),

  http.get(
    `${BASE}/master/currency-rate/currency/:currencyCode/rate-type/:rateType/latest`,
    () => {
      return HttpResponse.json(singleCurrencyRateResponse);
    },
  ),

  http.post(`${BASE}/master/currency-rate`, () => {
    return HttpResponse.json(singleCurrencyRateResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/currency-rate/:id`, () => {
    return HttpResponse.json(singleCurrencyRateResponse);
  }),

  http.delete(`${BASE}/master/currency-rate/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Currency rate deleted successfully",
    });
  }),

  http.post(`${BASE}/master/currency-rate/sync`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Rates synced successfully",
    });
  }),
];
