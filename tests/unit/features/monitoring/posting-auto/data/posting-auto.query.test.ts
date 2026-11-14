import {
  postingAutoQueryKeys,
  usePostingAutoById,
  usePostingAutoByTransaction,
  usePostingAutoList,
  usePostingAutoStatusSummary,
} from "@/features/monitoring/posting-auto/data/posting-auto.query";
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

describe("postingAutoQueryKeys", () => {
  it("all returns base key array", () => {
    expect(postingAutoQueryKeys.all).toEqual(["postingAuto"]);
  });

  it("lists() returns list key", () => {
    expect(postingAutoQueryKeys.lists()).toEqual(["postingAuto", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(postingAutoQueryKeys.list()).toEqual([
      "postingAuto",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(postingAutoQueryKeys.list(params)).toEqual([
      "postingAuto",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(postingAutoQueryKeys.details()).toEqual(["postingAuto", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(postingAutoQueryKeys.detail(5)).toEqual([
      "postingAuto",
      "detail",
      5,
    ]);
  });

  it("transactions() returns transaction key", () => {
    expect(postingAutoQueryKeys.transactions()).toEqual([
      "postingAuto",
      "transaction",
    ]);
  });

  it("transaction() returns transaction key with params", () => {
    expect(postingAutoQueryKeys.transaction("A", "DOC", "REF")).toEqual([
      "postingAuto",
      "transaction",
      "A",
      "DOC",
      "REF",
    ]);
  });

  it("summaries() returns summary key", () => {
    expect(postingAutoQueryKeys.summaries()).toEqual([
      "postingAuto",
      "summary",
    ]);
  });

  it("statusSummary() returns status summary key", () => {
    expect(postingAutoQueryKeys.statusSummary()).toEqual([
      "postingAuto",
      "summary",
      "status",
    ]);
  });
});

describe("usePostingAutoList", () => {
  it("fetches and returns paged data when enabled (default)", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/auto`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: {
            content: [
              {
                reversalFlag: "A",
                documentNumber: "DOC-001",
                reference: "REF-001",
                documentDate: "20250101",
                virtualAccount: "VA001",
                sapDocumentNumber: "SAP-001",
                sapStatus: "S",
                postingStatus: 0,
                assignment: null,
                fiscalYear: 2025,
                createdAt: "2025-01-01T00:00:00Z",
                updatedAt: "2025-01-01T00:00:00Z",
              },
            ],
            pagination: {
              total: 1,
              pageSize: 10,
              pageNumber: 1,
              totalPages: 1,
              currentPage: 1,
              from: 0,
              to: 0,
            },
          },
        }),
      ),
    );

    const { result } = renderHook(() => usePostingAutoList());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].documentNumber).toBe(
      "DOC-001",
    );
  });

  it("does not fetch when enabled option is false", async () => {
    const { result } = renderHook(() =>
      usePostingAutoList(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/auto`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => usePostingAutoList());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePostingAutoById", () => {
  it("fetches and returns a single record by ID", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/auto/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Success",
          data: {
            id: 1,
            documentNumber: "DOC-001",
            transactionCode: "T001",
            reversalFlag: "A",
            documentType: "DT",
            documentDate: "20250101",
            debitCreditFlag: "S",
            accountNumber: "ACC-001",
            businessArea: "BA01",
          },
        }),
      ),
    );

    const { result } = renderHook(() => usePostingAutoById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.documentNumber).toBe("DOC-001");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      usePostingAutoById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("does not fetch when id is 0", async () => {
    const { result } = renderHook(() => usePostingAutoById(0));

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/auto/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => usePostingAutoById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePostingAutoByTransaction", () => {
  it("fetches and returns transaction records", async () => {
    server.use(
      http.get(
        `${BASE}/monitoring/posting/auto/:reversalFlag/:documentNumber/:reference`,
        () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Data fetched successfully",
            data: [
              {
                id: 1,
                documentNumber: "DOC-001",
                transactionCode: "T001",
                reversalFlag: "A",
                documentType: "DT",
                documentDate: "20250101",
                debitCreditFlag: "S",
                accountNumber: "ACC-001",
                businessArea: "BA01",
                postingDate: "20250101",
                segment: "",
                costCenter: "",
                profitCenter: "",
                fixedAssetNumber: "",
              },
            ],
          }),
      ),
    );

    const { result } = renderHook(() =>
      usePostingAutoByTransaction("A", "DOC-001", "REF-001"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      usePostingAutoByTransaction("A", "DOC-001", "REF-001", {
        enabled: false,
      }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("does not fetch when reversalFlag is empty", async () => {
    const { result } = renderHook(() =>
      usePostingAutoByTransaction("", "DOC-001", "REF-001"),
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(
        `${BASE}/monitoring/posting/auto/:reversalFlag/:documentNumber/:reference`,
        () => HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() =>
      usePostingAutoByTransaction("A", "DOC", "REF"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePostingAutoStatusSummary", () => {
  it("fetches and returns status summary", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/auto/summary/status`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Status summary fetched successfully",
          data: {
            pendingCount: 10,
            postedCount: 20,
            errorCount: 5,
            sapSuccessCount: 15,
            sapErrorCount: 3,
            sapCancelCount: 2,
          },
        }),
      ),
    );

    const { result } = renderHook(() => usePostingAutoStatusSummary());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.pendingCount).toBe(10);
    expect(result.current.data?.data?.postedCount).toBe(20);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      usePostingAutoStatusSummary({ enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/monitoring/posting/auto/summary/status`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => usePostingAutoStatusSummary());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
