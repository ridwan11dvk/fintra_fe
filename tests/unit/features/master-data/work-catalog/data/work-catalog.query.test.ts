import {
  useGetActiveWorkCatalogs,
  useGetWorkCatalogById,
  useGetWorkCatalogsByCompanyAndBA,
  useListWorkCatalogs,
  workCatalogQueryKeys,
} from "@/features/master-data/work-catalog/data/work-catalog.query";
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
  const { buildUiResponseMock } = await import(
    "@tests/unit/mocks/ui-response-mock"
  );
  return buildUiResponseMock(actual);
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("workCatalogQueryKeys", () => {
  it("builds list, active, company, and detail keys", () => {
    const params = { page: 1, size: 10 };

    expect(workCatalogQueryKeys.all).toEqual(["workCatalogs"]);
    expect(workCatalogQueryKeys.lists()).toEqual(["workCatalogs", "list"]);
    expect(workCatalogQueryKeys.list(params)).toEqual([
      "workCatalogs",
      "list",
      params,
    ]);
    expect(workCatalogQueryKeys.active()).toEqual(["workCatalogs", "active"]);
    expect(workCatalogQueryKeys.byCompanyAndBA("KAI", "BA01")).toEqual([
      "workCatalogs",
      "company",
      "KAI",
      "ba",
      "BA01",
    ]);
    expect(workCatalogQueryKeys.details()).toEqual([
      "workCatalogs",
      "detail",
    ]);
    expect(workCatalogQueryKeys.detail(4)).toEqual([
      "workCatalogs",
      "detail",
      4,
    ]);
  });
});

describe("useListWorkCatalogs", () => {
  it("returns paged work catalogs", async () => {
    const { result } = renderHook(() => useListWorkCatalogs());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content[0].workType).toBe("Pengangkutan");
  });

  it("does not fetch when disabled", () => {
    const { result } = renderHook(() =>
      useListWorkCatalogs(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("toasts the fallback success message when the payload has no message", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog`, () =>
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
    const { result } = renderHook(() => useListWorkCatalogs());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Work catalogs loaded successfully",
      ),
    );
  });

  it("does not toast success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListWorkCatalogs());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("toasts the fallback error message when the response has no message", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListWorkCatalogs());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load work catalogs"),
    );
  });
});

describe("useGetActiveWorkCatalogs", () => {
  it("returns active work catalogs", async () => {
    const { result } = renderHook(() => useGetActiveWorkCatalogs());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("toasts when the request fails", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog/active`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetActiveWorkCatalogs());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load active work catalogs",
      ),
    );
  });
});

describe("useGetWorkCatalogsByCompanyAndBA", () => {
  it("returns work catalogs for a company and business area", async () => {
    const { result } = renderHook(() =>
      useGetWorkCatalogsByCompanyAndBA("KAI", "BA01"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.[0].workType).toBe("Pengangkutan");
  });

  it("toasts when the request fails", async () => {
    server.use(
      http.get(
        `${BASE}/master/work-catalog/company/:companyCode/ba/:baCode`,
        () => HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useGetWorkCatalogsByCompanyAndBA("KAI", "BA01"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load work catalogs"),
    );
  });
});

describe("useGetWorkCatalogById", () => {
  it("returns one work catalog", async () => {
    const { result } = renderHook(() => useGetWorkCatalogById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.taxes).toHaveLength(2);
  });

  it("does not fetch when disabled", () => {
    const { result } = renderHook(() =>
      useGetWorkCatalogById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("toasts when the request fails", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetWorkCatalogById(9));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load work catalog"),
    );
  });
});
