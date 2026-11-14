import {
  costCenterQueryKeys,
  useGetActiveCostCenters,
  useGetCostCenterById,
  useGetCostCentersByCompanyAndBA,
  useGetCostCentersByCompanyBAAndType,
  useListCostCenters,
} from "@/features/master-data/cost-center/data/cost-center.query";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { mockCostCenter } from "./cost-center.handlers";

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
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/popover", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("costCenterQueryKeys", () => {
  it("all returns base key array", () => {
    expect(costCenterQueryKeys.all).toEqual(["costCenters"]);
  });

  it("lists() returns list key", () => {
    expect(costCenterQueryKeys.lists()).toEqual(["costCenters", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(costCenterQueryKeys.list()).toEqual([
      "costCenters",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(costCenterQueryKeys.list(params)).toEqual([
      "costCenters",
      "list",
      params,
    ]);
  });

  it("active() returns active key", () => {
    expect(costCenterQueryKeys.active()).toEqual(["costCenters", "active"]);
  });

  it("byCompanyAndBA() returns company and BA key", () => {
    expect(costCenterQueryKeys.byCompanyAndBA("COMP001", "BA001")).toEqual([
      "costCenters",
      "company",
      "COMP001",
      "ba",
      "BA001",
    ]);
  });

  it("byCompanyBAAndType() returns company BA and type key", () => {
    expect(
      costCenterQueryKeys.byCompanyBAAndType("COMP001", "BA001", "BA"),
    ).toEqual([
      "costCenters",
      "company",
      "COMP001",
      "ba",
      "BA001",
      "type",
      "BA",
    ]);
  });

  it("details() returns detail key", () => {
    expect(costCenterQueryKeys.details()).toEqual(["costCenters", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(costCenterQueryKeys.detail(5)).toEqual(["costCenters", "detail", 5]);
  });
});

describe("useListCostCenters", () => {
  it("fetches and returns paged cost center data", async () => {
    const { result } = renderHook(() => useListCostCenters());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].costCenterCode).toBe("CC-001");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "CC-001" };
    const { result } = renderHook(() => useListCostCenters(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListCostCenters(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListCostCenters());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center`, () =>
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
    const { result } = renderHook(() => useListCostCenters());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Cost centers loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center`, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListCostCenters());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCostCenters());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load cost centers"),
    );
  });
});

describe("useGetActiveCostCenters", () => {
  it("fetches and returns active cost centers", async () => {
    const { result } = renderHook(() => useGetActiveCostCenters());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetActiveCostCenters({ enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center/active`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetActiveCostCenters());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center/active`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: [mockCostCenter],
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetActiveCostCenters());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Active cost centers loaded successfully",
      ),
    );
  });

  it("calls toast.error with fallback message when no error message", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center/active`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetActiveCostCenters());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load active cost centers",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center/active`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetActiveCostCenters());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });
});

describe("useGetCostCentersByCompanyAndBA", () => {
  it("fetches cost centers by company and BA", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode`,
        () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Data fetched successfully",
            data: [],
          }),
      ),
    );

    const { result } = renderHook(() =>
      useGetCostCentersByCompanyAndBA("COMP001", "BA001"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCostCentersByCompanyAndBA("COMP001", "BA001", { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode`,
        () => HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() =>
      useGetCostCentersByCompanyAndBA("COMP001", "BA001"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode`,
        () =>
          HttpResponse.json({
            status: "SUCCESS",
            data: [],
          }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useGetCostCentersByCompanyAndBA("COMP001", "BA001"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Cost centers loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode`,
        () =>
          HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() =>
      useGetCostCentersByCompanyAndBA("COMP001", "BA001"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode`,
        () => HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useGetCostCentersByCompanyAndBA("COMP001", "BA001"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load cost centers"),
    );
  });
});

describe("useGetCostCentersByCompanyBAAndType", () => {
  it("fetches cost centers by company, BA and type", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode/type/:type`,
        () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Data fetched successfully",
            data: [],
          }),
      ),
    );

    const { result } = renderHook(() =>
      useGetCostCentersByCompanyBAAndType("COMP001", "BA001", "BA"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCostCentersByCompanyBAAndType("COMP001", "BA001", "BA", {
        enabled: false,
      }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode/type/:type`,
        () => HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() =>
      useGetCostCentersByCompanyBAAndType("COMP001", "BA001", "BA"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode/type/:type`,
        () =>
          HttpResponse.json({
            status: "SUCCESS",
            data: [],
          }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useGetCostCentersByCompanyBAAndType("COMP001", "BA001", "BA"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Cost centers loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode/type/:type`,
        () =>
          HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() =>
      useGetCostCentersByCompanyBAAndType("COMP001", "BA001", "BA"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message", async () => {
    server.use(
      http.get(
        `${BASE}/master/cost-center/company/:companyCode/ba/:baCode/type/:type`,
        () => HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useGetCostCentersByCompanyBAAndType("COMP001", "BA001", "BA"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load cost centers"),
    );
  });
});

describe("useGetCostCenterById", () => {
  it("fetches and returns a single cost center by ID", async () => {
    const { result } = renderHook(() => useGetCostCenterById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.costCenterName).toBe(
      "Jakarta Head Office Cost Center",
    );
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCostCenterById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetCostCenterById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            id: 1,
            companyCode: "COMP001",
            baCode: "BA001",
            costCenterCode: "CC-001",
            costCenterName: "Test",
            startDate: "2024-01-01",
            endDate: null,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            createdBy: "admin",
            updatedBy: "admin",
          },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCostCenterById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Cost center loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center/:id`, () =>
        HttpResponse.json({ status: "FAILED", message: "Error", data: null }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useGetCostCenterById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/cost-center/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCostCenterById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load cost center"),
    );
  });
});
