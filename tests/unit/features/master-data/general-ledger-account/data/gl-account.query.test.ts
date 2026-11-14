import {
  glAccountQueryKeys,
  useGetGLAccountById,
  useGetGLAccountsByBACode,
  useGetGLAccountsByCompanyCode,
  useListGLAccounts,
} from "@/features/master-data/general-ledger-account/data/gl-account.query";
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

describe("glAccountQueryKeys", () => {
  it("all returns base key array", () => {
    expect(glAccountQueryKeys.all).toEqual(["gl-accounts"]);
  });

  it("lists() returns list key", () => {
    expect(glAccountQueryKeys.lists()).toEqual(["gl-accounts", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(glAccountQueryKeys.list()).toEqual([
      "gl-accounts",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(glAccountQueryKeys.list(params)).toEqual([
      "gl-accounts",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(glAccountQueryKeys.details()).toEqual(["gl-accounts", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(glAccountQueryKeys.detail(5)).toEqual(["gl-accounts", "detail", 5]);
  });

  it("byCompany(code) returns company key", () => {
    expect(glAccountQueryKeys.byCompany("COMP1")).toEqual([
      "gl-accounts",
      "company",
      "COMP1",
    ]);
  });

  it("byBA(code) returns BA key", () => {
    expect(glAccountQueryKeys.byBA("BA001")).toEqual([
      "gl-accounts",
      "ba",
      "BA001",
    ]);
  });
});

describe("useListGLAccounts", () => {
  it("fetches and returns paged GL account data", async () => {
    const { result } = renderHook(() => useListGLAccounts());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].companyCode).toBe("COMP1");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "COMP1" };
    const { result } = renderHook(() => useListGLAccounts(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListGLAccounts(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/gl`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListGLAccounts());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/gl`, () =>
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
    const { result } = renderHook(() => useListGLAccounts());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "GL accounts loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/gl`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListGLAccounts());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/gl`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListGLAccounts());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load GL accounts"),
    );
  });
});

describe("useGetGLAccountById", () => {
  it("fetches and returns a single GL account by ID", async () => {
    const { result } = renderHook(() => useGetGLAccountById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.companyCode).toBe("COMP1");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetGLAccountById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/gl/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetGLAccountById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetGLAccountsByCompanyCode", () => {
  it("fetches GL accounts by company code", async () => {
    const { result } = renderHook(() => useGetGLAccountsByCompanyCode("COMP1"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data?.[0].companyCode).toBe("COMP1");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetGLAccountsByCompanyCode("COMP1", { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useGetGLAccountsByBACode", () => {
  it("fetches GL accounts by BA code", async () => {
    const { result } = renderHook(() => useGetGLAccountsByBACode("BA001"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data?.[0].baCode).toBe("BA001");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetGLAccountsByBACode("BA001", { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
