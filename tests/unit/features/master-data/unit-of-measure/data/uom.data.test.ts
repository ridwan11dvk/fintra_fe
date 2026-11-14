import {
  useCreateUomMutation,
  useDeleteUomMutation,
  useUpdateUomMutation,
} from "@/features/master-data/unit-of-measure/data/uom.mutation";
import {
  uomQueryKeys,
  useGetActiveUoms,
  useGetUomByCode,
  useGetUomById,
  useListUoms,
} from "@/features/master-data/unit-of-measure/data/uom.query";
import { uomService } from "@/features/master-data/unit-of-measure/data/uom.service";
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
const URL = `${BASE}/master/uom`;

const mockUom = {
  id: 1,
  code: "KG",
  unit: "Kilogram",
  unitEn: "Kilogram",
  unitAlias: "KG",
  isActive: true,
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("uomQueryKeys", () => {
  it("all returns base key array", () => {
    expect(uomQueryKeys.all).toEqual(["uoms"]);
  });

  it("lists() and list(params) return list keys", () => {
    expect(uomQueryKeys.lists()).toEqual(["uoms", "list"]);
    const params = { page: 1, size: 10 };
    expect(uomQueryKeys.list(params)).toEqual(["uoms", "list", params]);
  });

  it("details(), detail(id), detailByCode(code), active() return keys", () => {
    expect(uomQueryKeys.details()).toEqual(["uoms", "detail"]);
    expect(uomQueryKeys.detail(5)).toEqual(["uoms", "detail", 5]);
    expect(uomQueryKeys.detailByCode("KG")).toEqual([
      "uoms",
      "detail",
      "code",
      "KG",
    ]);
    expect(uomQueryKeys.active()).toEqual(["uoms", "active"]);
  });
});

describe("uomService", () => {
  it("listUoms fetches paged data", async () => {
    const data = await uomService.listUoms();
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.content[0].code).toBe("KG");
  });

  it("getActiveUoms fetches active list", async () => {
    const data = await uomService.getActiveUoms();
    expect(data.status).toBe("SUCCESS");
    expect(data.data).toHaveLength(1);
  });

  it("getUomById fetches a single uom", async () => {
    const data = await uomService.getUomById(1);
    expect(data.data?.id).toBe(1);
  });

  it("getUomByCode fetches by code", async () => {
    const data = await uomService.getUomByCode("KG");
    expect(data.data?.code).toBe("KG");
  });

  it("createUom posts payload", async () => {
    const data = await uomService.createUom({
      code: "M",
      unit: "Meter",
      unitAlias: "M",
      isActive: true,
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("updateUom puts payload", async () => {
    const data = await uomService.updateUom(1, {
      code: "M",
      unit: "Meter",
      unitAlias: "M",
      isActive: true,
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("deleteUom sends DELETE", async () => {
    const data = await uomService.deleteUom(1);
    expect(data.status).toBe("SUCCESS");
  });
});

describe("useListUoms", () => {
  it("fetches and returns paged uom data", async () => {
    const { result } = renderHook(() => useListUoms());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListUoms(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListUoms());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            content: [mockUom],
            pagination: {
              total: 1,
              pageSize: 10,
              pageNumber: 1,
              totalPages: 1,
              currentPage: 1,
              from: 1,
              to: 1,
            },
          },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListUoms());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Units of measure loaded successfully",
      ),
    );
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(http.get(URL, () => HttpResponse.json(null, { status: 500 })));

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListUoms());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load units of measure",
      ),
    );
  });
});

describe("useGetActiveUoms", () => {
  it("fetches active uoms", async () => {
    const { result } = renderHook(() => useGetActiveUoms());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${URL}/active`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetActiveUoms());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetUomById", () => {
  it("fetches a single uom by ID", async () => {
    const { result } = renderHook(() => useGetUomById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.id).toBe(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() => useGetUomById(1, { enabled: false }));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${URL}/:id`, () => HttpResponse.json(null, { status: 500 })),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetUomById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load unit of measure",
      ),
    );
  });
});

describe("useGetUomByCode", () => {
  it("fetches a single uom by code", async () => {
    const { result } = renderHook(() => useGetUomByCode("KG"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.code).toBe("KG");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetUomByCode("KG", { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${URL}/code/:code`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetUomByCode("XX"));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateUomMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useCreateUomMutation());

    result.current.mutate({
      code: "M",
      unit: "Meter",
      unitAlias: "M",
      isActive: true,
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(URL, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateUomMutation());

    result.current.mutate({
      code: "M",
      unit: "Meter",
      unitAlias: "M",
      isActive: true,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateUomMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateUomMutation());

    result.current.mutate({
      id: 1,
      data: { code: "M", unit: "Meter", unitAlias: "M", isActive: true },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.put(`${URL}/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useUpdateUomMutation());

    result.current.mutate({
      id: 1,
      data: { code: "M", unit: "Meter", unitAlias: "M", isActive: true },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteUomMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useDeleteUomMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${URL}/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useDeleteUomMutation());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
