import {
  provinceQueryKeys,
  useGetProvinceById,
  useListProvinces,
} from "@/features/master-data/province/data/province.query";
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
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("provinceQueryKeys", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("all returns base key array", () => {
    expect(provinceQueryKeys.all).toEqual(["provinces"]);
  });

  it("lists() returns list key", () => {
    expect(provinceQueryKeys.lists()).toEqual(["provinces", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(provinceQueryKeys.list()).toEqual(["provinces", "list", undefined]);
  });

  it("list(params) returns list key with params", () => {
    expect(provinceQueryKeys.list({ page: 1 })).toEqual([
      "provinces",
      "list",
      { page: 1 },
    ]);
  });

  it("details() returns detail key", () => {
    expect(provinceQueryKeys.details()).toEqual(["provinces", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(provinceQueryKeys.detail(1)).toEqual(["provinces", "detail", 1]);
  });
});

describe("useListProvinces", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches and returns paged province data", async () => {
    const { result } = renderHook(() => useListProvinces());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(1);
  });

  it("passes pagination params to the query", async () => {
    const { result } = renderHook(() =>
      useListProvinces({ pageSize: 10, pageNumber: 1 }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListProvinces(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/province`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListProvinces());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/province`, () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListProvinces());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalledWith("Failed to load provinces");
  });

  it("calls toast.success with success message", async () => {
    const { result } = renderHook(() => useListProvinces());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toastSuccess).toHaveBeenCalledWith("Data fetched successfully");
  });
});

describe("useGetProvinceById", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches and returns a single province by ID", async () => {
    const { result } = renderHook(() => useGetProvinceById(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.id).toBe(1);
    expect(result.current.data?.data.name).toBe("West Java");
  });

  it("does not fetch when id is undefined", async () => {
    const { result } = renderHook(() =>
      useGetProvinceById(undefined as unknown as number, {
        enabled: false,
      }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/province/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetProvinceById(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });
});
