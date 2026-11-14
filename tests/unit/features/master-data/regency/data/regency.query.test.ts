import {
  regencyQueryKeys,
  useGetRegenciesByProvinceId,
  useGetRegencyById,
  useListRegencies,
} from "@/features/master-data/regency/data/regency.query";
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

describe("regencyQueryKeys", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("all returns base key array", () => {
    expect(regencyQueryKeys.all).toEqual(["regencies"]);
  });

  it("lists() returns list key", () => {
    expect(regencyQueryKeys.lists()).toEqual(["regencies", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(regencyQueryKeys.list()).toEqual(["regencies", "list", undefined]);
  });

  it("list(params) returns list key with params", () => {
    expect(regencyQueryKeys.list({ page: 1 })).toEqual([
      "regencies",
      "list",
      { page: 1 },
    ]);
  });

  it("details() returns detail key", () => {
    expect(regencyQueryKeys.details()).toEqual(["regencies", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(regencyQueryKeys.detail(1)).toEqual(["regencies", "detail", 1]);
  });

  it("byProvince(id) returns province filter key", () => {
    expect(regencyQueryKeys.byProvince(1)).toEqual([
      "regencies",
      "province",
      1,
    ]);
  });
});

describe("useListRegencies", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches and returns paged regency data", async () => {
    const { result } = renderHook(() => useListRegencies());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(1);
  });

  it("passes pagination params to the query", async () => {
    const { result } = renderHook(() =>
      useListRegencies({ pageSize: 10, pageNumber: 1 }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListRegencies(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/regency`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListRegencies());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/regency`, () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListRegencies());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalledWith("Failed to load regencies");
  });

  it("calls toast.success with success message", async () => {
    const { result } = renderHook(() => useListRegencies());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toastSuccess).toHaveBeenCalledWith("Data fetched successfully");
  });
});

describe("useGetRegencyById", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches and returns a single regency by ID", async () => {
    const { result } = renderHook(() => useGetRegencyById(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.id).toBe(1);
    expect(result.current.data?.data.name).toBe("Bandung");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetRegencyById(undefined as unknown as number, {
        enabled: false,
      }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/regency/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetRegencyById(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useGetRegenciesByProvinceId", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches regencies by province ID", async () => {
    const { result } = renderHook(() => useGetRegenciesByProvinceId(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetRegenciesByProvinceId(undefined as unknown as number, {
        enabled: false,
      }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/regency/province/:provinceId`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetRegenciesByProvinceId(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });
});
