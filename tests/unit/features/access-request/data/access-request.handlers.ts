import type {
  AccessRequestDetailResponse,
  AccessRequestResponse,
} from "@/features/access-request";
import type { PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockAccessRequest: AccessRequestResponse = {
  id: 1,
  userId: 10,
  userType: "INTERNAL",
  userName: "John Doe",
  userNipp: "NIPP001",
  status: "PENDING",
  moduleNames: "Finance, Procurement",
  requestNotes: "Need access for monthly reports",
  requestedAt: "2024-06-01T08:00:00Z",
  approvedAt: null,
  responseNotes: null,
  approvedBy: null,
};

export const mockAccessRequestDetail: AccessRequestDetailResponse = {
  ...mockAccessRequest,
  modules: [
    {
      moduleId: 1,
      moduleName: "Finance",
      availableRoles: [
        { id: 1, name: "Finance User" },
        { id: 2, name: "Finance Manager" },
      ],
    },
    {
      moduleId: 2,
      moduleName: "Procurement",
      availableRoles: [{ id: 3, name: "Procurement User" }],
    },
  ],
};

export const pagedAccessRequestResponse: PagedApiResponse<AccessRequestResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockAccessRequest],
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

export const accessRequestHandlers = [
  http.get(`${BASE}/access-request`, () =>
    HttpResponse.json(pagedAccessRequestResponse),
  ),

  http.get(`${BASE}/access-request/:id`, () =>
    HttpResponse.json(mockAccessRequestDetail),
  ),

  http.put(`${BASE}/access-request/:id`, () =>
    HttpResponse.json(mockAccessRequest),
  ),
];
