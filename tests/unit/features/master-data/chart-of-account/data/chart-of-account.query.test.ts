import {
  chartOfAccountQueryKeys,
  useGetChartOfAccountById,
  useListChartOfAccounts,
} from "@/features/master-data/chart-of-account/data/chart-of-account.query";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { mockChartOfAccount } from "./chart-of-account.handlers";

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

const BASE = "http://localhost:3000";

describe("chartOfAccountQueryKeys", () => {
  it("all returns base key array", () => {
    expect(chartOfAccountQueryKeys.all).toEqual(["chartOfAccounts"]);
  });

  it("lists() returns list key", () => {
    expect(chartOfAccountQueryKeys.lists()).toEqual(["chartOfAccounts", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(chartOfAccountQueryKeys.list()).toEqual([
      "chartOfAccounts",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(chartOfAccountQueryKeys.list(params)).toEqual([
      "chartOfAccounts",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(chartOfAccountQueryKeys.details()).toEqual([
      "chartOfAccounts",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(chartOfAccountQueryKeys.detail(1)).toEqual([
      "chartOfAccounts",
      "detail",
      1,
    ]);
  });
});

describe("useListChartOfAccounts", () => {
  it("fetches and returns paged chart of account data", async () => {
    const { result } = renderHook(() => useListChartOfAccounts());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toBeDefined();
    expect(result.current.data?.data?.content[0].code).toBe(
      mockChartOfAccount.code,
    );
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "Cash" };
    const { result } = renderHook(() => useListChartOfAccounts(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListChartOfAccounts(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master-data/chart-of-accounts`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListChartOfAccounts());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetChartOfAccountById", () => {
  it("fetches single chart of account by ID", async () => {
    const { result } = renderHook(() => useGetChartOfAccountById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.code).toBe(mockChartOfAccount.code);
  });

  it("does not fetch when id is falsy", async () => {
    const { result } = renderHook(() => useGetChartOfAccountById(""));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns error", async () => {
    server.use(
      http.get(`${BASE}/master-data/chart-of-accounts/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetChartOfAccountById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("refetches on remount because staleTime is 0 and refetchOnMount is always", async () => {
    let callCount = 0;
    server.use(
      http.get(`${BASE}/master-data/chart-of-accounts/:id`, () => {
        callCount++;
        return HttpResponse.json({
          status: "SUCCESS",
          data: { ...mockChartOfAccount, id: 1 },
        });
      }),
    );

    const { result, unmount } = renderHook(() => useGetChartOfAccountById(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(callCount).toBe(1);

    unmount();

    const { result: remountedResult } = renderHook(() =>
      useGetChartOfAccountById(1),
    );
    await waitFor(() => expect(remountedResult.current.isSuccess).toBe(true));
    expect(callCount).toBe(2);
  });
});
