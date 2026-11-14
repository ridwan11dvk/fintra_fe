import {
  useCreateCurrencyRateMutation,
  useDeleteCurrencyRateMutation,
  useSyncCurrencyRatesMutation,
  useUpdateCurrencyRateMutation,
} from "@/features/master-data/currency-rate/data/currency-rate.mutation";
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
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useCreateCurrencyRateMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateCurrencyRateMutation());

    result.current.mutate({
      currencyCode: "USD",
      rateType: "KMK",
      rate: 15500.5,
      startDate: "2024-01-01",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns error", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/currency-rate`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useCreateCurrencyRateMutation());

    result.current.mutate({
      currencyCode: "USD",
      rateType: "KMK",
      rate: 15500.5,
      startDate: "2024-01-01",
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateCurrencyRateMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateCurrencyRateMutation());

    result.current.mutate({
      id: 1,
      data: {
        currencyCode: "USD",
        rateType: "KMK",
        rate: 15600.0,
        startDate: "2024-01-01",
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns error", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/currency-rate/:id`, () =>
        HttpResponse.json({ message: "Update failed" }, { status: 400 }),
      ),
    );
    const { result } = renderHook(() => useUpdateCurrencyRateMutation());

    result.current.mutate({
      id: 1,
      data: {
        currencyCode: "USD",
        rateType: "KMK",
        rate: 15600.0,
        startDate: "2024-01-01",
      },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("accepts optional fields in update payload", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateCurrencyRateMutation());

    result.current.mutate({
      id: 1,
      data: {
        currencyCode: "USD",
        rateType: "KMK",
        rate: 15700.0,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        description: "Updated rate",
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });
});

describe("useDeleteCurrencyRateMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteCurrencyRateMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns error", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${BASE}/master/currency-rate/:id`, () =>
        HttpResponse.json({ message: "Cannot delete" }, { status: 409 }),
      ),
    );
    const { result } = renderHook(() => useDeleteCurrencyRateMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useSyncCurrencyRatesMutation", () => {
  it("calls toast.success after successful sync", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useSyncCurrencyRatesMutation());

    result.current.mutate();

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when sync fails", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/currency-rate/sync`, () =>
        HttpResponse.json({ message: "Sync failed" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useSyncCurrencyRatesMutation());

    result.current.mutate();

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
