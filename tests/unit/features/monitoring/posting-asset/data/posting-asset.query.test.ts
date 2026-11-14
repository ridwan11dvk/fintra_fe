import {
  postingAssetQueryKeys,
  usePostingAssetById,
  usePostingAssetByTransaction,
  usePostingAssetList,
  usePostingAssetStatusSummary,
} from "@/features/monitoring/posting-asset/data/posting-asset.query";
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

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  const { buildUiResponseMock } =
    await import("@tests/unit/mocks/ui-response-mock");
  return buildUiResponseMock(actual);
});

const BASE = "http://localhost:3000";

describe("postingAssetQueryKeys", () => {
  it("all returns base key array", () => {
    expect(postingAssetQueryKeys.all).toEqual(["postingAsset"]);
  });

  it("lists() returns list key", () => {
    expect(postingAssetQueryKeys.lists()).toEqual(["postingAsset", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(postingAssetQueryKeys.list()).toEqual([
      "postingAsset",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(postingAssetQueryKeys.list(params)).toEqual([
      "postingAsset",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(postingAssetQueryKeys.details()).toEqual(["postingAsset", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(postingAssetQueryKeys.detail(5)).toEqual([
      "postingAsset",
      "detail",
      5,
    ]);
  });

  it("transactions() returns transaction key", () => {
    expect(postingAssetQueryKeys.transactions()).toEqual([
      "postingAsset",
      "transaction",
    ]);
  });

  it("transaction() returns transaction key with params", () => {
    expect(postingAssetQueryKeys.transaction("A", "DOC", "REF")).toEqual([
      "postingAsset",
      "transaction",
      "A",
      "DOC",
      "REF",
    ]);
  });

  it("summaries() returns summary key", () => {
    expect(postingAssetQueryKeys.summaries()).toEqual([
      "postingAsset",
      "summary",
    ]);
  });

  it("statusSummary() returns status summary key", () => {
    expect(postingAssetQueryKeys.statusSummary()).toEqual([
      "postingAsset",
      "summary",
      "status",
    ]);
  });
});

describe("usePostingAssetList", () => {
  it("fetches and returns paged data when enabled (default)", async () => {
    const { result } = renderHook(() => usePostingAssetList());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].documentNumber).toBe(
      "DOC-001",
    );
  });

  it("does not fetch when enabled option is false", async () => {
    const { result } = renderHook(() =>
      usePostingAssetList(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/asset`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => usePostingAssetList());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePostingAssetById", () => {
  it("fetches and returns a single record by ID", async () => {
    const { result } = renderHook(() => usePostingAssetById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.documentNumber).toBe("DOC-001");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      usePostingAssetById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("does not fetch when id is 0", async () => {
    const { result } = renderHook(() => usePostingAssetById(0));

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/asset/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => usePostingAssetById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePostingAssetByTransaction", () => {
  it("fetches and returns transaction records", async () => {
    const { result } = renderHook(() =>
      usePostingAssetByTransaction("A", "DOC-001", "REF-001"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      usePostingAssetByTransaction("A", "DOC-001", "REF-001", {
        enabled: false,
      }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("does not fetch when reversalFlag is empty", async () => {
    const { result } = renderHook(() =>
      usePostingAssetByTransaction("", "DOC-001", "REF-001"),
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(
        `${BASE}/monitoring/posting/asset/:reversalFlag/:documentNumber/:reference`,
        () => HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() =>
      usePostingAssetByTransaction("A", "DOC", "REF"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePostingAssetStatusSummary", () => {
  it("fetches and returns status summary", async () => {
    const { result } = renderHook(() => usePostingAssetStatusSummary());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.pendingCount).toBe(5);
    expect(result.current.data?.data?.postedCount).toBe(10);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      usePostingAssetStatusSummary({ enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/asset/summary/status`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => usePostingAssetStatusSummary());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
