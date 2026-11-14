import {
  currencyQueryKeys,
  useGetActiveCurrenciesByCountry,
  useGetCurrenciesByCountry,
  useGetCurrencyById,
  useListCurrencies,
} from "@/features/master-data/currency/data/currency.query";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { mockCurrency, singleCurrencyResponse } from "./currency.handlers";

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

describe("currencyQueryKeys", () => {
  it("all returns base key array", () => {
    expect(currencyQueryKeys.all).toEqual(["currencies"]);
  });

  it("lists() returns list key", () => {
    expect(currencyQueryKeys.lists()).toEqual(["currencies", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(currencyQueryKeys.list()).toEqual(["currencies", "list", undefined]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(currencyQueryKeys.list(params)).toEqual([
      "currencies",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(currencyQueryKeys.details()).toEqual(["currencies", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(currencyQueryKeys.detail(5)).toEqual(["currencies", "detail", 5]);
  });

  it("byCountry() returns by-country key", () => {
    expect(currencyQueryKeys.byCountry()).toEqual(["currencies", "by-country"]);
  });

  it("byCountryId(id) returns by-country key with id", () => {
    expect(currencyQueryKeys.byCountryId(3)).toEqual([
      "currencies",
      "by-country",
      3,
    ]);
  });
});

describe("useListCurrencies", () => {
  it("fetches and returns paged currency data", async () => {
    const { result } = renderHook(() => useListCurrencies());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].code).toBe("IDR");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "IDR" };
    const { result } = renderHook(() => useListCurrencies(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListCurrencies(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/currency`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListCurrencies());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/currency`, () =>
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
    const { result } = renderHook(() => useListCurrencies());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Currencies loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/currency`, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListCurrencies());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message", async () => {
    server.use(
      http.get(`${BASE}/master/currency`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCurrencies());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load currencies"),
    );
  });
});

describe("useGetCurrencyById", () => {
  it("fetches and returns a single currency by ID", async () => {
    const { result } = renderHook(() => useGetCurrencyById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.code).toBe("IDR");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCurrencyById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    const { result } = renderHook(() => useGetCurrencyById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/currency/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: mockCurrency,
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCurrencyById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Currency loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/currency/:id`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetCurrencyById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message", async () => {
    server.use(
      http.get(`${BASE}/master/currency/:id`, ({ params }) => {
        if (params.id === "999") {
          return HttpResponse.json(null, { status: 404 });
        }
        return HttpResponse.json(singleCurrencyResponse);
      }),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCurrencyById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load currency"),
    );
  });
});

describe("useGetCurrenciesByCountry", () => {
  it("fetches currencies by country", async () => {
    const { result } = renderHook(() => useGetCurrenciesByCountry(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCurrenciesByCountry(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/currency/country/:countryId`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetCurrenciesByCountry(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetActiveCurrenciesByCountry", () => {
  it("fetches active currencies by country", async () => {
    const { result } = renderHook(() => useGetActiveCurrenciesByCountry(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetActiveCurrenciesByCountry(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/currency/country/:countryId/active`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetActiveCurrenciesByCountry(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
