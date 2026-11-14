import type { TransactionTypeResponse } from "@/features/master-data/transaction-type/data/transaction-type.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockModule = { id: 1, name: "Accounts Receivable" };

export const mockTransactionType: TransactionTypeResponse = {
  id: 1,
  companyCode: "COMP",
  code: "SI",
  tcode: "FB70",
  name: "Sales Invoice",
  description: "Sales Invoice transaction type",
  moduleId: 1,
  module: mockModule,
  docType: "F5",
  docBase: "DOCBASE",
  formType: "FORM-A",
  type: "revenue",
  customerCode: "CUST001",
  taxableItemCode: "TAX001",
  invoiceCode: "INV-{YYYY}-{MM}-{NNNN}",
  isVatUsed: true,
  hasVirtualPenalty: false,
  isRevenueRecorded: true,
  isAutoBilling: false,
  glRevenue: "410000",
  glPrepaid: "420000",
  glFreight: "430000",
  wwprd: "WWPRD001",
  wwrvc: "WWRVC001",
  vaSource: "VA001",
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedTransactionTypeResponse: PagedApiResponse<TransactionTypeResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockTransactionType],
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

export const singleTransactionTypeResponse: ApiResponse<TransactionTypeResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: mockTransactionType,
  };

export const multiTransactionTypeResponse: ApiResponse<
  TransactionTypeResponse[]
> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockTransactionType],
};

export const transactionTypeHandlers = [
  http.get(`${BASE}/master/transaction-type`, () => {
    return HttpResponse.json(pagedTransactionTypeResponse);
  }),

  http.get(`${BASE}/master/transaction-type/:id`, () => {
    return HttpResponse.json(singleTransactionTypeResponse);
  }),

  http.get(`${BASE}/master/transaction-type/company/:companyCode`, () => {
    return HttpResponse.json(multiTransactionTypeResponse);
  }),

  http.get(
    `${BASE}/master/transaction-type/company/:companyCode/tcode/:tcode`,
    () => {
      return HttpResponse.json(singleTransactionTypeResponse);
    },
  ),

  http.get(`${BASE}/master/transaction-type/module/:moduleId`, () => {
    return HttpResponse.json(multiTransactionTypeResponse);
  }),

  http.post(`${BASE}/master/transaction-type`, () => {
    return HttpResponse.json(singleTransactionTypeResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/transaction-type/:id`, () => {
    return HttpResponse.json(singleTransactionTypeResponse);
  }),

  http.delete(`${BASE}/master/transaction-type/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
