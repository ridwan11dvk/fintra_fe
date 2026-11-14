import type {
  M2mClientAuditResponse,
  M2mClientCreateApiResponse,
  M2mClientResponse,
} from "@/features/settings/m2m-client/data/m2m-client.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";
const URL = `${BASE}/m2m-clients`;

export const mockM2mClient: M2mClientResponse = {
  id: 1,
  name: "Test Client",
  description: "Test description",
  status: "ACTIVE",
  permissions: [],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const m2mClientPagedResponse: PagedApiResponse<M2mClientResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockM2mClient],
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

export const m2mClientSingleResponse: ApiResponse<M2mClientResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockM2mClient,
};

export const m2mClientCreateResponse: M2mClientCreateApiResponse = {
  status: "SUCCESS",
  message: "Created",
  data: {
    ...mockM2mClient,
    token: "tok",
    permissionIds: [1],
    createdAt: "2024-01-01T00:00:00Z",
  },
};

export const m2mClientAuditPagedResponse: PagedApiResponse<M2mClientAuditResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [
        {
          id: 1,
          apiClientId: 1,
          actionType: "CREATE",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ],
      pagination: {
        total: 1,
        pageSize: 20,
        pageNumber: 0,
        totalPages: 1,
        currentPage: 0,
        from: 1,
        to: 1,
      },
    },
  };

export const m2mClientHandlers = [
  http.get(URL, () => HttpResponse.json(m2mClientPagedResponse)),
  http.get(`${URL}/:id`, () => HttpResponse.json(m2mClientSingleResponse)),
  http.get(`${URL}/:id/audit`, () =>
    HttpResponse.json(m2mClientAuditPagedResponse),
  ),
  http.post(URL, () =>
    HttpResponse.json(m2mClientCreateResponse, { status: 201 }),
  ),
  http.put(`${URL}/:id`, () => HttpResponse.json(m2mClientSingleResponse)),
  http.delete(`${URL}/:id`, () =>
    HttpResponse.json({ status: "SUCCESS", message: "Deleted" }),
  ),
  http.post(`${URL}/:id/regenerate-token`, () =>
    HttpResponse.json(m2mClientCreateResponse),
  ),
  http.put(`${URL}/:id/permissions`, () =>
    HttpResponse.json(m2mClientSingleResponse),
  ),
];
