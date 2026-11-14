import type {
  ExternalUserRequest,
  ExternalUserResponse,
  InternalUserEsaCreateRequest,
  InternalUserResponse,
} from "@/features/settings";
import { userService } from "@/features/settings";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockGet, mockPost, mockPut, mockPatch, mockDelete } = vi.hoisted(
  () => ({
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockPut: vi.fn(),
    mockPatch: vi.fn(),
    mockDelete: vi.fn(),
  }),
);

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      apiClient: {
        get: mockGet,
        post: mockPost,
        put: mockPut,
        patch: mockPatch,
        delete: mockDelete,
      },
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const axiosInstance = {
  get: mockGet,
  post: mockPost,
  put: mockPut,
  patch: mockPatch,
  delete: mockDelete,
};

const mockInternalUser: InternalUserResponse = {
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

const mockExternalUser: ExternalUserResponse = {
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

const apiResponse = <T>(data: T): ApiResponse<T> => ({
  status: "SUCCESS",
  message: "Success",
  data,
});

const pagedResponse = <T>(content: T[]): PagedApiResponse<T> => ({
  status: "SUCCESS",
  message: "Success",
  data: {
    content,
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
});

describe("userService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createInternalUserFromEsa", () => {
    it("creates an internal user from ESA", async () => {
      const payload: InternalUserEsaCreateRequest = { nipp: "12345", roles: [1] };
      const response = apiResponse(mockInternalUser);
      vi.mocked(axiosInstance.post).mockResolvedValue({ data: response });

      const result = await userService.createInternalUserFromEsa(payload);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/users/internal/esa",
        payload,
      );
      expect(result).toEqual(response);
    });

    it("handles API error", async () => {
      vi.mocked(axiosInstance.post).mockRejectedValue(
        new Error("Network error"),
      );
      await expect(
        userService.createInternalUserFromEsa({ nipp: "12345", roles: [1] }),
      ).rejects.toThrow("Network error");
    });
  });

  describe("getInternalUser", () => {
    it("fetches internal user by ID", async () => {
      const response = apiResponse(mockInternalUser);
      vi.mocked(axiosInstance.get).mockResolvedValue({ data: response });

      const result = await userService.getInternalUser(1);

      expect(axiosInstance.get).toHaveBeenCalledWith("/users/internal/1");
      expect(result).toEqual(response);
    });
  });

  describe("getInternalUserByNipp", () => {
    it("fetches internal user by NIPP", async () => {
      const response = apiResponse(mockInternalUser);
      vi.mocked(axiosInstance.get).mockResolvedValue({ data: response });

      const result = await userService.getInternalUserByNipp(12345);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/users/internal/esa/12345",
      );
      expect(result).toEqual(response);
    });
  });

  describe("listInternalUsers", () => {
    it("lists internal users with pagination", async () => {
      const response = pagedResponse([mockInternalUser]);
      vi.mocked(axiosInstance.get).mockResolvedValue({ data: response });

      const result = await userService.listInternalUsers({ page: 1, size: 10 });

      expect(axiosInstance.get).toHaveBeenCalledWith("/users/internal", {
        params: { page: 1, size: 10 },
      });
      expect(result).toEqual(response);
    });

    it("lists internal users without params", async () => {
      const response = pagedResponse([mockInternalUser]);
      vi.mocked(axiosInstance.get).mockResolvedValue({ data: response });

      const result = await userService.listInternalUsers();

      expect(axiosInstance.get).toHaveBeenCalledWith("/users/internal", {
        params: undefined,
      });
      expect(result).toEqual(response);
    });
  });

  describe("patchInternalUser", () => {
    it("patches an internal user", async () => {
      const payload: InternalUserEsaCreateRequest = { nipp: "12345", roles: [1] };
      const response = apiResponse(mockInternalUser);
      vi.mocked(axiosInstance.patch).mockResolvedValue({ data: response });

      const result = await userService.patchInternalUser(1, payload);

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        "/users/internal/1",
        payload,
      );
      expect(result).toEqual(response);
    });
  });

  describe("deleteInternalUser", () => {
    it("deletes an internal user", async () => {
      const response = apiResponse("Deleted");
      vi.mocked(axiosInstance.delete).mockResolvedValue({ data: response });

      const result = await userService.deleteInternalUser(1);

      expect(axiosInstance.delete).toHaveBeenCalledWith("/users/internal/1");
      expect(result).toEqual(response);
    });
  });

  describe("updateInternalUserRkipDateLimit", () => {
    it("updates RKIP date limit", async () => {
      const response = apiResponse(mockInternalUser);
      vi.mocked(axiosInstance.post).mockResolvedValue({ data: response });

      const result = await userService.updateInternalUserRkipDateLimit(
        1,
        "2024-12-31",
      );

      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/users/internal/1/rkip-date-limit",
        { dateLimit: "2024-12-31" },
      );
      expect(result).toEqual(response);
    });
  });

  describe("deleteInternalUserRkipDateLimit", () => {
    it("deletes RKIP date limit", async () => {
      const response = apiResponse(mockInternalUser);
      vi.mocked(axiosInstance.delete).mockResolvedValue({ data: response });

      const result = await userService.deleteInternalUserRkipDateLimit(1);

      expect(axiosInstance.delete).toHaveBeenCalledWith(
        "/users/internal/1/rkip-date-limit",
      );
      expect(result).toEqual(response);
    });
  });

  describe("createExternalUser", () => {
    it("creates an external user", async () => {
      const payload: ExternalUserRequest = {
        userType: "PERSONAL",
        name: "Jane Doe",
        email: "jane@example.com",
        username: "jane_doe",
        password: "password123",
        roles: [2],
        twoFactorEnabled: false,
      };
      const response = apiResponse(mockExternalUser);
      vi.mocked(axiosInstance.post).mockResolvedValue({ data: response });

      const result = await userService.createExternalUser(payload);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/users/external",
        payload,
      );
      expect(result).toEqual(response);
    });
  });

  describe("getExternalUser", () => {
    it("fetches external user by ID", async () => {
      const response = apiResponse(mockExternalUser);
      vi.mocked(axiosInstance.get).mockResolvedValue({ data: response });

      const result = await userService.getExternalUser(1);

      expect(axiosInstance.get).toHaveBeenCalledWith("/users/external/1");
      expect(result).toEqual(response);
    });
  });

  describe("listExternalUsers", () => {
    it("lists external users with pagination", async () => {
      const response = pagedResponse([mockExternalUser]);
      vi.mocked(axiosInstance.get).mockResolvedValue({ data: response });

      const result = await userService.listExternalUsers({ page: 1, size: 10 });

      expect(axiosInstance.get).toHaveBeenCalledWith("/users/external", {
        params: { page: 1, size: 10 },
      });
      expect(result).toEqual(response);
    });
  });

  describe("updateExternalUser", () => {
    it("updates an external user", async () => {
      const payload: ExternalUserRequest = {
        userType: "PERSONAL",
        name: "Jane Doe",
        email: "jane@example.com",
        username: "jane_doe",
        roles: [2],
        twoFactorEnabled: false,
      };
      const response = apiResponse(mockExternalUser);
      vi.mocked(axiosInstance.put).mockResolvedValue({ data: response });

      const result = await userService.updateExternalUser(1, payload);

      expect(axiosInstance.put).toHaveBeenCalledWith(
        "/users/external/1",
        payload,
      );
      expect(result).toEqual(response);
    });
  });

  describe("deleteExternalUser", () => {
    it("deletes an external user", async () => {
      const response = apiResponse("Deleted");
      vi.mocked(axiosInstance.delete).mockResolvedValue({ data: response });

      const result = await userService.deleteExternalUser(1);

      expect(axiosInstance.delete).toHaveBeenCalledWith("/users/external/1");
      expect(result).toEqual(response);
    });
  });
});
