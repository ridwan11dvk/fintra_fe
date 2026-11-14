import type { TermOfPaymentResponse } from "@/features/master-data/term-of-payment/data/term-of-payment.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockTermOfPayment: TermOfPaymentResponse = {
  id: 1,
  code: "NET_30",
  name: "Net 30",
  description: "Payment due within 30 calendar days",
  numberOfDays: 30,
  calculationType: "CALENDAR_DAYS",
  discount: null,
  discountType: null,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedTermOfPaymentResponse: PagedApiResponse<TermOfPaymentResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockTermOfPayment],
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

export const singleTermOfPaymentResponse: ApiResponse<TermOfPaymentResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockTermOfPayment,
};

export const termOfPaymentHandlers = [
  http.get(`${BASE}/master/term-of-payment`, () =>
    HttpResponse.json(pagedTermOfPaymentResponse),
  ),

  http.get(`${BASE}/master/term-of-payment/:id`, () =>
    HttpResponse.json(singleTermOfPaymentResponse),
  ),

  http.post(`${BASE}/master/term-of-payment`, () =>
    HttpResponse.json(singleTermOfPaymentResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/term-of-payment/:id`, () =>
    HttpResponse.json(singleTermOfPaymentResponse),
  ),

  http.delete(`${BASE}/master/term-of-payment/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
