import type { CountryResponse } from "@/features/master-data/country/data/country.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockCountry: CountryResponse = {
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
};

export const pagedCountryResponse: PagedApiResponse<CountryResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockCountry],
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

export const singleCountryResponse: ApiResponse<CountryResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockCountry,
};

export const countryHandlers = [
  http.get(`${BASE}/master/country/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "Indonesia", description: "Indonesia" }],
    }),
  ),

  http.get(`${BASE}/master/country`, () =>
    HttpResponse.json(pagedCountryResponse),
  ),

  http.get(`${BASE}/master/country/:id`, () =>
    HttpResponse.json(singleCountryResponse),
  ),

  http.post(`${BASE}/master/country`, () =>
    HttpResponse.json(singleCountryResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/country/:id`, () =>
    HttpResponse.json(singleCountryResponse),
  ),

  http.delete(`${BASE}/master/country/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
