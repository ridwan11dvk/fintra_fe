import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
  closePaymentQueryKeys,
  useGetClosePaymentById,
  useGetPaymnetCountByStatus,
  useGetUnpaidCount,
  useListClosePayments,
} from "@/features/treasury/close-payment/data/close-payment.query";
import { handlers } from "@tests/unit/features/treasury/close-payment/data/close-payment.handlers";

const BASE = "http://localhost:3000";

describe("closePaymentQueryKeys", () => {
  it("all returns base key array", () => {
    expect(closePaymentQueryKeys.all).toEqual(["closePayments"]);
  });

  it("lists() returns list segment", () => {
    expect(closePaymentQueryKeys.lists()).toEqual([
      "closePayments",
      "list",
    ]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(closePaymentQueryKeys.list()).toEqual([
      "closePayments",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(closePaymentQueryKeys.list(params)).toEqual([
      "closePayments",
      "list",
      params,
    ]);
  });

  it("details() returns detail segment", () => {
    expect(closePaymentQueryKeys.details()).toEqual([
      "closePayments",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(closePaymentQueryKeys.detail(5)).toEqual([
      "closePayments",
      "detail",
      5,
    ]);
  });

  it("summaries() returns summary segment", () => {
    expect(closePaymentQueryKeys.summaries()).toEqual([
      "closePayments",
      "summary",
    ]);
  });

  it("unpaidCount() returns unpaid count key", () => {
    expect(closePaymentQueryKeys.unpaidCount()).toEqual([
      "closePayments",
      "summary",
      "unpaid-count",
    ]);
  });

  it("countByStatus(status) returns count by status key", () => {
    expect(closePaymentQueryKeys.countByStatus(0)).toEqual([
      "closePayments",
      "summary",
      "count-by-status",
      0,
    ]);
  });

  it("countByStatus(paid) returns count by status key with 1", () => {
    expect(closePaymentQueryKeys.countByStatus(1)).toEqual([
      "closePayments",
      "summary",
      "count-by-status",
      1,
    ]);
  });
});

describe("useListClosePayments", () => {
  it("fetchs and returns paged close payment data", async () => {
    server.use(...handlers);

    const { result } = renderHook(() => useListClosePayments());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].transId).toBe("TRANS-001");
  });

  it("passes pagination params to the query", async () => {
    server.use(...handlers);

    const params = { page: 1, size: 10 };
    const { result } = renderHook(() => useListClosePayments(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(true);
  });

  it("does not fetch when enabled is false", async () => {
    server.use(...handlers);

    const { result } = renderHook(() =>
      useListClosePayments(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/treasury/close-payment`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListClosePayments());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetClosePaymentById", () => {
  it("fetchs and returns a single close payment by ID", async () => {
    server.use(...handlers);

    const { result } = renderHook(() => useGetClosePaymentById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.transId).toBe("TRANS-001");
  });

  it("does not fetch when enabled is false", async () => {
    server.use(...handlers);

    const { result } = renderHook(() =>
      useGetClosePaymentById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/treasury/close-payment/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetClosePaymentById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetUnpaidCount", () => {
  it("fetchs and returns unpaid count", async () => {
    server.use(...handlers);

    const { result } = renderHook(() => useGetUnpaidCount());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data).toBe(5);
  });

  it("does not fetch when enabled is false", async () => {
    server.use(...handlers);

    const { result } = renderHook(() => useGetUnpaidCount({ enabled: false }));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/treasury/close-payment/summary/unpaid-count`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetUnpaidCount());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetPaymnetCountByStatus", () => {
  it("fetchs count by status for unpaid (0)", async () => {
    server.use(...handlers);

    const { result } = renderHook(() => useGetPaymnetCountByStatus(0));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data).toBe(5);
  });

  it("fetchs count by status for paid (1)", async () => {
    server.use(...handlers);

    const { result } = renderHook(() => useGetPaymnetCountByStatus(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data).toBe(10);
  });

  it("does not fetch when enabled is false", async () => {
    server.use(...handlers);

    const { result } = renderHook(() =>
      useGetPaymnetCountByStatus(0, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(
        `${BASE}/treasury/close-payment/summary/count-by-status`,
        () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetPaymnetCountByStatus(0));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
