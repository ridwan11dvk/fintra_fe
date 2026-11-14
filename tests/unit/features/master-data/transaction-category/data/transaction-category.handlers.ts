import type { TransactionCategoryResponse } from "@/features/master-data/transaction-category/data/transaction-category.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockTransactionCategory: TransactionCategoryResponse = {
  id: 1,
  name: "Office Supplies",
  description: "Expenses related to office supplies and stationery",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedTransactionCategoryResponse: PagedApiResponse<TransactionCategoryResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockTransactionCategory],
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

export const singleTransactionCategoryResponse: ApiResponse<TransactionCategoryResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: mockTransactionCategory,
  };

export const transactionCategoryHandlers = [
  http.get(`${BASE}/master/transaction-category`, () => {
    return HttpResponse.json(pagedTransactionCategoryResponse);
  }),

  http.get(`${BASE}/master/transaction-category/:id`, () => {
    return HttpResponse.json(singleTransactionCategoryResponse);
  }),

  http.post(`${BASE}/master/transaction-category`, () => {
    return HttpResponse.json(singleTransactionCategoryResponse, {
      status: 201,
    });
  }),

  http.put(`${BASE}/master/transaction-category/:id`, () => {
    return HttpResponse.json(singleTransactionCategoryResponse);
  }),

  http.delete(`${BASE}/master/transaction-category/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
