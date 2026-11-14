import { depositService } from "@/features/treasury";
import type { AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";

const { mockGet, mockPut, mockObjectToFormData } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPut: vi.fn(),
  mockObjectToFormData: vi.fn(() => new FormData()),
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      apiClient: {
        get: mockGet,
        put: mockPut,
      },
      objectToFormData: mockObjectToFormData,
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
  put: mockPut,
};

const mockAxiosResponse = <T>(data: T): Partial<AxiosResponse<T>> => ({
  data,
});

describe("depositService", () => {
  describe("listDeposits", () => {
    it("should call GET with correct URL and params", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Deposits retrieved successfully",
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
      await depositService.listDeposits(params);

      expect(axiosInstance.get).toHaveBeenCalledWith("/treasury/deposit", {
        params,
      });
    });

    it("should return paginated deposits", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Deposits retrieved successfully",
        data: {
          content: [
            {
              id: 1,
              agentCode: "AGT001",
              virtualAccount: "1234567890",
              name: "John Doe",
              sendStatus: 0,
            },
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

      const result = await depositService.listDeposits();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].agentCode).toBe("AGT001");
    });
  });

  describe("getDepositById", () => {
    it("should call GET with correct URL including id", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Deposit retrieved successfully",
        data: { id: 1 },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await depositService.getDepositById(1);

      expect(axiosInstance.get).toHaveBeenCalledWith("/treasury/deposit/1");
    });

    it("should return a single deposit by ID", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Deposit retrieved successfully",
        data: { id: 1, agentCode: "AGT001", name: "John Doe" },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await depositService.getDepositById(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
      expect(result.data.agentCode).toBe("AGT001");
    });
  });

  describe("updateDeposit", () => {
    it("should send PUT with FormData and multipart/form-data header", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Deposit updated successfully",
        data: { id: 1 },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await depositService.updateDeposit(1, { name: "Updated" });

      expect(axiosInstance.put).toHaveBeenCalledWith(
        "/treasury/deposit/1",
        expect.any(FormData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    });

    it("should call objectToFormData with the payload", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Deposit updated successfully",
        data: { id: 1 },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const { objectToFormData } = await import("@railfinance/core");
      vi.mocked(objectToFormData).mockClear();

      const payload = {
        name: "John Updated",
        amount: 2000000,
      };

      await depositService.updateDeposit(1, payload);
      expect(objectToFormData).toHaveBeenCalledWith(payload);
    });

    it("should return updated deposit data", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Deposit updated successfully",
        data: { id: 1, name: "John Updated" },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await depositService.updateDeposit(1, {
        name: "John Updated",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.name).toBe("John Updated");
    });
  });

  describe("updateSendStatus", () => {
    it("should call PUT with correct URL, null body, and sendStatus param", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Send status updated successfully",
        data: { id: 1, sendStatus: 1 },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await depositService.updateSendStatus(1, 1);

      expect(axiosInstance.put).toHaveBeenCalledWith(
        "/treasury/deposit/1/send-status",
        null,
        {
          params: { sendStatus: 1 },
        },
      );
    });

    it("should return updated deposit with new sendStatus", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Send status updated successfully",
        data: { id: 1, sendStatus: 1 },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await depositService.updateSendStatus(1, 1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.sendStatus).toBe(1);
    });
  });

  describe("bulkUpdateSendStatus", () => {
    it("should call PUT with correct URL, ids array, and sendStatus param", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Send status updated successfully",
        data: { message: "Bulk update completed" },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await depositService.bulkUpdateSendStatus([1, 2], 1);

      expect(axiosInstance.put).toHaveBeenCalledWith(
        "/treasury/deposit/send-status/bulk",
        [1, 2],
        {
          params: { sendStatus: 1 },
        },
      );
    });

    it("should return success response", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Send status updated successfully",
        data: { message: "Bulk update completed" },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await depositService.bulkUpdateSendStatus([1], 0);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.message).toBe("Bulk update completed");
    });
  });

  describe("getSummary", () => {
    it("should call GET with correct URL", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Summary retrieved successfully",
        data: {
          totalDeposits: 10,
          totalNotSent: 4,
          totalSent: 6,
          totalAmount: 5000000,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await depositService.getSummary();

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/deposit/summary/stats",
      );
    });

    it("should return deposit summary", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Summary retrieved successfully",
        data: {
          totalDeposits: 10,
          totalNotSent: 4,
          totalSent: 6,
          totalAmount: 5000000,
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await depositService.getSummary();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.totalDeposits).toBe(10);
      expect(result.data.totalAmount).toBe(5000000);
    });
  });

  describe("getCountByStatus", () => {
    it("should call GET with correct URL", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Count by status retrieved successfully",
        data: { notSent: 4, sent: 6 },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await depositService.getCountByStatus();

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/deposit/summary/count-by-status",
      );
    });

    it("should return count by status", async () => {
      const responseData = {
        status: "SUCCESS",
        message: "Count by status retrieved successfully",
        data: { notSent: 4, sent: 6 },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await depositService.getCountByStatus();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.notSent).toBe(4);
      expect(result.data.sent).toBe(6);
    });
  });
});
