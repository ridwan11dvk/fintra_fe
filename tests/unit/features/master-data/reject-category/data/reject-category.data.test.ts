import {
  useCreateRejectCategoryMutation,
  useDeleteRejectCategoryMutation,
  useUpdateRejectCategoryMutation,
} from "@/features/master-data/reject-category/data/reject-category.mutation";
import {
  rejectCategoryQueryKeys,
  useGetRejectCategoryById,
  useListRejectCategories,
} from "@/features/master-data/reject-category/data/reject-category.query";
import { rejectCategoryService } from "@/features/master-data/reject-category/data/reject-category.service";
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
const URL = `${BASE}/master/reject-category`;

const mockCategory = {
  id: 1,
  name: "Invalid Data",
  description: "Invalid data rejection",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const singleResponse = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockCategory,
};

const pagedResponse = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockCategory],
    pagination: {
      total: 1,
      pageSize: 10,
      pageNumber: 1,
      totalPages: 1,
      currentPage: 1,
      from: 1,
      to: 1,
    },
  },
};

describe("rejectCategoryQueryKeys", () => {
  it("all returns base key array", () => {
    expect(rejectCategoryQueryKeys.all).toEqual(["rejectCategories"]);
  });

  it("lists() returns list key", () => {
    expect(rejectCategoryQueryKeys.lists()).toEqual([
      "rejectCategories",
      "list",
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(rejectCategoryQueryKeys.list(params)).toEqual([
      "rejectCategories",
      "list",
      params,
    ]);
  });

  it("details() and detail(id) return detail keys", () => {
    expect(rejectCategoryQueryKeys.details()).toEqual([
      "rejectCategories",
      "detail",
    ]);
    expect(rejectCategoryQueryKeys.detail(5)).toEqual([
      "rejectCategories",
      "detail",
      5,
    ]);
  });
});

describe("rejectCategoryService", () => {
  it("listRejectCategories fetches paged data", async () => {
    const data = await rejectCategoryService.listRejectCategories();
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.content[0].name).toBe("Invalid Data");
  });

  it("getRejectCategoryById fetches a single item", async () => {
    const data = await rejectCategoryService.getRejectCategoryById(1);
    expect(data.data?.id).toBe(1);
  });

  it("createRejectCategory posts payload", async () => {
    const data = await rejectCategoryService.createRejectCategory({
      name: "New",
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("updateRejectCategory puts payload", async () => {
    const data = await rejectCategoryService.updateRejectCategory(1, {
      name: "Updated",
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("deleteRejectCategory sends DELETE", async () => {
    const data = await rejectCategoryService.deleteRejectCategory(1);
    expect(data.status).toBe("SUCCESS");
  });
});

describe("useListRejectCategories", () => {
  it("fetches and returns paged reject category data", async () => {
    const { result } = renderHook(() => useListRejectCategories());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "Invalid" };
    const { result } = renderHook(() => useListRejectCategories(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListRejectCategories(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListRejectCategories());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: pagedResponse.data,
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListRejectCategories());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Reject categories loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListRejectCategories());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(http.get(URL, () => HttpResponse.json(null, { status: 500 })));

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListRejectCategories());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load reject categories",
      ),
    );
  });
});

describe("useGetRejectCategoryById", () => {
  it("fetches and returns a single reject category by ID", async () => {
    const { result } = renderHook(() => useGetRejectCategoryById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetRejectCategoryById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${URL}/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetRejectCategoryById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${URL}/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: mockCategory,
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetRejectCategoryById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Reject category loaded successfully",
      ),
    );
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${URL}/:id`, () => HttpResponse.json(null, { status: 500 })),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetRejectCategoryById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load reject category",
      ),
    );
  });
});

describe("useCreateRejectCategoryMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useCreateRejectCategoryMutation());

    result.current.mutate({ name: "New Category" });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(URL, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateRejectCategoryMutation());

    result.current.mutate({ name: "New Category" });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateRejectCategoryMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateRejectCategoryMutation());

    result.current.mutate({ id: 1, data: { name: "Updated" } });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.put(`${URL}/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useUpdateRejectCategoryMutation());

    result.current.mutate({ id: 1, data: { name: "Updated" } });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteRejectCategoryMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useDeleteRejectCategoryMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${URL}/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useDeleteRejectCategoryMutation());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
