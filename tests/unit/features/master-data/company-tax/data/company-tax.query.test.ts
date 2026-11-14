import {
  companyTaxQueryKeys,
  useGetCompanyTaxById,
  useListCompanyTaxes,
} from "@/features/master-data/company-tax/data/company-tax.query";
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

describe("companyTaxQueryKeys", () => {
  it("all returns base key array", () => {
    expect(companyTaxQueryKeys.all).toEqual(["company-taxes"]);
  });

  it("lists() returns list key", () => {
    expect(companyTaxQueryKeys.lists()).toEqual(["company-taxes", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(companyTaxQueryKeys.list()).toEqual([
      "company-taxes",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(companyTaxQueryKeys.list(params)).toEqual([
      "company-taxes",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(companyTaxQueryKeys.details()).toEqual(["company-taxes", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(companyTaxQueryKeys.detail(5)).toEqual([
      "company-taxes",
      "detail",
      5,
    ]);
  });
});

describe("useListCompanyTaxes", () => {
  it("fetches and returns paged company tax data", async () => {
    const { result } = renderHook(() => useListCompanyTaxes());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].companyCode).toBe("PT. ABC");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "PT. ABC" };
    const { result } = renderHook(() => useListCompanyTaxes(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListCompanyTaxes(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/company-tax`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListCompanyTaxes());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/company-tax`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCompanyTaxes());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load company tax assignments",
      ),
    );
  });
});

describe("useGetCompanyTaxById", () => {
  it("fetches and returns a single company tax by ID", async () => {
    const { result } = renderHook(() => useGetCompanyTaxById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.companyCode).toBe("PT. ABC");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCompanyTaxById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/company-tax/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetCompanyTaxById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/company-tax/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCompanyTaxById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load company tax assignment",
      ),
    );
  });
});
