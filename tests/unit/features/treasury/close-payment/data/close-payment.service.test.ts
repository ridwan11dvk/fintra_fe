import { closePaymentService } from "@/features/treasury/close-payment/data/close-payment.service";
import type { AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";

const { mockGet, mockPut, mockPost, mockObjectToFormData } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPut: vi.fn(),
  mockPost: vi.fn(),
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
        post: mockPost,
      },
      objectToFormData: mockObjectToFormData,
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const axiosInstance = {
  get: mockGet,
  put: mockPut,
  post: mockPost,
};

const mockAxiosResponse = <T>(data: T): Partial<AxiosResponse<T>> => ({
  data,
});

describe("closePaymentService", () => {
  describe("listClosePayments()", () => {
    it("calls GET with the correct URL and params", async () => {
      const responseData = {
        success: true,
        message: "Success",
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

      const params = { page: 1, size: 10 };
      await closePaymentService.listClosePayments(params);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/close-payment",
        { params },
      );
    });

    it("returns paged close payment data", async () => {
      const responseData = {
        success: true,
        message: "Success",
        data: {
          content: [
            {
              id: 1,
              transId: "TRANS-001",
              invoiceNumber: "INV-001",
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

      const result = await closePaymentService.listClosePayments();

      expect(result.success).toBe(true);
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].transId).toBe("TRANS-001");
    });
  });

  describe("getClosePaymentById()", () => {
    it("calls GET with the correct URL including id", async () => {
      const responseData = {
        success: true,
        message: "Success",
        data: { id: 1, transId: "TRANS-001" },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await closePaymentService.getClosePaymentById(1);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/close-payment/1",
      );
    });

    it("returns a single close payment by ID", async () => {
      const responseData = {
        success: true,
        message: "Success",
        data: { id: 1, transId: "TRANS-001", invoiceNumber: "INV-001" },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await closePaymentService.getClosePaymentById(1);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(1);
      expect(result.data.transId).toBe("TRANS-001");
    });
  });

  describe("updateClosePayment()", () => {
    it("sends PUT request with FormData and multipart/form-data header", async () => {
      const responseData = {
        success: true,
        message: "Close payment updated successfully",
        data: { id: 1, transId: "TRANS-001" },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const payload = {
        transId: "TRANS-001",
        paymentDate: "2025-01-15T10:00:00",
        bankCode: "BNI",
        invoiceNumber: "INV-001",
        ppfNumber: "PPF-001",
        bankRuleId: 1,
      };

      await closePaymentService.updateClosePayment(1, payload);

      expect(axiosInstance.put).toHaveBeenCalledWith(
        "/treasury/close-payment/1",
        expect.any(FormData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    });

    it("calls objectToFormData with the payload", async () => {
      const responseData = {
        success: true,
        message: "Close payment updated successfully",
        data: { id: 1 },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const { objectToFormData } = await import("@railfinance/core");
      vi.mocked(objectToFormData).mockClear();

      const payload = {
        transId: "TRANS-001",
        paymentDate: "2025-01-15T10:00:00",
        bankCode: "BNI",
        invoiceNumber: "INV-001",
        ppfNumber: "PPF-001",
        bankRuleId: 1,
      };

      await closePaymentService.updateClosePayment(1, payload);

      expect(objectToFormData).toHaveBeenCalledWith(payload);
    });

    it("returns updated close payment data", async () => {
      const responseData = {
        success: true,
        message: "Close payment updated successfully",
        data: { id: 1, transId: "TRANS-001-UPDATED" },
      };

      vi.mocked(axiosInstance.put).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await closePaymentService.updateClosePayment(1, {
        transId: "TRANS-001-UPDATED",
        paymentDate: "2025-01-15T10:00:00",
        bankCode: "BNI",
        invoiceNumber: "INV-001",
        ppfNumber: "PPF-001",
        bankRuleId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.data.transId).toBe("TRANS-001-UPDATED");
    });
  });

  describe("resetPostingA8Status()", () => {
    it("calls POST with the correct URL and ids array", async () => {
      const responseData = {
        success: true,
        message: "Posting status reset successfully",
        data: {
          message: "Posting status reset successfully",
          status: "SUCCESS",
          data: [],
          errors: null,
        },
      };

      vi.mocked(axiosInstance.post).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const ids = [1, 2, 3];
      await closePaymentService.resetPostingA8Status(ids);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/treasury/close-payment/posting-status-reset",
        { ids },
      );
    });

    it("returns reset result response", async () => {
      const responseData = {
        success: true,
        message: "Posting status reset successfully",
        data: {
          message: "Posting status reset successfully",
          status: "SUCCESS",
          data: [
            {
              name: "PT Example",
              invoiceNumber: "INV-001",
              success: true,
            },
          ],
          errors: null,
        },
      };

      vi.mocked(axiosInstance.post).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await closePaymentService.resetPostingA8Status([1]);

      expect(result.success).toBe(true);
      expect(result.data.status).toBe("SUCCESS");
      expect(result.data.data).toHaveLength(1);
      expect(result.data.data[0].success).toBe(true);
    });
  });

  describe("getUnpaidCount()", () => {
    it("calls GET with the correct URL", async () => {
      const responseData = {
        success: true,
        message: "Success",
        data: 5,
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await closePaymentService.getUnpaidCount();

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/close-payment/summary/unpaid-count",
      );
    });

    it("returns unpaid count", async () => {
      const responseData = {
        success: true,
        message: "Success",
        data: 5,
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await closePaymentService.getUnpaidCount();

      expect(result.success).toBe(true);
      expect(result.data).toBe(5);
    });
  });

  describe("getCountByStatus()", () => {
    it("calls GET with the correct URL and paymentStatus param", async () => {
      const responseData = {
        success: true,
        message: "Success",
        data: 10,
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      await closePaymentService.getCountByStatus(1);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/treasury/close-payment/summary/count-by-status",
        { params: { paymentStatus: 1 } },
      );
    });

    it("returns count by status for unpaid", async () => {
      const responseData = {
        success: true,
        message: "Success",
        data: 5,
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await closePaymentService.getCountByStatus(0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(5);
    });

    it("returns count by status for paid", async () => {
      const responseData = {
        success: true,
        message: "Success",
        data: 10,
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(
        mockAxiosResponse(responseData) as AxiosResponse,
      );

      const result = await closePaymentService.getCountByStatus(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(10);
    });
  });
});
