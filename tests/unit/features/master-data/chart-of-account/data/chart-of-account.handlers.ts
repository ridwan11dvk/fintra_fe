import type { ChartOfAccountResponse } from "@/features/master-data/chart-of-account/data/chart-of-account.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockChartOfAccount: ChartOfAccountResponse = {
  id: 1,
  code: "11100",
  name: "Cash and Cash Equivalents",
  level: 1,
  description: "Standard cash and bank accounts",
  active: true,
};

export const mockChartOfAccounts: ChartOfAccountResponse[] = [
  mockChartOfAccount,
  {
    id: 2,
    code: "11200",
    name: "Petty Cash",
    level: 2,
    description: "Petty cash account",
    active: false,
  },
];

export const pagedChartOfAccountResponse: PagedApiResponse<ChartOfAccountResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockChartOfAccount],
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

export const singleChartOfAccountResponse: ApiResponse<ChartOfAccountResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockChartOfAccount,
};

export const rawListChartOfAccountResponse: ApiResponse<ChartOfAccountResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockChartOfAccounts,
};

export const chartOfAccountHandlers = [
  // List
  http.get(`${BASE}/master-data/chart-of-accounts`, () => {
    return HttpResponse.json(rawListChartOfAccountResponse);
  }),
  http.get("*/master-data/chart-of-accounts", () => {
    return HttpResponse.json(rawListChartOfAccountResponse);
  }),

  // Detail
  http.get(`${BASE}/master-data/chart-of-accounts/:id`, () => {
    return HttpResponse.json(singleChartOfAccountResponse);
  }),
  http.get("*/master-data/chart-of-accounts/:id", () => {
    return HttpResponse.json(singleChartOfAccountResponse);
  }),

  // Create
  http.post(`${BASE}/master-data/chart-of-accounts`, () => {
    return HttpResponse.json(singleChartOfAccountResponse, { status: 201 });
  }),
  http.post("*/master-data/chart-of-accounts", () => {
    return HttpResponse.json(singleChartOfAccountResponse, { status: 201 });
  }),

  // Update
  http.put(`${BASE}/master-data/chart-of-accounts/:id`, () => {
    return HttpResponse.json(singleChartOfAccountResponse);
  }),
  http.put("*/master-data/chart-of-accounts/:id", () => {
    return HttpResponse.json(singleChartOfAccountResponse);
  }),

  // Delete
  http.delete(`${BASE}/master-data/chart-of-accounts/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
      data: "1",
    });
  }),
  http.delete("*/master-data/chart-of-accounts/:id", () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
      data: "1",
    });
  }),

  // Activate
  http.post(`${BASE}/master-data/chart-of-accounts/:id/activate`, () => {
    return HttpResponse.json({
      ...singleChartOfAccountResponse,
      data: { ...mockChartOfAccount, active: true },
    });
  }),
  http.post("*/master-data/chart-of-accounts/:id/activate", () => {
    return HttpResponse.json({
      ...singleChartOfAccountResponse,
      data: { ...mockChartOfAccount, active: true },
    });
  }),

  // Deactivate
  http.post(`${BASE}/master-data/chart-of-accounts/:id/deactivate`, () => {
    return HttpResponse.json({
      ...singleChartOfAccountResponse,
      data: { ...mockChartOfAccount, active: false },
    });
  }),

  // Import
  http.post(`${BASE}/master-data/chart-of-accounts/import`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Import completed successfully",
      data: {
        summary: {
          totalRows: 10,
          validRows: 10,
          invalidRows: 0,
          createdRows: 10,
          updatedRows: 0,
          skippedRows: 0,
          dryRun: false,
        },
        rowErrors: [],
        errorReport: {
          fileName: "",
          contentType: "",
          base64Content: "",
        },
      },
      errors: [],
    });
  }),
  http.post("*/master-data/chart-of-accounts/import", () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Import completed successfully",
      data: {
        summary: {
          totalRows: 10,
          validRows: 10,
          invalidRows: 0,
          createdRows: 10,
          updatedRows: 0,
          skippedRows: 0,
          dryRun: false,
        },
        rowErrors: [],
        errorReport: {
          fileName: "",
          contentType: "",
          base64Content: "",
        },
      },
      errors: [],
    });
  }),
  // Download Template
  http.get(`${BASE}/master-data/chart-of-accounts/import/template`, () => {
    return new HttpResponse(new TextEncoder().encode("template-data"), {
      headers: { "Content-Type": "application/vnd.ms-excel" },
    });
  }),
  http.get("*/master-data/chart-of-accounts/import/template", () => {
    return new HttpResponse(new TextEncoder().encode("template-data"), {
      headers: { "Content-Type": "application/vnd.ms-excel" },
    });
  }),
];
