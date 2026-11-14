import {
  partnerClassificationQueryKeys,
  useGetPartnerClassificationById,
  useListPartnerClassifications,
} from "@/features/master-data/partner-classification/data/partner-classification.query";
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

describe("partnerClassificationQueryKeys", () => {
  it("all returns base key array", () => {
    expect(partnerClassificationQueryKeys.all).toEqual([
      "partner-classifications",
    ]);
  });

  it("lists() returns list key", () => {
    expect(partnerClassificationQueryKeys.lists()).toEqual([
      "partner-classifications",
      "list",
    ]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(partnerClassificationQueryKeys.list()).toEqual([
      "partner-classifications",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(partnerClassificationQueryKeys.list(params)).toEqual([
      "partner-classifications",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(partnerClassificationQueryKeys.details()).toEqual([
      "partner-classifications",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(partnerClassificationQueryKeys.detail(5)).toEqual([
      "partner-classifications",
      "detail",
      5,
    ]);
  });

  it("options() returns options key", () => {
    expect(partnerClassificationQueryKeys.options()).toEqual([
      "partner-classifications",
      "options",
    ]);
  });
});

describe("useListPartnerClassifications", () => {
  it("fetches and returns paged partner classification data", async () => {
    const { result } = renderHook(() => useListPartnerClassifications());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].name).toBe("Distributor");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "Distributor" };
    const { result } = renderHook(() => useListPartnerClassifications(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerClassifications(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/classification`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListPartnerClassifications());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not call toast.success when disableSuccessToast is true by default", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useListPartnerClassifications());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with server error message on 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/classification`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListPartnerClassifications());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Server Error"),
    );
  });

  it("calls toast.error with fallback when response body is null on 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/classification`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListPartnerClassifications());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("An unknown error occurred"),
    );
  });
});

describe("useGetPartnerClassificationById", () => {
  it("fetches and returns a single partner classification by ID", async () => {
    const { result } = renderHook(() => useGetPartnerClassificationById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("Distributor");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetPartnerClassificationById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/partner/classification/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetPartnerClassificationById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not call toast.success when disableSuccessToast is true by default", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useGetPartnerClassificationById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with server error message on 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/classification/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetPartnerClassificationById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Server Error"),
    );
  });

  it("calls toast.error with fallback when response body is null on 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/classification/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetPartnerClassificationById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("An unknown error occurred"),
    );
  });
});
