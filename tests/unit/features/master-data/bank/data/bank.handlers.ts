import type { BankResponse } from "@/features/master-data/bank/data/bank.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockBank: BankResponse = {
  id: 1,
  name: "Bank Central Asia",
  code: "BCA",
  color: "#003ea0",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedBankResponse: PagedApiResponse<BankResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockBank],
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

export const singleBankResponse: ApiResponse<BankResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockBank,
};

export const bankHandlers = [
  // List banks
  http.get(`${BASE}/master/bank/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "BNI", description: "Bank Negara Indonesia" }],
    }),
  ),

  http.get(`${BASE}/master/bank`, () => {
    return HttpResponse.json(pagedBankResponse);
  }),

  // Get bank by ID
  http.get(`${BASE}/master/bank/:id`, () => {
    return HttpResponse.json(singleBankResponse);
  }),

  // Create bank
  http.post(`${BASE}/master/bank`, () => {
    return HttpResponse.json(singleBankResponse, { status: 201 });
  }),

  // Update bank
  http.put(`${BASE}/master/bank/:id`, () => {
    return HttpResponse.json(singleBankResponse);
  }),

  // Delete bank
  http.delete(`${BASE}/master/bank/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),

  // Export banks (returns blob)
  http.get(`${BASE}/master/bank/export`, () => {
    return new HttpResponse(
      new Blob(["excel-data"], { type: "application/vnd.ms-excel" }),
      {
        headers: { "Content-Type": "application/vnd.ms-excel" },
      },
    );
  }),

  // Download import template (returns blob)
  http.get(`${BASE}/master/bank/import/template`, () => {
    return new HttpResponse(
      new Blob(["template-data"], { type: "application/vnd.ms-excel" }),
      {
        headers: { "Content-Type": "application/vnd.ms-excel" },
      },
    );
  }),

  // Import banks
  http.post(`${BASE}/master/bank/import`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Import successful",
      data: {
        summary: { total: 5, success: 5, failed: 0 },
        rowErrors: [],
        errorReport: { fileUrl: null },
      },
    });
  }),
];
