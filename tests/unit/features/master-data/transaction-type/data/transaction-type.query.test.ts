import {
  transactionTypeQueryKeys,
  useGetTransactionTypeById,
  useGetTransactionTypesByCompanyCode,
  useGetTransactionTypesByModuleId,
  useListTransactionTypes,
} from "@/features/master-data/transaction-type/data/transaction-type.query";
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

describe("transactionTypeQueryKeys", () => {
  it("all returns base key array", () => {
    expect(transactionTypeQueryKeys.all).toEqual(["transaction-types"]);
  });

  it("lists() returns list key", () => {
    expect(transactionTypeQueryKeys.lists()).toEqual([
      "transaction-types",
      "list",
    ]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(transactionTypeQueryKeys.list()).toEqual([
      "transaction-types",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(transactionTypeQueryKeys.list(params)).toEqual([
      "transaction-types",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(transactionTypeQueryKeys.details()).toEqual([
      "transaction-types",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(transactionTypeQueryKeys.detail(5)).toEqual([
      "transaction-types",
      "detail",
      5,
    ]);
  });

  it("byCompanyCode() returns company key", () => {
    expect(transactionTypeQueryKeys.byCompanyCode("COMP")).toEqual([
      "transaction-types",
      "company",
      "COMP",
    ]);
  });

  it("byModuleId() returns module key", () => {
    expect(transactionTypeQueryKeys.byModuleId(3)).toEqual([
      "transaction-types",
      "module",
      3,
    ]);
  });
});

describe("useListTransactionTypes", () => {
  it("fetches and returns paged transaction type data", async () => {
    const { result } = renderHook(() => useListTransactionTypes());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].name).toBe("Sales Invoice");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "Invoice" };
    const { result } = renderHook(() => useListTransactionTypes(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListTransactionTypes(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListTransactionTypes());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type`, () =>
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
    const { result } = renderHook(() => useListTransactionTypes());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Transaction types loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListTransactionTypes());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListTransactionTypes());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load transaction types",
      ),
    );
  });
});

describe("useGetTransactionTypeById", () => {
  it("fetches and returns a single transaction type by ID", async () => {
    const { result } = renderHook(() => useGetTransactionTypeById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("Sales Invoice");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetTransactionTypeById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetTransactionTypeById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            id: 1,
            companyCode: "COMP",
            code: "SI",
            name: "Sales Invoice",
            isActive: true,
            createdAt: "2024-06-01T00:00:00Z",
            updatedAt: "2024-06-01T00:00:00Z",
            createdBy: "admin",
            updatedBy: "admin",
          },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetTransactionTypeById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Transaction type loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type/:id`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetTransactionTypeById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetTransactionTypeById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load transaction type",
      ),
    );
  });
});

describe("useGetTransactionTypesByCompanyCode", () => {
  it("fetches transaction types by company code", async () => {
    const { result } = renderHook(() =>
      useGetTransactionTypesByCompanyCode("COMP"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data?.[0].companyCode).toBe("COMP");
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type/company/:companyCode`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() =>
      useGetTransactionTypesByCompanyCode("UNKNOWN"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when request fails", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type/company/:companyCode`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useGetTransactionTypesByCompanyCode("UNKNOWN"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load transaction types",
      ),
    );
  });
});

describe("useGetTransactionTypesByModuleId", () => {
  it("fetches transaction types by module ID", async () => {
    const { result } = renderHook(() => useGetTransactionTypesByModuleId(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type/module/:moduleId`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetTransactionTypesByModuleId(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when request fails", async () => {
    server.use(
      http.get(`${BASE}/master/transaction-type/module/:moduleId`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetTransactionTypesByModuleId(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load transaction types",
      ),
    );
  });
});
