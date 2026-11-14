import {
  businessAreaQueryKeys,
  useGetBusinessAreaByCode,
  useGetBusinessAreaById,
  useListBusinessAreas,
} from "@/features/master-data/business-area/data/business-area.query";
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

describe("businessAreaQueryKeys", () => {
  it("all returns base key array", () => {
    expect(businessAreaQueryKeys.all).toEqual(["business-areas"]);
  });

  it("lists() returns list key", () => {
    expect(businessAreaQueryKeys.lists()).toEqual(["business-areas", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(businessAreaQueryKeys.list()).toEqual([
      "business-areas",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(businessAreaQueryKeys.list(params)).toEqual([
      "business-areas",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(businessAreaQueryKeys.details()).toEqual([
      "business-areas",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(businessAreaQueryKeys.detail(5)).toEqual([
      "business-areas",
      "detail",
      5,
    ]);
  });

  it("byCode(baCode) returns code key", () => {
    expect(businessAreaQueryKeys.byCode("BA-JKT-01")).toEqual([
      "business-areas",
      "code",
      "BA-JKT-01",
    ]);
  });
});

describe("useListBusinessAreas", () => {
  it("fetches and returns paged business area data", async () => {
    const { result } = renderHook(() => useListBusinessAreas());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].baCode).toBe("BA-JKT-01");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "Jakarta" };
    const { result } = renderHook(() => useListBusinessAreas(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListBusinessAreas(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    const { toast } = await import("sonner");
    vi.mocked(toast.success).mockClear();

    server.use(
      http.get(`${BASE}/master/business-area`, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    vi.mocked(toast.success).mockClear();
    const { result } = renderHook(() => useListBusinessAreas());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/business-area`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListBusinessAreas());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/business-area`, () =>
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
    const { result } = renderHook(() => useListBusinessAreas());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Business areas loaded successfully",
      ),
    );
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/business-area`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListBusinessAreas());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load business areas"),
    );
  });
});

describe("useGetBusinessAreaById", () => {
  it("fetches and returns a business area by id", async () => {
    const { result } = renderHook(() => useGetBusinessAreaById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/business-area/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            id: 1,
            companyCode: "PTABC",
            name: "Business Area Jakarta",
            baCode: "BA-JKT-01",
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
    vi.mocked(toast.success).mockClear();

    const { result } = renderHook(() => useGetBusinessAreaById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Business area loaded successfully",
      ),
    );
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/business-area/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetBusinessAreaById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    const { toast } = await import("sonner");
    vi.mocked(toast.success).mockClear();

    server.use(
      http.get(`${BASE}/master/business-area/:id`, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    vi.mocked(toast.success).mockClear();
    const { result } = renderHook(() => useGetBusinessAreaById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    const { toast } = await import("sonner");
    vi.mocked(toast.error).mockClear();

    server.use(
      http.get(`${BASE}/master/business-area/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    vi.mocked(toast.success).mockClear();
    const { result } = renderHook(() => useGetBusinessAreaById(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load business area"),
    );
  });
});

describe("useGetBusinessAreaByCode", () => {
  it("fetches and returns a business area by code", async () => {
    const { result } = renderHook(() => useGetBusinessAreaByCode("BA-JKT-01"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.baCode).toBe("BA-JKT-01");
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/business-area/code/:baCode`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            id: 1,
            companyCode: "PTABC",
            name: "Business Area Jakarta",
            baCode: "BA-JKT-01",
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
    vi.mocked(toast.success).mockClear();

    const { result } = renderHook(() => useGetBusinessAreaByCode("BA-JKT-01"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Business area loaded successfully",
      ),
    );
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/business-area/code/:baCode`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetBusinessAreaByCode("MISSING"));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    const { toast } = await import("sonner");
    vi.mocked(toast.success).mockClear();

    server.use(
      http.get(`${BASE}/master/business-area/code/:baCode`, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    vi.mocked(toast.success).mockClear();
    const { result } = renderHook(() => useGetBusinessAreaByCode("BA-JKT-01"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    const { toast } = await import("sonner");
    vi.mocked(toast.error).mockClear();

    server.use(
      http.get(`${BASE}/master/business-area/code/:baCode`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    vi.mocked(toast.success).mockClear();
    const { result } = renderHook(() => useGetBusinessAreaByCode("BA-JKT-01"));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load business area"),
    );
  });
});
