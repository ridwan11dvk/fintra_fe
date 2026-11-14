import {
  districtQueryKeys,
  useGetDistrictById,
  useGetDistrictsByRegencyId,
  useListDistricts,
} from "@/features/master-data/district/data/district.query";
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

describe("districtQueryKeys", () => {
  it("all returns base key array", () => {
    expect(districtQueryKeys.all).toEqual(["districts"]);
  });

  it("lists() returns list key", () => {
    expect(districtQueryKeys.lists()).toEqual(["districts", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(districtQueryKeys.list()).toEqual(["districts", "list", undefined]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(districtQueryKeys.list(params)).toEqual([
      "districts",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(districtQueryKeys.details()).toEqual(["districts", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(districtQueryKeys.detail(5)).toEqual(["districts", "detail", 5]);
  });

  it("byRegency() returns regency key with id", () => {
    expect(districtQueryKeys.byRegency(1)).toEqual(["districts", "regency", 1]);
  });
});

describe("useListDistricts", () => {
  it("fetches and returns paged district data", async () => {
    const { result } = renderHook(() => useListDistricts());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].code).toBe("DIST001");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "Bandung" };
    const { result } = renderHook(() => useListDistricts(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListDistricts(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/district`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListDistricts());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/district`, () =>
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
    const { result } = renderHook(() => useListDistricts());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Districts loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/district`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListDistricts());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/district`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListDistricts());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load districts"),
    );
  });
});

describe("useGetDistrictById", () => {
  it("fetches and returns a single district by ID", async () => {
    const { result } = renderHook(() => useGetDistrictById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("Bandung City");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetDistrictById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/district/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetDistrictById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/district/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            id: 1,
            name: "Bandung City",
            code: "DIST001",
            provinceId: 1,
            regencyId: 1,
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
    const { result } = renderHook(() => useGetDistrictById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "District loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/district/:id`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetDistrictById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/district/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetDistrictById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load district"),
    );
  });
});

describe("useGetDistrictsByRegencyId", () => {
  it("fetches and returns districts by regency ID", async () => {
    const { result } = renderHook(() => useGetDistrictsByRegencyId(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data?.[0].regencyId).toBe(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetDistrictsByRegencyId(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/district/regency/:regencyId`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetDistrictsByRegencyId(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/district/regency/:regencyId`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: [],
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetDistrictsByRegencyId(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Districts loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/district/regency/:regencyId`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetDistrictsByRegencyId(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/district/regency/:regencyId`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetDistrictsByRegencyId(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load districts"),
    );
  });
});
