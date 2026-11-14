import {
  useResetPostingA8StatusMutation,
  useUpdateClosePaymentMutation,
} from "@/features/treasury/close-payment/data/close-payment.mutation";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    const { buildUiResponseMock } =
      await import("@tests/unit/mocks/ui-response-mock");
    return buildUiResponseMock(actual);
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useUpdateClosePaymentMutation", () => {
  it("calls toast.success after successful update", async () => {
    server.use(
      http.put(`${BASE}/treasury/close-payment/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Close payment updated successfully",
          data: {
            id: 1,
            transId: "TRANS-001",
            invoiceNumber: "INV-001",
          },
        }),
      ),
    );

    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateClosePaymentMutation());

    result.current.mutate({
      id: 1,
      data: {
        transId: "TRANS-001",
        paymentDate: "2025-01-15T10:00:00",
        bankCode: "BNI",
        invoiceNumber: "INV-001",
        ppfNumber: "PPF-001",
        bankRuleId: 1,
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Close payment updated successfully",
      ),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    server.use(
      http.put(`${BASE}/treasury/close-payment/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateClosePaymentMutation());

    result.current.mutate({
      id: 1,
      data: {
        transId: "TRANS-001",
        paymentDate: "2025-01-15T10:00:00",
        bankCode: "BNI",
        invoiceNumber: "INV-001",
        ppfNumber: "PPF-001",
        bankRuleId: 1,
      },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useResetPostingA8StatusMutation", () => {
  it("calls toast.success with SUCCESS status", async () => {
    server.use(
      http.post(`${BASE}/treasury/close-payment/posting-status-reset`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Posting status reset successfully",
          data: {
            message: "Posting status reset successfully",
            status: "SUCCESS",
            data: [],
            errors: null,
          },
        }),
      ),
    );

    const { toast } = await import("sonner");

    const { result } = renderHook(() => useResetPostingA8StatusMutation());

    result.current.mutate([1, 2]);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Posting status reset successfully",
      ),
    );
  });

  it("calls toast.warning with WARNING status", async () => {
    server.use(
      http.post(`${BASE}/treasury/close-payment/posting-status-reset`, () =>
        HttpResponse.json({
          status: "WARNING",
          message: "Partial reset completed",
          data: {
            message: "Partial reset completed",
            status: "WARNING",
            data: [
              {
                name: "PT Example",
                invoiceNumber: "INV-001",
                success: true,
              },
              {
                name: "PT Other",
                invoiceNumber: "INV-002",
                success: false,
                reason: "Status not eligible",
              },
            ],
            errors: ["Some records could not be reset"],
          },
        }),
      ),
    );

    const { toast } = await import("sonner");

    const { result } = renderHook(() => useResetPostingA8StatusMutation());

    result.current.mutate([1, 2]);

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith("Partial reset completed"),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    server.use(
      http.post(`${BASE}/treasury/close-payment/posting-status-reset`, () =>
        HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        ),
      ),
    );

    const { toast } = await import("sonner");

    const { result } = renderHook(() => useResetPostingA8StatusMutation());

    result.current.mutate([1]);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
