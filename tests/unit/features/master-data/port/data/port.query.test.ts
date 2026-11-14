import {
  portQueryKeys,
  useGetPortById,
  useListPorts,
  useListPortsAlt,
  useListPortsByCustomsOffice,
} from "@/features/master-data/port/data/port.query";
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

describe("portQueryKeys", () => {
  it("all returns base key array", () => {
    expect(portQueryKeys.all).toEqual(["ports"]);
  });

  it("lists() returns list key", () => {
    expect(portQueryKeys.lists()).toEqual(["ports", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(portQueryKeys.list()).toEqual(["ports", "list", undefined]);
  });

  it("list(params) returns list key with params", () => {
    const params = { pageSize: 10, pageNumber: 1 };
    expect(portQueryKeys.list(params)).toEqual(["ports", "list", params]);
  });

  it("listByCustomsOffice() returns listByCustomsOffice key", () => {
    expect(portQueryKeys.listByCustomsOffice(1)).toEqual([
      "ports",
      "listByCustomsOffice",
      1,
      undefined,
    ]);
  });

  it("details() returns detail key", () => {
    expect(portQueryKeys.details()).toEqual(["ports", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(portQueryKeys.detail(1)).toEqual(["ports", "detail", 1]);
  });
});

describe("useListPorts", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("fetches and returns paged port data", async () => {
    const { result } = renderHook(() => useListPorts());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(1);
    expect(result.current.data?.data.content[0].code).toBe("PORT-CGK-001");
  });

  it("passes pagination params to the query", async () => {
    const params = { pageSize: 25, pageNumber: 2 };
    const { result } = renderHook(() => useListPorts(params));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.pagination.pageSize).toBe(10);
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(() =>
      useListPorts(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/port`, () =>
        HttpResponse.json(
          { message: "Internal server error" },
          { status: 500 },
        ),
      ),
    );

    const { result } = renderHook(() => useListPorts());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/port`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    renderHook(() => useListPorts());

    await waitFor(() => {
      expect(toastError).toHaveBeenCalled();
    });
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/port`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            content: [
              {
                id: 1,
                customsOfficeId: 1,
                customsOffice: {
                  id: 1,
                  code: "KPPBC-001",
                  name: "Test Custom Office",
                  isActive: true,
                  createdAt: "2024-01-01T00:00:00Z",
                  updatedAt: "2024-01-01T00:00:00Z",
                  createdBy: "admin",
                  updatedBy: "admin",
                },
                code: "PORT-001",
                name: "Test Port",
                isActive: true,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
                createdBy: "admin",
                updatedBy: "admin",
              },
            ],
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
        }),
      ),
    );

    renderHook(() => useListPorts());

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalled();
    });
  });
});

describe("useListPortsAlt", () => {
  beforeEach(() => {
    toastError.mockClear();
  });

  it("fetches ports by customs office (alt)", async () => {
    const { result } = renderHook(() => useListPortsAlt(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("does not fetch when customsOfficeId is undefined", () => {
    const { result } = renderHook(() => useListPortsAlt(undefined));

    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/port/list/customs-office/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListPortsAlt(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useListPortsByCustomsOffice", () => {
  it("fetches paged ports by customs office id", async () => {
    const { result } = renderHook(() => useListPortsByCustomsOffice(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(1);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/port/customs-office/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListPortsByCustomsOffice(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useGetPortById", () => {
  it("fetches and returns a single port by ID", async () => {
    const { result } = renderHook(() => useGetPortById(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.id).toBe(1);
    expect(result.current.data?.data.code).toBe("PORT-CGK-001");
  });

  it("does not fetch when id is undefined", async () => {
    const { result } = renderHook(() =>
      useGetPortById(undefined as unknown as number, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/port/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetPortById(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
