import {
  taxableItemKeys,
  taxableItemQueryKeys,
  useGetTaxableItemById,
  useListChildrenByParentId,
  useListParentTaxableItems,
  useListTaxableItemRows,
  useListTaxableItems,
  useTaxableItemById,
  useTaxableItemsByParent,
} from "@/features/master-data/taxable-item/data/taxable-item.query";
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

describe("taxableItemQueryKeys", () => {
  it("all returns base key array", () => {
    expect(taxableItemQueryKeys.all).toEqual(["taxableItems"]);
  });

  it("lists() returns list key", () => {
    expect(taxableItemQueryKeys.lists()).toEqual(["taxableItems", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(taxableItemQueryKeys.list()).toEqual([
      "taxableItems",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(taxableItemQueryKeys.list(params)).toEqual([
      "taxableItems",
      "list",
      params,
    ]);
  });

  it("rows(params) returns rows key with params", () => {
    const params = { page: 1, size: 10 };
    expect(taxableItemQueryKeys.rows(params)).toEqual([
      "taxableItems",
      "rows",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(taxableItemQueryKeys.details()).toEqual(["taxableItems", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(taxableItemQueryKeys.detail(5)).toEqual([
      "taxableItems",
      "detail",
      5,
    ]);
  });

  it("children() returns children key", () => {
    expect(taxableItemQueryKeys.children()).toEqual([
      "taxableItems",
      "children",
    ]);
  });

  it("childrenByParent(id) returns children key with parent id", () => {
    expect(taxableItemQueryKeys.childrenByParent(3)).toEqual([
      "taxableItems",
      "children",
      3,
    ]);
  });

  it("parents(search) returns parents key with search", () => {
    expect(taxableItemQueryKeys.parents("test")).toEqual([
      "taxableItems",
      "parents",
      "test",
    ]);
  });

  it("parents() returns parents key with undefined", () => {
    expect(taxableItemQueryKeys.parents()).toEqual([
      "taxableItems",
      "parents",
      undefined,
    ]);
  });

  it("taxableItemKeys alias matches taxableItemQueryKeys", () => {
    expect(taxableItemKeys).toBe(taxableItemQueryKeys);
  });
});

describe("useListTaxableItems", () => {
  it("fetches and returns paged taxable item data", async () => {
    const { result } = renderHook(() => useListTaxableItems());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].code).toBe("GOODS-001");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "ELECTRONIC" };
    const { result } = renderHook(() => useListTaxableItems(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListTaxableItems(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/taxable-item`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListTaxableItems());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when server returns error", async () => {
    server.use(
      http.get(`${BASE}/master/taxable-item`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListTaxableItems());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load taxable items"),
    );
  });
});

describe("useTaxableItemById", () => {
  it("fetches and returns a single taxable item by ID", async () => {
    const { result } = renderHook(() => useTaxableItemById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("Electronic Goods");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useTaxableItemById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/taxable-item/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useTaxableItemById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when server returns error", async () => {
    server.use(
      http.get(`${BASE}/master/taxable-item/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useTaxableItemById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load taxable item"),
    );
  });
});

describe("useGetTaxableItemById", () => {
  it("is an alias for useTaxableItemById", () => {
    expect(useGetTaxableItemById).toBe(useTaxableItemById);
  });
});

describe("useTaxableItemsByParent", () => {
  it("fetches children by parent ID", async () => {
    const { result } = renderHook(() => useTaxableItemsByParent(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/taxable-item/parent/:parentId`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useTaxableItemsByParent(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when server returns error", async () => {
    server.use(
      http.get(`${BASE}/master/taxable-item/parent/:parentId`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useTaxableItemsByParent(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load taxable item children",
      ),
    );
  });
});

describe("useListChildrenByParentId", () => {
  it("fetches children when parentId is provided", async () => {
    const { result } = renderHook(() => useListChildrenByParentId(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("does not fetch when parentId is undefined", async () => {
    const { result } = renderHook(() => useListChildrenByParentId(undefined));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useListParentTaxableItems", () => {
  it("fetches parent items without search", async () => {
    const { result } = renderHook(() => useListParentTaxableItems());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("fetches parent items with search", async () => {
    const { result } = renderHook(() =>
      useListParentTaxableItems("ELECTRONIC"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });
});

describe("useListTaxableItemRows", () => {
  it("fetches and returns paged rows data", async () => {
    const { result } = renderHook(() => useListTaxableItemRows());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].level1?.name).toBe(
      "Electronic Goods",
    );
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListTaxableItemRows(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/taxable-item/rows`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListTaxableItemRows());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when server returns error", async () => {
    server.use(
      http.get(`${BASE}/master/taxable-item/rows`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListTaxableItemRows());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load taxable item rows",
      ),
    );
  });
});
