import {
  partnerCategoryQueryKeys,
  useGetPartnerCategoryById,
  useListPartnerCategories,
} from "@/features/master-data/partner-category/data/partner-category.query";
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

describe("partnerCategoryQueryKeys", () => {
  it("all returns base key array", () => {
    expect(partnerCategoryQueryKeys.all).toEqual(["partner-categories"]);
  });

  it("lists() returns list key", () => {
    expect(partnerCategoryQueryKeys.lists()).toEqual([
      "partner-categories",
      "list",
    ]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(partnerCategoryQueryKeys.list()).toEqual([
      "partner-categories",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(partnerCategoryQueryKeys.list(params)).toEqual([
      "partner-categories",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(partnerCategoryQueryKeys.details()).toEqual([
      "partner-categories",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(partnerCategoryQueryKeys.detail(5)).toEqual([
      "partner-categories",
      "detail",
      5,
    ]);
  });
});

describe("useListPartnerCategories", () => {
  it("fetches and returns paged partner category data", async () => {
    const { result } = renderHook(() => useListPartnerCategories());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].name).toBe("Supplier");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "Supplier" };
    const { result } = renderHook(() => useListPartnerCategories(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerCategories(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/category`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListPartnerCategories());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/partner/category`, () =>
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
    const { result } = renderHook(() => useListPartnerCategories());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Partner categories loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/partner/category`, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListPartnerCategories());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/partner/category`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListPartnerCategories());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load partner categories",
      ),
    );
  });
});

describe("useGetPartnerCategoryById", () => {
  it("fetches and returns a single partner category by ID", async () => {
    const { result } = renderHook(() => useGetPartnerCategoryById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("Supplier");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetPartnerCategoryById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/partner/category/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetPartnerCategoryById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/partner/category/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            id: 1,
            name: "Supplier",
            description: "Supplier category",
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
    const { result } = renderHook(() => useGetPartnerCategoryById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Partner category loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/partner/category/:id`, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetPartnerCategoryById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/partner/category/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetPartnerCategoryById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load partner category",
      ),
    );
  });
});
