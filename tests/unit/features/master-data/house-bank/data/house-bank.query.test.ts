import {
  houseBankQueryKeys,
  useGetHouseBankById,
  useListHouseBanks,
} from "@/features/master-data/house-bank/data/house-bank.query";
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

describe("houseBankQueryKeys", () => {
  it("all returns base key array", () => {
    expect(houseBankQueryKeys.all).toEqual(["house-banks"]);
  });

  it("lists() returns list key", () => {
    expect(houseBankQueryKeys.lists()).toEqual(["house-banks", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(houseBankQueryKeys.list()).toEqual([
      "house-banks",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(houseBankQueryKeys.list(params)).toEqual([
      "house-banks",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(houseBankQueryKeys.details()).toEqual(["house-banks", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(houseBankQueryKeys.detail(5)).toEqual(["house-banks", "detail", 5]);
  });
});

describe("useListHouseBanks", () => {
  it("fetches and returns paged house bank data", async () => {
    const { result } = renderHook(() => useListHouseBanks());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].bankCode).toBe("BCA");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "BCA" };
    const { result } = renderHook(() => useListHouseBanks(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListHouseBanks(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/house-bank`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListHouseBanks());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/house-bank`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            content: [],
            pagination: {
              total: 0,
              pageSize: 10,
              pageNumber: 1,
              totalPages: 0,
              currentPage: 1,
              from: 0,
              to: 0,
            },
          },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListHouseBanks());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "House banks loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/house-bank`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListHouseBanks());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/house-bank`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListHouseBanks());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load house banks"),
    );
  });
});

describe("useGetHouseBankById", () => {
  it("fetches and returns a single house bank by ID", async () => {
    const { result } = renderHook(() => useGetHouseBankById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.accountName).toBe(
      "PT Fintra - BCA Operasional",
    );
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetHouseBankById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/house-bank/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetHouseBankById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/house-bank/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            id: 1,
            accountId: "HB-BCA-001",
            accountNumber: "1234567890",
            accountName: "PT Fintra - BCA Operasional",
            companyCode: "FINTRA",
            currencyCode: "IDR",
            bankCode: "BCA",
            isActive: true,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            createdBy: "admin",
            updatedBy: "admin",
          },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetHouseBankById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "House bank loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/house-bank/:id`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetHouseBankById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/house-bank/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetHouseBankById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load house bank"),
    );
  });
});
