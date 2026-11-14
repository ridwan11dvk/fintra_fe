import {
  taxRateQueryKeys,
  useGetTaxRateByCode,
  useGetTaxRateById,
  useListTaxRates,
} from "@/features/master-data/tax-rate/data/tax-rate.query";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
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
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/popover", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("taxRateQueryKeys", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("all returns base key array", () => {
    expect(taxRateQueryKeys.all).toEqual(["taxRates"]);
  });

  it("lists() returns list key", () => {
    expect(taxRateQueryKeys.lists()).toEqual(["taxRates", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(taxRateQueryKeys.list()).toEqual(["taxRates", "list", undefined]);
  });

  it("list(params) returns list key with params", () => {
    expect(taxRateQueryKeys.list({ page: 1 })).toEqual([
      "taxRates",
      "list",
      { page: 1 },
    ]);
  });

  it("details() returns detail key", () => {
    expect(taxRateQueryKeys.details()).toEqual(["taxRates", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(taxRateQueryKeys.detail(1)).toEqual(["taxRates", "detail", 1]);
  });

  it("byCode(code) returns byCode key with code", () => {
    expect(taxRateQueryKeys.byCode("PPN_17")).toEqual([
      "taxRates",
      "byCode",
      "PPN_17",
    ]);
  });
});

describe("useListTaxRates", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches and returns paged tax rate data", async () => {
    const { result } = renderHook(() => useListTaxRates());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(1);
  });

  it("passes pagination params to the query", async () => {
    const { result } = renderHook(() =>
      useListTaxRates({ pageSize: 10, pageNumber: 1 }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListTaxRates(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/tax-rates`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListTaxRates());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/tax-rates`, () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListTaxRates());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalledWith("Failed to load tax rates");
  });

  it("calls toast.success with success message", async () => {
    const { result } = renderHook(() => useListTaxRates());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toastSuccess).toHaveBeenCalledWith("Data fetched successfully");
  });
});

describe("useGetTaxRateById", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches and returns a single tax rate by ID", async () => {
    const { result } = renderHook(() => useGetTaxRateById(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.id).toBe(1);
    expect(result.current.data?.data.name).toBe("PPN 17%");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetTaxRateById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/tax-rates/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetTaxRateById(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useGetTaxRateByCode", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches and returns a single tax rate by code", async () => {
    const { result } = renderHook(() => useGetTaxRateByCode("PPN_17"));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.code).toBe("PPN_17");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetTaxRateByCode("PPN_17", { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/tax-rates/code/:code`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetTaxRateByCode("PPN_17"));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });
});
