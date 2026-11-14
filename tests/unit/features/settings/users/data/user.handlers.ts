import type {
  ExternalUserResponse,
  InternalUserResponse,
} from "@/features/settings";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockInternalUser: InternalUserResponse = {
  id: 1,
  nipp: "12345",
  name: "John Doe",
  email: "john@example.com",
  password: "",
  nik: "320123456789",
  dateOfBirth: "1990-05-15",
  placeOfBirth: "Jakarta",
  companyCode: "C001",
  companyName: "Company A",
  directorateCode: "D001",
  directorateName: "Directorate A",
  personalAreaCode: "PA001",
  personalAreaName: "Personal Area A",
  organizationCode: "O001",
  organizationName: "Organization A",
  jobCode: "J001",
  jobName: "Developer",
  positionCode: "P001",
  positionName: "Senior Developer",
  costCenterCode: "CC001",
  costCenterName: "Cost Center A",
  businessAreaCode: "BA001",
  businessAreaName: "Business Area A",
  supervisorLevelOnePosition: "",
  supervisorLevelOnePositionName: "",
  supervisorLevelTwoPosition: "",
  supervisorLevelTwoPositionName: "",
  twoFactorEnabled: false,
  roles: [{ id: 1, name: "Admin" }],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockExternalUser: ExternalUserResponse = {
  id: 1,
  userType: "PERSONAL",
  name: "Jane Doe",
  email: "jane@example.com",
  username: "jane_doe",
  phoneNumber: "08123456789",
  dateOfBirth: "1990-05-15",
  placeOfBirth: "Jakarta",
  privyId: "privy-abc123",
  twoFactorEnabled: false,
  roles: [{ id: 2, name: "User" }],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const pagedInternalResponse: PagedApiResponse<InternalUserResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockInternalUser],
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

const pagedExternalResponse: PagedApiResponse<ExternalUserResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockExternalUser],
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

const singleInternalResponse: ApiResponse<InternalUserResponse> = {
  status: "SUCCESS",
  message: "Internal user fetched successfully",
  data: mockInternalUser,
};

const singleExternalResponse: ApiResponse<ExternalUserResponse> = {
  status: "SUCCESS",
  message: "External user fetched successfully",
  data: mockExternalUser,
};

const successMessageResponse = {
  status: "SUCCESS",
  message: "Operation successful",
};

export const userHandlers = [
  // Internal Users
  http.get(`${BASE}/users/internal`, () =>
    HttpResponse.json(pagedInternalResponse),
  ),

  http.get(`${BASE}/users/internal/:id`, () =>
    HttpResponse.json(singleInternalResponse),
  ),

  http.get(`${BASE}/users/internal/esa/:nipp`, () =>
    HttpResponse.json(singleInternalResponse),
  ),

  http.post(`${BASE}/users/internal`, () =>
    HttpResponse.json(singleInternalResponse, { status: 201 }),
  ),

  http.post(`${BASE}/users/internal/esa`, () =>
    HttpResponse.json(singleInternalResponse, { status: 201 }),
  ),

  http.patch(`${BASE}/users/internal/:id`, () =>
    HttpResponse.json(singleInternalResponse),
  ),

  http.put(`${BASE}/users/internal/:id`, () =>
    HttpResponse.json(singleInternalResponse),
  ),

  http.delete(`${BASE}/users/internal/:id`, () =>
    HttpResponse.json(successMessageResponse),
  ),

  http.post(`${BASE}/users/internal/:id/rkip-date-limit`, () =>
    HttpResponse.json(singleInternalResponse),
  ),

  http.delete(`${BASE}/users/internal/:id/rkip-date-limit`, () =>
    HttpResponse.json(singleInternalResponse),
  ),

  // External Users
  http.get(`${BASE}/users/external`, () =>
    HttpResponse.json(pagedExternalResponse),
  ),

  http.get(`${BASE}/users/external/:id`, () =>
    HttpResponse.json(singleExternalResponse),
  ),

  http.post(`${BASE}/users/external`, () =>
    HttpResponse.json(singleExternalResponse, { status: 201 }),
  ),

  http.put(`${BASE}/users/external/:id`, () =>
    HttpResponse.json(singleExternalResponse),
  ),

  http.delete(`${BASE}/users/external/:id`, () =>
    HttpResponse.json(successMessageResponse),
  ),
];
