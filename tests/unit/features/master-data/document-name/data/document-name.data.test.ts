import {
  useCreateDocumentNameMutation,
  useDeleteDocumentNameMutation,
  useUpdateDocumentNameMutation,
} from "@/features/master-data/document-name/data/document-name.mutation";
import {
  documentNameQueryKeys,
  useGetDocumentNameById,
  useListDocumentNames,
} from "@/features/master-data/document-name/data/document-name.query";
import { documentNameService } from "@/features/master-data/document-name/data/document-name.service";
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
const URL = `${BASE}/master/document-name`;

const mockDocumentNameData = {
  id: 1,
  name: "Purchase Order",
  description: "Purchase order document",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const singleResponse = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockDocumentNameData,
};

const pagedResponse = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockDocumentNameData],
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
};

describe("documentNameQueryKeys", () => {
  it("all returns base key array", () => {
    expect(documentNameQueryKeys.all).toEqual(["documentNames"]);
  });

  it("lists() returns list key", () => {
    expect(documentNameQueryKeys.lists()).toEqual([
      "documentNames",
      "list",
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(documentNameQueryKeys.list(params)).toEqual([
      "documentNames",
      "list",
      params,
    ]);
  });

  it("details() and detail(id) return detail keys", () => {
    expect(documentNameQueryKeys.details()).toEqual([
      "documentNames",
      "detail",
    ]);
    expect(documentNameQueryKeys.detail(5)).toEqual([
      "documentNames",
      "detail",
      5,
    ]);
  });
});

describe("documentNameService", () => {
  it("listDocumentNames fetches paged data", async () => {
    const data = await documentNameService.listDocumentNames();
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.content[0].name).toBe("Purchase Order");
  });

  it("getDocumentNameById fetches a single item", async () => {
    const data = await documentNameService.getDocumentNameById(1);
    expect(data.data?.id).toBe(1);
  });

  it("createDocumentName posts payload", async () => {
    const data = await documentNameService.createDocumentName({
      name: "New",
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("updateDocumentName puts payload", async () => {
    const data = await documentNameService.updateDocumentName(1, {
      name: "Updated",
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("deleteDocumentName sends DELETE", async () => {
    const data = await documentNameService.deleteDocumentName(1);
    expect(data.status).toBe("SUCCESS");
  });
});

describe("useListDocumentNames", () => {
  it("fetches and returns paged document name data", async () => {
    const { result } = renderHook(() => useListDocumentNames());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "Purchase" };
    const { result } = renderHook(() => useListDocumentNames(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListDocumentNames(undefined, { enabled: false }),
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

    const { result } = renderHook(() => useListDocumentNames());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: pagedResponse.data,
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListDocumentNames());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Document names loaded successfully",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListDocumentNames());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(http.get(URL, () => HttpResponse.json(null, { status: 500 })));

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListDocumentNames());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load document names",
      ),
    );
  });
});

describe("useGetDocumentNameById", () => {
  it("fetches and returns a single document name by ID", async () => {
    const { result } = renderHook(() => useGetDocumentNameById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetDocumentNameById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${URL}/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetDocumentNameById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${URL}/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: mockDocumentNameData,
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetDocumentNameById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Document name loaded successfully",
      ),
    );
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${URL}/:id`, () => HttpResponse.json(null, { status: 500 })),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetDocumentNameById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load document name",
      ),
    );
  });
});

describe("useCreateDocumentNameMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useCreateDocumentNameMutation());

    result.current.mutate({ name: "New Document" });

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

    const { result } = renderHook(() => useCreateDocumentNameMutation());

    result.current.mutate({ name: "New Document" });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateDocumentNameMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateDocumentNameMutation());

    result.current.mutate({ id: 1, data: { name: "Updated" } });

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

    const { result } = renderHook(() => useUpdateDocumentNameMutation());

    result.current.mutate({ id: 1, data: { name: "Updated" } });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteDocumentNameMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useDeleteDocumentNameMutation());

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

    const { result } = renderHook(() => useDeleteDocumentNameMutation());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
