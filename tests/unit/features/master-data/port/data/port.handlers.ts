import type { PortResponse } from "@/features/master-data/port/data/port.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockPort: PortResponse = {
  id: 1,
  customsOfficeId: 1,
  customsOffice: {
    id: 1,
    code: "KPPBC-001",
    name: "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  code: "PORT-CGK-001",
  name: "Pelabuhan Soekarno-Hatta Jakarta",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockPortInactive: PortResponse = {
  id: 2,
  customsOfficeId: 1,
  customsOffice: {
    id: 1,
    code: "KPPBC-001",
    name: "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  code: "PORT-SUB-001",
  name: "Pelabuhan Susah Diatur",
  isActive: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedPortResponse: PagedApiResponse<PortResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockPort],
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

export const singlePortResponse: ApiResponse<PortResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockPort,
};

export const listPortAltResponse: ApiResponse<PortResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockPort, mockPortInactive],
};

export const portHandlers = [
  http.get(`${BASE}/master/port`, () => {
    return HttpResponse.json(pagedPortResponse);
  }),

  http.get(`${BASE}/master/port/list/customs-office/:customsOfficeId`, () => {
    return HttpResponse.json(listPortAltResponse);
  }),

  http.get(
    `${BASE}/master/port/customs-office/:customsOfficeId`,
    ({ request }) => {
      const url = new URL(request.url);
      const pageSize = url.searchParams.get("pageSize");
      if (pageSize) {
        return HttpResponse.json(pagedPortResponse);
      }
      return HttpResponse.json(pagedPortResponse);
    },
  ),

  http.get(`${BASE}/master/port/:id`, ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return HttpResponse.json({ message: "Port not found" }, { status: 404 });
    }
    return HttpResponse.json(singlePortResponse);
  }),

  http.post(`${BASE}/master/port`, () => {
    return HttpResponse.json(singlePortResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/port/:id`, () => {
    return HttpResponse.json(singlePortResponse);
  }),

  http.delete(`${BASE}/master/port/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),
];
