import { digitalVaultService } from "@/features/treasury";
import type { AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      apiClient: {
        get: mockGet,
      },
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const axiosInstance = {
  get: mockGet,
};

const mockAxiosResponse = <T>(data: T): Partial<AxiosResponse<T>> => ({
  data,
});

describe("digitalVaultService", () => {
  describe("listStationSummary", () => {
    it("should call GET with correct URL and params", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Station summary retrieved successfully",
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 10,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const params = { page: 0, size: 10 };
      await digitalVaultService.listStationSummary(params);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/digital-vault",
        {
          params,
        },
      );
    });

    it("should return paginated station summary", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Station summary retrieved successfully",
        data: {
          content: [
            { stationName: "Station A", companyCode: "C001", closureCount: 5 },
          ],
          totalElements: 1,
          totalPages: 1,
          number: 0,
          size: 10,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await digitalVaultService.listStationSummary();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].stationName).toBe("Station A");
    });
  });

  describe("totalStationSummary", () => {
    it("should call GET with correct URL", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Total summary retrieved successfully",
        data: {
          totalAllClosureAmount: 80000000,
          totalAllDepositAmount: 73000000,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await digitalVaultService.totalStationSummary();

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/digital-vault/total",
        { params: undefined },
      );
    });

    it("should pass filters as params", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Total summary retrieved successfully",
        data: {
          totalAllClosureAmount: 50000000,
          totalAllDepositAmount: 45000000,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const filters = { month: 6, year: 2025 };
      await digitalVaultService.totalStationSummary(filters);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/digital-vault/total",
        { params: filters },
      );
    });

    it("should return total summary data", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Total summary retrieved successfully",
        data: {
          totalAllClosureAmount: 80000000,
          totalAllDepositAmount: 73000000,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await digitalVaultService.totalStationSummary();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.totalAllClosureAmount).toBe(80000000);
      expect(result.data.totalAllDepositAmount).toBe(73000000);
    });
  });

  describe("listClosureDetail", () => {
    it("should call GET with correct URL including station name", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Closure detail retrieved successfully",
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 10,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await digitalVaultService.listClosureDetail("Station A");

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/digital-vault/Station%20A/closures",
        { params: undefined },
      );
    });

    it("should pass pagination params", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Closure detail retrieved successfully",
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 10,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const params = { page: 0, size: 10 };
      await digitalVaultService.listClosureDetail("Station A", params);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/digital-vault/Station%20A/closures",
        { params },
      );
    });

    it("should return paginated closure detail", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Closure detail retrieved successfully",
        data: {
          content: [
            { id: 1, closureNumber: "CL-001", stationName: "Station A" },
          ],
          totalElements: 1,
          totalPages: 1,
          number: 0,
          size: 10,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await digitalVaultService.listClosureDetail("Station A");
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].closureNumber).toBe("CL-001");
    });
  });

  describe("getTransactionDetail", () => {
    it("should call GET with correct URL including id", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Transaction detail retrieved successfully",
        data: { id: 1 },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await digitalVaultService.getTransactionDetail(1);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/digital-vault/transactions/1",
      );
    });

    it("should return transaction detail", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Transaction detail retrieved successfully",
        data: {
          id: 1,
          stationName: "Station A",
          closureNumber: "CL-001",
          totalDepositAmount: 9000000,
          depositDetails: [
            { id: 101, depositAmount: 5000000 },
            { id: 102, depositAmount: 4000000 },
          ],
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await digitalVaultService.getTransactionDetail(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
      expect(result.data.stationName).toBe("Station A");
      expect(result.data.depositDetails).toHaveLength(2);
    });
  });
});
