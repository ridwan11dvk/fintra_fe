import {
  useGetVillageById,
  useGetVillagesByDistrictId,
  useListVillages,
  villageQueryKeys,
} from "@/features/master-data/village/data/village.query";
import { villageService } from "@/features/master-data/village/data/village.service";
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
const URL = `${BASE}/master/village`;

describe("villageQueryKeys", () => {
  it("all returns base key array", () => {
    expect(villageQueryKeys.all).toEqual(["villages"]);
  });

  it("lists() and list(params) return list keys", () => {
    expect(villageQueryKeys.lists()).toEqual(["villages", "list"]);
    const params = { page: 1, size: 10 };
    expect(villageQueryKeys.list(params)).toEqual(["villages", "list", params]);
  });

  it("details() and detail(id) return detail keys", () => {
    expect(villageQueryKeys.details()).toEqual(["villages", "detail"]);
    expect(villageQueryKeys.detail(5)).toEqual(["villages", "detail", 5]);
  });

  it("byDistrict(districtId) returns district key", () => {
    expect(villageQueryKeys.byDistrict(3)).toEqual(["villages", "district", 3]);
  });
});

describe("villageService", () => {
  it("listVillages fetches paged data", async () => {
    const data = await villageService.listVillages();
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.content[0].name).toBe("Cihampelas");
  });

  it("getVillageById fetches a single village", async () => {
    const data = await villageService.getVillageById(1);
    expect(data.data?.id).toBe(1);
  });

  it("getVillagesByDistrictId fetches villages by district", async () => {
    const data = await villageService.getVillagesByDistrictId(1);
    expect(data.status).toBe("SUCCESS");
  });
});

describe("useListVillages", () => {
  it("fetches and returns paged village data", async () => {
    const { result } = renderHook(() => useListVillages());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListVillages(undefined, { enabled: false }),
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

    const { result } = renderHook(() => useListVillages());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(URL, () =>
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
    const { result } = renderHook(() => useListVillages());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Villages loaded successfully",
      ),
    );
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(http.get(URL, () => HttpResponse.json(null, { status: 500 })));

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListVillages());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load villages"),
    );
  });
});

describe("useGetVillageById", () => {
  it("fetches a single village by ID", async () => {
    const { result } = renderHook(() => useGetVillageById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.id).toBe(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetVillageById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${URL}/:id`, () => HttpResponse.json(null, { status: 500 })),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetVillageById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load village"),
    );
  });
});

describe("useGetVillagesByDistrictId", () => {
  it("fetches villages by district id", async () => {
    const { result } = renderHook(() => useGetVillagesByDistrictId(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetVillagesByDistrictId(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${URL}/district/:districtId`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetVillagesByDistrictId(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
