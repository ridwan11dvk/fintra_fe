import type { CustomsOfficeResponse } from "@/features/master-data/customs-office/data/customs-office.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockCustomsOffice: CustomsOfficeResponse = {
  id: 1,
  code: "KPPBC-001",
  name: "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockCustomsOfficeInactive: CustomsOfficeResponse = {
  id: 2,
  code: "KPPBC-002",
  name: "Kantor Pengawasan dan Pelayanan Bea dan Cukai Surabaya",
  isActive: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedCustomsOfficeResponse: PagedApiResponse<CustomsOfficeResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockCustomsOffice, mockCustomsOfficeInactive],
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

export const singleCustomsOfficeResponse: ApiResponse<CustomsOfficeResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockCustomsOffice,
};

export const listCustomsOfficeResponse: ApiResponse<CustomsOfficeResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockCustomsOffice, mockCustomsOfficeInactive],
};

export const customsOfficeHandlers = [
  http.get(`${BASE}/master/customs-office/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [
        {
          value: 1,
          label: "KPPBC-001",
          description: "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
        },
      ],
    }),
  ),

  http.get(`${BASE}/master/customs-office`, () => {
    return HttpResponse.json(pagedCustomsOfficeResponse);
  }),

  http.get(`${BASE}/master/customs-office/list`, () => {
    return HttpResponse.json(listCustomsOfficeResponse);
  }),

  http.get(`${BASE}/master/customs-office/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json(
        { message: "Customs office not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(singleCustomsOfficeResponse);
  }),

  http.post(`${BASE}/master/customs-office`, () => {
    return HttpResponse.json(singleCustomsOfficeResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/customs-office/:id`, () => {
    return HttpResponse.json(singleCustomsOfficeResponse);
  }),

  http.delete(`${BASE}/master/customs-office/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Customs office deleted successfully",
    });
  }),
];
