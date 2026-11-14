import {
  currencyRateQueryKeys,
  useGetCurrencyRateById,
  useGetCurrencyRatesByCurrency,
  useGetCurrencyRatesByType,
  useGetLatestRate,
  useGetLatestRatesByRateType,
  useGetRateAtDate,
  useListCurrencyRates,
} from "@/features/master-data/currency-rate/data/currency-rate.query";
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

describe("currencyRateQueryKeys", () => {
  it("all returns base key array", () => {
    expect(currencyRateQueryKeys.all).toEqual(["currency-rates"]);
  });

  it("lists() returns list key", () => {
    expect(currencyRateQueryKeys.lists()).toEqual(["currency-rates", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(currencyRateQueryKeys.list()).toEqual([
      "currency-rates",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(currencyRateQueryKeys.list(params)).toEqual([
      "currency-rates",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(currencyRateQueryKeys.details()).toEqual([
      "currency-rates",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(currencyRateQueryKeys.detail(5)).toEqual([
      "currency-rates",
      "detail",
      5,
    ]);
  });

  it("byCurrency() returns by-currency key", () => {
    expect(currencyRateQueryKeys.byCurrency()).toEqual([
      "currency-rates",
      "by-currency",
    ]);
  });

  it("byCurrencyCode(code) returns key with code", () => {
    expect(currencyRateQueryKeys.byCurrencyCode("USD")).toEqual([
      "currency-rates",
      "by-currency",
      "USD",
    ]);
  });

  it("byType(code, type) returns key with code and type", () => {
    expect(currencyRateQueryKeys.byType("USD", "KMK")).toEqual([
      "currency-rates",
      "by-currency",
      "USD",
      "KMK",
    ]);
  });
});

describe("useListCurrencyRates", () => {
  it("fetches and returns paged currency rate data", async () => {
    const { result } = renderHook(() => useListCurrencyRates());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(2);
    expect(result.current.data?.data?.content[0].currencyCode).toBe("USD");
  });

  it("passes pagination params", async () => {
    const params = { page: 1, size: 10, search: "USD", rateType: "KMK" };
    const { result } = renderHook(() => useListCurrencyRates(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListCurrencyRates(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/currency-rate`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListCurrencyRates());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when request fails", async () => {
    server.use(
      http.get(`${BASE}/master/currency-rate`, () =>
        HttpResponse.json(
          { message: "Failed to fetch rates" },
          { status: 500 },
        ),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCurrencyRates());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("calls toast.error with fallback message when no error message", async () => {
    server.use(
      http.get(`${BASE}/master/currency-rate`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCurrencyRates());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load currency rates"),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/currency-rate`, () =>
        HttpResponse.json({
          status: "ERROR",
          message: "Server Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListCurrencyRates());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });
});

describe("useGetCurrencyRateById", () => {
  it("fetches and returns a single currency rate by ID", async () => {
    const { result } = renderHook(() => useGetCurrencyRateById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.currencyCode).toBe("USD");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCurrencyRateById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when not found", async () => {
    server.use(
      http.get(`${BASE}/master/currency-rate/:id`, () =>
        HttpResponse.json({ message: "Not found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetCurrencyRateById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error with fallback message when no error details", async () => {
    server.use(
      http.get(`${BASE}/master/currency-rate/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCurrencyRateById(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load currency rate"),
    );
  });
});

describe("useGetCurrencyRatesByCurrency", () => {
  it("fetches rates by currency code", async () => {
    const { result } = renderHook(() => useGetCurrencyRatesByCurrency("USD"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(2);
  });
});

describe("useGetCurrencyRatesByType", () => {
  it("fetches rates by currency code and rate type", async () => {
    const { result } = renderHook(() =>
      useGetCurrencyRatesByType("USD", "KMK"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });
});

describe("useGetRateAtDate", () => {
  it("fetches rate at specific date", async () => {
    const { result } = renderHook(() =>
      useGetRateAtDate("USD", "KMK", "2024-06-01"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data?.id).toBe(1);
  });
});

describe("useGetLatestRatesByRateType", () => {
  it("fetches latest rates by rate type", async () => {
    const { result } = renderHook(() => useGetLatestRatesByRateType("KMK"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toHaveLength(2);
  });
});

describe("useGetLatestRate", () => {
  it("fetches latest rate for currency and type", async () => {
    const { result } = renderHook(() => useGetLatestRate("USD", "KMK"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data?.id).toBe(1);
  });
});
