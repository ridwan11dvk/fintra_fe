import type { ClosePaymentResponse } from "@/features/treasury/close-payment/data/close-payment.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE_URL = "*/treasury/close-payment";

export const mockClosePaymentRecord: ClosePaymentResponse = {
  id: 1,
  custId: "CUST-001",
  name: "PT Example",
  transId: "TRANS-001",
  invoiceNumber: "INV-001",
  ppfNumber: "PPF-001",
  paymentDate: "2025-01-15T10:00:00Z",
  invoiceDate: "2025-01-01",
  printDate: "2025-01-10",
  dueDate: "2025-02-15",
  amount: 10000000,
  paymentAmount: 10000000,
  vatAmount: 1100000,
  whtAmount: 200000,
  bankCode: "BNI",
  bankAccountNumber: "1234567890",
  bankAccountHolder: "PT Example",
  transferReceiptPath: null,
  paymentType: "TRANSFER",
  bankRuleId: 1,
  source: 0,
  paymentStatus: 0,
  postingA8Status: 0,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: null,
  createdBy: "admin",
  updatedBy: null,
};

export const handlers = [
  http.get(`${BASE_URL}`, () => {
    const response: PagedApiResponse<ClosePaymentResponse> = {
      success: true,
      message: "Success",
      data: {
        content: [mockClosePaymentRecord],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 10,
      },
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE_URL}/:id`, ({ params }) => {
    const response: ApiResponse<ClosePaymentResponse> = {
      success: true,
      message: "Success",
      data: { ...mockClosePaymentRecord, id: Number(params.id) },
    };
    return HttpResponse.json(response);
  }),

  http.put(`${BASE_URL}/:id`, async ({ request: _request }) => {
    const response: ApiResponse<ClosePaymentResponse> = {
      success: true,
      message: "Close payment updated successfully",
      data: mockClosePaymentRecord,
    };
    return HttpResponse.json(response);
  }),

  http.post(`${BASE_URL}/posting-status-reset`, () => {
    const response: ApiResponse<unknown> = {
      success: true,
      message: "Posting status reset successfully",
      data: {
        message: "Posting status reset successfully",
        status: "SUCCESS",
        data: [
          {
            name: "PT Example",
            invoiceNumber: "INV-001",
            success: true,
          },
        ],
        errors: null,
      },
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE_URL}/summary/unpaid-count`, () => {
    const response: ApiResponse<number> = {
      success: true,
      message: "Success",
      data: 5,
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE_URL}/summary/count-by-status`, ({ request }) => {
    const url = new URL(request.url);
    const status = Number(url.searchParams.get("paymentStatus"));
    const response: ApiResponse<number> = {
      success: true,
      message: "Success",
      data: status === 0 ? 5 : 10,
    };
    return HttpResponse.json(response);
  }),
];
