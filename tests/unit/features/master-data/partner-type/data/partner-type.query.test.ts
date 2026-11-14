import {
  partnerTypeQueryKeys,
  useGetPartnerTypeById,
  useGetPartnerTypeSubtypes,
  useGetRootPartnerTypesByLegality,
  useListPartnerTypes,
} from "@/features/master-data/partner-type/data/partner-type.query";
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

describe("partnerTypeQueryKeys", () => {
  it("all returns base key array", () => {
    expect(partnerTypeQueryKeys.all).toEqual(["partnerTypes"]);
  });

  it("lists() returns list key", () => {
    expect(partnerTypeQueryKeys.lists()).toEqual(["partnerTypes", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(partnerTypeQueryKeys.list()).toEqual([
      "partnerTypes",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    expect(partnerTypeQueryKeys.list({ pageSize: 10 })).toEqual([
      "partnerTypes",
      "list",
      { pageSize: 10 },
    ]);
  });

  it("details() returns detail key", () => {
    expect(partnerTypeQueryKeys.details()).toEqual(["partnerTypes", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(partnerTypeQueryKeys.detail(1)).toEqual([
      "partnerTypes",
      "detail",
      1,
    ]);
  });

  it("subtypes(parentId) returns subtypes key", () => {
    expect(partnerTypeQueryKeys.subtypes(1)).toEqual([
      "partnerTypes",
      "subtypes",
      1,
    ]);
  });

  it("legalityRoot(legalityId) returns legality root key", () => {
    expect(partnerTypeQueryKeys.legalityRoot(1)).toEqual([
      "partnerTypes",
      "legality",
      1,
      "root",
    ]);
  });
});

describe("useListPartnerTypes", () => {
  it("fetches and returns paged partner type data", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useListPartnerTypes());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data.content).toHaveLength(1);
    expect(toast.success).toHaveBeenCalled();
  });

  it("passes pagination params to the query", async () => {
    const { result } = renderHook(() =>
      useListPartnerTypes({ pageSize: 25, pageNumber: 2 }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerTypes(undefined, { enabled: false }),
    );

    expect(result.current.isPending).toBe(true);
  });

  it("enters error state when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.get(`${BASE}/master/partner/type`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListPartnerTypes());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalled();
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.get(`${BASE}/master/partner/type`, () =>
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

    const { result } = renderHook(() => useListPartnerTypes());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toast.success).toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.get(`${BASE}/master/partner/type`, () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListPartnerTypes());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useGetPartnerTypeById", () => {
  it("fetches and returns a single partner type by ID", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useGetPartnerTypeById(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.id).toBe(1);
    expect(toast.success).toHaveBeenCalled();
  });

  it("does not fetch when id is undefined", async () => {
    const { result } = renderHook(() => useGetPartnerTypeById(undefined));

    expect(result.current.isPending).toBe(true);
  });

  it("enters error state when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.get(`${BASE}/master/partner/type/:id`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useGetPartnerTypeById(1));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useGetRootPartnerTypesByLegality", () => {
  it("fetches root partner types by legality id", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useGetRootPartnerTypesByLegality(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(1);
    expect(toast.success).toHaveBeenCalled();
  });
});

describe("useGetPartnerTypeSubtypes", () => {
  it("fetches partner type subtypes by parent id", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useGetPartnerTypeSubtypes(1));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(1);
    expect(toast.success).toHaveBeenCalled();
  });
});
