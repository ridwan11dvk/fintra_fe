import type {
  ApiResponse,
  LookupValueResponse,
  PagedApiResponse,
} from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockDocumentName: LookupValueResponse = {
  id: 1,
  name: "Purchase Order",
  description: "Purchase order document",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedDocumentNameResponse: PagedApiResponse<LookupValueResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockDocumentName],
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

export const singleDocumentNameResponse: ApiResponse<LookupValueResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockDocumentName,
};

export const documentNameHandlers = [
  http.get(`${BASE}/master/document-name`, () =>
    HttpResponse.json(pagedDocumentNameResponse),
  ),

  http.get(`${BASE}/master/document-name/:id`, () =>
    HttpResponse.json(singleDocumentNameResponse),
  ),

  http.post(`${BASE}/master/document-name`, () =>
    HttpResponse.json(singleDocumentNameResponse, { status: 201 }),
  ),

  http.put(`${BASE}/master/document-name/:id`, () =>
    HttpResponse.json(singleDocumentNameResponse),
  ),

  http.delete(`${BASE}/master/document-name/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
