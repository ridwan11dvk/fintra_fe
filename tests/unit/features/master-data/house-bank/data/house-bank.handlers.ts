import type { HouseBankResponse } from "@/features/master-data/house-bank/data/house-bank.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockHouseBank: HouseBankResponse = {
  id: 1,
  accountId: "HB-BCA-001",
  accountNumber: "1234567890",
  accountName: "PT Fintra - BCA Operasional",
  companyCode: "FINTRA",
  currencyCode: "IDR",
  erpCode: "ERP-BCA1",
  bankCode: "BCA",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedHouseBankResponse: PagedApiResponse<HouseBankResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockHouseBank],
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

export const singleHouseBankResponse: ApiResponse<HouseBankResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockHouseBank,
};

export const houseBankHandlers = [
  http.get(`${BASE}/master/house-bank`, () =>
    HttpResponse.json(pagedHouseBankResponse),
  ),
  http.get(`${BASE}/master/house-bank/:id`, () =>
    HttpResponse.json(singleHouseBankResponse),
  ),
  http.post(`${BASE}/master/house-bank`, () =>
    HttpResponse.json(singleHouseBankResponse, { status: 201 }),
  ),
  http.put(`${BASE}/master/house-bank/:id`, () =>
    HttpResponse.json(singleHouseBankResponse),
  ),
  http.delete(`${BASE}/master/house-bank/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
  http.get(
    `${BASE}/master/house-bank/export`,
    () =>
      new HttpResponse(
        new Blob(["excel-data"], { type: "application/vnd.ms-excel" }),
        { headers: { "Content-Type": "application/vnd.ms-excel" } },
      ),
  ),
  http.get(
    `${BASE}/master/house-bank/import/template`,
    () =>
      new HttpResponse(
        new Blob(["template-data"], { type: "application/vnd.ms-excel" }),
        { headers: { "Content-Type": "application/vnd.ms-excel" } },
      ),
  ),
  http.post(`${BASE}/master/house-bank/import`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Import successful",
      data: {
        summary: { total: 5, success: 5, failed: 0 },
        rowErrors: [],
        errorReport: { fileUrl: null },
      },
    }),
  ),
];
