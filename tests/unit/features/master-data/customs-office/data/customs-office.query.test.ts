import {
  customsOfficeQueryKeys,
  useGetCustomsOfficeById,
  useListCustomsOffices,
  useListCustomsOfficesAlt,
} from "@/features/master-data/customs-office/data/customs-office.query";
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

describe("customsOfficeQueryKeys", () => {
  it("all returns base key array", () => {
    expect(customsOfficeQueryKeys.all).toEqual(["customsOffices"]);
  });

  it("lists() returns list key", () => {
    expect(customsOfficeQueryKeys.lists()).toEqual(["customsOffices", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(customsOfficeQueryKeys.list()).toEqual([
      "customsOffices",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(customsOfficeQueryKeys.list(params)).toEqual([
      "customsOffices",
      "list",
      params,
    ]);
  });

  it("listAlt() without params returns list alt key", () => {
    expect(customsOfficeQueryKeys.listAlt()).toEqual([
      "customsOffices",
      "list",
      "alt",
      undefined,
    ]);
  });

  it("listAlt(params) returns list alt key with params", () => {
    const params = { search: "Jakarta" };
    expect(customsOfficeQueryKeys.listAlt(params)).toEqual([
      "customsOffices",
      "list",
      "alt",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(customsOfficeQueryKeys.details()).toEqual([
      "customsOffices",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(customsOfficeQueryKeys.detail(5)).toEqual([
      "customsOffices",
      "detail",
      5,
    ]);
  });
});

describe("useListCustomsOffices", () => {
  it("fetches and returns paged customs office data", async () => {
    const { result } = renderHook(() => useListCustomsOffices());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(2);
    expect(result.current.data?.data?.content[0].code).toBe("KPPBC-001");
  });

  it("passes pagination params", async () => {
    const params = { page: 1, size: 10 };
    const { result } = renderHook(() => useListCustomsOffices(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListCustomsOffices(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListCustomsOffices());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when request fails", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office`, () =>
        HttpResponse.json({ message: "Failed to fetch" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCustomsOffices());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("calls toast.error with fallback message when no error message", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCustomsOffices());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load customs offices",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office`, () =>
        HttpResponse.json({
          status: "ERROR",
          message: "Server Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListCustomsOffices());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.success with default message when no message provided", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office`, () =>
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
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListCustomsOffices());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Customs offices loaded successfully",
    );
  });
});

describe("useListCustomsOfficesAlt", () => {
  it("fetches customs offices via alt endpoint", async () => {
    const { result } = renderHook(() => useListCustomsOfficesAlt());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("calls toast.error when alt endpoint fails", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office/list`, () =>
        HttpResponse.json({ message: "Failed" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCustomsOfficesAlt());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("calls toast.error with fallback message", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office/list`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCustomsOfficesAlt());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load customs offices",
      ),
    );
  });
});

describe("useGetCustomsOfficeById", () => {
  it("fetches and returns a single customs office by ID", async () => {
    const { result } = renderHook(() => useGetCustomsOfficeById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.code).toBe("KPPBC-001");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCustomsOfficeById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when not found", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office/:id`, () =>
        HttpResponse.json({ message: "Not found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetCustomsOfficeById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error with fallback message", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCustomsOfficeById(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load customs office"),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office/:id`, () =>
        HttpResponse.json({
          status: "ERROR",
          message: "Server Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetCustomsOfficeById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.success with default message when no message provided", async () => {
    server.use(
      http.get(`${BASE}/master/customs-office/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            id: 1,
            code: "KPPBC-001",
            name: "Test",
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
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetCustomsOfficeById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Customs office loaded successfully",
    );
  });
});
